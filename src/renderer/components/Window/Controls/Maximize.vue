<template>
    <li class="l-window__control" @click="func()"><i class="fa"  v-bind:class="[ isMax ? 'fa-window-restore':'fa-window-maximize']" aria-hidden="true"></i>

    </li>

</template>

<script>
export default {
    data () {
        return {
            // isMax: this.$store.state.Window.isMax,
        }
    },
    computed: {
        isMax() {
            return this.$store.state.Window.isMax
        }
    },
    props: {
        func: Function
    }
}
</script>

<style>
</style>
