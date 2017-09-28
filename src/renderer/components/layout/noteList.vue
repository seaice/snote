<template>
    <div id="noteList" class="fl" :style="{ height: height - 52 + 'px' }">
        <div class="search-box">
            <span  class="levelup-icon"><i class="fa fa-level-up" aria-hidden="true"></i></span>
            <span  class="search-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
            <input class="search" type="text" name="search" placeholder="搜索..." />
            <span  class="list-icon"><i class="fa fa-th-list" aria-hidden="true"></i></span>
        </div>
        <div class="noteListContent" :style="{ height: height - 107 + 'px' }">
            <div id="list">
                <noteItem>
                    <template slot="item" scope="item">
                        <li>
                            <div v-bind:class="{'my-note-item-folder': item.item.type === 1, 'my-note-item': item.item.type == 2 }">
                                <span class="item-title">{{ item.item.title }}</span>
                                    <span v-if="item.item.type === 1"><i></i>{{ item.item.belong }}</span>
                                    <div class="item-bottom"v-else="item.item.type ===2">
                                    <span class="item-createtime">{{ item.item.createtime }}</span>
                                    <span class="item-size">{{ item.item.size }}</span>
                                </div>
                            </div>
                        </li>
                    </template>
                </noteItem>
            </div>
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

#noteList .search-box .search{
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

#noteList  .search-box span i{
    margin:-2px 10px 0 10px ;
}

#noteList  .search-box i {
    color: #ADB8C4;
    font-size:14px;
}
#noteList .my-note-item{
    width: 240px;
    height: 125px;
    background: red;
    border-bottom: 1px solid  #ADB8C4;
    font-size: 12px;

}

#noteList .my-note-item-folder{
     width: 240px;
    height: 125px;
    background: blue;
    border-bottom: 1px solid  #ADB8C4;
    font-size: 12px;
}
#noteList .my-note-item, #noteList .my-note-item-folder {
    padding-left: 20px;
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
.noteListContent .item-bottom {
   margin-top: 60px;
   color: #eee;
}
.noteListContent .item-title {
    display: inline-block;
    padding-top: 10px;
}
</style>
