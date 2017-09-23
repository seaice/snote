const state = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
    isMax: true,
}
const mutations = {
    resize (state, size) {
        state.width = size.width
        state.height = size.height
    },
    setMax(state, isMax) {
        state.isMax = isMax
    }
}

export default {
    state,
    mutations
}
