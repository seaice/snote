<template>
  <ul class="l-window__controls">
    <minimize :func="minimize"></minimize>
    <maximize :func="maximize"></maximize>
    <close :func="close"></close>
  </ul>
</template>

<script>
import Close from './Controls/Close'
import Maximize from './Controls/Maximize'
import Minimize from './Controls/Minimize'
const ipcRenderer = require('electron').ipcRenderer

export default {
  components: {
    Close,
    Maximize,
    Minimize
  },
  methods: {
    close (e) {
      ipcRenderer.send('note:window:close', true)
    },
    maximize (e) {
      ipcRenderer.send('note:window:maximize', true)
    },
    minimize (e) {
      ipcRenderer.send('note:window:minimize', true)
    }
  },
  name: 'controls'
}
</script>

<style lang="scss">

.l-window {
    &__controls {
        float: right;
        list-style: none;
        user-select: none;    
    }

    &__control {
        color: #eee;
        cursor: pointer;
        float:left;
        padding: 0;
        margin: 0;
        font-size: 12px;
        display: block;
        margin: 0 15px 0 0;
    }
    &__control:hover {
        color: #fff;
    }
}

</style>
