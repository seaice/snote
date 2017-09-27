<template>
    <div id="note" class="fl" :style="{ height: height - 52 +'px', width: width - 442 +'px', minWidth: '358px'}">
        <div id="note-top">
            <div id="title">标题</div>
            <div id="storage">存储：<input type="radio">本地 <input type="radio">网络</div>
        </div>
       
        <div :style="{ height: height - 110 +'px', width: '100%' }">
            <script id="editor" type="text/plain" :style="{ height: height - 176 +'px', width: '100%' }"></script>
            <!-- <ueditor v-bind:value= "defaultMsg" v-bind:config= "config" v-on:input="getInput" v-on:ready="getReady" ></ueditor> -->
        </div>
    </div>    
</template>
<script>
    // import ueditor from './ueditor.vue'
    import '@/assets/ueditor/ueditor.config';
    import '@/assets/ueditor/ueditor.all';
    import '@/assets/ueditor/lang/zh-cn/zh-cn';


    export default{
        components: {
            // ueditor
        },
        data: function(){
            // var me = this;
            return {
                defaultMsg: "",  
                config: {
                  // initialFrameWidth: '100%',
                  // minFrameHeight: 320
                  // autoHeightEnabled: true,
                   toolbars: [
                        [ 'source', 'undo', 'redo'],
                        ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
                    ]
                },
                editor:{}
            }
        },
        mounted() {
            this.editor = UE.getEditor("editor", this.config);
        },
        computed: {
            height: function(){
                return this.$store.state.Window.height;
            },
            width: function(){
                return this.$store.state.Window.width;
            }
        }
    }
</script>
<style>

#note-top {
    height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #ddd;
}
#title {
    height: 30px;
    line-height: 30px;
}

#storage {
    height: 27px;
    line-height: 27px;
}

</style>