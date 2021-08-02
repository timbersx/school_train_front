  <!--
      /**
      * @name:公用组件：可编辑树形结构
      * @module:src/components/EtTree
      * @desc:
      * @author:
      * @date:2019-06-05
      * @param {Boolean} [addTop]    - 是否添加根节点，默认true
      * @param {Boolean} [filter]    - 节点是否显示过滤搜索，默认true
      * @param {Boolean} [unshift]    - 节点是否添加在开头，默认false
      * @param {String} [title]    - 添加根节点的按钮文字
      * @param {Object} [treeData] - tree的数据
      * @param {Number} [treeMaxExpandId] - 新增节点开始的ID 
      * @param {Method} [addTopNode] - 添加根节点的方法 
      * @param {Method} [clickNode] - 点击节点的方法
      * @param {Method} [addNode] - 添加子节点的方法 
      * @param {Method} [editNode] - 修改子节点的方法 
      * @param {Method} [delNode] - 删除子节点的方法 
      * @example 
      *  <et-tree 
          title="添加字典类型"
          :addTop=true
          :unshift=true
          :filter=false
          :treeData="treeData" 
          @addTopNode="handleAddTopNode" 
          @addNode="handleAddNode" 
          @editNode="handleEditNode"  
          @clickNode="handleClickNode">
        </et-tree>
          */
       -->
<template>
  <div class="expand">
    <div>
      <div>
        <el-input
          :placeholder="$t('tree.placeholder')"
          v-if="filter"
          v-model="filterText"
          :class="{filters:addTop}"
        ></el-input>
        <el-button
          @click="handleAddTopNode"
          v-if="addTop"
          type="primary"
          class="addTopNode"
          icon="el-icon-plus"
        >{{ title }}</el-button>
      </div>
      <div>
        <el-tree
          ref="expandMenuList"
          class="expand-tree"
          v-if="isLoadingTree"
          :filter-node-method="filterNode"
          :data="setTree"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :expand-on-click-node="false"
          :render-content="renderContent"
          :default-expanded-keys="defaultExpandKeys"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
  </div>
</template> 
<script>
import TreeRender from "./tree_render";
import { debuglog } from "util";

export default {
  name: "et-tree",
  props: {
    addTop:{
  type: Boolean,
      default: () => {
        return true;
      }
    },
    filter:{
  type: Boolean,
      default: () => {
        return true;
      }
    },
    unshift: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    title: {
      type: String,
      default: () => {
        return "";
      }
    },
    treeData: {
      type: Object,
      default: () => {
        return null;
      }
    },
    treeMaxExpandId:{
      type:Number,
      default:()=>{
        return 0
      }
    }
  },
  watch: {
      filterText(val) {
        this.$refs.expandMenuList.filter(val);
      },
    treeData: {
      deep: true,
      handler(nv, ov) {
        this.setTree = nv;
      }
    }
    },
  data() {
    return {
      filterText: '',
      maxexpandId:this.treeMaxExpandId, //新增节点开始id
      non_maxexpandId: this.treeMaxExpandId, //新增节点开始id(不更改)
      isLoadingTree: false, //是否加载节点树
      setTree: [],//this.treeData, //节点树数据
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultExpandKeys: [] //默认展开节点列表
    };
  },
  mounted() { 
    this.initExpand();
  },
  methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
    initExpand() {
      this.setTree.map(a => {
        if (this.unshift) this.defaultExpandKeys.unshift(a.id);
        else this.defaultExpandKeys.push(a.id);
      });
      this.isLoadingTree = true;
    },
    handleNodeClick(d, n, s) {
      //点击节点
      // console.log(d,n)
      d.isEdit = false; //放弃编辑状态
      this.$emit("clickNode", n.data);
    },
    renderContent(h, { node, data, store }) {
      //加载节点
      let that = this;
      return h(TreeRender, {
        props: {
          DATA: data,
          NODE: node,
          STORE: store,
          maxexpandId: that.non_maxexpandId
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
          nodeEditPass: (s, d, n) => that.handleEditPass(s, d, n),
          nodeDel: (s, d, n) => that.handleDelete(s, d, n)
        }
      });
    },
    handleAddTopNode() {
      let node = {
        id: ++this.maxexpandId,
        name: "新增节点",
        pid: "",
        isEdit: false,
        children: []
      };
      if (this.unshift) this.setTree.unshift(node);
      else this.setTree.push(node);
      this.$emit("addTopNode", node);
    },
    handleAdd(s, d, n) {
      //增加节点
      if (n.level >= 6) {
        this.$message.error("最多只支持五级！");
        return false;
      }
      //添加数据
      let node = {
        id: ++this.maxexpandId,
        name: "新增节点",
        pid: d.id,
        isEdit: false,
        children: []
      };
      if (this.unshift) d.children.unshift(node);
      else d.children.push(node);
      //展开节点
      if (!n.expanded) {
        n.expanded = true;
      }

      this.$emit("addNode", node);
    },
    handleEdit(s, d, n) {
      //编辑节点
      console.log(s, d, n);
    },
    handleEditPass(s, d, n) {
      //编辑节点结束
      console.log(s, d, n);
      this.$emit("editNode", n.data);
    },
    handleDelete(s, d, n) {
      //删除节点
      console.log(s, d, n);
      let that = this;
      //有子级不删除
      if (d.children && d.children.length !== 0) {
        this.$message.error("此节点有子级，不可删除！");
        return false;
      } else {
        //新增节点直接删除，否则要询问是否删除
        let delNode = () => {
          let list = n.parent.data.children || n.parent.data, //节点同级数据
            _index = 99999; //要删除的index
          list.map((c, i) => {
            if (d.id == c.id) {
              _index = i;
            }
          });
          let k = list.splice(_index, 1);
          //console.log(_index,k)
          this.$message.success("删除成功！");
          this.$emit("delNode", n.data);
        };
        let isDel = () => {
          that
            .$confirm("是否删除此节点？", "提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              delNode();
            })
            .catch(() => {
              return false;
            });
        };
        //判断是否新增
        d.id > this.non_maxexpandId ? delNode() : isDel();
      }
    }
  }
};
</script>

<style>
.expand {
  width: 100%;
  overflow: hidden;
}
.filters {
  margin-left: 10px;
  float: left;
  width: 45%;
}
.addTopNode {
  margin-left: 10px;
}
.expand > div {
  height: 100%;
  padding-top: 10px;
  overflow-y: auto;
}
.expand > div::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}
.expand > div::-webkit-scrollbar-thumb {
  background-color: rgba(50, 65, 87, 0.5);
  outline: 1px solid slategrey;
  border-radius: 5px;
}
.expand > div::-webkit-scrollbar {
  width: 10px;
}
.expand-tree {
  border: none;
  margin-top: 10px;
}
.expand-tree .el-tree-node.is-current,
.expand-tree .el-tree-node:hover {
  overflow: hidden;
}
.expand-tree .is-current > .el-tree-node__content .tree-btn,
.expand-tree .el-tree-node__content:hover .tree-btn {
  display: inline-block;
}
.expand-tree .is-current > .el-tree-node__content .tree-label {
  font-weight: 600;
  white-space: normal;
}
</style>