<template>
    <div id="noteList" class="fl" :style="{ height: height - 52 + 'px' }">
        <div class="search-box clear">
            <span  class="levelup-icon"><i class="fa fa-level-up" aria-hidden="true"></i></span>
            <!-- <div id="noteListSearchArea"> -->
            <span  class="search-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
            <input class="search" type="text" name="search" placeholder="搜索..." v-on:click="noteSearch" />
            <!-- </div> -->
            <span  class="list-icon"><i class="fa fa-th-list" aria-hidden="true"></i></span>
        </div>
        <div class="noteListContent" :style="{ height: height - 135 + 'px' }">
            <div v-if="items.length > 0" class="list">
                <ul>
                    <li v-for="(item,index) in items" v-on:contextmenu="getContentMenu(index, $event)" v-on:click="notePreview(index)" :class="{active:index==active_note_index}" v-on:scroll="getMoreNotes">
                        <span class="item-title">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            {{ item.title }}
                        </span>
                        <div class="item-bottom">
                            <span class="item-createtime">{{ getUpdatedTime(item.updated) }}</span>
                            <span class="item-size">云端或本地 {{item.fname}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else="items.length < 0" class="no-note">
                <span>没有内容</span>
                <button class="btn btn-info" @click="">新建笔记</button>
            </div>
        </div>
        <div class="totalCount">总共{{ this.items.length }}项</div>
        <div id="noteContextMenu" style="display:none;">
            <ul class="list-group">
                <li  class="list-group-item">新建
                    <ul class="list-group" id="right_menu">
                        <li  v-on:click="folderCreate" class="list-group-item"><i class="fa fa-folder-o" aria-hidden="true"></i><span>文件夹</span></li>
                        <li v-on:click="noteCreateCloud" class="list-group-item"><i class="fa fa-file-o" aria-hidden="true"></i><span>云笔记</span></li>
                        <li v-on:click="noteCreateLocal" class="list-group-item"><i class="fa fa-file-o" aria-hidden="true"></i><span>本地笔记</span></li>
                        <!-- <li class="list-group-item"><i class="fa fa-file-o" aria-hidden="true"></i>MarkDown笔记</li> -->
                    </ul>
                </li>
                <li class="list-group-item" v-on:click="noteRename">重命名</li>
                <li class="list-group-item" v-on:click="noteDelete">删除</li>
            </ul>
        </div>
        <div id="noteListRenameWindow" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title">重命名</h4>
                </div>
                <div class="modal-body">
                    <label>重命名为:</label>
                    <input type="text" v-bind:value="chooseItem.title" class="form-control"  id="NoteListRename"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"  v-on:click="saveModifyName">保存</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">

export default {
    components:{
    },
    data () {
        return {
            total             : 0,
            items             : [],  //所有笔记集合
            chooseItem        : {}, // 选中的笔记节点
            active_note_index : null, // 选中的笔记
            page              : 1, // 加载笔记的页数
        }
    },
    computed:{
        height () {
            return this.$store.state.Window.height;
        }
    },
    mounted:function(){
        this.$bus.$on("note:list:load",    this.noteListLoad);//笔记列表初始化
        this.$bus.$on("note:create:cloud", this.noteCreateCloud);//云笔记创建
        this.$bus.$on("note:create:local", this.noteCreateLocal);//本地笔记创建



        // this.$bus.$on("note:list:init",this.initNoteList);//笔记列表初始化
        // this.$bus.$on("note:addNote", this.addNote);//添加新增笔记
        // this.$bus.$on('note:getSelectedNode', this.getSelectedNode);//获取选中的树节点id
    },
    methods: {
        /* 加载笔记 */
        noteListLoad : function(fids, pageNum=1, pageSize=100) {
            var _this = this
            this.active_note_index = null

            var asyncOps = [
                // 获取笔记
                function(callback) {
                    _this.$db.notelistGet(fids, pageNum, pageSize, callback)
                },
                // 显示
                function(notelist, callback) {
                    _this.items = notelist
                }
            ]
            
            this.$async.waterfall(asyncOps, function (err, results) {
                if (err) {
                    _this.$db.alert()
                }
            })
        },
        noteCreate(fid, cloud) {
            var _this = this

            var newData = { title: "无标题笔记" , type: 0, state : 0, cloud : cloud }

            var asyncOps = [
                // 新建笔记
                function(callback) {
                    if(fid == undefined) {
                        fid = 1
                    }

                    _this.$db.noteCreate(fid, newData, callback)
                },
                // 渲染
                function(data, callback) {
                    _this.items.unshift(data)
                    _this.notePreview(0)
                    _this.$bus.$emit('note:editor:active');
                }
            ]
            this.$async.waterfall(asyncOps, function (err, results) {
                if (err) {
                    _this.$db.alert()
                    return false
                }
            })
        },
        /* 创建本地笔记 */
        noteCreateLocal: function(fid){
            this.noteCreate(fid, 0)
        },
        /* 创建云笔记 */
        noteCreateCloud: function(fid){
            this.noteCreate(fid, 1)
        },

        getContentSize: function(content){
            if (content != null && content != ''){
                var length = content.length;
                var size = 0;

                if (length >= 0 && length < 1024){
                    return length +"B";
                }else if (length >= 1024 && length < 1048576){
                    size = length / 1024;
                    return size.toFixed(2)+" K";
                }else if (length >= 1048576){
                    size = length / 1048576;
                    return size.toFixed(2)+" M"
                }
            }else {
                return "0B"
            }
        },

        getUpdatedTime: function(time){
            if (time != 0 && time != null){
                var date = new Date(time * 1000);
                var day = date.getDate();
                if (day < 10){
                    day = "0" + day;
                }
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + day;
            }
        },

        /*
        createNote: function(){
            var _this = this

            var newData = { title: "无标题笔记" , type: 0, state:0};
            var selectNode = this.selectedNode;
            console.log("selectNode: ", selectNode);
            $("#noteContextMenu").hide();

            var node = null;
           
            if (selectNode != null && selectNode.id != null) {
                node = selectNode;
                var asyncOps = [

                    function(callback) {
                        _this.$db.addNote(node.id, newData, callback)
                    },

                    function(id, created, callback) {
                        newData.checked = node.checked;
                        newData.id = id
                        newData.pid = node.id
                        newData.created = newData.updated = created;
                        callback(null)
                        _this.$bus.$emit("note:addNote", newData);
                        _this.$bus.$emit('note:editor:active', '');
                    }
                ]
                _this.$async.waterfall(asyncOps, function (err, results) {
                    if (err) {
                        _this.$db.alert()
                        return false
                    }
                });
            } else {

                var ops = [

                    function (callback){
                        _this.$db.findRootFolderByUid(callback);
                    },

                    function(folder, callback) {
                        console.log("folder11: ", folder);
                        node = foler;
                        _this.$db.addNote(node.id, newData, callback)
                    },

                    function(id, created, callback) {
                        newData.checked = node.checked;
                        newData.id = id
                        newData.pid = node.id
                        newData.created = newData.updated = created;
                        callback(null)
                        _this.$bus.$emit("note:addNote", newData);
                    }
                ]

                this.$async.waterfall(ops, function (err, results) {
                    if (err) {
                        _this.$db.alert()
                        return false
                    }

                    console.log("results: ", results);

                });
            }
        },
        */

        getContentMenu:function(index, event){
            // console.log("item : ", item)
            // console.log("event: ", event)

            // this.chooseItem = item
            this.active_note_index = index
            this.notePreview(index)

            // console.log(index)
            // console.log(event)


            // return

            //选择笔记列表条目
            var target = event.target;

            var x = event.clientX - 201;//减去左侧树宽度
            var y = event.clientY - 52;//减去头部高度
            
            $("#noteContextMenu").show();
            // 右键菜单显示位置
            $("#noteList #noteContextMenu").css({
                "top": y + "px",
                "left": x + "px",
                "z-index": '10000',
                'position': 'absolute'
            })

            $("#noteList #noteContextMenu .list-group").css({
                'width': '100px'
            })

            // 鼠标移入移出菜单效果
            $("#noteContextMenu ul li").hover(function(){
                $(this).css({'background-color': '#f5f5f5'})
            },function(){
                $(this).css({'background-color': '#fff'})
            });

            // 鼠标离开右键菜单时，隐藏右键菜单
            $("#noteContextMenu ul li").on('mouseleave', function(event){
                var tag = event.relatedTarget.tagName.toLowerCase();
                if (tag !== "li" && tag !== "ul"){
                    $("#noteContextMenu").hide();
                }
            })
        },
        noteRename: function(){
            $("#noteContextMenu").hide();
            $("#noteListRenameWindow").modal("show");
        },


        noteDelete: function() {
            var _this = this
            $("#noteContextMenu").hide();
            
            if(this.active_note_index == null || this.items[this.active_note_index] == undefined) {
                return
            }

            var asyncOps = [
                // 获取笔记
                function(callback) {
                    _this.$db.noteDelete(_this.items[_this.active_note_index].id, callback)
                },
                // 取消显示
                function(notelist, callback) {
                    _this.items.splice(_this.active_note_index, 1)
                    _this.active_note_index = null
                }
            ]
            
            this.$async.waterfall(asyncOps, function (err, results) {
                if (err) {
                    _this.$db.alert()
                }
            })
        },

        //todo 这里迁移到modal里面~~~~~
        saveModifyName: function(){
          
            var newTitle = $("#NoteListRename").val();
            if (newTitle == "" || newTitle == null){
                this.$bus.$emit('alert', {msg:'笔记名称不能为空',close:true, state:'danger'});
            }
            if (this.chooseItem == null){
                this.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'});

            } else {
                this.$db.modifyNoteTitle(this.chooseItem.id, newTitle);
                this.chooseItem.title = newTitle;
                $("#noteListRenameWindow").modal("hide");
            }
        },
        noteSearch: function(){
            $(".search-icon").hide();
            $(".search").val(" ");
            $(".search").blur(function(){
                var searchValue = $(".search").val();
                if (searchValue == null || searchValue == ' '){
                    $(".search").val("");
                     $(".search-icon").show();
                }
            });
        },
        folderCreate : function() {
            

        },
        // 点击笔记，右侧预览
        notePreview : function(index){
            // 高亮选中
            this.active_note_index = index
            //todo 渲染编辑器。传递参数
            this.$bus.$emit('note:editor:preview', this.items[index])
        },
        getMoreNotes: function(event){
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            console.log("scrollTop: ", scrollTop);
            var totalHeight = this.$store.state.Window.height;
            if (scrollTop - totalHeight - 135 >= 0){



            }
        }
    }
}

</script>

<style type="text/css">
#noteList {
    width: 240px;
    border-right: 1px solid #ddd;
    position: relative;
}

