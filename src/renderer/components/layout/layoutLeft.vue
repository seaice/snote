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
    </div>
</template>
<script>
var zNodes = [
    {
        name:"我的文件夹", open:true, children:[
            {
                name:"test1_1",
                open:true,
                children:[
                    {
                        name:'test123123'
                    }

                ]
            }, 
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
            {
                name:"test1_2"
            },
        ]
    }
];



// function ztree_beforeDrag(treeId, treeNodes) {
//     for (var i=0,l=treeNodes.length; i<l; i++) {
//         if (treeNodes[i].drag === false) {
//             return false;
//         }
//     }
//     return true;
// }




export default {
    components: {
    },
    data () {
        return {
            nickname: 'haibing1458',
            fullHeight: document.documentElement.clientHeight - 52,

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
                    beforeDrop  : this.ztree_beforeDrop,
                    onDrop      : this.ztree_onDrop,
                    onClick     : this.ztree_onClick,
                    onRightClick: this.OnRightClick
                }
            },
            // folder : this.$db.getNote(),
        }
    },
    methods: {
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

            // console.log('before')
            // console.log(targetNode)
            // console.log('before')

            return targetNode ? targetNode.drop !== false : true;
        },
        ztree_onClick : function (event, treeId, treeNode) {
            var ret = this.getAllChildrenNodes(treeNode, [treeNode.id])
            console.log(ret)

            //todo 获得所有节点的笔记

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
            // console.log(555)
            // this.folder = data
            this.ztreeObj = $.fn.zTree.init($("#treeDemo"), this.setting, data);
            // console.log(this.folder)
            // console.log(555)
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
    /*background:red;*/
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

/*@import '../../assets/css/ztree/awesomeStyle/awesome.css';*/
@import '../../assets/css/ztree/awesome/awesome.css';
</style>