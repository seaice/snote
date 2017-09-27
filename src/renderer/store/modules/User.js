const state = {
    id: 0,
    name: '请登陆',
    login: false,
    figure: '~@/assets/img/figure.png',
}

const mutations = {
    user_login (state, user) {

        console.log(user)
        state.id   = user.id
        state.name  = user.name
        state.login = true
    },
}

export default {
    state,
    mutations,
}
