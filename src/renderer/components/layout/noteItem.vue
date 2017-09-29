<template>
	<div v-if="items.length > 0" class="list">
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
            items:[]
        }
    }
    ,
    mounted (){
        this.$bus.$on('getNoteList', function(rst){
            console.log("rst: ", rst);

        })
    }
}
    
</script>
