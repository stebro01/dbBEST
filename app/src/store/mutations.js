export function SETTINGS_INIT (state) {
    state.SETTINGS.init()
}

export function SETTINGS_SET (state, payload) {
    if (!payload) return false
    state.SETTINGS.data = payload
}

export function SETTINGS_CLEAR (state) {
    state.SETTINGS.clear()
    state.SETTINGS.save()
}

export function CONNECTED_SET (state, payload) {
    state.connected = payload
}