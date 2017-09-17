import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'font-awesome/css/font-awesome.css'

// import ztree from 'ztree'

// import './assets/main.css'
require('./assets/main.css')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

console.log('at any moment you can check with navigator.onLine', navigator.onLine)

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
    ready: function () {
        window.addEventListener('resize', this.handleResize);
        // alert(123123);
        // console.log('at any moment you can check with navigator.onLine', navigator.onLine)
    },
    methods: {
    // whenever the document is resized, re-set the 'fullHeight' variable
        handleResize (event) {
          this.fullHeight = document.documentElement.clientHeight
        }
    }
}).$mount('#app')

