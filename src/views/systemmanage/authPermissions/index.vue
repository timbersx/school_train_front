<!--/*
 * @Name: Roles Permissions 
 * @Module: src/views/authPermissions/index
 * @Desc: Manage auth permissions
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
        <el-header>{{$t('auth.nick_name')}}</el-header>
        <el-main>
          <el-input
            :placeholder="$t('tree.placeholder')"
            v-model="filterText"
            style="padding-bottom:15px"
          ></el-input>

          <el-tree
            ref="authTree"
            :data="authData"
            node-key="id"
            :props="authDefaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            highlight-current
          >
          
          </el-tree>
          <el-pagination
            background
            :current-page.sync="listParameters.page"
            layout="total, prev, pager, next"
            :total="listParameters.total"
            class="pagination-container"
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
            <!-- :page-sizes="20" -->

        </el-main>
      </el-aside>

      <el-container>
        <el-header>
          <el-button
            type="primary"
            @click="handleSave"
          >{{ $t('button.save') }}</el-button>
        </el-header>

        <el-main>
          <el-tree
            :data="menusData"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="menusDefaultProps"
            ref="authPermissionsMenuTree"
          ></el-tree>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getAuthList, authUpdateResource, readAuth } from "@/api/systemmanage/auth"
import { getResourceTree } from "@/api/systemmanage/resourceTree"
import { generateTitle } from "@/utils/i18n"
import { debuglog } from "util"
import { exactSearchFilterData } from '@/utils/exactSearchFilter'
export default {
    watch: {
        filterText(val) {
            this.$refs.authTree.filter(val);
        }
    },
    data() {
        return {
            filterText: "",
            authData: [],
            authDefaultProps: {
                label: "nick_name"
            },
            menusData: [],
            menusDefaultProps: {
                label: (data, node) => {
                    return this.$t(`route.${data.meta.title}`);
                },
                children: "children"
            },
            menusCheckedKeys: [], //菜单选中的节点
            authCheckedKey: {
                nick_name: "",
                id: ""
            }, //角色选中的节点
            listParameters: {
              total: 0, // 数据总数,默认为0
              // pageSizes: [10, 20, 50, 100, 200],
              page: 1,
              limit: 20
            },
            apiQueryData: {
        limit: 20,
        offset: 0
      },
        };
    },
    created() {
        this.getListData(); 

        getResourceTree().then(response => {
            this.menusData = response.data
        })
    },
    methods: {
        filterNode(value, data) {
          if(value !== this.apiQueryData.search){
            this.apiQueryData.search = value
            this.apiQueryData.limit = 20
            this.apiQueryData.offset = 0
          this.getListData()
          }
        },
        getListData(){
          getAuthList( 
             this.apiQueryData
        ).then(response => {
          if(response.count > 0){
            this.listParameters.total = response.count
            this.authData = response.data
          }
          
        })
        },
        handleNodeClick(data) {
            //点击角色显示该权限已有的菜单
            //刷新menusData
            this.authCheckedKey = {}
            this.menusCheckedKeys = []//这里要换掉

            this.authCheckedKey.nick_name =data.user_name +'('+ data.nick_name+')'
            this.authCheckedKey.id = data.id
            readAuth(data.id).then(response => {
                this.menusCheckedKeys = response.data.user_resource
                this.$refs.authPermissionsMenuTree.setCheckedKeys(this.menusCheckedKeys)
            })


        },
        handleSave() {
            //保存选中菜单到数据库中
            this.menusCheckedKeys = this.$refs.authPermissionsMenuTree.getCheckedKeys()
            let errorMessage = "";
            if (this.authCheckedKey.id.toString() == "") {
                errorMessage += this.$t("message.autCheck") + "<br/>";
            }
            if (this.menusCheckedKeys.length <= 0) {
                errorMessage += this.$t("message.menusCheck");
            }
            if (errorMessage == "") {
                authUpdateResource(this.authCheckedKey.id, { user_resource: this.menusCheckedKeys }).then(response => {
                    this.$message.success(this.$t("message.saveSuccess"))
                }).catch(e=>{
                  console.log(e)
                })
            } else {
                this.$message({
                    dangerouslyUseHTMLString: true,
                    type: "error",
                    message: errorMessage
                });
            }
        },
        handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getListData()
    },
        handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset = this.listParameters.limit * (this.listParameters.page - 1)
      this.getListData()
    },
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