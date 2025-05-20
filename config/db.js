import Database from 'better-sqlite3';

export class SQLiteDB {

    constructor(dbPath) {
        const logLevel = "warn";
        const logger = (msg) => {
            if (logLevel === "debug") console.log(`[DEBUG] ${msg}`);
            else if (logLevel === "info" && !msg.includes("DEBUG")) console.info(`[INFO] ${msg}`);
            else if (logLevel === "warn" && (msg.includes("WARN") || msg.includes("ERROR"))) console.warn(`[WARN] ${msg}`);
            else if (logLevel === "error" && msg.includes("ERROR")) console.error(`[ERROR] ${msg}`);
        };

        this.db = new Database(dbPath, { verbose: logger });

        this.db.pragma('journal_mode = WAL');
        this.initTables();
    }

    initTables() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT, isp TEXT, city TEXT, country TEXT,
                date TEXT, path TEXT, useragent TEXT
            );
            CREATE TABLE IF NOT EXISTS foreign_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT, isp TEXT, city TEXT, country TEXT,
                date TEXT, path TEXT, useragent TEXT
            );
            CREATE TABLE IF NOT EXISTS msg (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT, isp TEXT, city TEXT, country TEXT,
                date TEXT, useragent TEXT, name TEXT, email TEXT, msg TEXT
            );
        `);
        console.log('SQLite DB Initialized.');
    }

    insertLog(table, ip, isp, city, country, path, userAgent) {
        this.db.prepare(`
            INSERT INTO ${table} (ip, isp, city, country, date, path, useragent)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(ip, isp, city, country, new Date(Date.now() + 21600000).toUTCString() + '+06', path, userAgent);
    }

    insertMsg(ip, isp, city, country, userAgent, name, email, msg) {
        this.db.prepare(`
            INSERT INTO msg (ip, isp, city, country, date, useragent, name, email, msg)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(ip, isp, city, country, new Date(Date.now() + 21600000).toUTCString() + '+06', userAgent, name, email, msg);
    }

    fetchAll(table) {
        const result = this.db.prepare(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 50`).all();
        return result;
    }

    checkExistingLog(ip) {
        return this.db.prepare('SELECT * FROM log WHERE ip = ? LIMIT 1').get(ip);
    }
}

export const db = new SQLiteDB('./database.db');
