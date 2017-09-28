<template>
    <div id="note" class="fl" :style="{ height: height - 52 +'px', width: width - 442 +'px'}">
        <div class="note-top">
            <input class="title" :style="{ width: width - 442 +'px' }" type="text" value="无标题笔记" />
            <div class="meta">
                <input type="checkbox" id="note-cloud" name="note-cloud" value="1"><label for="note-cloud">云端</label>
            </div>
        </div>
       
        <Ueditor class="editor-panel" :height="height-108" @ready="editorReady" :style="{ height: height - 108 +'px', width: '100%' }"></Ueditor>
    </div>    
</template>
<script>
import Ueditor from '../Ueditor'
    export default{
        components: {
            Ueditor,
        },
        data: function(){
            return {

            }
        },
        mounted() {

        },
        methods : {
            editorReady (instance) {
                instance.setContent('');

                instance.addListener('contentChange', () => {
                  this.content = instance.getContent();
                });
            },
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

.edui-toolbar {
    min-width: 690px;
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