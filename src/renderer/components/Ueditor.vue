<template>
    <div id="note-editor">
        <script :id="randomId" type="text/plain" style="width:100%;" :style="{ height: height - 157 + 'px' }"></script>
    </div>
</template>
<script>
const remote = require('electron').remote

import '../../../static/ueditor/ueditor.config.js'
import '../../../static/ueditor/ueditor.all.min.js'
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
    },
    beforeDestroy () {
        // 组件销毁的时候，要销毁 UEditor 实例
        if (this.instance !== null && this.instance.destroy) {
            this.instance.destroy();
        }
    },
    methods: {
        directorySelectorCallback (filenames) {
            var fs = require('fs');
            console.log(filenames)
            var content = ''

            console.log(remote.app.getPath('userData'))

            for(var i = 0; i < filenames.length; i++) {
                content += '<img src="snote:' + filenames[i] + '"/>'
            }
            this.instance.setContent(content,true)

        },
        initEditor () {
            var _this = this
            
            //dom元素已经挂载上去了
            this.$nextTick(() => {
                this.instance = UE.getEditor(this.randomId, this.ueditorConfig)
                // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
                this.instance.addListener('ready', () => {
                    this.$emit('ready', this.instance)
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