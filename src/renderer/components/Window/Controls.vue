<template>
  <ul class="l-window__controls" style="-webkit-app-region: no-drag">
    <config :func="config"></config>
    <minimize :func="minimize"></minimize>
    <maximize :func="maximize"></maximize>
    <close :func="close"></close>
</ul>
</template>

<script>
import Close from './Controls/Close'
import Maximize from './Controls/Maximize'
import Minimize from './Controls/Minimize'
import Config from './Controls/Config'
const ipcRenderer = require('electron').ipcRenderer

export default {
    components: {
        Close,
        Maximize,
        Minimize,
        Config,
    },
    methods: {
        close (e) {
            ipcRenderer.send('note:window:close', true)
        },
        maximize (e) {
            ipcRenderer.send('note:window:maximize')
        },
        minimize (e) {
            ipcRenderer.send('note:window:minimize', true)
        },
        config (e) {
            
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
        cursor: pointer;
        float:left;
        padding: 0;
        margin: 0;
        font-size: 14px;
        display: block;
        margin: 0 15px 0 0;
    }
    &__control i {
        color:#ddd;
    }
    &__control i:hover {
        color: #fff;
    }
}

</style>
