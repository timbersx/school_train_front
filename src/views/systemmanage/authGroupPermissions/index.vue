<!--/*
 * @Name: Roles Permissions 
 * @Module: src/views/authGroupPermissions/index
 * @Desc: Manage auth group permissions
 * @Author: Elliot.Wang
 * @Date: 2019-06-14 13:08:14
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-06-10 13:08:14
 * @Param: [Null] [Null]  - Desc Null 
 * @example:
*/-->
<template>
  <div class="app-container">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside style="width:30%;border: 1px solid #eee">
        <el-header>{{$t('authGroup.name')}}</el-header>
        <el-main>
          <el-input
            :placeholder="$t('tree.placeholder')"
            v-model="filterText"
            style="padding-bottom:15px"
          ></el-input>

          <el-tree
            ref="authGroupTree"
            :data="authGroupData"
            node-key="id"
            :props="authGroupDefaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            highlight-current
          ></el-tree> 
        </el-main>
      </el-aside>

      <el-container>
        <el-header>
          <el-button type="primary" @click="handleSave">{{ $t('button.save') }}</el-button>
        </el-header>

        <el-main>
          <el-tree
            :data="menusData"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="menusDefaultProps"
            ref="refAuthGroupMenuTree"
          ></el-tree>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  getAuthGroupList,
  readAuthGroup,
  authGroupUpdateResource} from "@/api/systemmanage/authGroup";
import {getResourceTree} from "@/api/systemmanage/resourceTree";
import { generateTitle } from "@/utils/i18n";
import { debuglog } from 'util';
export default {
  watch: {
    filterText(val) {
      this.$refs.authGroupTree.filter(val);
    }
  },
  data() {
    return {
      filterText: "",
      authGroupData: [],
      authGroupDefaultProps: {
        label: "name"
      },
      menusData: [],
      menusDefaultProps: {
        label: (data, node) => {
          return this.$t(`route.${data.meta.title}`);
        },
        children: "children"
      },
      menusCheckedKeys: [], //菜单选中的节点
      authGroupsCheckedKey: {
        name: "",
        id: ""
      } //角色选中的节点
    };
  },
  created(){
    
        getAuthGroupList({
        limit:100000  
      }).then(response => {
        this.authGroupData = response.data; 
      })

      getResourceTree().then(response=>{
        this.menusData=response.data
      })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) { 
      //点击角色显示该权限已有的菜单
      //刷新menusData
      this.authGroupsCheckedKey = {};
      this.menusCheckedKeys = [];

      this.authGroupsCheckedKey.name = data.name;
      this.authGroupsCheckedKey.id = data.id;

      readAuthGroup(data.id).then(response=>{ 
        this.menusCheckedKeys=response.data.resources 
        this.$refs.refAuthGroupMenuTree.setCheckedKeys(this.menusCheckedKeys)
      })
      
    },
    handleSave() {
      //保存选中菜单到数据库中  
      this.menusCheckedKeys=this.$refs.refAuthGroupMenuTree.getCheckedKeys()
      let errorMessage = "";
      if (this.authGroupsCheckedKey.id.toString() == "") {
        errorMessage += this.$t("message.authGroupCheck") + "<br/>";
      }
      if (this.menusCheckedKeys.length <= 0) {
        errorMessage += this.$t("message.menusCheck");
      }

      if (errorMessage == "") { 
        //let resources=Array.from(this.menusCheckedKeys)
        authGroupUpdateResource(this.authGroupsCheckedKey.id,{resources:this.menusCheckedKeys}).then(response=>{ 
            this.$message.success(this.$t("message.saveSuccess"))
        })


      } else {
        this.$message({
          dangerouslyUseHTMLString: true,
          type: "error",
          message: errorMessage
        });
      }
    }
  }
};
</script>

<style>
.el-header {
  background-color: #f8f8f8;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #dee8f3;
  font-weight: 600;
  white-space: normal;
}
</style>