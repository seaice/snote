<template>
    <div class="modal" id="modal_forget" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <a href="#" class="fr btn-modal-close" style="-webkit-app-region: no-drag" data-dismiss="modal" aria-label="Close"><i class="fa fa-close" aria-hidden="true"></i></a>
                    <h4 class="modal-title">重置密码</h4>
                </div>
                <div class="modal-body modal-body-form">
                    <form class="form-horizontal" data-toggle="validator">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">邮箱</label>
                            <div class="col-sm-8">
                                <input type="email" class="form-control" placeholder="Email" data-error="请输入邮箱" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">验证码</label>
                            <div class="col-sm-8">
                                <div class="input-group">
                                    <input type="text" data-error="请输入验证码" class="form-control" placeholder="验证码" required>
                                    <span class="input-group-btn">
                                        <button class="btn btn-default" type="button">发送验证码</button>
                                    </span>
                                </div>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">新密码</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" placeholder="新密码" data-error="请输入密码" required data-minlength="6" data-minlength-error="密码不能少于6位">
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">确认密码</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" placeholder="确认密码" data-match="#inputPassword" data-error="请输入密码" data-match-error="两次输入密码不一致" required>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-3 col-sm-8">
                                <button type="submit" v-on:click="forget" class="btn btn-success">修改</button>
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

export default {
    data() {
        return {
            
        }
    },
    methods: {
        forget() {
            
        },
        login() {
            $('#modal_forget').modal('hide')
            $('#modal_login').modal('show')
        }
    }
};
</script>

<style>


</style>
