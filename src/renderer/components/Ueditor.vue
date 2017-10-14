<template>
    <div id="note-editor">
        <script :id="randomId" type="text/plain" style="width:100%;" :style="{ height: height - 157 + 'px' }"></script>
    </div>
</template>
<script>
const remote = require('electron').remote

import '../../../static/ueditor/ueditor.config.js'
import '../../../static/ueditor/ueditor.all.js'
import '../../../static/ueditor/lang/zh-cn/zh-cn.js'

export default {
    props: [
        'height'
    ],
    data () {
        return {
            //每个编辑器生成不同的id,以防止冲突
            randomId: 'editor_' + (Math.random() * 100000000000000000),
            //编辑器实例
            instance: null,
            picPath:remote.app.getPath('pictures'),
            filePath:remote.app.getPath('documents'),
        };
    },
    //此时--el挂载到实例上去了,可以初始化对应的编辑器了
    mounted () {
        this.initEditor()
        this.$bus.$on('note:editor:focus', this.focus)
    },
    beforeDestroy () {
        // 组件销毁的时候，要销毁 UEditor 实例
        if (this.instance !== null && this.instance.destroy) {
            this.instance.destroy();
        }
    },
    methods: {
        focus() {
            console.log('focus')
            this.instance.setContent(this.$store.state.Global.note.content)
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
                            + this.$store.state.User.uid.toString(16).substr(-3)
                            + '/' + this.$store.state.User.uid 
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
                                    + _this.$store.state.User.uid.toString(16).substr(-3)
                                    + '/' + _this.$store.state.User.uid 
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
                    _this.$bus.$emit('note:editor:preview');
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
                            defaultPath : _this.picPath,
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
}
</script>
<style>
    
.edui-default {
    box-sizing: content-box;
}

.edui-toolbar {
    min-width: 690px;
}

#note-editor .edui-default .edui-editor {
    border: none;
    -webkit-border-radius:0;
    border-radius:0;
}

#note-editor .edui-default .edui-toolbar {
    padding: 0;
}

#note-editor .edui-default .edui-editor-toolbarbox {
    box-shadow:none;
    -webkit-box-shadow:none;
    border-bottom:1px solid #ddd;
    zoom:0;

}

#note-editor .edui-default .edui-editor-toolbarboxouter {
    background-color:#fff;
    background-image:none;
    border: none;
    border-radius: 0;
    box-shadow:none;
}

#note-editor .edui-default .edui-editor-toolbarboxinner {
    padding: 0;
}

</style>