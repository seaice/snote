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
                // console.log(sql)
                db.link.run(sql)
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

            this.addFolder = function(node, newNode, callbackFather) {
                if(!node.id) {
                    return false
                }

                var created = Date.parse(new Date())/1000
                var updated = created

                var asyncOps = [
                    function (callback) {
                        var sql = "select * from folder where id="+node.id
                        // console.log(sql)
                        db.link.all(sql, function(e, rows){
                            if(rows.length < 1) {
                                callback(1)
                            }
                            callback(null, node.id)
                        })
                    },
                    function(callback) {
                        var sql = "insert into folder (name,uid,pid,created,updated) values ("
                                + "'" + newNode.name + "',"
                                + "'" + store.state.User.id + "',"
                                + "'" + node.id + "'," 
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

                        callbackFather(1)
                    }
                    callbackFather(null, results[1])
                })
            }

            /* 关闭数据库连接 */
            this.close =function() {
                this.link.close()
                console.log('sqlite close')
            },
            
            this.getNoteList = function(fid, uid){
                // var sql = "  select '' as id, '' as title, '' as content,'' as summary, updated, name, '1' as type from folder where pid = " + fid
                //         + " union select n.id,n.title,n.content,n.summary,n.updated, f.name,'0' as type from note n,folder f where n.state = 0 and f.id = n.fid and n.uid = " + store.state.User.id + " and n.fid = " + fid;
                var sql = "select f.name,n.* from folder f ,note n where f.id = n.fid and n.fid in ("+ fid +") and n.state = 0 and n.uid=" + store.state.User.id
                console.log("getNoteList: ", sql);
                db.link.all(sql, function(err, rows){
                    if (err) {
                        db.alert()
                        return console.error(err.message)
                    }
                    if(rows.length < 0) { // 没找到节点
                        db.alert()
                        return console.error(err.message)                        
                    }
                    Vue.prototype.$bus.$emit('note:list:init', rows);
                })
            },

            this.addNote = function(node, newnode, callbackFather){
                var created = Date.parse(new Date())/1000;
                var updated = created;
                var asyncOps = [
                    function (callback) {
                        var sql = "select * from folder where id=" + node.id
                        db.link.all(sql, function(e, rows){
                            if(rows.length < 1) {
                               db.alert()
                               return console.error(err.message)
                            }
                            callback(null, node.id)
                        })
                    },
                    function(id, callback){
                        var sql = "select * from note where fid = "+ node.id + " and uid = " + store.state.User.id 
                                + " and title like '" + newnode.title + "%' and state = 0";
                        
                        db.link.all(sql,function(e,rows){
                            if (rows.length >= 1){
                                newnode.title = newnode.title + "(" + rows.length + ")";
                            }
                             callback(null, newnode.title);
                        })
                    },
                    function(title, callback) {
                        const uuidv1 = require('uuid/v1');
                        var uuid = uuidv1(); 
                        var sql = "insert into note (uuid,fid,uid,nid,type,cloud,title,thumbnail,summary,content,state,version,created,updated,synced) values ("
                                + "'" + uuid + "',"
                                + "'" + node.id + "',"
                                + "'" + store.state.User.id + "',"
                                + "0,"
                                + "'" + newnode.type + "',"
                                + "1,"
                                + "'" + title + "',"
                                + "'',"
                                + "'',"
                                + "'',"
                                + "'" + newnode.state + "',"
                                + "0,"
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
                            callback(null, this.lastID);
                        })
                }]
                Vue.prototype.$async.waterfall(asyncOps, function (err, results) {
                    if (err) {
                        console.log(err);
                        callbackFather(1)
                    }
                    callbackFather(null, results[1], created)
                })
            },
            this.modifyNoteTitle = function(id, newTitle){
                var sql = "update note set title = '" + newTitle + "' where id = " + id;
                db.link.run(sql);
            },
            this.deleteNote = function(id){
                // 删除先加入回收站
                var sql = "update note  set state = 1 where id = " + id;
                console.log("delete note : ", sql);
                db.link.run(sql);
            },
            this.findRootFolderByUid = function(callback){
                var sql = "select * from folder where uid = " + store.state.User.id + " and pid = 0";
                console.log("findRootFolderByUid sql: ", sql)
                db.link.all(sql, function(err, rows){
                    if (err) {
                        db.alert()
                        return console.error(err.message)
                    }
                    if(rows.length < 0) { // 没找到节点
                        db.alert()
                        return console.error(err.message)                        
                    }
                    console.log("findRootFolderByUid: ", rows);
                    callback(null , rows[0]);
                })
            }
        }
    }
}
