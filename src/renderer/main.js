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

///////////////////////////////////////////////////////////////////////////////////////////////

/*
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.db')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath);
console.log(dbPath);
db.serialize(function() {
  // db.run("CREATE TABLE lorem (info TEXT)");

  // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  // for (var i = 0; i < 10; i++) {
  //     stmt.run("Ipsum " + i);
  // }
  // stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

*/
import noteDb from './assets/js/db.js'
Object.defineProperty(Vue.prototype, '$db', { value: new noteDb() });
/*
var noteDb = {
    createNew: function(){
        var db = {};
        db.name = 'database.db';
        db.path = require('path');
        db.dbPath = db.path.resolve(__dirname, db.name)
        db.sqlite3 = require('sqlite3').verbose();

        db.init = function() {
            console.log('init db');
            
            db.link = new db.sqlite3.Database(db.dbPath);

            console.log(db.name);
        }

        db.getNote = function() {
            db.link.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
                console.log(row.id + ": " + row.info);
            });
        }

        // db.getNote = function(){ alert("喵喵喵"); };
        db.init();

        return db;
        // some code here
    }
};
*/
// console.log(noteDb.noteDb);
// var temp = 
// temp.getNote();




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
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this. handleWindowResize)
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

