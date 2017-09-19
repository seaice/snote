<template>
    <div id="layoutTop" style="-webkit-app-region: drag">
        <div class="nickname fl">{{ nickname }}</div>

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

export default {

    data () {
        return {
            nickname: 'haibing1458',
            path: '/',
            vue: require('vue/package.json').version
        }
    },
    components: {
      Controls
    },
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
}
</style>
