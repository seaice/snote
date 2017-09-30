<template>
    <div id="layoutLeft" class="fl" :style="{ height: height - 52 +'px' }">
        <div class="btn-group-note">
            <a href="#"><i class="fa fa-plus" aria-hidden="true"></i><span>新文档</span><i class="fa fa-caret-down" aria-hidden="true"></i></a>
            <a href="#"><i class="fa fa-refresh" aria-hidden="true"></i><span>同步</span></a>
        </div>
        <div id="folder" :style="{ height: height - 267 + 'px' }">
            <div class="new">
                <ul>
                    <li><a href=""><i class="fa fa-file-text-o" aria-hidden="true"></i>最新文档</a></li>
                </ul>
            </div>
            <div>
                <ul id="treeDemo" class="ztree"></ul>
            </div>
        </div>
        <div class="ad-left">
            <a href="#" v-on:click="getFolder">加载目录</a> <br>
            此处是广告 <br>
            {{ height }}<br>
            {{ width }}
        </div>
        <div id="tree_menu">
            <ul>
                <li id="tree_menu_add">新建
                    <ul>
                        <li v-on:click="createFolder"><i class="fa fa-folder-o" aria-hidden="true"></i><span>文件夹</span></li>
                        <li><i class="fa fa-file-o" aria-hidden="true"></i><span>笔记</span></li>
                        <li><i class="fa fa-file-o" aria-hidden="true"></i>MarkDown笔记</li>
                    </ul>
                </li>
                <li id="tree_menu_rename" v-on:click="renameFolder">重命名</li>
                <li id="tree_menu_del" v-on:click="deleteFolder">删除</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    components: {
    },
    data () {
        return {
            fullHeight: document.documentElement.clientHeight - 52,
            ztree : {},
            ztree_node_oldname : "",
            ztree_menu_flag : false, //是否隐藏菜单
            setting : {
                view : {
                    // showLine: false,
                    // showIcon: false
                    // dblClickExpand: false
                    addDiyDom: this.ztree_addDiyDom
                },
                edit : {
                    enable : true,
                    showRemoveBtn : false,
                    showRenameBtn : false,
                    drag : {
                        isCopy : false,
                        isMove :true,
                        prev :true,
                        inner :true,
                        next :true,
                    }
                },
                callback: {
                    // beforeDrag : ztree_beforeDrag,
                    beforeDrop      : this.ztree_beforeDrop,
                    onDrop          : this.ztree_onDrop,
                    onClick         : this.ztree_onClick,
                    onRightClick    : this.OnRightClick,
                    beforeRename    : this.ztree_beforeRename,
                    onRename        : this.ztree_onRename,
                    onRename        : this.ztree_onRename,
                }
            },
            // folder : this.$db.getNote(),
        }
    },
    methods: {
        createFolder : function() {
            var _this = this
            var _ztree = this.ztree

            this.ztree_menu_flag = false
            this.hideRMenu()
            var newData = { name:"新建文件夹" };
            var selectNode = this.ztree.getSelectedNodes()[0]
            if (selectNode) {
                var asyncOps = [
                    function(callback) {
                        _this.$db.addFolder(selectNode, newData, callback)
                    },
                    function(id, callback) {
                        newData.checked = selectNode.checked;
                        newData.id = id
                        newData.pid = selectNode.id
                        var newNode = _ztree.addNodes(selectNode, newData);
                        _ztree.editName(newNode[0])

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
        ztree_beforeRename : function(treeId, treeNode, newName, isCancel) {
            if(treeNode.pid == 0)
                return false
            this.ztree_node_oldname = treeNode.name
        },
        deleteFolder : function() {
            var nodes = this.ztree.getSelectedNodes()
            console.log(nodes)
            this.ztree_menu_flag = false
            this.hideRMenu()

            //todo  删除要判断内部有没有笔记，如果存在，要提示。
            //方案：删除目录，目录以及其子目录，直接删除。目录内部笔记，直接进入垃圾站。不在进行分类。恢复笔记，直接恢复到我的文件夹。
            this.ztree.removeNode(nodes[0])
        },
        renameFolder : function() {
            this.ztree_menu_flag = false
            this.hideRMenu()
            var nodes = this.ztree.getSelectedNodes()
            this.ztree.editName(nodes[0])
        },
        ztree_onRename : function(event, treeId, treeNode, isCancel) {
            if(isCancel == true) {
                return true;
            }

            if(this.ztree_node_oldname == treeNode.name) {
                return true;
            }

            var name = this.filterStr(treeNode.name)
            if(name == '') {
                treeNode.name = '新建文件夹'
                this.ztree.updateNode(treeNode)
            }

            this.$db.renameFolder(treeNode)
        },
        showRMenu : function (type, x, y) {
            var nodes = this.ztree.getSelectedNodes()
            var _this = this
            $("#tree_menu").show();

            _this.ztree_menu_flag = true

            if (nodes[0].pid == 0) {
                $("#tree_menu_rename").hide();
                $("#tree_menu_del").hide();
            } else {
                $("#tree_menu_add").show();
                $("#tree_menu_rename").show();
                $("#tree_menu_del").show();
            }

            var id = nodes[0].tId + '_a'

            $("#tree_menu").css({"top":y+"px", "left":x+"px", "visibility":"visible"});

            $("#tree_menu, #" + id).on('mouseover', function() {
                _this.ztree_menu_flag = true
            });

            $("#tree_menu, #" + id).on('mouseleave', function() {
                _this.ztree_menu_flag = false
                _this.hideRMenu(id)
            });
        },
        hideRMenu : function (id=null) {
            var _this = this

            setTimeout(function(){
                if(_this.ztree_menu_flag) {
                    return false
                }
                $("#tree_menu").css({"visibility": "hidden"})
                if(id != null) {
                    // console.log('unbind mouseleave ' + id)
                    $("#" + id).unbind('mouseleave')
                    $("#" + id).unbind('mouseover')
                }
            }, 100)
        },
        /* 右键菜单 */
        OnRightClick : function (event, treeId, treeNode) {
            console.log('menu right click')
            console.log(treeId)
            console.log(treeNode)
            console.log('menu right click')
            if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                this.ztree.cancelSelectedNode();
                this.showRMenu("root", event.clientX, event.clientY);
            } else if (treeNode && !treeNode.noR) {
                this.ztree.selectNode(treeNode);
                this.showRMenu("node", event.clientX, event.clientY);
            }
        },
        getAllChildrenNodes : function (treeNode,result = []) {
              if (treeNode.isParent) {
                var childrenNodes = treeNode.children;
                if (childrenNodes) {
                    for (var i = 0; i < childrenNodes.length; i++) {
                        // console.log(childrenNodes[i])
                        result.push(childrenNodes[i].id)
                        result = this.getAllChildrenNodes(childrenNodes[i], result);
                    }
                }
            }
            return result;
        },
        ztree_resort : function (treeNodes) {
            var len = treeNodes.length
            for(var i = 0; i < len; i++) {
                treeNodes[i].sort = len - i
            }

            return treeNodes
        },
        ztree_addDiyDom : function (treeId, treeNode) {
            var spaceWidth = 20;
            var switchObj = $("#" + treeNode.tId + "_switch"),
            icoObj = $("#" + treeNode.tId + "_ico");
            switchObj.remove();
            icoObj.before(switchObj);

            if (treeNode.level > 0) {
                switchObj.siblings('.tree-switch-before').remove();
                var spaceStr = "<span class='tree-switch-before' style='display: block; float:left; height:20px; width:" + (spaceWidth * treeNode.level + 4)+ "px'></span>";
                switchObj.before(spaceStr);
            }
        },
        ztree_beforeDrop : function (treeId, treeNodes, targetNode, moveType) {
            if((targetNode == null || targetNode.pid == 0) && moveType != 'inner') 
                return false

            return targetNode ? targetNode.drop !== false : true;
        },
        ztree_onClick : function (event, treeId, treeNode) {
            var ret = this.getAllChildrenNodes(treeNode, [treeNode.id])
            console.log(ret)

            //todo 获得所有节点的笔记,展示在第二列

        },
        ztree_rebuildDiyDom : function(treeId, treeNode) {
            this.ztree_addDiyDom(treeId, treeNode)
            if(treeNode.isParent) {
                for (var i = 0; i < treeNode.children.length; i++) {
                    this.ztree_rebuildDiyDom(treeId, treeNode.children[i])
                }
            }
        },
        ztree_onDrop : function (event, treeId, treeNodes, targetNode, moveType) {
            if(targetNode == null) {
                return false
            }

            this.ztree_rebuildDiyDom(treeId, treeNodes[0])

            var data = {}

            if(moveType == 'inner') {
                data = {
                    'to_node':targetNode,
                    'node':treeNodes[0],
                    'children': this.ztree_resort(targetNode.children),
                }
            } else {
                var parent = targetNode.getParentNode()
                data = {
                    'to_node':parent,
                    'node':treeNodes[0],
                    'children': this.ztree_resort(parent.children),
                }
            }

            this.$db.moveFolder(data)
        },
        new_window : function(event) {
            this.$modal.show('hello-world');

            // this.$route.router
            // console.log(this.$route)
            // this.$router.replace({name: "config", query: {redirect: encodeURIComponent(this.$route.path)}});
            // this.$router.push({path: '/config'})
        },
        initFolders (data) {
            this.ztree = $.fn.zTree.init($("#treeDemo"), this.setting, data);
        },
        getFolder () {
            this.$db.getFolder(1)
            // console.log(555)
            // this.folder = data
            // this.ztreeObj = $.fn.zTree.init($("#treeDemo"), this.setting, data);
            // console.log(this.folder)
            // console.log(555)
        }
    },
    computed: {
        height () {
            return this.$store.state.Window.height;
        },
        width () {
            return this.$store.state.Window.width;
        },
        // folder() {
        //     return this.$store.state.Global.folder;
        // }
    },
    mounted() {
        this.$bus.$on('folder:init', this.initFolders)
    },
}
</script>

<style>
#layoutLeft {
    background: #f5f5f5;
    width: 200px;
    overflow: hidden;
    border-right: 1px solid #ddd;
    clear: both;
}
#layoutLeft a{
    color: #000;
    text-decoration: none;
}

