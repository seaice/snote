<template>
  <div id="index">
    <layoutTop></layoutTop>
    <div class="clear"></div>
    <layoutLeft></layoutLeft>
   </div>
</template>

<script type="text/javascript">
import layoutTop from './layout/layoutTop'
import layoutLeft from './layout/layoutLeft'
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
    }
  // components: { menu, SystemInformation }
}
</script>

<style type="text/css">

</style>