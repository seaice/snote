export default {
    install : function (Vue, options) {
        Vue.prototype.$db = new function() {
            console.log('init db')
            this.name = 'snote.db'
            this.dbPath = require('path').resolve(__dirname, '../../../data/' + this.name)
            this.sqlite3 = require('sqlite3').verbose()
            this.link = new this.sqlite3.Database(this.dbPath, err => {
                if(err) {
                    return console.error(err.message)
                }
                console.log('sqlite:connect success')
            })

            this.addFolder = function(name, pid='000001') {
                console.log(name)
                if(Vue.prototype.isNull(name)) {
                    name = '无标题笔记'
                }
                console.log(name)
                
                pid = parseInt(pid)
                if(pid < 0) {
                    pid = 0
                }

                // 判断pid是否存在
                console.log(9999)
                // console.log(this.getFolderById(pid))
                console.log(9999)
                // if(this.getFolderById(pid) === false) {
                //     pid = 0
                // }
            }
        }
    }
}