#layoutLeft #folder{
    overflow: hidden;
}

#layoutLeft #folder:hover {
    overflow-y: auto;
}

#layoutLeft #folder::-webkit-scrollbar
{
    width: 10px;  
} 

/*滚动条背景*/
#layoutLeft #folder::-webkit-scrollbar-track
{
}

/*滚动条颜色*/
#layoutLeft #folder::-webkit-scrollbar-thumb  
{  
    background-color: #bfd8f5;
} 

/*滚动条颜色*/
#layoutLeft #folder::-webkit-scrollbar-thumb:hover
{  
    background-color: #9ec7f7;
}

#layoutLeft .btn-group-note {
    height: 55px;
}
#layoutLeft .btn-group-note a {
    text-align: center;
    display: block;
    float: left;
    width: 50%;
    height: 55px;
    line-height: 55px;
    color: #000;
    font-size: 12px;
}
#layoutLeft .btn-group-note a span {
    margin: 0 5px 0 10px;
}
#layoutLeft .btn-group-note a i {
    font-size: 22px;
    margin: -2px 0 0 0;
}
#layoutLeft .btn-group-note a i.fa-caret-down {
    color: #999;
    font-size: 12px;
}

#layoutLeft .btn-group-note a i{
    color:#398dee;
}

#layoutLeft #folder .new li {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    padding-left: 30px;
}
#layoutLeft #folder .new li i{
    margin: -3px 14px 0 0;
    font-size: 16px;
}

