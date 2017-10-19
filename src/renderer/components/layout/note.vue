<template>
    <div id="note" class="fl" :style="{ height: height - 52 +'px', width: width - 440 +'px'}">
        <div class="no-preview" v-show="no_preview" :style="{ 'line-height': height - 52 +'px' }">
            <div>
                <i class="fa fa-file-text-o" aria-hidden="true"></i><span>无预览</span>
            </div>
        </div>
        <div class="note-top">
            <input class="title" :style="{ width: width - 440 +'px' }" type="text" v-model="note_edit.title">
            <div class="meta">
                <input type="checkbox" id="note-cloud" name="note-cloud" v-model="note_edit.cloud" :true-value="1" :false-value="0"><label for="note-cloud">云端</label>
            </div>
        </div>

        <div v-show="show_preview" class="preview" v-on:click="active" :style="{ height: height - 108 +'px', width: '100%' }" v-html="note_edit.content">
        </div>
        <script :id="randomId" type="text/plain" style="width:100%;" :style="{ height: height - 157 + 'px' }"></script>

        <!-- <Ueditor v-show="show_editor" class="editor-panel" :height="height" @ready="editorReady" :style="{ height: height - 108 +'px', width: '100%' }"></Ueditor> -->
    </div>    
</template>
<script>
const remote = require('electron').remote
const clone = require('clone')

import '../../../../static/ueditor/ueditor.config.js'
import '../../../../static/ueditor/ueditor.all.js'
import '../../../../static/ueditor/lang/zh-cn/zh-cn.js'

import "../../../../static/ueditor/third-party/SyntaxHighlighter/syntaxhighlighter.js"

