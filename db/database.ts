import * as SQLite from "expo-sqlite";

interface ID3Structure {
  trackID: number;
  album: string | undefined;
  artist: string | undefined;
  title: string | undefined;
  genre: string | undefined;
  year: string | undefined;
  track: number | undefined;
}

export const db = SQLite.openDatabaseSync("metadata");
export const createDB = async () => {
  try {
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY NOT NULL, 
            album TEXT, 
            artist TEXT,
            title TEXT,
            genre TEXT,
            year INTEGER,
            track TEXT
            );
            CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            );
            CREATE TABLE IF NOT EXISTS genres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            );
            CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            );
            CREATE TABLE IF NOT EXISTS tracks_albums(
            track_id INTEGER,
            album_id INTEGER,
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (album_id) REFERENCES albums (id),
            PRIMARY KEY (track_id, album_id)
            );
            CREATE TABLE IF NOT EXISTS tracks_genres (
            track_id INTEGER,
            genre_id INTEGER,
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (genre_id) REFERENCES genres (id),
            PRIMARY KEY (track_id, genre_id)
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

export const insertMedatada = async (metadata : ID3Structure) =>{
  try {
    await db.runAsync(`INSERT INTO tracks (id, album, artist, title, genre, year, track) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        metadata.trackID,
        metadata.album || null,
        metadata.artist || null,
        metadata.title || null,
        metadata.genre || null,
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
