<template>
    <div id="index">
        <layoutTop></layoutTop>
        {{ msg }}
        <!-- <SystemInformation></SystemInformation> -->
    </div>
</template>

<script type="text/javascript">
import layoutTop from './layout/layoutTop'
// import SystemInformation from './LandingPage/SystemInformation'


export default {
  data () {
    return {
      msg: 'Hello Vue!2'
    }
  },
  components: { layoutTop }
  // components: { menu, SystemInformation }
}
</script>

<style type="text/css">
    * {
        margin:0;
    }

    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
</style>