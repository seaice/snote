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
            此处是广告 {{ height }}
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


function ztree_addDiyDom(treeId, treeNode) {
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
}

// function ztree_beforeDrag(treeId, treeNodes) {
//     for (var i=0,l=treeNodes.length; i<l; i++) {
//         if (treeNodes[i].drag === false) {
//             return false;
//         }
//     }
//     return true;
// }

function ztree_beforeDrop(treeId, treeNodes, targetNode, moveType) {
    if((targetNode == null || targetNode.pid == 0) && moveType != 'inner') 
        return false

    return targetNode ? targetNode.drop !== false : true;
}
function ztree_onDrop(event, treeId, treeNodes, targetNode, moveType) {
    ztree_addDiyDom(treeId, treeNodes[0])

    // 拖拽后，同等级重新排序。
    console.log(targetNode)
    // 获得父节点
    // 

}

function ztree_onClick(event, treeId, treeNode) {
    var ret = getAllChildrenNodes(treeNode, [treeNode.id])
    console.log(ret)

    //todo 获得所有节点的笔记

}

function getAllChildrenNodes(treeNode,result = []) {
      if (treeNode.isParent) {
        var childrenNodes = treeNode.children;
        if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
                console.log(childrenNodes[i])
                result.push(childrenNodes[i].id)
                result = getAllChildrenNodes(childrenNodes[i], result);
            }
        }
    }
    return result;
}

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
                    addDiyDom: ztree_addDiyDom
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
                    beforeDrop : ztree_beforeDrop,
                    onDrop: ztree_onDrop,
                    onClick: ztree_onClick,
                }
            },
            // folder : this.$db.getNote(),
        }
    },
    methods: {
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