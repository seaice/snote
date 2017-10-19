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
        <div class="noteListContent" :style="{ height: height - 135 + 'px' }" v-on:scroll="getMoreNotes">
            <div v-if="total > 0" id="note_list" class="list">
                <ul>
                    <li v-for="(item,index) in items" v-on:contextmenu="getContentMenu(index, $event)" v-on:click="notePreview(index)" :class="{active:index==active_note_index}">
                        <!-- <a v-if="item.cloud" title="云端" class="note-cloud"><i class="fa fa-cloud" aria-hidden="true"></i></a> -->
                        <!-- <a v-else title="本地" class="note-cloud"><i class="fa fa-floppy-o" aria-hidden="true"></i></a> -->
                        <i v-if="item.cloud" title="云端" class="fa fa-cloud note-cloud" aria-hidden="true"></i>
                        <i v-else title="本地" class="fa fa-floppy-o note-cloud" aria-hidden="true"></i>
                        <!-- <a v-if="item.sort" title="置顶" class="note-stick"><i class="fa fa-cloud" aria-hidden="true"></i></a> -->
                        <span class="item-title"><i v-if="item.sort" title="置顶" class="fa fa-arrow-up" aria-hidden="true"></i><!-- <i class="fa fa-pencil-square-o" aria-hidden="true"></i> --><a title="item.title">{{ item.title }}</a></span>
                        <div class="item-summary">{{ item.summary }}</div>
                        <div class="item-bottom">
                            <span class="item-folder"><i class="fa fa-folder-o" aria-hidden="true"></i>{{item.fname}}</span>
                            <span class="item-time">{{ getUpdatedTime(item.updated) }}</span>
                        </div>
                    </li>
                </ul>
                <div style="display:none;" id="noteLoading"><img src="~@/assets/img/loading.gif" /></div>
            </div>
            <div v-else class="no-note">
                <span>没有内容</span>
                <button class="btn btn-info" @click="">新建笔记</button>
            </div>
        </div>
        <div class="totalCount">总共{{ this.total }}项</div>
        <div id="noteContextMenu" style="display:none;">
            <ul class="">
                <li >新建<i class="fa fa-caret-right" aria-hidden="true"></i>
                    <ul class="contentSubMenu">
                        <li v-on:click="folderCreate"><i class="fa fa-folder-o" aria-hidden="true"></i><span>文件夹</span></li>
                        <li v-on:click="noteCreateCloud($store.state.Global.cur_fid)"><i class="fa fa-file-o" aria-hidden="true"></i><span>云笔记</span></li>
                        <li v-on:click="noteCreateLocal($store.state.Global.cur_fid)"><i class="fa fa-file-o" aria-hidden="true"></i><span>本地笔记</span></li>
                        <!-- <li><i class="fa fa-file-o" aria-hidden="true"></i>MarkDown笔记</li> -->
                    </ul>
                </li>

                <li v-if="active_note_index!= null && items[active_note_index].sort" v-on:click="noteStick(0)">取消置顶</li>
                <li v-else v-on:click="noteStick()">置顶</li>
                <li v-on:click="">移动到</li>
                <li v-on:click="noteDelete">删除</li>
            </ul>
        </div>
    </div>
</template>
<script type="text/javascript">