#noteList .search-box {
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    width: 240px;
}

#noteList .search-box .search {
    height: 35px;
    line-height: 35px;
    border-radius: 20px;
    display: inline-block;
    border: 1px solid #ddd;
    padding-left:25px;
}

#noteList .search-box .levelup-icon {
    text-align: left;
}

#noteList  .search-box .search-icon {
    position: absolute;
}

#noteList  .search-box .list-icon {
    /*position: absolute;
    right: 20px;*/
    text-align: right;
}

#noteList  .search-box span i {
    margin:-2px 10px 0 10px;
}

#noteList  .search-box i {
    color: #ddd;
    font-size:14px;
}

#noteList .list li {
    width: 239px;
    height: 125px;
    border-bottom: 1px solid  #ddd;
    font-size: 12px;
    padding: 15px;
}

#noteList .list li:hover {
    background: #f5f5f5;
}
/*
#noteList .my-note-item-folder {
    width: 239px;
    height: 80px;
    border-bottom: 1px solid  #ADB8C4;
    font-size: 12px;
}

#noteList .my-note-item, #noteList .my-note-item-folder {
    padding-left: 20px;
}
*/
#noteList .noteListContent {
    overflow: hidden;
}

#noteList .noteListContent:hover {
    overflow-y: auto;
}

