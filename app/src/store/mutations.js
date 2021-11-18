export function SETTINGS_INIT (state) {
    state.SETTINGS.init()
}

/**
 * 
 * @example this.$store.commit('SETTINGS_SET', {label: 'user', value: this.active_user})
 */
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

export function QUESTS_PRESETS_SET (state, payload) {
    state.QUESTS_PRESETS = payload
}