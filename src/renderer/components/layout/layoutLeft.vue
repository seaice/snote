<template>
    <div id="layoutLeft"  :style="{ height: fullHeight+'px' }">
        <div class="btn-group">
            <a href=""><i class="fa fa-plus" aria-hidden="true"></i><span>新文档</span><i class="fa fa-caret-down" aria-hidden="true"></i></a>
            <a href=""><i class="fa fa-refresh" aria-hidden="true"></i><span>同步</span></a>
        </div>
        <div id="folder" :style="{ height: fullHeight - 215 + 'px' }">
            <ul>
                <li class="new"><i class="fa fa-file-text-o" aria-hidden="true"></i>最新文档</li>
                <li><i class="fa fa-file-text-o" aria-hidden="true"></i>我的文件夹</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
                <li>我的笔记</li>
            </ul>
        </div>
        <div class="ad-left">
            123123
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            nickname: 'haibing1458',
            fullHeight: document.documentElement.clientHeight - 50,
            children: [
                { name: 'hello' },
                { name: 'wat' },
                {
                  name: 'child folder',
                  children: [
                    {
                      name: 'child folder',
                      children: [
                        { name: 'hello' },
                        { name: 'wat' }
                      ]
                    },
                    { name: 'hello' },
                    { name: 'wat' },
                    {
                      name: 'child folder',
                      children: [
                        { name: 'hello' },
                        { name: 'wat' }
                      ]
                    }
                  ]
                }
              ]
        }
    },
    methods: {
        handleResize (event) {
            this.fullHeight = document.documentElement.clientHeight - 50;
        }
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this. handleWindowResize)
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
    },

}


</script>

<style>
#layoutLeft {
    background: #f5f5f5;
    width: 200px;
    overflow: hidden;
}

#layoutLeft #folder{
    overflow: hidden;
}

#layoutLeft #folder:hover {
    overflow-y: scroll;
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

#layoutLeft .btn-group {
    height: 55px;
}
#layoutLeft .btn-group a {
    text-align: center;
    display: block;
    float: left;
    width: 50%;
    height: 55px;
    line-height: 55px;
    color: #000;
    font-size: 14px;
}
#layoutLeft .btn-group a span {
    margin: 0 5px 0 10px;
}
#layoutLeft .btn-group a i {
    font-size: 22px;
}
#layoutLeft .btn-group a i.fa-caret-down {
    color: #999;
    font-size: 12px;
}

#layoutLeft .btn-group a i{
    color:#398dee;
}

#layoutLeft #folder li {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 30px
}
#layoutLeft #folder li i{
    margin: -2px 10px 0 0;
    font-size: 16px;
}


#layoutLeft #folder li:hover {
    background: #e4edf9;
}

#layoutLeft #folder .new i {
    color:#398dee;
}

#layoutLeft .ad-left {
    height: 160px;
}

</style>