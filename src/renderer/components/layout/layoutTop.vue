<template>
    <div id="layoutTop" style="-webkit-app-region: drag">
        <div class="userinfo fl" style="-webkit-app-region: no-drag">
            <div class="fl">
                <a class="s-figure clear" data-toggle="modal" v-on:click="userinfo"><img src="~@/assets/img/default-figure.png"></a>
            </div>
            <a class="fl" data-toggle="modal" data-target="#modal_login">{{ name }}</a>

            <!-- <b-dropdown class="s-dropdown fl">
                <span slot="text">haibing1458<i class="fa fa-angle-down" aria-hidden="true"></i></span>
                <a class="dropdown-item" href="#">个人信息</a>
                <a class="dropdown-item" href="#">我的账号 action</a>
                <b-dropdown-divider></b-dropdown-divider>
                <a class="dropdown-item" href="#">注销当前账号</a>
            </b-dropdown> -->
        </div>

        <div class="fr">
            <controls></controls>
            <!-- <a href="#" v-on:click="min">隐藏</a> -->
            <!-- <a href="#" id="max-btn">最大</a> -->
            <!-- <a href="#" onclick="window.top.close(); return false">关闭</a> -->
        </div>
        <modalUserinfo></modalUserinfo>
        <modalLogin></modalLogin>
        <modalRegister></modalRegister>
        <modalForget></modalForget>
    </div>
</template>
<script>
import Controls from '../Window/Controls'
import modalUserinfo from '../modal/userinfo'
import modalLogin from '../modal/login'
import modalRegister from '../modal/register'
import modalForget from '../modal/forget'

export default {
    data () {
        return {
            figure: this.$store.state.User.figure,
            name: this.$store.state.User.name,
        }
    },
    components: {
        Controls,
        modalUserinfo,
        modalLogin,
        modalRegister,
        modalForget,
    },
    methods: {
        userinfo() {
            console.log(this.$store.state.User)
            if(this.$store.state.User.login) {
                $('#modal_userinfo').modal('show')
            } else {
                $('#modal_login').modal('show')
            }
        }
    }
}
</script>

<style>

#layoutTop {
    height: 50px;
    background: #398dee;
}

#layoutTop .userinfo {
    line-height: 50px;
}
#layoutTop a{
    color:#fff;
    cursor: pointer;
}

#layoutTop .s-figure {
    width: 50px;
    height: 50px;
}
#layoutTop .s-figure img {
    margin: 10px;
    width: 30px;
    height: 30px;
    display: block;
}
</style>
