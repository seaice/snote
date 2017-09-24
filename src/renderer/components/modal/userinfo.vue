<template>
    <b-modal id="userinfo" ref="userinfo" 
        :no-fade="true" 
        :no-close-on-backdrop="true"
        :hide-footer="true"
    >
        <div slot="modal-header">
            <span>个人信息</span>
            <a href="#" v-on:click="$refs.userinfo.hide(false)" class="fr btn-modal-close"  style="-webkit-app-region: no-drag"><i class="fa fa-close" aria-hidden="true"></i></a>
        </div>
        <p clas="my-4">
            Hello from modal!
        </p>
    </b-modal>
</template>
<script type="text/javascript">
// export default {
//     data () {
//         return {
            
//         }
//     },
//     components: { 
//     },
//     methods: {
//     },
// }
</script>
<style>


</style>
