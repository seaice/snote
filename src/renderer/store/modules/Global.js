const state = {
    note   : {title:'',content:''}, //当前激活的note
    page_size : 10,
    cur_fid : 1, //当前选择文件夹。默认根目录
    cur_fid_child : undefined, //当前文件夹id + 所有子文件夹id
}

const mutations = {
    setNote(state, note) {
        state.note = note
    },
    setCurFolder(state, data) {
        state.cur_fid = data.fid
        state.cur_fid_child = data.children
    }
}

export default {
    state,
    mutations
}
