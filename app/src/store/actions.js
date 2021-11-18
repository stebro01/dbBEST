
/**
 * Initialisieren von Settings.js
 * @method
 */
 export function initSettings ({commit}) {
    commit('SETTINGS_INIT')
}

/**
 * @description setzt die Einstellung zurück
 * @param {}
 * @example this.$store.dispatch('clearSettings')
 */
export function clearSettings ({commit}) {
    console.log('action -> clearSettings')
    commit('SETTINGS_CLEAR')
    return new Promise((res, rej) => {
        return res('Einstellungen erfolgreich zurückgesetzt')
    })
}


/**
 * Diese Funktion baut die Verbindung zur DB auf
 * @method
 */
export function checkDB ({commit}, payload) {
    console.log('action -> checkDB', payload)

    const status = window.electron.dbman.connect(payload.filename)
    return new Promise((res, rej) => {
        if (!status) return rej('DB konnte nicht geladen werden')
        commit('CONNECTED_SET', true)
        return res('DB konnte erfolgreich geladen werden')
    })
}

export function connectDB ({commit, state}) {
    console.log('action -> connectDB')
    const filename = state.SETTINGS.data.filename
    return new Promise((res, rej) => {
        if (!filename) return rej('Keine DB ausgewählt')
        const status = window.electron.dbman.connect(filename) 
        if (!status) return rej('DB konnte nicht geladen werden')
        commit('CONNECTED_SET', true)
        return res('DB konnte erfolgreich geladen werden')
    })
}

export function closeDB ({commit}) {
    console.log('action -> closeDB')
    const status = window.electron.dbman.close()
    commit('CONNECTED_SET', false)
    return new Promise((res, rej) => {
        if (!status) return rej('Verbindung war bereits getrennt.')
        return res('Verbindung erfoglreich getrennt.')
    }) 
}

/**
 * @description Führt eine einfache SQL Query aus
 * @param {object} payload - string with the SQL Query 
 * @example this.$store.dispatch('queryDB', `SELECT * FROM ${this.table}`)
 * @returns a promise for the results (array)
 */
export function queryDB ({}, payload) {
    console.log('action -> queryDB: ', payload)
    return window.electron.dbman.get_all(payload)
}

/**
 * 
 * @description Löscht einen DB Eintrag (mit ID spezifiziert) aus einem Table
 * @param {object} payload - {table: 'string of table name', id: 'ID of entry to delete'}
 * @example this.$store.dispatch('deleteDBEntry', {table: this.table, id: payload.id})
 * @returns Promise > resolve (if success), and reject (else)
 */
export async function deleteDBEntry({}, payload) {
    console.log('action -> queryDB: ', payload)
    const sqlquery = `DELETE FROM ${payload.table} WHERE id = ${payload.id}`

    if (payload.table === 'visits') {
        console.log('clear quests as well ... ')
        const sqlquest2 = 'SELECT id, label, description FROM list_quests'
        queryDB({}, sqlquest2).then(quests => {
            quests.forEach(q => {
                let sqlrmquest = `DELETE FROM ${q.label} WHERE visit_id = ${payload.id}`
                window.electron.dbman.run(sqlrmquest)
            })
        })
    }

    return window.electron.dbman.run(sqlquery)
}

/**
 * 
 * @description Fügt einen leeren Eintrag in einen Table hinzu
 * @param {object} payload - {table: 'string of table name'}
 * @example this.$store.dispatch('addDBEntry', {table: 'coding'})
 * @returns Promise > resolve (if success), and reject (else)
 */
 export function addDBEntry({}, payload) {
    console.log('action -> addDBEntry: ', payload)
    let sqlquery = undefined
    if (!payload.values) sqlquery = `INSERT INTO ${payload.table} DEFAULT VALUES`
    else {

    //     INSERT INTO "main"."patients"
    //     ("name", "first_name", "birthdate", "sex")
    // VALUES ('Jim', 'John', '12.11.2021', 'male');

        let fields = undefined
        let values = undefined
        Object.keys(payload.values).forEach(key => {
            let val = payload.values[key]
            if (val) {
                if (!fields) fields = `"${key}"`
                else fields += `, "${key}"`
                if (typeof(val) === 'string') val = `'${val}'`
                if (!values) values = `${val}`
                else values += `, ${val}`
            }
        })

        if (fields) sqlquery = `INSERT INTO ${payload.table} (${fields}) VALUES (${values})`
    }
    if (!sqlquery) return false
    return window.electron.dbman.run(sqlquery)
}

/**
 * 
 * @description Update eine ROW eines Tables entsprechend einer ID
 * @param {object} payload - {table: 'string of table name', id: ID als Integer, values: {object}}
 * @example this.$store.dispatch('updateDBEntry', {table: this.table, values: payload, id: 1})
 * @returns Promise > resolve (if success), and reject (else)
 */
 export function updateDBEntry({}, payload) {
    console.log('action -> updateDBEntry: ', payload)
    let values = null
    Object.keys(payload.values).forEach(item => {
       if (item !== 'id') {
           let val = payload.values[item]
           if (val !== null) {
                if (typeof(val) === 'string') val = `'${val}'`
                else if (typeof(val) === 'number') {/**do nothing */}
                else console.error(`ERROR: type ${typeof(val)} of ${item} not supported`)
                item = '`' + item + '`'
               if (values === null) values = `${item}=${val}`
               else values = `${values}, ${item}=${val}`
            }
       } 
    })
    const sqlquery = `UPDATE ${payload.table} SET ${values} WHERE id= ${payload.id}`
    return window.electron.dbman.run(sqlquery)
}

/**
 * 
 * @description führt eine vorbereite SQL Anfrage durch
 * @param {string} payload - SQL Anfrage als string
 * @example this.$store.dispatch('runQueryDB', 'SELECT * FROM patients WHERE id=1')
 * @returns Promise > resolve (if success), and reject (else)
 */
 export function runQueryDB({}, payload) {
    console.log('action -> runQueryDB: ', payload)
    return window.electron.dbman.get_all(payload)
}

/**
 * @description führt eine vorbereite SQL Aktion durch, ie: Visits.vue / setProtected
 * @param {string} payload - SQL Aktion als Sting: ie: UPDATE visits SET protected=true WHERE id=1
 * @example this.$store.dispatch('runUpdateDB', 'UPDATE visits SET protected=true WHERE id=1')
 * @returns Promise > resolve (if success), and reject (else)
 */
export function runUpdateDB({}, payload) {
    if (payload.length <200 ) console.log('action -> runUpdateDB: ', payload)
    else console.log('action -> runUpdateDB: ', payload.substring(0, 200))
    return window.electron.dbman.run(payload)
}
