export default {
    install : function (Vue, options) {
        Vue.prototype.$db = new function() {
            var db = this
            var async = require('async');

            console.log('init db')
            this.name = 'snote.db'
            this.dbPath = require('path').resolve(__dirname, '../../../data/' + this.name)
            this.sqlite3 = require('sqlite3').verbose()
            this.link = new this.sqlite3.Database(this.dbPath, this.sqlite3.OPEN_READWRITE, err => {
                if(err) {
                    return console.error(err.message)
                }
                console.log('sqlite:connect success')
            })
            

            this.addFolder = function(name, pid=1) {
                if(Vue.prototype.isNull(name)) {
                    name = '无标题笔记'
                }

                pid = parseInt(pid)
                if(pid < 0) {
                    pid = 1
                }

                var asyncOps = [
                    function (callback) {
                        console.log('1. Lets print the rows from the database-');
                        db.link.all("SELECT * FROM folder where id=" + pid, function (err, row) {
                            if (err) {
                                return callback(err);
                            }

                            if(row.length < 0) {
                                pid = 1
                            }

                            console.log(row);
                            console.log('All done 1');
                            callback(null, row);
                        });
                        // I made the above more verbose for clarity, but keep in mind you could also have done:
                        // db.link.each("SELECT result FROM raw_results", done);
                    },
                    function (callback) {
                        console.log('2. Lets print the rows from the database-');

                        db.link.serialize(function(){
                            // var sql = 


                        })

                        db.link.each("insert result FROM raw_results WHERE someColumn = '<test></test>'", function (err, row) {
                            if (err) {
                                return callback(err);
                            }
                            console.log(row);
                            console.log('All done 2');
                            callback(null, row);
                        });
                    }
                ];

                async.series(asyncOps, function (err, results) {
                    if (err) {
                        return console.log(err);
                    }
                    // results = [ row1, row2 ];
                });





/*



                console.log(name)
                if(Vue.prototype.isNull(name)) {
                    name = '无标题笔记'
                }

                pid = parseInt(pid)
                if(pid < 0) {
                    pid = 0
                }

                console.log(9999)

                db.link.serialize(function() {
                    // console.log(db.link)
                    // db.link.all("SELECT * FROM floder where id = " + pid, function(err, row) {
                    //     console.log(row)
                    //     console.log(8888888888888)

                    // })
                    db.getFolderById(pid, function(err, all) {
                        // folder = all
                        // console.log(all)
                        console.log('length=' + all.length)
                        if(all.length < 0) {
                            pid = 0
                            // return false
                        }
                    })
                })

                console.log(777777777777)
                console.log(pid)
                console.log(777777777777)

                // 判断pid是否存在
                console.log(9999)
                // if(this.getFolderById(pid) === false) {
                //     pid = 0
                // }
            */
            }




            this.close =function() {
                this.link.close()
                console.log('sqlite close')
            }

        }
    }
}
