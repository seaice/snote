<template>
	<ul>
		<slot name="item"
		v-for="item in items"
		:text="item.text">
		<!-- 这里写入备用内容 -->
		备用呢哦让
		<li>aaaa</li>
		</slot>
    </ul>
</template>


<script type="text/javascript">
export default {
    data () {
        return {
            items:[]
        }
    }
}
    
</script>