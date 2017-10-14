<template>
<div id="index">
    <layoutTop></layoutTop>
    <layoutLeft></layoutLeft>
    <notelist></notelist>
    <note></note>
    <modalAlert></modalAlert>
    <div class="clear"></div>
</div>
</template>

<script type="text/javascript">
import layoutTop from './layout/layoutTop'
import layoutLeft from './layout/layoutLeft'
import notelist from './layout/notelist'
import note from './layout/note'
import modalAlert from './modal/alert'
import noteItem from './layout/noteItem'

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
        modalAlert,
        noteItem,
    }
  // components: { menu, SystemInformation }
}
</script>

<style type="text/css">
#index {
    /*border-bottom: 1px solid #a0a0a0;*/
}
</style>