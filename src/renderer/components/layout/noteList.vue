<template>
    <div id="noteList" class="fl" :style="{ height: height - 52 + 'px' }">
        <div id="search-box">
            <span  id="levelup-icon"><i class="fa fa-level-up" aria-hidden="true"></i></span>
            <span  id="search-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
            <input type="text" name="search" placeholder="搜索..." id="search"/>
            <span  id="list-icon"><i class="fa fa-th-list" aria-hidden="true"></i></span>
        </div>
        <div id="note" :style="{ height: height - 109 + 'px' }">
            <div id="list">
                <!-- <parentNoteItem>
                    nothing
                </parentNoteItem> -->
                <!-- <noteItem :items="items">
                     <template slot="item" scope="props">
                        <li class="my-item">{{ props.text }}</li>
                    </template>
                </noteItem> -->
                <!-- <noteItem>
                  <template slot="item" scope="props">
                    <li class="my-fancy-item">{{ props.text }}</li>
                  </template>
                  test test
                </noteItem> -->


                
                <!-- <ul>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                    <li>fsafasfasdf</li>
                </ul> -->
            </div>
            <div id="totalCount">总共{{total}}项</div>
        </div>

    </div>
</template>
<script type="text/javascript">
import parentNoteItem from './parentNoteItem'
// import noteItem from './noteItem'
export default {
    components:{
        parentNoteItem
        // noteItem
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
#search-box {
    height: 57px;
    line-height: 57px;
    border-bottom: 1px solid #ddd;
    position: relative;
    font-size: 12px;
    /*text-align: center;*/
}

#search{
    height: 35px;
    line-height: 35px;
    border-radius: 20px;
    display: inline-block;
    border: 1px solid #ddd;
    padding-left:25px;

}
#levelup-icon {
    text-align: left;
    margin:-2px 10px 0 15px;
    
}
#search-icon {
    position: absolute;
    left: 45px;
    top:-2px;
   
}

#list-icon {
    text-align: right;
    margin:-2px 10px 0 0 ;

    /*margin-right:5px;*/

}
#search-box i{
    color: #ADB8C4;
    font-size:14px;

}

#totalCount {
    width: 100%;
    height: 30px;
    line-height: 30px;
    position: absolute;
    bottom: 0px;
    text-align: center;
    font-size: 12px;
}
</style>
