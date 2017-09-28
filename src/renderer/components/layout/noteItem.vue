<template>
	<div v-if="items.length > 0">
		<ul>
			<slot name="item"
				v-for="item in items"
				:item="item">
			</slot>
	    </ul>
    </div>
    <div v-else="items.length <= 0 ">
    	// todo 没记录显示的内容
	</div>
</template>


<script type="text/javascript">
export default {
    data () {
        return {
            items:[{
            	title: 'test',
            	type: 2,
            	belong: null,
            	createtime: '2017-09-28',
            	size: '11b'
            }]
        }
    }
}
    
</script>