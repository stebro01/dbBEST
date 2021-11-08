/**
 * Diese Funktion baut die Verbindung zur DB auf
 * @method
 */
export function checkDB ({}, payload) {
    console.log('action -> checkDB')
    return new Promise((res, rej) => {
        if (!payload) return rej('invalid data')
        const status = window.electron.checkDB('/Users/ste/MyProjects/dbBEST/dbase/mydb.db')
        if (status) return res('valid db')
        else rej('error occured')
    })
    
    
    
}

/**
 * Initialisieren von Settings.js
 * @method
 */
 export function initSettings ({commit}) {
    commit('SETTINGS_INIT')
}