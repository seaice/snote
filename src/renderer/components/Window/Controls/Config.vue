<template>
  <li class="l-window__control" @click="func()"><i class="fa fa-cog" aria-hidden="true"></i></li>
</template>

<script>
export default {
    props: {
        func: Function
    }
}
</script>

<style>
</style>