export default {
    components:{
    },
    data () {
        return {
            loading           : false,
            pageNum           : 1, // 加载笔记的页数
            pageSize          : 10, // 加载笔记的页数
            
            total             : 0,
            items             : [],  //所有笔记集合
            chooseItem        : {}, // 选中的笔记节点
            
            active_note_index : null, // 选中的笔记
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

        this.$bus.$on("note:list:update:note", this.noteListUpdateNote);//笔记更新后，更新列表中该笔记数据

        // this.$bus.$on("note:list:init",this.initNoteList);//笔记列表初始化
        // this.$bus.$on("note:addNote", this.addNote);//添加新增笔记
        // this.$bus.$on('note:getSelectedNode', this.getSelectedNode);//获取选中的树节点id
    },
    methods: {
        /* 加载笔记 */

        /**
          * @param append true：翻页追加。false：首次加载
          * @param pageNumUp 是否更新this.pageNum。在取消置顶时。一次加载多页。append：false。无需更新pagenum为1
          */
        noteListLoad : function(fids, conds={}, append=false, pageNumUp=true) {
            console.log('note list load')
            console.log(conds)
            if(conds.pageNum == undefined) {
                conds.pageNum = 1
            }
            if(conds.pageSize == undefined) {
                conds.pageSize = this.pageSize
            }

            if(!append) {
                this.items = []
                if(pageNumUp) {
                    this.pageNum = 1
                }
                this.loading = false
                $("#noteLoading").hide()
            }

            var _this = this
            this.active_note_index = null

            var asyncOps = [
                // 获取数量
                function(callback) {
                    _this.$db.notelistGetCount(fids, {}, callback)
                },
                // 获取笔记
                function(total, callback) {
                    _this.total = total
                    _this.$db.notelistGet(fids, conds, callback)
                },
                // 显示
                function(notelist, callback) {
                    if(append) {
                        if(notelist.length > 0) {
                            _this.items = _this.items.concat(notelist)
                            _this.pageNum++
                        }
                        _this.loading = false
                        $("#noteLoading").hide()
                    } else {
                        _this.items = notelist
                    }
                }
            ]
            
            this.$async.waterfall(asyncOps, function (err, results) {
                if (err) {
                    _this.$db.alert()
                }
            })
        },
        /* 创建笔记 */
        noteCreate(fid, cloud) {
            var _this = this
            $("#noteContextMenu").hide()



            var newData = { title: "无标题笔记" , content: "", type: 0, cloud : cloud }

            var asyncOps = [
                // 新建笔记
                function(callback) {
                    console.log(_this.$store.state.Global.cur_fid)
                    if(fid == undefined) {
                        fid = 1
                    }

                    _this.$db.noteCreate(fid, newData, callback)
                },
                // 渲染
                function(data, callback) {
                    _this.items.unshift(data)
                    _this.total++

                    _this.$nextTick(function () {
                        _this.notePreview(0,true)
                    })
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
        getContentMenu:function(index, event){
            this.active_note_index = index
            this.notePreview(index)

            //选择笔记列表条目
            var x = event.clientX - 201;//减去左侧树宽度
            var y = event.clientY - 52;//减去头部高度
            
            // 右键菜单显示位置
            $("#noteList #noteContextMenu").css({
                "top": (y) + "px",
                "left": (x) + "px",
                "z-index": '10000',
            })
            $("#noteContextMenu").show()

            // console.log(this.items.indexOf(this.active_note_index).title)
            var hideFlag = true
            var hideInt = setInterval(function() {
                console.log(hideFlag)
                if(hideFlag) {
                    $("#noteContextMenu").hide()
                    clearInterval(hideInt)
                }
            }, 1000)

            $("#noteContextMenu").on('mouseover', _.throttle(function(event) {
                hideFlag = false
                clearInterval(hideInt)
            }, 250))

            $("#noteContextMenu").on('mouseleave', function(event) {
                console.log('leave')
                hideFlag = true
                $("#noteContextMenu").hide()
                clearInterval(hideInt)
            })
        },

        // 删除笔记
        noteDelete: function() {
            console.log('note delete')

            var _this = this
            $("#noteContextMenu").hide();
            
            if(this.active_note_index == null || this.items[this.active_note_index] == undefined) {
                return
            }

            var asyncOps = [
                // 删除笔记
                function(callback) {
                    _this.$db.noteDelete(_this.items[_this.active_note_index].id, callback)
                },
                // 列表中删除
                function(callback) {
                    _this.items.splice(_this.active_note_index, 1)
                    _this.active_note_index = null
                    callback(null)
                }
            ]
            
            this.$async.series(asyncOps, function (err, results) {
                if (err) {
                    _this.$db.alert()
                }
                _this.$bus.$emit('note:editor:preview:no')
            })
        },
        /*置顶插入*/
        notelistInsert: function(note) {
            for (var i = 0; i < this.items.length ; i++) {
                var item = this.items[i]
                if(note.sort > item.sort) {
                    this.items.splice(i, 0, note)
                    break
                } else if(note.updated > item.updated) {
                    this.items.splice(i, 0, note)
                    break
                }
            }
        },
        // 置顶
        noteStick: function(sort=1) {
            var _this = this

            $("#noteContextMenu").hide();
            var asyncOps = [
                // 删除笔记
                function(callback) {
                    _this.$db.noteStick(_this.items[_this.active_note_index].id, sort, callback)
                },
                // 列表中删除
                function(callback) {
                    var item = _this.items[_this.active_note_index]
                    //删除
                    if(sort == 1) {
                        _this.items.splice(_this.active_note_index, 1)
                        item.sort = sort
                        // 旧逻辑，直接放到上面
                        // _this.items.splice(0, 0, item)

                        _this.notelistInsert(item)
                    } else { //取消置顶
                        _this.noteListLoad(_this.$store.state.Global.cur_fid_child, {pageNum:1, pageSize: _this.pageSize * _this.pageNum}, false, false)
                    }

                    // if(sort == 1) { // 置顶
                    //     //插入
                    //     item.sort = 1
                    //     _this.notelistInsert(item)
                    //     // _this.items.splice(0, 0, item);
                    // } else { // 取消置顶
                        // _this.notelistInsert(item)

                    // }

                    callback(null)
                }
            ]
            
            this.$async.series(asyncOps, function (err, results) {
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

        // 搜索笔记
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

        // 创建文件夹
        folderCreate : function() {
            $("#noteContextMenu").hide()
            this.$bus.$emit('folder:create')
        },
        // 点击笔记，右侧预览
        notePreview : function(index, active=false){
            // 高亮选中
            this.active_note_index = index
            //todo 渲染编辑器。传递参数
            this.$bus.$emit('note:editor:preview', this.items[index], active)
        },
        getMoreNotes: function(event){
            var offset = $(".list li:last").offset()
            // console.log($(document).height() - offset.top)
            if(offset == undefined) {
                return
            }

            if($(document).height() - offset.top >= 155) {
                console.log('get more note ok')
                if(!this.loading) {
                    this.loading = true
                    $("#noteLoading").show()
                    this.noteListLoad(this.$store.state.Global.cur_fid_child, {pageNum:this.pageNum+1}, true)
                }
            }
        },

        /* 更新笔记列表内容 */
        noteListUpdateNote: function(note) {
            // console.log(this.items)

            this.items.forEach(function(item) {
                if(item.id == note.id) {
                    item.title = note.title
                    item.summary = note.summary
                    item.cloud = note.cloud
                }  
            })
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
    position: relative;
    width: 239px;
    height: 125px;
    border-bottom: 1px solid  #ddd;
    font-size: 12px;
    padding: 15px;
}

#noteList .list li .note-cloud {
    position: absolute;
    right: 15px;
    top: 18px;
    color: #ddd;
}

#noteList .list li.active .note-cloud {
    color: #999;
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

#noteList .noteListContent .item-title {
    /*display: inline-block;*/
    color: #000;
}
#noteList .noteListContent .item-title a {
    color: #000;
    display:block;
    width: 175px;
    float: left;
    height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
}

#noteList .noteListContent .item-title i {
    margin: 2px 6px 0 0;
    color: #398dee;
    float: left;
}

#noteList .noteListContent .item-summary {
    height: 40px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    display: -webkit-box;
    margin: 10px 0 0 0;
    color: #999;
}

#noteList .noteListContent .item-folder {
    color: #000;
}
#noteList .noteListContent .item-folder i {
    margin: -1px 6px 0 0;
    color: #999;
}

#noteList .noteListContent .item-bottom {
    margin:10px 0 0 0;
}
#noteList .noteListContent .item-bottom .item-time {
    float: right;
    color: #999;
}
#noteList .noteListContent .item-bottom .item-size {
    /*padding-left: 20px;*/
}

#noteList .noteListContent .no-note {
    position: relative;
    top: 42%;
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

/*右键菜单*/
#noteList #noteContextMenu {
    position: absolute;
    font-size: 11px;
    border: 1px solid #b3d6ff;
    background: #fff;
}

#noteList #noteContextMenu li {
    height: 30px;
    line-height: 30px;
    padding: 0 0 0 30px;
    font-size: 11px;
    cursor: pointer;
    position: relative;
    width: 130px;
    list-style:none;
}

#noteList #noteContextMenu .fa-caret-right {
    display: block;
    margin: 0 15px 0 0;
    float: right;
    line-height: 30px;
}

#noteList #noteContextMenu li:hover{
    background-color: #e9f3ff;
}

#noteList #noteContextMenu .contentSubMenu {
    border: 1px solid #b3d6ff;
    background: #fff;
    display: none;
    position: absolute;
    z-index:999;
}

#noteList #noteContextMenu ul li:hover .contentSubMenu{     
    display: block;
    left: 130px;
    top: -1px;
}

#noteList #noteContextMenu .contentSubMenu  i {
    margin-right: 5px;
}

#noteList .list li.active {
    background-color: #e0eafa!important;
}

#noteList #noteLoading {
    text-align: center;
}
</style>
