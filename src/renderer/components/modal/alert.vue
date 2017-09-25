<template>
    <div class="s-modal">
        <b-modal id="alert" ref="alert" 
            :no-fade="true" 
            :no-close-on-backdrop="true"
            :hide-footer="true"
        >
            <div slot="modal-header">
                <span>系统错误</span>
                <a v-if="close" href="#" v-on:click="$refs.alert.hide(false)" class="fr btn-modal-close"  style="-webkit-app-region: no-drag"><i class="fa fa-close" aria-hidden="true"></i></a>
            </div>
            <div class="s-alert" v-bind:class="[state]" v-html="msg"></div>
        </b-modal>
    </div>
</template>
<script>
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
            msg : '网络连接超时，请重试！',
            close : true,
            state : 's-alert-primary',
        }
    },
    mounted: function () {
        this.$bus.$on('alert', this.alert)
    },
    methods: {
        alert (data) {
            if(data.msg != null && data.msg != '') {
                this.msg = data.msg
            }
            if(data.close === false) {
                this.close = data.close
            }
            if(data.state != null && data.state != '') {
                this.state = 's-alert-' + data.state
            }
            this.$refs.alert.show()
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
