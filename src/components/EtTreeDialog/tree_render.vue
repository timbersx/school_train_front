
<template>
	<span class="tree-expand"> 
		<span v-show="true" 
		:class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
			<span>{{DATA.name}}</span>
		</span>
		<span class="tree-btn" v-show="true">
			<i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
			<i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
			<i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
		</span>
	</span>
</template>

<script>
	export default{
		name: 'treeExpand',
		props: ['NODE', 'DATA', 'STORE', 'maxexpandId'],
		methods: {
			nodeAdd(s,d,n){//新增
				this.$emit('nodeAdd',s,d,n)
			},
			nodeEdit(s,d,n){//编辑
				// d.isEdit = true;
				// this.$nextTick(() => {
				// 	this.$refs['treeInput'+d.id].$refs.input.focus()
				// })
				this.$emit('nodeEdit',s,d,n)
			},
			nodeDel(s,d,n){//删除
				this.$emit('nodeDel',s,d,n)
			}, 
			nodeEditFocus(){
				//阻止点击节点的事件冒泡
			},
		}
	}
</script>

<style>
	.tree-expand{
		overflow:hidden;
	}
	.tree-expand .tree-label.tree-new{
		font-weight:600;
	}
	.tree-expand .tree-label{
		font-size:0.9em;
	}
	.tree-expand .tree-label .edit{
		width:80%;
	}
	.tree-expand .tree-btn{
		display:none;
		float:right;
		margin-left:10px;
	}
	.tree-expand .tree-btn i{
		color:#8492a6;
		font-size:0.9em;
		margin-left:3px;
	}
</style>