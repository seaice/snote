const state = {
    note   : {title:'',content:''}, //当前激活的note
    page_size : 10,
    cur_fid : 1, //当前选择文件夹。默认根目录
}

const mutations = {
    setNote(state, note) {
        state.note = note
    },
    setCurFolder(state, fid) {
        state.cur_fid = fid
    }
}

export default {
    state,
    mutations
}
