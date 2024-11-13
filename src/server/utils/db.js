import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '../../../db.json');

const defaultDb = {
  settings: {
    smtp: {
      host: '',
      port: 465,
      secure: false,
      username: '',
      password: '',
      fromEmail: '',
      fromName: ''
    }
  },
  users: [],
  clients: [],
  notifications: [],
  email_logs: []
};

export function readDb() {
  try {
    const content = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with default structure
      writeDb(defaultDb);
      return defaultDb;
    }
    console.error('Error reading database:', error);
    return defaultDb;
  }
}

export function writeDb(data) {
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}