import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

///////////////////////////////////////////////////////////////////////////////////////////////
import 'font-awesome/css/font-awesome.css'

import 'ztree/js/jquery.ztree.all.min.js'

import common from './assets/js/common.js'
Vue.use(common);

import db from './assets/js/db.js'
Vue.use(db);
// Object.defineProperty(Vue.prototype, '$db', { value: new db() });

// import VueMenu from '@hscmap/vue-menu'
// Vue.use(VueMenu)

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


require('./assets/main.css')
//判断是否联网
console.log('at any moment you can check with navigator.onLine', navigator.onLine)

///////////////////////////////////////////////////////////////////////////////////

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
    data() {
        return {
            fullHeight: document.documentElement.clientHeight
        }
    },
    mounted: function () {
        // this.$db.addFolder('    ')
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this. handleWindowResize)
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

