import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'font-awesome/css/font-awesome.css'
require('./assets/main.css')


import 'ztree/js/jquery.ztree.all.min.js'
// import './assets/css/ztree/awesomeStyle/awesome.css';

// import 'ztree/css/zTreeStyle/zTreeStyle.css'
// import 'ztree/css/awesomeStyle/awesome.css'

// import ztree from 'ztree'
// const sqlite3 = require('sqlite3');
// sqlite3.verbose();
// const db = new sqlite3.Database('mydb.db');
// db.serialize(function() {
//     db.run("CREATE TABLE if not exists lorem (info TEXT)");
// });
// db.close();


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

