exports.install = function (Vue, options) {
    Vue.prototype.db = function (){
        var db = {}
        var _this = this
        db.name = 'snote.db'
        db.dbPath = require('path').resolve(__dirname, '../../../data/' + db.name)
        db.sqlite3 = require('sqlite3').verbose()

        db.init = function() {
            console.log('init db')
            db.link = new db.sqlite3.Database(db.dbPath)
        }

        db.getNote = function() {
            db.link.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
                console.log(row.id + ": " + row.info)
            })
        }

        db.getFolderById = function(id) {
            return db.link.all("SELECT * FROM folderr where id = " + id, function(err, row) {
                if(err) {
                    console.log(err)
                    return false
                }
                // console.log(err)
                console.log(44444444)
                console.log(row)
                console.log(44444444)
            })

            console.log('zem')
        }

        db.addFolder = function(name, pid='000001') {
            if(!_this.isNull(name)) {
                name = '无标题笔记'
            }
            
            pid = parseInt(pid)
            if(pid < 0) {
                pid = 0
            }

            // 判断pid是否存在
            console.log(9999)
            console.log(this.getFolderById(pid))
            console.log(9999)
            // if(this.getFolderById(pid) === false) {
            //     pid = 0
            // }



        }

        db.init()
        return db
    };
};



/*
export default function noteDb() {

    console.log('db one time')
    var db = {}
    db.name = 'database.db'
    // db.path = 
    db.dbPath = require('path').resolve(__dirname, '../../../data/' + db.name)
    db.sqlite3 = require('sqlite3').verbose()

    db.init = function() {
        console.log('init db')
        db.link = new db.sqlite3.Database(db.dbPath)
        // console.log(db.link)
    }

    db.getNote = function($pid) {
        this.changeData();
        db.link.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
            console.log(row.id + ": " + row.info)
        })
    }

    db.addFloder = function(name, pid=0) {

        console.log(name)
        if(isNull(name)) {
            console.log(12313);
        }

    }



    db.init()
    return db
};
*/