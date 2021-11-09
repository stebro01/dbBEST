
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
