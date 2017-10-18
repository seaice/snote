/**
 * note 表结构
 * id   
 * uuid 唯一id
 * fid  文件夹id
 * nid  云端笔记id。默认为0。同步云端成功会返回。回写到此字段。
 * uid  用户id
 * type 类型：0，html；1，markdown
 * cloud 是否云笔记：0，本地笔记；1，云笔记
 * title    标题
 * thumbnail    缩略图，笔记中的第一个图。没有为空
 * summary  摘要
 * content  笔记内容
 * state    状态：0，正常；1，回收站；2，彻底删除；
 * version  笔记版本。默认为0。同步云端成功会返回。回写到此字段。
 * created  创建时间
 * updated  修改时间
 * synced   同步时间
 */

export default {
    install : function (Vue, options) {
        Vue.prototype.$db = new function() {
            var db = this
            var store = Vue.prototype.$store
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
            this.folderBuild =  function (data) {
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
            this.folderMove = function(data) {
                var folder = this.getTable('folder')
                db.link.serialize(function() {
                    var sql = "update " + folder + " set pid="+data.to_node.id+" where id="+data.node.id
                    db.link.run(sql)

                    if(data.children.length > 1) {
                        for (var i = 0; i < data.children.length; i++) {
                            var sql = "update " + folder + " set sort="+data.children[i].sort+" where id="+data.children[i].id
                            db.link.run(sql)
                        }
                    }
                })
            }

            /* 重命名 */
            this.folderRename = function(node) {
                var folder = this.getTable('folder')
                var sql = "update " + folder + " set name='" + node.name + "' where id=" + node.id;
                // console.log(sql)
                db.link.run(sql)
            }

            /* 获得树，并初始化左侧树 */
            this.folderGet = function(callback) {
                var sql = "select id,name,pid,sort from " + this.getTable('folder') + " where state=0 order by sort desc, id asc"

                db.link.all(sql, function(err, rows){
                    if (err) {
                        db.alert()
                        return console.error(err.message)
                    }
                    if(rows.length < 0) { // 没找到根节点
                        db.alert()
                        return console.error(err.message)                        
                    }

                    if(callback != undefined) {
                        callback(null, db.folderBuild(rows))
                    }
                })
            }

            /*
                @param uid
                @param node     父文件夹
                @param newNode  新文件夹
                @param callback
            */
            this.folderCreate = function(fid, newNode, callback) {
                if(fid == undefined) {
                    return false
                }

                var created = Date.parse(new Date())/1000
                var updated = created

                var folder = this.getTable('folder')

                var asyncOps = [
                    function (callback) {
                        var sql = "select * from " + folder + " where id=" + fid
                        // console.log(sql)
                        db.link.all(sql, function(e, rows){
                            if(rows.length < 1) {
                                callback(1)
                            }
                            callback(null, fid)
                        })
                    },
                    function(callback) {
                        var sql = "insert into " + folder + " (name,pid,created,updated) values ("
                                + "'" + newNode.name + "',"
                                + "'" + fid + "'," 
                                + "'" + created + "',"
                                + "'" + updated + "'" 
                                + ")"
                        // console.log(sql)

                        db.link.run(sql, function(err){
                            if(err) {
                                return callback(err)
                            }

                            if(this.changes != 1) {
                                return callback(1)
                            }

                            callback(null, this.lastID)
                        })
                    }
                ]

                Vue.prototype.$async.series(asyncOps, function (err, results) {
                    if (err) {
                        console.log(err);

                        callback(1)
                    }
                    callback(null, results[1])
                })
            }

            /* 关闭数据库连接 */
            this.close =function() {
                this.link.close()
                console.log('sqlite close')
            },

            this.notelistGetCount = function(fids, conds, callback) {
                var note   = this.getTable('note')

                switch(typeof(fids)) {
                    case 'object':
                         fids = fids.join(",")
                    default:
                }

                var whereArr = []
                whereArr.push("state=0")


                if(fids != undefined) {
                    whereArr.push("fid in ("+ fids +")")
                }

                var where = whereArr.join(" and ")
                var sql = "select count(*) as count from " + note + " where " + where
                    
                console.log(sql)

                db.link.get(sql, function(err, row) {
                    if (err) {
                        db.alert()
                        return console.error(err.message)
                    }

                    callback(null, row.count)
                })
            },

            /*
                @param mixed fid 单独id或者id数组
            */
            this.notelistGet = function(fids, pageNum=1, pageSize=10, callback) {
                var note   = this.getTable('note')
                var folder = this.getTable('folder')

                switch(typeof(fids)) {
                    case 'object':
                         fids = fids.join(",")
                    default:
                }
                if(pageNum < 1) {
                    pageNum = 1
                }

                var offset = (pageNum - 1) * pageSize

                if(fids == undefined) {
                    var sql = "select t1.id, t1.title, t1.summary, t1.updated, t1.cloud, t1.sort, t1.fid, t2.name as fname from " + note + " t1 left join " + folder + " t2 on t1.fid = t2.id where t1.state = 0 order by t1.sort desc, t1.updated desc limit " + offset + "," + pageSize
                } else {
                    var sql = "select t1.id, t1.title, t1.summary, t1.updated, t1.cloud, t1.sort, t1.fid, t2.name as fname from " + note + " t1 left join " + folder + " t2 on t1.fid = t2.id where t1.fid in ("+ fids +") and t1.state = 0 order by t1.sort desc, t1.updated desc limit " + offset + "," + pageSize
                }

                // console.log(sql)
                db.link.all(sql, function(err, rows) {
                    if (err) {
                        db.alert()
                        return console.error(err.message)
                    }
                    
                    callback(null, rows)
                })
            },

            /* 获取笔记详情 */
            this.noteGet = function(id, callback) {
                if(id < 0) {
                    return false
                }
                var note = this.getTable('note')
                var sql = "select * from " + note + " where id=" + id
                db.link.get(sql, function(err, row){
                    if(err) {
                        db.alert()
                        return callback(err)
                    }

                    if(row == undefined) {
                       db.alert()
                       return console.error(err.message)
                    }

                    callback(null, row)
                })
            }

            /* 
                更新笔记
            */
            this.noteUpdate = function(id, data, callback) {
                if(id < 0 || id == undefined || data.title == null || data.content == null) {
                    console.log('error update start')
                    console.log('id')
                    console.log('data')
                    console.log('error update end')
                    return false
                }

                var note = this.getTable('note')
                var time = Date.parse(new Date())/1000;
                var sql  = "update " + note + " set" 
                        + " content = '" + data.content + "',"
                        + " title = '"+ data.title + "',"
                        + " summary = '"+ data.summary + "',"
                        + " cloud = "+ data.cloud + "," 
                        + " updated = " + time 
                        + " where id = " + id
                // console.log(sql)
                db.link.run(sql, function(err){
                    if(err) {
                        if(callback != undefined) {
                            callback(err)
                        } else {
                            console.error(err.message)
                        }
                    }
                    if(callback != undefined) {
                        callback(null, data)
                    }
                })
            }

            /*
                添加笔记
                @fid
                @data
                @callback  
            */
            this.noteCreate = function(id, data, callbackFather){
                var created = Date.parse(new Date())/1000;
                var updated = created;

                var folder = this.getTable('folder')
                var note   = this.getTable('note')

                var asyncOps = [
                    function (callback) {
                        var sql = "select * from " + folder + " where id=" + id
                        db.link.get(sql, function(e, row){
                            if(row == undefined) {
                               db.alert()
                               return console.error(err.message)
                            }
                            data.fid   = id
                            data.fname = row.name
                            callback(null, row)
                        })
                    },
                    function(folder, callback){
                        var sql = "select count(*) as count from " + note + " where title like '" + data.title + "%'"
                        db.link.get(sql, function(e, row) {
                            if (row.count > 0){
                                data.title = data.title + "(" + row.count + ")"
                            }
                            callback(null, data.title)
                        })
                    },
                    function(title, callback) {
                        const uuidv1 = require('uuid/v1')
                        var uuid = uuidv1()
                        var sql = "insert into " + note + " (uuid,fid,type,cloud,title,thumbnail,summary,content,created,updated,synced) values ("
                                + "'" + uuid + "',"
                                + id + ","
                                + data.type + ","
                                + data.cloud + ","
                                + "'" + title + "',"
                                + "'',"
                                + "'',"
                                + "'" + data.content + "',"
                                + "'" + created + "',"
                                + "'" + updated + "'," 
                                + "0"
                                + ")"

                        db.link.run(sql, function(err){
                            if(err) {
                                return callback(err)
                            }

                            if(this.changes != 1) {
                                return callback(1)
                            }

                            data.id      = this.lastID
                            data.title   = title
                            data.created = created
                            data.updated = updated

                            callback(null);
                        })
                }]
                Vue.prototype.$async.waterfall(asyncOps, function (err, results) {
                    if (err) {
                        db.alert()
                        return console.error(err.message)
                    }
                    callbackFather(null, data)
                })
            },
            

            //todo  修改一下名字noteUpdateTitle,要修改updated更新时间
            this.modifyNoteTitle = function(id, newTitle){
                var sql = "update note set title = '" + newTitle + "' where id = " + id;
                db.link.run(sql);
            },

            this.noteDelete = function(id, callback){
                // 删除先加入回收站
                var note = this.getTable('note')

                var sql = "update " + note + " set state = 1 where id = " + id
                db.link.run(sql, function(err){
                    if(err) {
                        console.error(err)
                        callback(1)
                    }

                    callback(null)
                })
            },

            this.noteStick = function(id, callback) {
                var note = this.getTable('note')

                var sql = "update " + note + " set sort = 1 where id = " + id
                db.link.run(sql, function(err){
                    if(err) {
                        console.error(err)
                        callback(1)
                    }

                    callback(null)
                })
            },

            this.getTable = function(table) {
                return table + '_' +  store.state.User.id
            }

            /*
                用户登陆，初始化
            */
            this.initUserDb = function(callback) {
                var table_folder = this.getTable('folder')
                var table_note   = this.getTable('note')
                db.link.serialize(function() {
                    var sql = "CREATE TABLE IF NOT EXISTS " + table_folder + " (\
                                id INTEGER PRIMARY KEY AUTOINCREMENT, \
                                name VARCHAR (20) NOT NULL, \
                                pid INT (11) NOT NULL DEFAULT (0), \
                                sort INT (11) NOT NULL DEFAULT (0), \
                                state INT (11) NOT NULL DEFAULT (0), \
                                created INT (11) NOT NULL DEFAULT (0), \
                                updated INT (11) NOT NULL DEFAULT (0))"
                    // console.log(sql)
                    db.link.run(sql)

                    var sql = "CREATE TABLE IF NOT EXISTS `" + table_note + "` ( \
                            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
                            uuid STRING (36) NOT NULL, \
                            nid INT (11) NOT NULL DEFAULT (0), \
                            fid INT (11) NOT NULL, \
                            type INT (1) NOT NULL DEFAULT (0), \
                            cloud INT (1) NOT NULL DEFAULT (1), \
                            title VARCHAR (200) NOT NULL, \
                            thumbnail VARCHAR (100), \
                            summary VARCHAR (100) NOT NULL, \
                            content TEXT NOT NULL, \
                            state INT (1) NOT NULL DEFAULT (0), \
                            version INT (11) DEFAULT (0) NOT NULL, \
                            sort INT (11) DEFAULT (0) NOT NULL, \
                            created INT (11) NOT NULL, \
                            updated INT (11) NOT NULL, \
                            synced INT (11) NOT NULL DEFAULT (0))"
                    // console.log(sql)
                    db.link.run(sql)

                    var sql = "INSERT OR REPLACE INTO " + table_folder + " (id, name, pid, created, updated) VALUES (1, '我的文件夹', 0, 0, 0)"
                    // console.log(sql)
                    db.link.run(sql)    
                })
                if(callback != undefined) {
                    callback(null)
                }
            }
        }
    }
}
