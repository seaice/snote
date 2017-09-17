<template>
  <li class="l-window__control" @click="func()"><i class="fa fa-window-close-o" aria-hidden="true"></i></li>
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
