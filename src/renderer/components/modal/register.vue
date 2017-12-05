<template>
    <div class="modal" id="modal_register" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <!-- <a href="#" class="fr btn-modal-close" style="-webkit-app-region: no-drag" data-dismiss="modal" aria-label="Close"><i class="fa fa-close" aria-hidden="true"></i></a> -->
                    <h4 class="modal-title">注册</h4>
                </div>
                <div class="modal-body modal-body-form">
                    <form class="form-horizontal" data-toggle="validator" id="form_register">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">邮箱</label>
                            <div class="col-sm-8">
                                <input type="email" name="email" class="form-control" placeholder="邮箱" data-error="请输入邮箱" v-model="user.email" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">昵称</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" placeholder="昵称" data-error="请输入昵称" v-model="user.nick" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
<!--                         <div class="form-group">
                            <label class="col-sm-3 control-label">验证码</label>
                            <div class="col-sm-8">
                                <div class="input-group">
                                    <input type="text" data-error="请输入验证码" class="form-control" placeholder="验证码" v-model="user.email" required>
                                    <span class="input-group-btn">
                                        <button class="btn btn-default" type="button">发送验证码</button>
                                    </span>
                                </div>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div> -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">密码</label>
                            <div class="col-sm-8">
                                <input id="inputPassword" type="password" class="form-control" placeholder="密码" data-error="请输入密码" v-model="user.password" required data-minlength="6" data-minlength-error="密码不能少于6位">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">确认密码</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" placeholder="确认密码" data-match="#inputPassword" data-error="请输入密码" data-match-error="两次输入密码不一致" v-model="user.re_password" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-3 col-sm-8">
                                <button type="button" v-on:click="register" class="btn btn-success">注册</button>
                                <button type="reset" class="btn btn-default">重置</button>
                                &nbsp;&nbsp;&nbsp;已有账号，<a href="#" v-on:click="login" style="color:red;">去登陆</a>！
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

const qs     = require('qs');

export default {
    data() {
        return {
            user : {
                email : 'test@baidu.com',
                nick : 'test',
                password : '111111',
                re_password : '111111'
            }
        }
    },
    methods: {
        register() {
            this.$http.post('http://127.0.0.1:7000/snote/public/index.php?r=user/register', qs.stringify({
            // this.$http.post('http://127.0.0.20/snote/public/index.php?r=user/login', qs.stringify({
                email       : this.user.email,
                nick       : this.user.nick,
                password    : this.user.password
            }))
            .then(function (response) {
                // 注册成功
                if(response.data.errno == 0) { 
                    

                } else {
                    console.log(response.data)
                    var msg = '系统错误，请重试';
                    if(typeof(response.data.msg) == 'string') {
                        msg = response.data.msg;
                    }
                  
                    $("#form_register input[name=email]").parents('.form-group').addClass('has-error has-danger')
                    $("#form_register input[name=email]").siblings('.help-block').html('<ul class="list-unstyled"><li>'+msg+'</li></ul>');
                    return false
                }

            })
            .catch(function (error) {
                console.log(error)
            });

            return false
        },
        login() {
            $('#modal_register').modal('hide')
            $('#modal_login').modal('show')
        }
    }
};
</script>

<style>

</style>
