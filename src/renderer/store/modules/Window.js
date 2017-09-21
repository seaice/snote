const state = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
}
const mutations = {
    resize (state, size) {
        state.width = size.width
        state.height = size.height
    }
}

export default {
    state,
    mutations
}
