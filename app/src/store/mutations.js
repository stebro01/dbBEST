export function SETTINGS_INIT (state) {
    state.SETTINGS.init()
}

export function SETTINGS_SET (state, payload) {
    if (!payload) return false
    state.SETTINGS.data = payload
}