#layoutLeft #folder .new li:hover {
    background: #e4edf9;
}

#layoutLeft #folder .new i {
    color:#398dee;
}

#layoutLeft .ad-left {
    border-top: 1px solid #ddd;
    height: 159px;
}


#layoutLeft #tree_menu {
    border: 1px solid #b3d6ff;
    position:absolute; 
    visibility:hidden; 
    top:0; 
    background-color: #fff;
    text-align: left;
    z-index: 10000;
}
#layoutLeft #tree_menu ul li{
    height: 30px;
    line-height: 30px;
    padding: 0 0 0 30px;
    font-size: 11px;
    cursor: pointer;
    /*list-style: none outside none;*/
    position: relative;
    width: 130px;

}
#layoutLeft #tree_menu ul li:hover{
    background-color: #e9f3ff;
}
#layoutLeft #tree_menu ul li ul{
    width: 150px;
    display: none;
    position: absolute;
    border:1px solid  #b3d6ff;
    background: #fff;
}

#layoutLeft #tree_menu ul li:hover ul{
    display: block;
    position: absolute;
    top: -1px;
    left: 130px;
}

#layoutLeft #tree_menu ul li ul li {
    width: 150px;
    padding: 0 0 0 20px;
}


#layoutLeft #tree_menu ul li ul i{
    margin: 0 5px 0 0;
}

@import '../../assets/css/ztree/awesome/awesome.css';
</style>
