<template>
    <div id="note" class="fl" :style="{ height: height - 52 +'px', width: width - 442 +'px'}">
        <div class="note-top">
            <input class="title" :style="{ width: width - 442 +'px' }" type="text" value="无标题笔记" autofocus="autofocus" />
            <!-- <div class="storage">存储：<input type="radio">本地 <input type="radio">网络</div> -->
            <div class="meta">
                <input type="checkbox" id="note-cloud" name="note-cloud" value="1"><label for="note-cloud">云端</label>
                 <!-- <b-form-checkbox value="cloud">云端</b-form-checkbox> -->
            </div>
        </div>
       
        <div class="editor-panel" :style="{ height: height - 110 +'px', width: '100%' }">
            <script id="editor_html" type="text/plain" :style="{ height: height - 176 +'px', width: '100%' }"></script>
        </div>
    </div>    
</template>
<script>
    import '@/assets/ueditor/ueditor.config';
    import '@/assets/ueditor/ueditor.all';
    import '@/assets/ueditor/lang/zh-cn/zh-cn';

    export default{
        components: {
        },
        data: function(){
            return {
                defaultMsg: "",  
                config: {
                   toolbars: [
                        [ 'source', '|', 'removeformat', '|', 'undo', 'redo', '|', 'paragraph', 'fontfamily', '|', 'bold', 'italic', 'underline', 'strikethrough','|', 'forecolor', 'backcolor'],
                        ['inserttable', 'superscript', 'subscript', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
                    ],
                    enableAutoSave: false
                },
                editor:{}
            }
        },
        mounted() {
            this.editor = UE.getEditor("editor_html", this.config);
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

#note {
}

#note .note-top {
    height: 56px;
    border-bottom: 1px solid #ddd;
    position: relative;
}

#note .note-top .title {
    display: block;
    height: 55px;
    line-height: 55px;
    border: none;
    font-size: 16px;
    text-indent: 10px;
}

#note .note-top .meta {
    position: absolute;
    right: 0;
    top: 0;
    height: 55px;
    line-height: 55px;
    padding: 0 10px 0 0;
    font-size: 12px;
}

#note .note-top .meta input {
    display: block;
    float: left;
    margin: 22px 0 0 0;
}
#note .note-top .meta label {
    display: inline-block;
}

#note .editor-panel {
    line-height: 1;
    overflow: hidden;
}

.edui-default {
    box-sizing: content-box;
}

#note .edui-default .edui-editor {
    border: none;
    -webkit-border-radius:0;
    border-radius:0;
}

#note .edui-default .edui-toolbar {
    padding: 0;
}

#note .edui-default .edui-editor-toolbarbox {
    box-shadow:none;
    -webkit-box-shadow:none;
    border-bottom:1px solid #ddd;
    zoom:0;

}

#note .edui-default .edui-editor-toolbarboxouter {
    background-color:#fff;
    background-image:none;
    border: none;
    border-radius: 0;
    box-shadow:none;
}

#note .edui-default .edui-editor-toolbarboxinner {
    padding: 0;
}

</style>