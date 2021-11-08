

const sqlite3 = require('sqlite3').verbose()

/**
 * @class DBMan
 * @description DB Manager, funktioniert mit sqlite3
 */
 class DBMan {
     db = undefined
    

    constructor() {

    }

    /**
     * @description Stelle eine Verbindung zur DB her
     * @param {string} filename
     * @return {boolean} true, wenn erfolgreich, false ...
     * @example const DBMAN = new DBMan()
     * const status = DBMAN.connect('./mydb.db')
     * // DBMAN.db enthält die DBVerbindung
     */
    connect(filename) {
        if (!filename) return false
        let database = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              console.error(err.message);
              return false
            }
        });

        this.db = database

        return true

    }

    /**
     * @description Schließt eine Verbindung
     * @return {boolean} true, wenn erfolgreich
     * @example DBMAN.close()
     */
    close() {
        this.db.close()
        this.db = undefined
    }


    /**
     * @description Gibt alle Einträge einer Query als Promise zurück
     * @param {string} sql_query 
     * @returns {async} Array mit Ergebnis der Anfrage
     * @example const result = await DBMAN.get_all(`SELECT * FROM patients`)
     * 
     */
    async get_all(sql_query) {
        return new Promise((resolve, reject) => {
            this.db.all(sql_query, [], (err, rows) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }


}

export const DBMAN = new DBMan()
