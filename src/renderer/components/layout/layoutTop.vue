<template>
    <div id="layoutTop" style="-webkit-app-region: drag">
        <div class="userinfo fl" style="-webkit-app-region: no-drag">
            <div class="fl s-modal">
                <a class="s-figure clear" v-b-modal.userinfo><img src="~@/assets/img/default-figure.png"></a>
                <modelUserinfo></modelUserinfo>
            </div>
            <a class="fl">{{ name }}</a>
            <!-- <div class="dropdown fl"> -->
                <b-dropdown class="s-dropdown fl">
                    <span slot="text">haibing1458<i class="fa fa-angle-down" aria-hidden="true"></i></span>
                    <a class="dropdown-item" href="#">个人信息</a>
                    <a class="dropdown-item" href="#">我的账号 action</a>
                    <b-dropdown-divider></b-dropdown-divider>
                    <a class="dropdown-item" href="#">注销当前账号</a>
                </b-dropdown>
                <b-dropdown class="fl">
                    <span slot="text"><i class="fa fa-plus" aria-hidden="true"></i>Split Dropdown Button</span>
                    <a class="dropdown-item" href="#">个人信息</a>
                    <a class="dropdown-item" href="#">我的账号 action</a>
                    <a class="dropdown-item" href="#">注销当前账号</a>
                </b-dropdown>
            <!-- </div> -->
        </div>

        <div class="fr">
            <controls></controls>
            <!-- <a href="#" v-on:click="min">隐藏</a> -->
            <!-- <a href="#" id="max-btn">最大</a> -->
            <!-- <a href="#" onclick="window.top.close(); return false">关闭</a> -->
        </div>
    </div>
</template>
<script>
import Controls from '../Window/Controls'
import modelUserinfo from '../modal/userinfo'

export default {
    data () {
        return {
            figure: this.$store.state.User.figure,
            name: this.$store.state.User.name,
        }
    },
    components: {
        Controls,
        modelUserinfo,
    },
    methods: {

    }
}
</script>

<style>

#layoutTop {
    height: 50px;
    line-height: 50px;
    background: #398dee;
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
    margin: 5px;
    width: 40px;
    height: 40px;
    display: block;
}
</style>
