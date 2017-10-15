const state = {
    folder : [],
    note   : {title:'',content:''}, //当前激活的note
    page_size : 10
}

const mutations = {
    folderinit (state, folder) {
        state.folder = folder
    },
    setNote(state, note) {
        state.note = note
    }
}

export default {
    state,
    mutations
}
