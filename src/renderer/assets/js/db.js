export default function noteDb() {
    // console.log(123);
    
    // createNew: function(){
        var db = {};
        db.name = 'database.db';
        // db.path = 
        db.dbPath = require('path').resolve(__dirname, '../../../data/' + db.name)
        console.log(db.dbPath);
        // console.log(db.path);
        // console.log(111111111111);
        db.sqlite3 = require('sqlite3').verbose();

        db.init = function() {
            console.log('init db');
            db.link = new db.sqlite3.Database(db.dbPath);
            console.log(db.link);
        }

        db.getNote = function() {
            // console.log(3333);
            db.link.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
                console.log(row.id + ": " + row.info);
            });
        }

        // // db.getNote = function(){ alert("喵喵喵"); };
        db.init();

        return db;
        // some code here
    // }
    
};
