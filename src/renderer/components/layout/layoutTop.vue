<template>
    <div id="layoutTop">
        <div class="nickname fl">{{ nickname }}</div>

        <div class="fr">
            <controls></controls>
            <!-- <a href="#" v-on:click="min">隐藏</a> -->
            <!-- <a href="#" id="max-btn">最大</a> -->
            <a href="#" onclick="window.top.close(); return false">关闭</a>
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
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    background: blue;
}
#layoutTop a{
    color:#fff;
}
</style>
