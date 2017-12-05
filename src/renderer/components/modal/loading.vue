<template>
    <div class="modal" id="loading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">{{ title }}</h4>
                </div>
                <div class="modal-body s-alert" v-bind:class="[state]" v-html="msg">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const remote = require('electron').remote
const path   = require('path');
const fs     = require('fs-extra')
const Store  = require('electron-store');

export default {
    /*
        doc：
        Vue.prototype.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'})
        or
        this.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'})

        msg     非必须     显示内容
        close   非必须     是否显示关闭按钮
        state   非必须     显示文本样式
    */ 

    data() {
        return {
            title : '加载中...',
            msg : '加载中...',
            state : 's-alert-primary',
        }
    },
    mounted: function () {
        this.$bus.$on('loading', this.loading)
    },
    methods: {
        loading (data) {
            console.log(data)
            $('#loading').modal()

            this.title = data.title
            this.title = '等待初始化.'


            if(data.function == 'initUser') {
                // this.initUser(data.data)
            }

            // if(data.msg != null && data.msg != '') {
            //     this.msg = data.msg
            // }
            // if(data.close === false) {
            //     this.close = data.close
            // }
            // if(data.state != null && data.state != '') {
            //     this.state = 's-alert-' + data.state
            // }

        },
        initUser(data) {
            var _this = this

            var id       = data.uid
            var email    = data.email
            var nick     = data.nick
            var token    = data.token
            var pathData = path.join(remote.app.getPath('userData'), id.toString())

            var asyncOps = [
                function(callback) {
                    // 创建个人文件夹
                    fs.ensureDirSync(pathData)
                    _this.title = '初始化文件夹'
                    callback(null)
                },
                function(callback) {
                    // 设置global
                    // _this.title = '初始化信息'

                    // _this.$store.commit('user_login', {
                    //     id : id,
                    //     nick : nick,
                    //     email : email,
                    //     token : token,
                    //     pathData : pathData,
                    // })

                    callback(null)
                },
                function(callback) {
                    // 初始化数据库
                    _this.title = '初始化数据库'
                    _this.$db.initUserDb(callback)
                },
                function(callback) {
                    // 存储个人信息到本地
                    _this.title = '初始化数据'

                    const store = new Store()
                    store.set('id', id)
                    store.set('email', email)
                    store.set('nick', nick)
                    store.set('token', token)

                    callback(null)
                },
                function(callback) {
                    _this.$bus.$emit('user:login:success')
                    callback(null)
                }
            ]
            this.$async.series(asyncOps, function (err, results) {
                if (err) {
                    _this.$db.alert()
                    return false
                }
                console.log("login success")
                $('#loading').modal('hide')
                return true
            });
        }
    }
}
</script>
<style>
#alert .s-alert {
    font-size: 12px;
    margin: 0;
}
#alert .s-alert-primary {
    color: #000;
}

#alert .s-alert-danger {
    color: #721c24;
}
</style>
