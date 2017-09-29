<template>
    <div id="noteList" class="fl" :style="{ height: height - 52 + 'px' }">
        <div class="search-box">
            <span  class="levelup-icon"><i class="fa fa-level-up" aria-hidden="true"></i></span>
            <span  class="search-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
            <input class="search" type="text" name="search" placeholder="搜索..." />
            <span  class="list-icon"><i class="fa fa-th-list" aria-hidden="true"></i></span>
        </div>
        <div class="noteListContent" :style="{ height: height - 107 + 'px' }">
            <noteItem>
                <template slot="item" scope="item">
                    <li>
                        <div v-bind:class="{'my-note-item-folder': item.item.type === 1, 'my-note-item': item.item.type == 2 }">
                            <span class="item-title">
                                <i :class="{ 'fa fa-folder': item.item.type === 1, 'fa fa-pencil-square-o': item.item.type == 2} " aria-hidden="true"></i>
                                {{ item.item.type === 1  ? item.item.belong : item.item.title }}
                            </span>
                            <div class="item-folder-bottom" v-if="item.item.type === 1">
                                 <span class="item-createtime">{{ item.item.createtime }}</span>
                            </div>
                           
                            <div class="item-bottom"  v-else="item.item.type === 2">
                                <span class="item-createtime">{{ item.item.createtime }}</span>
                                <span class="item-size">{{ item.item.size + 'B' }}</span>
                            </div>
                        </div>
                    </li>
                </template>
            </noteItem>
            <div class="totalCount">总共{{ total }}项</div>
        </div>

    </div>
</template>
<script type="text/javascript">
import noteItem from './noteItem'

export default {
    components:{
        noteItem
    },
    data () {
        return {
            nickname: 'haibing1458',
            total:0,
        }
    },
    computed:{
        height () {
            return this.$store.state.Window.height;
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
    position: relative;
    font-size: 12px;
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
    text-align: left;
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

#noteList .noteListContent .list li {
    position: relative;
}

#noteList .my-note-item-folder .item-folder-bottom .item-createtime {
    bottom: 10px;
    position: absolute;
    color: #eee;
}

#noteList .noteListContent .item-title {
    display: inline-block;
    padding-top: 10px;
}


#noteList .noteListContent .item-title .fa-pencil-square-o {
    color: #398dee;
    margin-right:10px;
}

#noteList .item-title .fa-folder{
    color: #f6ce62;
    margin-right:10px;
}

#noteList .noteListContent .item-bottom {
    position: absolute;
    bottom: 5px;
}

#noteList .noteListContent .item-bottom span {
    color: #ddd;
}

#noteList .noteListContent .item-bottom .item-size{
    padding-left: 35px;
}

#noteList .noteListContent .totalCount {
    width: 100%;
    height: 30px;
    line-height: 30px;
    position: absolute;
    bottom: 0px;
    text-align: center;
    font-size: 12px;
}

</style>
