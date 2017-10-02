<template>
	<div v-if="items" class="list">
		<ul>
			<slot name="item"
				v-for="item in items"
				:item="item">
			</slot>
	    </ul>
        has value : {{ items }}

    </div>
    <div v-else="items ">
    	todo 没记录显示的内容
        {{ items }}
	</div>
</template>


<script type="text/javascript">
export default {
    data () {
        return {
           items:[]
        }
    }
    ,mounted (){
        this.$bus.$on("note:list:init",this.initNoteList);
        // this.$bus.$on('note:addNote', function(rst){
        //     console.log("rst: ", rst);

        // })
    }
    ,methods:{
        initNoteList:function(data){
            this.items = data;
        }
        
    }
}
    
</script>
