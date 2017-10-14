<template>
    <div id="note" class="fl" :style="{ height: height - 52 +'px', width: width - 442 +'px'}">
        <div class="note-top">
            <input class="title" :style="{ width: width - 442 +'px' }" type="text" value="无标题笔记" />
            <div class="meta">
                <input type="checkbox" id="note-cloud" name="note-cloud" value="1"><label for="note-cloud">云端</label>
            </div>
        </div>
        <!-- <img src="~@/assets/logo.png" alt=""> -->
        <!-- <div> -->
            <div v-show="show_preview" class="preview" v-on:click="edit" :style="{ height: height - 108 +'px', width: '100%' }" v-html="content">
            </div>
            <Ueditor v-show="show_editor" class="editor-panel" :height="height" @ready="editorReady" :style="{ height: height - 108 +'px', width: '100%' }"></Ueditor>
        <!-- </div> -->
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
            show_preview : true,
            show_editor  : false,
            note         : null, // 当前激活的笔记
            content      : '',
        }
    },
    mounted() {
        this.$bus.$on('note:editor:preview', this.preview)
        this.$bus.$on('note:editor:active', this.active)

        $( document ).on( 'click', "#edui_fixedlayer, #note", function(e){
            this.show_preview = false
            this.show_editor  = true

            e.stopPropagation();
        })
    },
    methods : {
        preview(note) {
            this.note = note
            this.show_preview = true
            this.show_editor  = false
            // this.content = note.content

            console.log(note)

            //todo update note

        },
        active(content) {
            this.show_preview = false
            this.show_editor  = true
            this.content = content
            this.$bus.$emit('note:editor:focus', content)
        },
        edit() {
            this.show_preview = false
            this.show_editor  = true
        },
        dialog () {
            const {dialog} = require('electron').remote
            dialog.showOpenDialog({properties: ['openFile', 'multiSelections']})
        },
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
    overflow: hidden;
    /*border-right:1px solid #a0a0a0;*/
}

#note .note-top {
    height: 55px;
    border-bottom: 1px solid #ddd;
    position: relative;
}

#note .note-top .title {
    display: block;
    height: 54px;
    line-height: 54px;
    border: none;
    font-size: 16px;
    text-indent: 10px;
}

#note .note-top .meta {
    position: absolute;
    right: 0;
    top: 0;
    height: 54px;
    line-height: 54px;
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
#note .preview {
    padding: 10px;
    overflow: hidden;
    font-size: 16px;
}

#note .preview table { 
    border-collapse: collapse; 
    border: none; 
} 
#note .preview td, #note .preview th { 
    padding: 5px 10px;
    border: 1px solid #DDD;
    box-sizing: content-box;
} 

#note .preview p {
    margin: 5px 0;
}

#note .preview ol, #note .preview ul {
    padding-left: 30px;
    /*list-style-type: initial;*/
}

</style>