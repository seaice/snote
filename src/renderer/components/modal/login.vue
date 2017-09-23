<template>
    <div id="login" class="modal">
        <modal name="login" :draggable=true :clickToClose=false>
            <div class="title-bar">
                <div class="title fl">登陆</div>

                <div class="fr">
                    <a href="#" v-on:click="$modal.hide('login')" ><i class="fa fa-close" aria-hidden="true"></i></a>
                </div>
            </div>

            hello, world!
            123123
        </modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            
        }
    },
    components: { 
    },
    methods: {
    },
}
</script>
<style>


</style>