#noteList .noteListContent::-webkit-scrollbar
{
    width: 10px;
} 

/*滚动条背景*/
#noteList .noteListContent::-webkit-scrollbar-track
{
    background: none;
}

/*滚动条颜色*/
#noteList .noteListContent::-webkit-scrollbar-thumb  
{  
    background-color: #bfd8f5;
} 

/*滚动条颜色*/
#noteList .noteListContent::-webkit-scrollbar-thumb:hover
{  
    background-color: #9ec7f7;
}

#noteList .noteListContent .list li {
    position: relative;
}
/*
#noteList .my-note-item-folder .item-folder-bottom .item-createtime {
    bottom: 10px;
    position: absolute;
    color: #D3D3D3;
}
*/
#noteList .noteListContent .item-title {
    display: inline-block;
}


#noteList .noteListContent .item-title .fa-pencil-square-o {
    color: #398dee;
}

#noteList .noteListContent .item-bottom {
    position: absolute;
    bottom: 15px;
    left: 15px;
}

#noteList .noteListContent .item-bottom span {
    color: #aaa;
}

#noteList .noteListContent .item-bottom .item-size {
    padding-left: 20px;
}

#noteList .noteListContent .no-note {
    position: relative;
    top: 50%;
    margin-left: 80px;
}

#noteList .noteListContent .no-note button{
    padding: 10px 18px;
    margin-top: 10px;
}

#noteList .noteListContent .no-note span {
    display: block;
    color: #D3D3D3;
    margin-left: 18px;
}

#noteList .btn-info {
   background-color: #398dee;
}

#noteList .btn-info:hover {
    background-color: #337ab7;
}
#noteList .totalCount {
    width: 240px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    border-top: 1px solid #398dee;
}
#noteList #noteContextMenu {
    font-size: 11px;
}

#noteList #noteContextMenu #right_menu {
    display: none;
}

#noteList #noteContextMenu ul li:hover #right_menu{     
    display: block;
    position: absolute;
    left: 100px;
    top: 0px;
    z-index:999;
}

#noteList #noteContextMenu ul li ul li{
    width: 130px;
}

#right_menu i {
    margin-right: 5px;
}

#noteList .list li.active {
    background-color: #e0eafa!important;
}

</style>
