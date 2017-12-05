<template>
<div id="index">
    <layoutTop></layoutTop>
    <layoutLeft></layoutLeft>
    <notelist></notelist>
    <note></note>
    <modalAlert></modalAlert>
    <modalLoading></modalLoading>
    <div class="clear"></div>
</div>
</template>

<script type="text/javascript">
import layoutTop from './layout/layoutTop'
import layoutLeft from './layout/layoutLeft'
import notelist from './layout/notelist'
import note from './layout/note'
import noteItem from './layout/noteItem'
import modalAlert from './modal/alert'
import modalLoading from './modal/loading'

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
        noteItem,
        modalAlert,
        modalLoading,
    },
    mounted() {
    }
}
</script>

<style type="text/css">
#index {
    overflow: hidden;
    border-bottom: 1px solid #a0a0a0;
}
</style>