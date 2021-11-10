
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
export function deleteDBEntry({}, payload) {
    console.log('action -> queryDB: ', payload)
    const sqlquery = `DELETE FROM ${payload.table} WHERE id = ${payload.id}`
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
    const sqlquery = `INSERT INTO ${payload.table} DEFAULT VALUES`
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