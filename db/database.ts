import * as SQLite from "expo-sqlite";

interface ID3Structure {
  trackID: number;
  album: string | undefined;
  artist: string | undefined;
  title: string | undefined;
  year: string | undefined;
  track: number | undefined;
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
            album_id INTEGER,
            artist_id INTEGER,
            title TEXT,
            year INTEGER,
            track TEXT,
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

export const getTrackMetadata = async (songID : number) =>{
  try {
    const metadata = await db.getAllAsync(`SELECT * from tracks WHERE id=?`, [songID]);
    return metadata
  } catch (error) {
    console.log(error);
  }
}

export const insertTrackMedatada = async (metadata : ID3Structure) =>{
  try {
    await db.runAsync(`INSERT INTO tracks (id, album_id, artist_id, title, year, track) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        metadata.trackID,
        metadata.album || null,
        metadata.artist || null,
        metadata.title || null,
        metadata.year || null,
        metadata.track || null
      ]
    )
    if(metadata.album !== undefined){
      const album = await db.getAllAsync(`SELECT * from albums WHERE name =?`, [metadata.album]);
      if(album.length==0){
        await db.runAsync(`INSERT INTO albums (name) VALUES (?)`, [metadata.album]);
      }
      console.log(album);
    }
  } catch (error) {
    console.log(error);
  }
}
