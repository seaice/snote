<template>
    <div class="modal" id="modal_login" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <!-- <a href="#" class="fr btn-modal-close" style="-webkit-app-region: no-drag" data-dismiss="modal" aria-label="Close"><i class="fa fa-close" aria-hidden="true"></i></a> -->
                    <h4 class="modal-title">登陆</h4>
                </div>
                <div class="modal-body modal-body-form">
                    <form class="form-horizontal" data-toggle="validator">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">邮箱</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" placeholder="Email" v-model="user.email">
                                <!-- <input type="email" class="form-control" id="inputEmail3" placeholder="Email" data-error="请输入邮箱" required> -->
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
                                <button type="submit" v-on:click="login" class="btn btn-success">登陆</button>
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


export default {
    data() {
        return {
            user : {},
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
            console.log(this.user)
            // return;

            // 登陆成功
            if(this.user.email == this.user.password) { 
                var id       = 1
                var name     = 'haibing'
                var token    = id
                var pathData = path.join(remote.app.getPath('userData'), id.toString())

                // 创建个人文件夹
                fs.ensureDirSync(pathData)

                // 创建根节点
                // this.$db.initFolderRoot(0)

                // 存储个人信息到本地
                const store = new Store()
                store.set('id', id)
                store.set('name', name)
                store.set('token', token)

                // 设置global
                this.$store.commit('user_login', {
                    id : id,
                    name : name,
                    token : token,
                    pathData : pathData,
                })

                $('#modal_login').modal('hide')
            } else {
                // 密码错误

            }
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
