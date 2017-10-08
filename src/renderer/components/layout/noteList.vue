<template>
    <div id="noteList" class="fl" :style="{ height: height - 52 + 'px' }">
        <div class="search-box">
            <span  class="levelup-icon"><i class="fa fa-level-up" aria-hidden="true"></i></span>
            <!-- <div id="noteListSearchArea"> -->
            <span  class="search-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
            <input class="search" type="text" name="search" placeholder="搜索..." v-on:click="searchNote" />
            <!-- </div> -->
            <span  class="list-icon"><i class="fa fa-th-list" aria-hidden="true"></i></span>
        </div>
        <div class="noteListContent" :style="{ height: height - 137 + 'px' }">
            <div v-if="items.length > 0" class="list">
                <ul>
                    <li v-for="item in items" v-on:contextmenu="getContentMenu(item,$event)">
                        <div v-bind:class="{'my-note-item-folder': item.type == 1, 'my-note-item': item.type == 0 }">
                            <span class="item-title">
                                <i :class="{ 'fa fa-folder': item.type == 1, 'fa fa-pencil-square-o': item.type == 0} " aria-hidden="true"></i>
                                {{ item.type == 1  ? item.name : item.title }}
                            </span>
                            <div class="item-folder-bottom" v-if="item.type == 1">
                                 <span class="item-createtime">{{ getUpdatedTime(item.updated) }}</span>
                            </div>
                           
                            <div class="item-bottom"  v-else="item.type == 0">
                                <span class="item-createtime">{{ getUpdatedTime(item.updated) }}</span>
                                <span class="item-size">{{ getContentSize(item.content) }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else="items.length < 0" class="no-note">
                <span>没有内容</span>
                <button class="btn btn-info" @click="createNote">新建笔记</button>
            </div>
        </div>
        <div class="totalCount">总共{{ this.items.length }}项</div>
        <div id="noteContextMenu" style="display:none;">
            <ul class="list-group">
                <li  class="list-group-item">新建
                    <ul class="list-group" id="right_menu">
                        <li  v-on:click="createFolder" class="list-group-item"><i class="fa fa-folder-o" aria-hidden="true"></i><span>文件夹</span></li>
                        <li v-on:click="createNote" class="list-group-item"><i class="fa fa-file-o" aria-hidden="true"></i><span>笔记</span></li>
                        <li class="list-group-item"><i class="fa fa-file-o" aria-hidden="true"></i>MarkDown笔记</li>
                    </ul>
                </li>
                <li class="list-group-item" v-on:click="renameNote">重命名</li>
                <li class="list-group-item" v-on:click="deleteNote">删除</li>
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
              </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    </div>
</template>
<script type="text/javascript">

export default {
    components:{
    },
    data () {
        return {
            nickname: 'haibing1458',
            total: 0,
            items: [],  //所有笔记集合
            selectedNode: {},// 选中的树节点
            chooseItem:{} // 选中的笔记节点
        }
    },
    computed:{
        height () {
            return this.$store.state.Window.height;
        }
    },
    mounted:function(){
         this.$bus.$on("note:list:init",this.initNoteList);//笔记列表初始化
         this.$bus.$on("note:addNote", this.addNote);//添加新增笔记
         this.$bus.$on('note:getSelectedNode', this.getSelectedNode);//获取选中的树节点id
    },
    methods: {
        initNoteList:function(data){
            this.items = data;
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
        addNote: function(item){
            this.items.unshift(item);
        },
        createNote: function(){
            var _this = this

            var newData = { title: "无标题笔记" , type: 0, state:0};
            var selectNode = this.selectedNode;
            console.log("selectNode: ", selectNode);
            $("#noteContextMenu").hide();
           
            if (selectNode!= null && selectNode.id !=null) {
                var asyncOps = [
                    function(callback) {
                        _this.$db.addNote(selectNode, newData, callback)
                    },
                    function(id, created, callback) {
                        
                        newData.checked = selectNode.checked;
                        newData.id = id
                        newData.pid = selectNode.id
                        newData.created = newData.updated = created;
                        callback(null)
                        _this.$bus.$emit("note:addNote", newData);
                    }
                ]
                this.$async.waterfall(asyncOps, function (err, results) {
                    if (err) {
                        _this.$db.alert()
                        return false
                    }
                });
            } else {
                // 没选中节点。不能添加
                this.$bus.$emit('alert', {msg:'请选择笔记所属文件夹',close:true, state:'danger'})
            }
        },
        getSelectedNode: function(treeNode){
            this.selectedNode = treeNode;
        },
        getContentMenu:function(item,event){
            console.log("item : ", item);
            this.chooseItem = item;
            console.log("target: ", event.target);
            var x = event.clientX - 201;//减去左侧树宽度
            var y = event.clientY - 52;//减去头部高度
            
            $("#noteContextMenu").show();
            // 右键菜单显示位置
            $("#noteList #noteContextMenu").css({
                "top": y + "px",
                "left": x + "px",
                "z-index": '10000',
                'position': 'absolute'
            });
            $("#noteList #noteContextMenu .list-group").css({
                'width': '100px'
            });

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
        renameNote: function(){
            $("#noteContextMenu").hide();// 弹出修改框前隐藏右键菜单
            $("#noteListRenameWindow").modal("show");
        },
        deleteNote: function(){
            $("#noteContextMenu").hide();// 删除前隐藏右键菜单
            if (this.chooseItem == null){
                this.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'});

            } else {
                this.$db.deleteNote(this.chooseItem.id);

                 if (this.selectedNode != null && this.selectedNode.id != null) {

                     this.$db.getNoteList(this.selectedNode.id);
                 } else {

                    this.$bus.$emit('alert', {msg:'数据异常，请重启笔记！<br>如果重启不能解决问题，请重新安装！',close:false, state:'danger'});
                 }
                
            }
        },
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
        searchNote: function(){
            $(".search-icon").toogle();
            $(".search").toogle();
            var searchValue = $(".search").val();

        },
        createFolder : function() {
            var _this = this
            $("#noteContextMenu").hide();
            var newData = { name:"新建文件夹" };
            var selectNode = this.selectedNode;
            console.log("selectNode", selectNode);
            if (selectNode) {
                var asyncOps = [
                    function(callback) {
                        _this.$db.addFolder(selectNode, newData, callback)
                    },
                    function(id, callback) {
                        newData.checked = selectNode.checked;
                        newData.id = id
                        newData.pid = selectNode.id
                        // var newNode = _ztree.addNodes(selectNode, newData);
                        // _ztree.editName(newNode[0])
                        _this.$db.getFolder(_this.$store.state.User.id);

                        callback(null)
                    }
                ]
                // var async = require('async');
                this.$async.waterfall(asyncOps, function (err, results) {
                    if (err) {
                        _this.$db.alert()
                        return false
                    }
                });
            } else {
                // 没选中节点。不能添加
            }

        },
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
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid #ddd;
    position: fixed;
    font-size: 12px;
    top: 52px;
    left: 201px;
    bottom: 54px;
    width: 240px;
}

/*#noteList .search-box #noteListSearchArea {
    position: absolute;
    height: 37px;
    line-height: 37px;
    text-align: center;
    top: 10px;
    left: 25px;
}*/

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
    color: #ADB8C4;
    font-size:14px;
}

#noteList .list li:hover {
    background: #f5f5f5;
}

#noteList .my-note-item {
    width: 240px;
    height: 125px;
    border-bottom: 1px solid  #ADB8C4;
    font-size: 12px;
    color: #eee;
}

#noteList .my-note-item-folder {
    width: 240px;
    height: 80px;
    border-bottom: 1px solid  #ADB8C4;
    font-size: 12px;
}

#noteList .my-note-item, #noteList .my-note-item-folder {
    padding-left: 20px;
}

#noteList .noteListContent {
    position: absolute;
    top: 56px;
    overflow-y: auto;

}
#noteList .noteListContent .list li {
    position: relative;
}

#noteList .my-note-item-folder .item-folder-bottom .item-createtime {
    bottom: 10px;
    position: absolute;
    color: #D3D3D3;
}

#noteList .noteListContent .item-title {
    display: inline-block;
    padding-top: 10px;
    color: #000;
}


#noteList .noteListContent .item-title .fa-pencil-square-o {
    color: #398dee;
    margin-right:10px;
}

#noteList .item-title .fa-folder {
    color: #f6ce62;
    margin-right:10px;
}

#noteList .noteListContent .item-bottom {
    position: absolute;
    bottom: 5px;
}

#noteList .noteListContent .item-bottom span {
    color: #D3D3D3;
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
    /*width: 100%;*/
    width: 240px;
    height: 30px;
    line-height: 30px;
    position: fixed;
    bottom: 0;
    text-align: center;
    font-size: 12px;
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


</style>
