const state = {
    id       : 0,
    name     : '请登陆',
    token    : null,
    login    : false,
    figure   : '~@/assets/img/figure.png',
    pathData : null,
}

const mutations = {
    user_login (state, user) {
        state.id    = user.id
        state.name  = user.name
        state.token = user.token
        state.login = true
        state.pathData = user.pathData
    },
}

export default {
    state,
    mutations,
}
