import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
Vue.prototype.$store = store

///////////////////////////////////////////////////////////////////////////////////////////////
import 'font-awesome/css/font-awesome.css'

import 'ztree/js/jquery.ztree.all.min.js'

import _ from './assets/js/lodash.custom.min.js'

import common from './assets/js/common.js'
Vue.use(common);

import db from './assets/js/db.js'
Vue.use(db);
// Object.defineProperty(Vue.prototype, '$db', { value: new db() });


import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

require('./assets/main.css')
//判断是否联网
console.log('at any moment you can check with navigator.onLine', navigator.onLine)


const electron = require('electron').remote


// const path = require('path')

console.log(electron)

electron.protocol.unregisterProtocol('snote')
electron.protocol.registerFileProtocol('snote', (request, callback) => {
    console.log(111111111111)
    console.log(request)
    console.log(callback)
    console.log(111111111111)

    const url = request.url.substr(6)
    console.log(url)
    // callback({path: path.normalize(`${__dirname}/${url}`)})
    callback({path: url})
}, (error) => {
    console.log(error)
    if (error) console.error('Failed to register protocol')
})   

// electron.app.on('ready', () => {
    // electron.protocol.registerFileProtocol('snote', (request, callback) => {
    //     console.log(111111111111)
    //     console.log(request)
    //     console.log(callback)
    //     console.log(111111111111)

    //     const url = request.url.substr(6)
    //     console.log(url)
    //     callback({path: path.normalize(`${__dirname}/${url}`)})
    // }, (error) => {
    //     console.log(error)
    //     if (error) console.error('Failed to register protocol')
    // })
// })

///////////////////////////////////////////////////////////////////////////////////

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

const bus = new Vue()
Vue.prototype.$bus = bus
Vue.prototype.$async = require('async');
/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
    data() {
        return {
        }
    },
    mounted: function () {
        // 获得用户
        var uid = 1
        store.commit('user_login', {
            id : uid,
            name : 'haibing',
        })

        // 初始化文件夹
        this.$db.getFolder(uid)
        // this.$db.addFolder('    ', 4)

        // 初始化第二列


        // 初始化第三列


        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleWindowResize, 100)
        this.$db.close()
    },
    methods: {
        handleResize (event) {
            store.commit('resize', {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            })

            const BrowserWindow = require('electron').remote.BrowserWindow
            var top = BrowserWindow.getFocusedWindow()
            if(top.isMaximized()) {
                store.commit('setMax', true)
            } else {
                store.commit('setMax', false)
            }
        }
    }
}).$mount('#app')

