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
                    db.alert()
                    return console.error(err.message)
                }
            })

            /* 数据库异常alert */
            this.alert = function() {
                Vue.prototype.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'})
            }

            /* 根据数据库结果，构建数据给ztree */
            this.buildFolder =  function (data) {
                // 删除 所有 children,以防止多次调用
                data.forEach(function (item) {
                    if(item.depth == 0) {
                        item.open = true
                    } else {
                        item.open = false
                        item.open = true //测试用
                    }
                    // delete item.children;
                });

                // 将数据存储为 以 id 为 KEY 的 map 索引数据列
                var map = {};
                data.forEach(function (item) {
                    map[item.id] = item;
                });

                var val = [];
                data.forEach(function (item) {
                    // 以当前遍历项，的pid,去map对象中找到索引的id
                    var parent = map[item.pid];
                    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                    if (parent) {
                        (parent.children || ( parent.children = [] )).push(item);
                    } else {
                        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                        val.push(item);
                    }
                });

                return val;
            }

            /* 拖拽节点移动 */
            this.moveFolder = function(data) {
                db.link.serialize(function() {
                    var sql = "update folder set pid="+data.to_node.id+" where id="+data.node.id
                    db.link.run(sql)

                    if(data.children.length > 1) {
                        for (var i = 0; i < data.children.length; i++) {
                            var sql = "update folder set sort="+data.children[i].sort+" where id="+data.children[i].id
                            db.link.run(sql)
                        }
                    }
                });
            }

            /* 重命名 */
            this.renameFolder = function(node) {
                var sql = "update folder set name='" + node.name + "' where id=" + node.id;
                console.log(sql)
                // db.link.run(sql)
            }

            /* 获得树，并初始化左侧树 */
            this.getFolder = function(uid) {
                var sql = "select id,name,pid,sort,depth from folder where uid=" + uid + " order by sort desc, id asc"
                db.link.all(sql, function(err, rows){
                    if (err) {
                        db.alert()
                        return console.error(err.message)
                    }
                    if(rows.length < 0) { // 没找到根节点
                        db.alert()
                        return console.error(err.message)                        
                    }

                    this.tree = db.buildFolder(rows)

                    Vue.prototype.$bus.$emit('folder:init', this.tree)
                })
            }

            this.addFolder = function(name, uid, pid=1) {
                if(Vue.prototype.isNull(name)) {
                    name = '无标题笔记'
                }

                pid = parseInt(pid)
                if(pid < 0) {
                    pid = 1
                }

                // return pid
                uid = 1
                var depth = 0
                var created = Date.parse(new Date())/1000
                var updated = created

                var asyncOps = [
                    // 取parent
                    function (callback) {
                        console.log('1. Lets print the rows from the database-');
                        db.link.all("SELECT * FROM folder where id=" + pid, function (err, rows) {
                            if (err) {
                                return callback(err);
                            }
                            if(rows.length < 0) {
                                pid = 1
                                depth = 1
                            } else {
                                pid = rows[0].id
                                depth = rows[0].depth + 1
                            }

                            callback(null, {pid:pid, depth:depth});
                        });
                    },
                    // 插入节点
                    function (parent, callback) {
                        console.log('2. Lets print the rows from the database-');
                        var sql = "insert into folder (name,uid,pid,depth,created,updated) values ("
                                + "'" + name + "',"
                                + "'" + uid + "',"
                                + "'" + pid + "'," 
                                + "'" + depth + "'," 
                                + "'" + created + "',"
                                + "'" + updated + "'" 
                                + ")"
                        console.log(sql)

                        // db.link.run(sql, function(err, id){
                        //     if(err) {
                        //         return callback(err)
                        //     }

                        //     if(this.changes != 1) {
                        //         return callback('sql')
                        //     }

                        //     callback(null, this.lastID)
                        // })
                        callback(null, 3)
                    },
                    // rebuild
                    function (folder_id, callback) {
                        console.log('step 3')
                        var sql = "select id,name,pid from folder where uid=" + uid
                        console.log(sql)
                        db.link.all(sql, function(err, rows){
                            if (err) {
                                return callback(err);
                            }
                            // console.log(rows)
                            if(rows.length < 0) { // 没找到根节点
                                callback(null, false)
                            } else {
                                callback(null, rows)
                            }

                        })

                        // var test = 123
                        // callback(null, test)
                    },
                    function(folders, callback) {
                        if(folders == false) { // 创建根节点
                            console.log(uid + ' has no root folder, create it~')
                            var sql = "insert into folder (name,uid,pid,depth,created,updated) values ("
                                + "'root',"
                                + "'" + uid + "',"
                                + "'0'," 
                                + "'0'," 
                                + "'" + created + "',"
                                + "'" + updated + "'" 
                                + ")"
                            // db.link.run(sql, function(err, id){
                            //     if(err) {
                            //         return callback(err)
                            //     }

                            //     if(this.changes != 1) {
                            //         return callback('sql')
                            //     }

                            //     callback(null, this.lastID)
                            // })

                            callback(null, '1')
                        } else {
                            callback(null, folders)
                        }
                    },
                    function(folders, callback) {
                        console.log(folders)
                        // 格式化
                        db.rebuildFolder(folders)
                    }
                ];

                // return 123
                async.waterfall(asyncOps, function (err, results) {
                    console.log('0000000000')

                    if (err) {
                        console.log('error total')
                        console.log(err);

                        Vue.prototype.$bus.$emit('alert', '123123')

                        return false
                    }
                });
            }


            /* 关闭数据库连接 */
            this.close =function() {
                this.link.close()
                console.log('sqlite close')
            }

        }
    }
}
