import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

///////////////////////////////////////////////////////////////////////////////////////////////
require('./assets/main.css')
import 'font-awesome/css/font-awesome.css'


import 'ztree/js/jquery.ztree.all.min.js'
import common from './assets/js/common.js'
Vue.use(common);

import db from './assets/js/db.js'
Vue.use(db);
// Object.defineProperty(Vue.prototype, '$db', { value: new db() });


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
    // whenever the document is resized, re-set the 'fullHeight' variable
        handleResize (event) {
            store.commit('resize', {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            })
            // this.$store.state.Window.height = document.documentElement.clientHeight
        }
    }
}).$mount('#app')

