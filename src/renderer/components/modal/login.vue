<template>
    <div class="modal" id="modal_login" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <!-- <a href="#" class="fr btn-modal-close" style="-webkit-app-region: no-drag" data-dismiss="modal" aria-label="Close"><i class="fa fa-close" aria-hidden="true"></i></a> -->
                    <h4 class="modal-title">登陆</h4>
                </div>
                <div class="modal-body modal-body-form">
                    <form class="form-horizontal" id="form_login">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">邮箱</label>
                            <div class="col-sm-8">
                                <input type="email" name="email" class="form-control" placeholder="Email" data-error="请输入邮箱" v-model="user.email" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">密码</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" placeholder="密码" v-model="user.password">
                                <!-- <input type="password" class="form-control" id="inputPassword3" placeholder="密码" data-error="请输入密码" required data-minlength="6" data-minlength-error="密码不能少于6位"> -->
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-3 col-sm-8">
                                <button type="button" v-on:click="login" class="btn btn-success">登陆</button>
                                <button type="reset" class="btn btn-default">重置</button>
                                &nbsp;&nbsp;&nbsp;<a href="#" v-on:click="register" style="color:red;">注册</a>
                                &nbsp;&nbsp;&nbsp;<a href="#" v-on:click="forget" style="color:red;">忘记密码</a>
                                <!-- <button type="reset" class="btn btn-info">注册</button> -->
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import 'bootstrap-validator/dist/validator.min.js'

const remote = require('electron').remote
const path   = require('path');
const fs     = require('fs-extra')
const Store  = require('electron-store');
const os     = require('os');
const qs     = require('qs');
var address  = require('address');

export default {
    data() {
        return {
            user : {
                email: 'test@baidu.com',
                password: '111111'
            },
        }
    },

    mounted() {
        this.$bus.$on('user:login:modal:active', this.loginModal)
    },

    methods: {
        loginModal(data) {
            $('#modal_login').modal('show')
        },
        login() {
            $('#form_login').validator()

            var _this = this

            this.$http.post('http://127.0.0.1:7000/snote/public/index.php?r=user/login', qs.stringify({
            // this.$http.post('http://127.0.0.20/snote/public/index.php?r=user/login', qs.stringify({
                os_release  : os.release(),
                os_type     : os.type(),
                os_platform : os.platform(),
                ip          : address.ip(),
                email       : this.user.email,
                password    : this.user.password
            }))
            .then(function (response) {
                // 登陆成功
                if(response.data.errno == 0) { 

                    $('#modal_login').modal('hide')
                    _this.$bus.$emit('loading', {title:'登陆成功，等待初始化...', data:response.data.data, function:'initUser'})

                    return 
                /*
                    var id       = response.data.data.id
                    var email     = response.data.data.email
                    var nick     = response.data.data.nick
                    var token    = response.data.data.token
                    var pathData = path.join(remote.app.getPath('userData'), id.toString())

                    var asyncOps = [
                        function(callback) {
                            // 创建个人文件夹
                            fs.ensureDirSync(pathData)
                            callback(null)
                        },
                        function(callback) {
                            // 设置global
                            _this.$store.commit('user_login', {
                                id : id,
                                nick : nick,
                                email : email,
                                token : token,
                                pathData : pathData,
                            })

                            callback(null)
                        },
                        function(callback) {
                            // 初始化数据库
                            _this.$db.initUserDb(callback)
                        },
                        function(callback) {
                            // 存储个人信息到本地
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
                        $('#modal_login').modal('hide')
                        return true
                    });
                    */
                } else {
                    var msg = '系统错误，请重试';
                    if(typeof(response.data.msg) == 'string') {
                        msg = response.data.msg;
                    }
                    // console.log(response.data.msg)
                    // console.log(typeof(response.data.msg))

                    // console.log('login error')
                    // 登陆错误
                    $("#form_login input[name=email]").parents('.form-group').addClass('has-error has-danger')
                    $("#form_login input[name=email]").siblings('.help-block').html('<ul class="list-unstyled"><li>'+msg+'</li></ul>');
                    return false
                }

                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            });

            // return false
        },
        register() {
            $('#modal_login').modal('hide')
            $('#modal_register').modal('show')
        },
        forget() {
            $('#modal_login').modal('hide')
            $('#modal_forget').modal('show')
        }
    }
};
</script>

<style>


</style>
