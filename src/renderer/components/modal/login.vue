<template>
    <div class="modal" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <a href="#" class="fr btn-modal-close" style="-webkit-app-region: no-drag" data-dismiss="modal" aria-label="Close"><i class="fa fa-close" aria-hidden="true"></i></a>
                    <h4 class="modal-title" id="myModalLabel">登陆</h4>
                </div>
                <div class="modal-body">
                
                    <form class="form-horizontal" data-toggle="validator">
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-2 control-label">邮箱</label>
                            <div class="col-sm-10">
                                <!-- <input type="email" class="form-control" id="inputEmail3" placeholder="Email" data-error="请输入邮箱" required> -->
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputPassword3" class="col-sm-2 control-label">密码</label>
                            <div class="col-sm-10">
                                <!-- <input type="password" class="form-control" id="inputPassword3" placeholder="Password" data-error="请输入密码" required data-minlength="6" data-minlength-error="密码不能少于6位"> -->
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-2 col-sm-10">
                                <button type="submit" v-on:click="login" class="btn btn-success">登陆</button>
                                <button type="reset" class="btn btn-default">重置</button>
                                &nbsp;&nbsp;&nbsp;没有账号，<a href="#" style="color:red;">点击注册</a>！
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

export default {
    data() {
        return {
          
        }
    },
    methods: {
        login() {
            const remote = require('electron').remote
            const path = require('path');

            var id   = 1
            var name = 'haibing'
            var pathData = path.join(remote.app.getPath('userData'), name)

            const fs = require('fs-extra')

            //创建个人文件夹
            fs.ensureDirSync(pathData)

            this.$store.commit('user_login', {
                id : 1,
                name : 'haibing',
                pathData : pathData,
            })
        }
    }
};
</script>

<style>


</style>
