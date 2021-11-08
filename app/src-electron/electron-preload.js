const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => {
        ipcRenderer.send('do-a-thing')
        console.log('hi')
    },
    readFile: fs.readFileSync,
    path: path,
    /**
     * @description Überprüfe die SQLITE DB
     * @param {string} Dateiname (absoluter Pfad)
     * @returns {boolean} true, wenn erfolgreich; false ...
     * @example const status = window.electron.checkDB('./mydb.db')
     */
    checkDB: (arg) => {
      let db = new sqlite3.Database(arg, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          return false
        }
      });
      db.close()
      return true
    },
    sqlite3: (arg) => {
        let db = new sqlite3.Database(arg, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              console.error(err.message);
            }
        });

        db.each(`SELECT * FROM patients`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row.id + "\t" + row.name);
        });


        return db
        
    }
  }
)