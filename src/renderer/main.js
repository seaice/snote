import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

///////////////////////////////////////////////////////////////////////////////////////////////
Vue.prototype.$store = store
import 'font-awesome/css/font-awesome.css'

import 'ztree/js/jquery.ztree.all.min.js'

import _ from './assets/js/lodash.custom.min.js'

import common from './assets/js/common.js'
Vue.use(common);

import db from './assets/js/db.js'
Vue.use(db);
// Object.defineProperty(Vue.prototype, '$db', { value: new db() });


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'


require('./assets/main.css')
//判断是否联网
console.log('at any moment you can check with navigator.onLine', navigator.onLine)


/*
const electron = require('electron').remote

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
*/

const remote = require('electron').remote

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
        // 用户登陆
        // Vue.prototype.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'})
        // login()



        // 初始化个人目录
        // remote.app.getPath('userData')

        // 初始化文件夹列表
        this.$db.getFolder(1)
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

