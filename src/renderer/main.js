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

const Store  = require('electron-store')
// const storeFile = new Store()
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
            'config' : null,
        }
    },
    mounted: function () {
        /* 登陆成功后，触发 */
        this.$bus.$on('user:login:success', this.userLoginSuccess)

        var _this = this
        
        this.init()
        this.check_login()


        // 初始化文件夹列表
        // this.$db.getFolder(1)

        // 初始化第二列
        // this.$db.getNoteList(1, Vue.prototype.$store.state.User.id);
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
            if (error) {
                console.log(error)
                console.error('Failed to register protocol')
            }
        })

        
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleWindowResize, 100)
        this.$db.close()
    },
    methods: {
        /* snote 初始化 */
        init() {
            // 全局配置
            this.config = new Store()
            // const store = 
            if(!this.config.has('autostart')) {
                this.config.set('autostart', true)
            }
            if(!this.config.has('autoupdate')) {
                this.config.set('autoupdate', true)
            }

            // 事件监听
            $(document).on('click', "#edui_fixedlayer, #note, #noteList", function(e){
                this.show_preview = false
                this.show_editor  = true

                e.stopPropagation();
            })

            $(document).on('click', ".modal", function(e) {
                e.stopPropagation();
            })

            window.addEventListener('resize', this.handleResize);
        },

        /* 登陆校验 */
        check_login() {
            if(!this.config.has('id') || !this.config.has('name') || !this.config.has('token')) {
                this.$bus.$emit('user:login:modal:active', {close:false})
                return 
            }

            //todo 去server检查登陆
            this.$bus.$emit('user:login:success')

        },

        /* 登陆成功后，初始化用户数据 */
        userLoginSuccess() {
            console.log('login success')
            //初始化 store user
            const path   = require('path');
            var pathData = path.join(remote.app.getPath('userData'), this.config.get('id').toString())
            this.$store.commit('user_login', {
                id       : this.config.get('id'),
                name     : this.config.get('name'),
                token    : this.config.get('token'),
                pathData : pathData,
            })

            /* 文件夹初始化 */
            this.$bus.$emit('folder:init')
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

