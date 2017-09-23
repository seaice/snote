<template>
    <div id="userinfo" class="modal">
        <modal name="userinfo" :draggable=true :clickToClose=false>
            <div class="title-bar">
                <div class="title fl">个人信息</div>

                <div class="fr">
                    <a href="#" v-on:click="$modal.hide('userinfo')" ><i class="fa fa-close" aria-hidden="true"></i></a>
                </div>
            </div>

            hello, world!
            123123
        </modal>
    </div>
</template>
<script type="text/javascript">
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
<style type="text/css">
#config #title-bar {
    line-height: 30px;
    height: 30px;
    background: #398dee;
}
#config #title-bar .title {
    color:#fff;
    font-size: 12px;
    text-indent: 10px;
}
#config #title-bar .fr {
    margin: 0 10px 0 0;
}

#config #title-bar .fa-close {
    color:#fff;
    font-size: 12px;
    margin:-2px 0 0 0;
}

</style>
