<template>
<div id="index">
    <layoutTop></layoutTop>
    <layoutLeft></layoutLeft>
    <notelist></notelist>
    <note></note>
    <div class="clear"></div>
</div>
</template>

<script type="text/javascript">
import layoutTop from './layout/layoutTop'
import layoutLeft from './layout/layoutLeft'
import notelist from './layout/notelist'
import note from './layout/note'

export default {
    data () {
        return {
            msg: 'Hello Vue!2'
        }
    },
    components: { 
        layoutTop,
        layoutLeft,
        notelist,
        note,
    }
  // components: { menu, SystemInformation }
}
</script>

<style type="text/css">
#index {
    border: 1px solid #398dee;
}
</style>