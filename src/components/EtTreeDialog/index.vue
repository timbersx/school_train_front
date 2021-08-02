  <!--
      /**
      * @name:公用组件：可编辑树形结构，点击新增，编辑弹出dialog，在dialog中操作
      * @module:src/components/EtTreeDialog
      * @desc:
      * @author:
      * @date:2019-06-12
      * @param {Boolean} [addTop]    - 是否添加根节点，默认true
      * @param {Boolean} [filter]    - 节点是否显示过滤搜索，默认true
      * @param {Boolean} [unshift]    - 节点是否添加在开头，默认false
      * @param {String} [title]    - 添加根节点的按钮文字
      * @param {Object} [treeData] - tree的数据,数据中包含的字段必须包含id,name,parent_id
      * @param {Array} [dialogItem] - 展示在弹出的Dialog中的项目，传入的格式为:
                                      [
                                        {
                                          name:'item-name1',
                                          key:'item-key1',
                                          value:'',
                                          rule:[{ required: true,
                                                   message: this.$t("validate.required"),
                                                   trigger: "blur"}]
                                        }.....]
      
      * @param {String} [showKey]    - 在节点上需要显示内容的字段值，如dialogItem中的name 
      * @param {Object} [disableItem] - 禁止编辑的判断字段，格式为:{key:'item-key',value''}
      * @param {Number} [treeMaxExpandId] - 新增节点开始的ID 
      * @param {Method} [clickNode] - 点击节点的方法
      * @param {Method} [addNode] - 添加子节点的方法 
      * @param {Method} [editNode] - 修改子节点的方法 
      * @param {Method} [delNode] - 删除子节点的方法 
      * @example 
      *   <et-tree-dialog
          :title="$t('dataDictionary.treeTitle')"
          :treeData="treeData"
          :unshift="true"
          :filter="true"
          :dialogItem="treeDialogItem"
          showKey="name"
          :disableItem="disableItem"
          @clickNode="handleClickTypeNode"
          @addNode="handleAddTypeNode"
          @editNode="handleEditTypeNode"
          @delNode="handleDelTypeNode"
          style="padding-top:10px"
        ></et-tree-dialog>
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
          default-expand-all
          @node-click="handleNodeClick"
        ></el-tree>
      </div>

      <el-dialog
        :visible.sync="dialogFormVisible"
        :title="textMap[dialogStatus]"
      >
        <el-form
          ref="etTreeDialogDataForm"
          :model="dialogData"
          label-width="100px"
        >
          <el-form-item
            :label="$t('tree.parentNode')"
            v-if="JSON.stringify(parentNode) != '{}'"
          >{{parentNode.name}}</el-form-item>
          <el-form-item
            v-for="(item,index) in dialogData.items"
            :label="item.name"
            :key="item.key"
            :prop="`items.${index}.value`"
            :rules="item.rule"
          >
            <el-input
              v-model="item.value"
              :disabled="inputDisabled"
            ></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
          v-show="!inputDisabled"
        >
          <el-button @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?handleAddData():handleUpdateData()"
          >{{ $t('button.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template> 
<script>
import TreeRender from "./tree_render";
import { debuglog } from "util";

export default {
  name: "et-tree",
  props: {
    treeData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    addTop: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    filter: {
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
    dialogItem: {
      type: Array,
      default: () => {
        return [];
      }
    },
    showKey: {
      type: String,
      default: () => {
        return "";
      }
    },
    disableItem: {
      type: Object,
      default: () => {
        return null;
      }
    },
    treeMaxExpandId: {
      type: Number,
      default: () => {
        return 0;
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
      filterText: "",
      maxexpandId: this.treeMaxExpandId, //新增节点开始id
      non_maxexpandId: this.treeMaxExpandId, //新增节点开始id(不更改)
      isLoadingTree: false, //是否加载节点树
      setTree: [], //this.treeData, //节点树数据
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultExpandKeys: [], //默认展开节点列表

      dialogStatus: "",
      textMap: {
        update: this.$t("button.edit"),
        create: this.$t("button.add")
      },
      dialogFormVisible: false, //是否展示dialog
      dialogData: {
        items: []
      }, //dialog中的项目
      parentNode: {}, //上级节点
      currentNode: null, //当前节点
      inputDisabled: false //dialog中的input禁止编辑，默认flase
    };
  },
  created() {
    this.dialogData.items = this.dialogItem;
  },
  mounted() {
    this.initExpand();
  },
  methods: {
    filterNode(value, data) {
      //关键字过滤
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    initExpand() {
      //初始化展开
      this.setExpandKeys(this.setTree);
      this.isLoadingTree = true;
    },
    setExpandKeys(obj) {
      //循环所有节点，将id加入到需要扩展到节点中
      obj.forEach(item => {
        if (item.children.length > 0) {
          this.setExpandKeys(item.children);
        } else {
          this.defaultExpandKeys.push(item.id);
        }
      });
    },
    handleNodeClick(d, n, s) {
      //点击节点
      this.$emit("clickNode", n.data);
    },
    renderContent(h, { node, data, store }) {
      //鼠标划过的节点显示的新增删除修改图标
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
          nodeDel: (s, d, n) => that.handleDelete(s, d, n)
        }
      });
    },
    handleAddTopNode() {
      //添加子节点事件
      this.currentNode = null;
      this.parentNode = {};
      this.inputDisabled = false;
      this.openDialog("create");
      // this.dialogStatus = "create"
      // this.dialogFormVisible = true
      // this.resetDialogData()
      // this.resetParentNode()
      // this.$nextTick(() => {
      //   this.$refs["etTreeDialogDataForm"].clearValidate()
      // })
    },
    openDialog(status) {
      //弹出Dialog
      this.resetDialogData();
      this.resetParentNode();
      this.dialogStatus = status;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["etTreeDialogDataForm"].clearValidate();
      })
    },
    handleAdd(s, d, n) {
      this.inputDisabled = false;
      //增加节点
      if (n.level >= 6) {
        this.$message.error("最多只支持五级！");
        return false;
      }
      this.openDialog("create");
      Object.assign(this.parentNode, d); //必须用Object.assign，否则会因为双向绑定造成tree中显示的数据错误
      this.currentNode = n;
    },
    handleEdit(s, d, n) { 
      //编辑节点
      this.openDialog("update");
      //获取节点数据
      this.dialogData.items.forEach(item => {
        item.value = d[item.key];
      });

      if (d[this.disableItem.key] == this.disableItem.value)
        this.inputDisabled = true;
      else this.inputDisabled = false;

      //编辑节点
      if (d.parent_id != "") {
        this.getParentNode(this.setTree, d.parent_id);
      } else {
        this.parentNode = {};
      }
      this.currentNode = n;
    },
    handleDelete(s, d, n) {
      //删除节点
      let that = this;
     if (d[this.disableItem.key] == this.disableItem.value)
      { 
        this.$message.error(this.$t('tree.disableDeleteWaring'));
        return false;
      }
      //有子级不删除
      if (d.children && d.children.length !== 0) {
        this.$message.error(this.$t('tree.hasChildrenDeleteWaring'));
        return false;
      } else {
        //新增节点直接删除，否则要询问是否删除
        // let delNode = () => {
        //   let list = n.parent.data.children || n.parent.data, //节点同级数据
        //     _index = 99999; //要删除的index
        //   list.map((c, i) => {
        //     if (d.id == c.id) {
        //       _index = i;
        //     }
        //   });
        //   let k = list.splice(_index, 1);
        //   this.$message.success(this.$t("confirm.deleteSucced"));
        //   this.$emit("delNode", n.data);
        // };
        // let isDel = () => {
        //   that
        //     .$confirm(this.$t("confirm.delete"), this.$t("confirm.warning"), {
        //       confirmButtonText: this.$t("button.confirm"),
        //       cancelButtonText: this.$t("button.cancel"),
        //       type: "warning"
        //     })
        //     .then(() => {
        //       delNode();
        //     })
        //     .catch(() => {
        //       return false;
        //     });
        // };
        // //判断是否新增
        // d.id > this.non_maxexpandId ? delNode() : isDel();

              that.$confirm(this.$t("confirm.delete"), this.$t("confirm.warning"), {
              confirmButtonText: this.$t("button.confirm"),
              cancelButtonText: this.$t("button.cancel"),
              type: "warning"
            })
            .then(() => {
              this.$emit("delNode", n.data);
            })
            .catch(() => {
              return false;
            });
      }
    },

    resetDialogData() {
      this.dialogData.items.forEach(item => {
        item.value = "";
      });
    },
    resetParentNode() {
      if (JSON.stringify(this.parentNode) != "{}") {
        this.parentNode.id = "";
        this.parentNode.name = "";
      }
    },
    handleAddData() {
      //新增时，Dialog中的确定按钮事件
      this.$refs["etTreeDialogDataForm"].validate(valid => {
        if (valid) {
          let node = this.getAddOrEditNodeData();
          if (JSON.stringify(this.parentNode) === "{}") {
            //添加根节点
            if (this.unshift) this.setTree.unshift(node);
            else this.setTree.push(node);
          } else {
            //添加子节点
            if (this.unshift) this.parentNode.children.unshift(node);
            else this.parentNode.children.push(node);
            //展开节点
            if (!this.currentNode.expanded) {
              this.currentNode.expanded = true;
            }
          }
            this.$emit("addNode", node);

          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    handleUpdateData() {
      //编辑时，Dialog中的确定按钮事件
      this.$refs["etTreeDialogDataForm"].validate(valid => {
        if (valid) {
          let node = this.getAddOrEditNodeData();
          this.dialogData.items.forEach(item => {
            this.currentNode.data[item.key] = item.value;
          });
          node['id']=this.currentNode.data.id
          this.$emit("editNode", node);

          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    getAddOrEditNodeData() {
      //新增、编辑节点的数据结构
      let nodeName = "";
      this.dialogData.items.forEach(item => {
        if (item.key.toLowerCase() == this.showKey.toLowerCase())
          nodeName = item.value;
      });

      let node = {
        name: nodeName,
        parent_id:
          JSON.stringify(this.parentNode) === "{}" ? "" : this.parentNode.id,
        nodeData: this.dialogData.items,
        children: []
      };
      return node;
    },
    getParentNode(obj, parent_id) {
      //点击节点的编辑，递归获取上一级节点信息
      obj.forEach(item => {
        if (item.id == parent_id) {
          Object.assign(this.parentNode, item);
        } else {
          if (item.children.length > 0) {
            this.getParentNode(item.children, parent_id);
          }
        }
      });
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