const sqlite3 = require('sqlite3')

let database = undefined

/**
 * @description Stelle eine Verbindung zur DB her
 * @param {string} filename
 * @return {boolean} true, wenn erfolgreich, false ...
 * @example const status = dbman.connect('./mydb.db')
 * // DBMAN.db enthält die DBVerbindung
 */
const connect = (filename) => {
    console.log('connect: ' + filename)
    if (database) database.close()
    database = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            return false
        }
    });
    return true
};

/**
 * @description Schließt eine Verbindung
 * @return {boolean} true, wenn erfolgreich
 * @example dbman.close()
 */
const close = () => {
    if (!database) return false
    if (database) database.close()
    database = undefined
    return true
}


/**
 * @description Gibt alle Einträge einer Query als Promise zurück
 * @param {string} sql_query 
 * @returns {async} Array mit Ergebnis der Anfrage
 * @example const result = await dbman.get_all(`SELECT * FROM patients`)
 * 
 */
const get_all = async (sql_query) => {
    return new Promise((resolve, reject) => {
        database.all(sql_query, [], (err, rows) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}
  


// EXPORT THE MODULES
exports.connect = connect;
exports.close = close;
exports.get_all = get_all;