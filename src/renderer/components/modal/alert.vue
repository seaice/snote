<template>
    <div class="s-modal">
        <b-modal id="alert" ref="alert" 
            :no-fade="true" 
            :no-close-on-backdrop="true"
            :hide-footer="true"
        >
            <div slot="modal-header">
                <span>系统错误</span>
                <a href="#" v-on:click="$refs.alert.hide(false)" class="fr btn-modal-close"  style="-webkit-app-region: no-drag"><i class="fa fa-close" aria-hidden="true"></i></a>
            </div>
            <p clas="my-4">
                {{ msg }}
            </p>
        </b-modal>
    </div>
</template>
<script>
export default {
    data() {
        return {
            msg : '网络连接超时，请重试！'
        }
    },
    mounted: function () {
        this.$bus.$on('alert', this.alert)
    },
    methods: {
        alert (msg) {
            if(msg != null && msg != '') {
                this.msg = msg
            }
            this.$refs.alert.show()
        }
    }
}
</script>
<style>

</style>
