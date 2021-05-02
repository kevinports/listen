import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
import path from 'path';
import os from 'os';

const configDirPath = path.join(os.homedir(),'.audioPlayer'); 
const dbPath = path.join(configDirPath, 'db.json');

if (!fs.existsSync(configDirPath)){
  fs.mkdirSync(configDirPath);
}

const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({ directory: null, audioFiles: null }).write();

export default db;