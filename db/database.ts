import * as SQLite from "expo-sqlite";
import { PlayingStructure, TagStructure } from "../interfaces/Interfaces";

interface AlbumOrArtist {
  id: number;
  name: string
}

export const db = SQLite.openDatabaseSync("metadata");
export const createDB = async () => {
  try {
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS artists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            );
            CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            );
            CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            );
            CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY NOT NULL, 
            album_id INTEGER NULL,
            artist_id INTEGER NULL,
            title TEXT,
            year INTEGER,
            track TEXT,
            uri TEXT,
            duration NUMBER,
            date NUMBER,
            FOREIGN KEY (album_id) REFERENCES albums (id),
            FOREIGN KEY (artist_id) REFERENCES artists (id)
            );
            CREATE TABLE IF NOT EXISTS tracks_playlists (
            track_id INTEGER,
            playlist_id INTEGER,
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (playlist_id) REFERENCES playlists (id),
            PRIMARY KEY (track_id, playlist_id)
            );
            `);
  } catch (error) {
    console.log(error);
  }
};

export const getTrackMetadata = async (songID: number): Promise<PlayingStructure | undefined> => {
  try {
    const query = `
      SELECT 
        t.id as track_id, 
        t.title, 
        t.track, 
        t.year, 
        t.uri,
        t.duration,
        t.date,
        a.name as artist, 
        al.name as album 
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.id = ?;
    `;

    const metadata = await db.getAllAsync(query, [songID]) as PlayingStructure[];

    if (metadata.length > 0) {
      const trackData = metadata[0];
      const res: PlayingStructure = {
        id: trackData.id,
        artist: trackData.artist || undefined,
        album: trackData.album || undefined,
        albumTrack: trackData.albumTrack,
        title: trackData.title,
        year: trackData.year,
        uri:trackData.uri,
        duration:trackData.duration,
        date:trackData.date
      };

      return res;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching track metadata:', error);
    return undefined;
  }
};

export const insertTrackMedatada = async (metadata: PlayingStructure) => {
  try {
    let albumID = null;
    let artistID = null;

    if (metadata.album) {
      await db.runAsync(`INSERT OR IGNORE INTO albums (name) VALUES (?)`, [metadata.album]);
      const album: AlbumOrArtist[] = await db.getAllAsync(`SELECT id FROM albums WHERE name = ?`, [metadata.album]);
      albumID = album[0].id;
    }
    if (metadata.artist) {
      await db.runAsync(`INSERT OR IGNORE INTO artists (name) VALUES (?)`, [metadata.artist]);
      const artist: AlbumOrArtist[] = await db.getAllAsync(`SELECT id FROM artists WHERE name = ?`, [metadata.artist]);
      artistID = artist[0].id;
    }
    await db.runAsync(
      `INSERT INTO tracks (id, album_id, artist_id, title, year, track, uri, duration, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        metadata.id,
        albumID,
        artistID,
        metadata.title || null,
        metadata.year || null,
        metadata.albumTrack || null,
        metadata.uri,
        metadata.duration,
        metadata.date
      ]
    );
  } catch (error) {
    console.log('Error inserting track metadata:', error);
  }
};

export const getAllTracks = async () => {
  const query = `SELECT 
    tracks.id,
    tracks.title,
    tracks.year,
    tracks.track,
    tracks.uri,
    tracks.duration,
    tracks.date,
    artists.name AS artist_name,
    albums.name AS album_name
    FROM tracks
    LEFT JOIN artists ON tracks.artist_id = artists.id
    LEFT JOIN albums ON tracks.album_id = albums.id;`
  const allTracks = await db.getAllAsync(query) as PlayingStructure[]
  return allTracks;
}


// export const getTrackMetadata = async (songID: number) => {
//   try {
//     let artist : string | undefined= undefined;
//     let album: string | undefined = undefined;
//     let res : TagStructure |  undefined = undefined;

//     const metadata = await db.getAllAsync(`SELECT * from tracks WHERE id=?`, [songID]) as MetadataType[];

//     if (metadata.length > 0) {
//       if(metadata[0].artist_id !== null){
//         const artistRes : AlbumOrArtist[]= await db.getAllAsync(`SELECT * from artists WHERE id =?`, [metadata[0].artist_id]);
//         console.log(artistRes[0].name+"**********OVO");
//         artist = artistRes[0].name;
//       }
//       if(metadata[0].album_id !== null){
//         const albumRes : AlbumOrArtist[]= await db.getAllAsync(`SELECT * from albums WHERE id =?`, [metadata[0].album_id]);
//         album = albumRes[0].name;
//       }
//       res= {
//         id: metadata[0].id,
//         artist: artist,
//         album: album,
//         albumTrack: metadata[0].track,
//         title: metadata[0].title,
//         year: metadata[0].year,
//       }
//     }
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// }


// export const insertTrackMedatada = async (metadata: TagStructure) => {
//   try {
//     let albumID = null;
//     let artistID = null;

//     if (metadata.album !== undefined) {
//       const album: AlbumOrArtist[] = await db.getAllAsync(`SELECT * from albums WHERE name =?`, [metadata.album]);
//       if (album.length == 0) {
//         await db.runAsync(`INSERT INTO albums (name) VALUES (?)`, [metadata.album]);
//         const newAlbum: AlbumOrArtist[] = await db.getAllAsync(`SELECT * FROM albums WHERE name = ?`, [metadata.album]);
//         albumID = newAlbum[0].id;
//       } else {
//         albumID = album[0].id;
//       }
//     }
//     if (metadata.artist !== undefined) {
//       const artist: AlbumOrArtist[] = await db.getAllAsync(`SELECT * from artists WHERE name =?`, [metadata.artist]);
//       if (artist.length == 0) {
//         await db.runAsync(`INSERT INTO artists (name) VALUES (?)`, [metadata.artist]);
//         const newArtist: AlbumOrArtist[] = await db.getAllAsync(`SELECT * FROM artists WHERE name = ?`, [metadata.artist]);
//         artistID = newArtist[0].id;
//       } else {
//         artistID = artist[0].id;
//       }
//     }

//     await db.runAsync(`INSERT INTO tracks (id, album_id, artist_id, title, year, track) VALUES (?, ?, ?, ?, ?, ?);`,
//       [
//         metadata.id,
//         albumID,
//         artistID,
//         metadata.title || null,
//         metadata.year || null,
//         metadata.albumTrack || null
//       ]
//     )
//   } catch (error) {
//     console.log(error);
//   }
// }
