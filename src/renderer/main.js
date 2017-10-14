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


const remote = require('electron').remote
// const electron = require('electron').remote

// console.log(remote)


// var app = require('app');

// function setupProtocol () {
//   var protocol = require('protocol');

//   console.log("http: " + protocol.isHandledProtocol('http'))

//   protocol.interceptProtocol('http', function(request) {
//     // Parse the URL
//     var parsedUri = url.parse(request.url);

//     var appName = parsedUri.hostname;

//     console.log(parsedUri)

//     // The default path is '/index.html'.
//     if (parsedUri.pathname === "/")
//       parsedUri.pathname = "/index.html"

//     var filePath = path.join(__dirname, parsedUri.pathname);
//     console.log('Requesting', filePath);

//     return new protocol.RequestFileJob(filePath);
//   })
// }

const Store  = require('electron-store');

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
        this.init()

        // this.check_login()

        var _this = this
        // 用户登陆
        // Vue.prototype.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'})
        // login()


        // console.log(this.encrypt_uid(1))

        //假数据
        const path   = require('path');
        var pathData = path.join(remote.app.getPath('userData'), '866747')
        this.$store.commit('user_login', {
            id : 1,
            name : 'haibing',
            pathData : pathData,
        })
        // 初始化个人目录
        // remote.app.getPath('userData')

        // 初始化文件夹列表
        this.$db.getFolder(1)
        // this.$db.addFolder('    ', 4)

        // 初始化第二列
        this.$db.getNoteList(1, Vue.prototype.$store.state.User.id);


        // 初始化第三列

        console.log('ready')
        remote.protocol.unregisterProtocol('snote')
        remote.protocol.registerFileProtocol('snote', (request, callback) => {
            const path   = require('path');
            // console.log(request)
            // console.log(callback)

            var url = path.join(store.state.User.pathData,  path.basename(request.url))
            // console.log(url)
            callback({path: url})
        }, (error) => {
            console.log(error)
            if (error) {
                console.error('Failed to register protocol')
            }
        })

        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleWindowResize, 100)
        this.$db.close()
    },
    methods: {
        init() {
            // 全局配置
            const store = new Store()
            if(!store.has('autostart')) {
                store.set('autostart', true)
            }
            if(!store.has('autoupdate')) {
                store.set('autoupdate', true)
            }

            $(document).on('click', "#edui_fixedlayer, #note, #noteList", function(e){
                this.show_preview = false
                this.show_editor  = true

                e.stopPropagation();
            })

            $(".modal").on('click', function(e) {
                e.stopPropagation();
            })
        },
        check_login() {
            // const store = new Store('')
            if(true) { //未登录
                this.$bus.$emit('user:login:modal:active', {close:false})
            }
            


        },
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

