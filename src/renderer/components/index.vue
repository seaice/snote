<template>
  <div id="index">
    <layoutTop></layoutTop>
    <div class="clear"></div>
    <layoutLeft></layoutLeft>
    <notelist></notelist>
   </div>
</template>

<script type="text/javascript">
import layoutTop from './layout/layoutTop'
import layoutLeft from './layout/layoutLeft'
import notelist from './layout/notelist'
// import SystemInformation from './LandingPage/SystemInformation'


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
    }
  // components: { menu, SystemInformation }
}
</script>

<style type="text/css">

</style>