export default{
    components: {
    },
    data: function(){
        return {
            randomId: 'editor_' + (Math.random() * 100000000000000000),
            instance    : null,  //编辑器实例
            note_empty  : {
                id      : null,
                title   : null,
                content : null,
                cloud   : null,

            }, 
            note         : null,    // 要预览的笔记
            note_db      : null,    // 当前笔记数据库中值
            note_edit    : null,    // 当前笔记编辑器中值

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
        this.initEditor()

        // let syntex = document.createElement('script');
        // syntex.setAttribute('src',"/static/ueditor/third-party/SyntaxHighlighter/shCore.js");
        // document.head.appendChild(syntex);

        this.$bus.$on('note:editor:preview', this.preview)
        this.$bus.$on('note:editor:preview:no', this.previewNo)
        this.$bus.$on('note:editor:active', this.active)
    },
    beforeDestroy () {
        // 组件销毁的时候，要销毁 UEditor 实例
        if (this.instance !== null && this.instance.destroy) {
            this.instance.destroy();
        }
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
        getSummary(content) {
            var div = document.createElement("div");
            div.innerHTML = content;
            var text = div.textContent || div.innerText || "";

            return text.substring(0, 100)
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

                    note_edit.summary = this.getSummary(note_edit.content)

                    this.$db.noteUpdate(note_edit.id, note_edit, callback)
                } else {
                    if(callback != undefined)
                        callback(null, false)
                }
            } else {
                if(callback != undefined)
                    callback(null, false)
            }

        },

        // 预览笔记
        // @param note 笔记列表中的值
        preview(note, active) {
            console.log('preview')

            if(note == undefined) {
                if(this.note_db.id == null) {
                    return
                } else {
                    note = clone(this.note_db)
                }
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
                function(saveNote, callback) {
                    if(saveNote !== false) {
                        _this.$bus.$emit("note:list:update:note", saveNote)
                    }

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
            // this.$bus.$emit('note:editor:focus')
            this.focus()
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
        focus() {
            this.instance.focus()
        },
        directorySelectorCallback (filenames) {
            if(filenames == undefined) {
                return
            }
            const md5File = require('md5-file')
            const fs = require('fs-extra')
            const path   = require('path');
            // var fs = require('fs')

            console.log(filenames)
            var content = ''

            // 从路径中获得文件名
            // var filename = fullPath.replace(/^.*[\\\/]/, '')

            console.log(this.$store.state.User.pathData)

            var file_err = []
            for(var i = 0; i < filenames.length; i++) {
                try {
                    var stat = fs.statSync(filenames[i])

                    /* 最大图片2m */
                    if(stat.size > 2 * 1024 * 1024) {
                        file_err.push({'file':filenames[i],'msg':'图片不能大于2M'})
                        continue
                    }

                    var ext = path.extname(filenames[i])
                    if(ext  == '' || ext  == '.') {
                        continue
                    }

                    var filename = md5File.sync(filenames[i]) + ext
                    var file = path.join(this.$store.state.User.pathData, filename)

                    fs.copySync(filenames[i], file)

                    file = 'snote://img.makeclean.net/' 
                            + this.$store.state.User.id.toString(16).substr(-3)
                            + '/' + this.$store.state.User.id 
                            + '/' + filename


                    content += '<img src="' + file + '"/>'
                } catch (err) {
                    console.error(err)
                }

            }
            console.log(file_err)
            this.instance.execCommand('inserthtml', content);
        },
        initEditor () {
            var _this = this
            
            //dom元素已经挂载上去了
            this.$nextTick(() => {
                this.instance = UE.getEditor(this.randomId, this.ueditorConfig)
                // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
                this.instance.addListener('ready', () => {
                    this.$emit('ready', this.instance)
                    
                    UE.dom.domUtils.on(this.instance.body,"paste",function(e){
                        const clipboard = require('electron').clipboard
    
                        if(!clipboard.readImage().isEmpty()) {
                            const fs     = require('fs-extra')
                            const path   = require('path');
                            const crypto = require('crypto')

                            try {
                                var md5 = crypto.createHash('md5')

                                var buffer = clipboard.readImage().toJPEG(100)
                                var filename = md5.update(buffer).digest('hex') + '.jpg'

                                var filepath = path.join(_this.$store.state.User.pathData, filename)

                                fs.writeFileSync(filepath, buffer)

                                var file = 'snote://img.makeclean.net/' 
                                    + _this.$store.state.User.id.toString(16).substr(-3)
                                    + '/' + _this.$store.state.User.id 
                                    + '/' + filename

                                _this.instance.execCommand('inserthtml', '<img src="' + file + '"/>');
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    })

                    // this.instance.addListener("contentChange", () => {
                    // })

                    // this.instance.addListener('blur', () => {
                    // });
                })

                $(document).on('click', function(){
                    console.log('document click')
                    _this.preview()
                    // _this.$bus.$emit('note:editor:preview');
                }) 

            })

            UE.registerUI('snote_imageupload',function(editor,uiName){
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName,{
                    execCommand:function(){
                        // alert('execCommand:' + uiName)
                    }
                });

                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name:uiName,
                    //提示
                    title:'图片上传',
                    //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules :'background-position: -380px 0;',
                    //点击时执行的命令
                    onclick:function () {
                        btn.setDisabled(true)
                        // let configDir = remote.app.getPath('pictures');
                        // const {dialog} = require('electron').remote
                        remote.dialog.showOpenDialog({
                            properties: ['openFile', 'multiSelections'],
                            title : '选择图片',
                            defaultPath : remote.app.getPath('pictures'),
                        }, _this.directorySelectorCallback)

                        //这里可以不用执行命令,做你自己的操作也可
                       // editor.execCommand(uiName)
                    }
                });

                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName)
                    if (state == -1) {
                        btn.setDisabled(true)
                        btn.setChecked(false)
                    } else {
                        btn.setDisabled(false)
                        btn.setChecked(state)
                    }
                });

                //因为你是添加button,所以需要返回这个button
                return btn
            })
        }
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
    border-right:1px solid #a0a0a0;
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


/* editor */
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

/* v4 */
@import '/static/ueditor/third-party/SyntaxHighlighter/theme.css'

</style>