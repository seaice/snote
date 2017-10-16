<template>
    <div id="note" class="fl" :style="{ height: height - 52 +'px', width: width - 442 +'px'}">
        <div class="no-preview" v-show="no_preview" :style="{ 'line-height': height - 52 +'px' }">
            <div>
                <i class="fa fa-file-text-o" aria-hidden="true"></i><span>无预览</span>
            </div>
        </div>
        <div class="note-top">
            <input class="title" :style="{ width: width - 442 +'px' }" type="text" v-model="note_edit.title">
            <div class="meta">
                <input type="checkbox" id="note-cloud" name="note-cloud" v-model="note_edit.cloud" :true-value="1" :false-value="0"><label for="note-cloud">云端</label>
            </div>
        </div>

        <!-- <img src="~@/assets/logo.png" alt=""> -->
        <!-- <div> -->
            <div v-show="show_preview" class="preview" v-on:click="active" :style="{ height: height - 108 +'px', width: '100%' }" v-html="note_edit.content">
            </div>
            <Ueditor v-show="show_editor" class="editor-panel" :height="height" @ready="editorReady" :style="{ height: height - 108 +'px', width: '100%' }"></Ueditor>
        <!-- </div> -->
    </div>    
</template>
<script>
import Ueditor from '../Ueditor'

const clone = require('clone')

// v4
import "../../../../static/ueditor/third-party/SyntaxHighlighter/syntaxhighlighter.js"
// console.log(sh)

export default{
    components: {
        Ueditor,
    },
    data: function(){
        return {
            instance    : null, 
            note_empty  : {
                id      : null,
                title   : null,
                content : null,
                cloud   : null,

            }, 
            note_db      : null,    // 当前笔记数据库中值
            note_edit    : null,    // 当前笔记编辑器中值

            title        : null,
            content      : null,   // 从编辑器获得的笔记
            cloud        : 1,   // 从编辑器获得的笔记
            no_preview   : true,
            show_preview : false,
            show_editor  : false,
        }
    },
    created() {
        this.note_db   = clone(this.note_empty)
        this.note_edit = clone(this.note_empty)
    },
    mounted() {
        // let syntex = document.createElement('script');
        // syntex.setAttribute('src',"/static/ueditor/third-party/SyntaxHighlighter/shCore.js");
        // document.head.appendChild(syntex);

        this.$bus.$on('note:editor:preview', this.preview)
        this.$bus.$on('note:editor:preview:no', this.previewNo)
        this.$bus.$on('note:editor:active', this.active)
    },
    methods : {
        previewNo() {
            console.log('preview no')
            this.no_preview = true
            this.show_preview = false
            this.show_editor  = false

            this.note_db   = clone(this.note_empty)
            this.note_edit = clone(this.note_empty)
        },

        // 保存笔记
        save(note_db, note_edit, callback) {
            if(note_db.id != null 
                && note_edit.id != null 
                && note_db.id == note_edit.id) {

                note_edit.content = this.instance.getContent()

                if(note_db.title != note_edit.title
                    || note_db.content != note_edit.content
                    || note_db.cloud != note_edit.cloud
                    ) {
                    console.log('save note db')
                    this.$db.noteUpdate(note_edit.id, note_edit, callback)
                } else {
                    if(callback != undefined)
                        callback(null)
                }
            } else {
                if(callback != undefined)
                    callback(null)
            }

        },

        // 预览笔记
        // @param note 笔记列表中的值
        preview(note, active) {
            console.log('preview')

            if(note == undefined || note.id == undefined) {
                return
            }

            var _this = this
            this.no_preview = false
            this.show_preview = true
            this.show_editor  = false

            var asyncOps = [
                // 保存笔记
                function(callback) {
                    _this.save(_this.note_db, _this.note_edit, callback)
                },
                function(callback) {
                    // console.log('get note ' + note.id)
                    _this.$db.noteGet(note.id, callback)
                },
                function(noteDetail, callback) {
                    _this.note_db   = clone(noteDetail)
                    _this.note_edit = clone(noteDetail)
                    _this.instance.setContent(_this.note_edit.content)

                    _this.$store.commit('setNote', clone(noteDetail))

                    callback(null)
                },
                function(callback) {
                    _this.$nextTick(function () {
                        sh.highlight()
                        if(active) {
                            _this.active()
                        }
                    })

                    callback(null)
                }
            ]
            this.$async.waterfall(asyncOps, function (err, results) {
                if (err) {
                    _this.$db.alert()
                    return false
                }
            })
        },
        active() {
            console.log('active')
            this.show_preview = false
            this.show_editor  = true
            this.$bus.$emit('note:editor:focus')
        },
        dialog () {
            const {dialog} = require('electron').remote
            dialog.showOpenDialog({properties: ['openFile', 'multiSelections']})
        },
        editorReady (instance) {
            this.instance = instance

            // instance.setContent('')

            instance.addListener('contentChange', () => {
                this.note_edit.content = instance.getContent()
            });
        },
    },
    computed: {
        height: function(){
            return this.$store.state.Window.height
        },
        width: function(){
            return this.$store.state.Window.width
        }
    }
}
</script>
<style>
/*@import '/static/ueditor/third-party/SyntaxHighlighter/theme.css'*/
/*@import '/static/ueditor/third-party/SyntaxHighlighter/theme.css'*/

#note {
    overflow: hidden;
    position: relative;
    /*border-right:1px solid #a0a0a0;*/
}

#note .no-preview {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 30px;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 1000;
    text-align: center;
    color: #aaa;
}
#note .no-preview span {
    font-size: 22px;
    margin-left: 10px;
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

/* v4 */
@import '/static/ueditor/third-party/SyntaxHighlighter/theme.css'

</style>