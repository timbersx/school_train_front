<!--  -->
<template>
  <div class="app-container">
    <!-- 新增、编辑的dialog -->
    <add-dialog
      :id="fatherMenuId"
      :visible="addDialogvisible"
      :edit-id="editId"
      :is-father="isFather"
      :is-edit="isEdit"
      @update="handleChild"
      @cancel="handleCancelChild"
    />
    <el-container>
      <el-aside class="aside-style">
        <!-- 左侧的树组件 -->
        <el-card v-loading="loading" class="div-style">
          <div slot="header" class="clearfix wider">
            <span>{{ $t('route.systemMenu') }}</span>
            <!-- 新增一级菜单 -->
            <el-button
              class="head_save_btn"
              type="text"
              @click="handleAdd"
            >{{ $t('route.addSystemMenu') }}</el-button>
          </div>
          <el-tree
            ref="dataTree"
            :node-key="nodeKey"
            :props="defaultProps"
            :data="treeData"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          />
        </el-card>

      </el-aside>
      <el-main>
        <!-- 系统菜单详情 -->
        <el-row>
          <el-form
            label-width="150px"
            label-suffix=":"
          >
            <el-card v-loading="loading">
              <div slot="header" class="clearfix">
                <span class="wider">{{ $t('route.systemMenuDetail') }}</span>
              </div>
              <!-- <div v-if="true" class="father"> -->
              <div>
                <el-row>
                  <!-- 上级菜单 -->
                  <el-col :span="8">
                    <el-form-item :label="$t('route.fatherSystemMenu')">
                      <span>{{ detailData.parentName }}</span>
                    </el-form-item>
                  </el-col>
                  <!-- 菜单名称 -->
                  <el-col :span="8">
                    <el-form-item :label="$t('route.systemMenuName')">
                      <span>{{ detailData.name }}</span>
                    </el-form-item>
                  <!-- 代码 -->
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('route.code')">
                      <span>{{ detailData.code }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <!-- 菜单路由 -->
                  <el-col :span="16">
                    <el-form-item :label="$t('route.menuRoute')">
                      <span>{{ detailData.component }}</span>
                    </el-form-item>
                  </el-col>
                  <!-- 菜单文件地址 -->
                  <el-col :span="16">
                    <el-form-item :label="$t('route.menuLocation')">
                      <span>{{ detailData.path }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="right-button-group" style="padding-top: 0">
                    <!-- 详情的编辑、删除按钮 -->
                    <el-button
                      type="primary"
                      @click="handleEdit"
                    >{{ $t('button.edit') }}</el-button>
                    <el-button @click="handleDelete">{{ $t('button.delete') }}</el-button>
                  </el-col>
                </el-row>

              </div>

            </el-card>
          </el-form>
          <!-- 子系统菜单 -->
        </el-row>
        <el-row class="bottom">
          <el-card id="cardId">
            <div slot="header" class="clearfix">
              <span class="wider">{{ $t('route.childsystemMenu') }}</span>
            </div>
            <el-button
              class="addBtn"
              type="primary"
              @click="addChildMenu"
            >{{ $t('route.addChildSystemMenu') }}</el-button>
            <!-- 表格区域 -->
            <el-table
              v-loading="loading"
              style="width: 100%"
              border
              :stripe="true"
              :data="tableData"
            >
              <el-table-column
                prop="parentName"
                :label="$t('route.fatherSystemMenu')"
              />
              <el-table-column prop="name" :label="$t('route.systemMenuName')" />

              <el-table-column prop="code" :label="$t('route.code')" />
              <el-table-column prop="component" :label="$t('route.menuRoute')" />
              <el-table-column prop="path" :label="$t('route.menuLocation')" />
              <el-table-column :label="$t('table.actions')" width="100">
                <template slot-scope="scope">
                  <!-- <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button> -->
                  <!-- 表格内的编辑按钮 -->
                  <el-button
                    type="text"
                    @click="handleEdit(scope.row.id)"
                  >{{ $t('button.edit') }}</el-button>
                  <el-button
                    type="text"
                    style="color:red"
                    @click="handleDelete(scope.row.id)"
                  >{{ $t('button.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 页码 -->
            <!-- <el-pagination
              background
              :page-sizes="listParameters.pageSizes"
              layout="total, sizes, prev, pager, next, jumper"
              :total="listParameters.total"
              class="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            /> -->

          </el-card>
        </el-row>

      </el-main>

    </el-container>
  </div>
</template>

<script>
// import EtEvaluateTree from '@/components/EtEvaluateTree'
import AddDialog from './operations/add'
import { getResourceTree, getMenuList, deleteMenuInformation } from '@/api/systemmanage/resourceTree'

export default {

  components: { AddDialog },
  data() {
    return {
      loading: false,
      nodeKey: 'id',
      editId: -1,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedKeys: 1,
      detailData: {},
      tableData: [],
      treeData: [],
      isEdit: false,
      fatherMenuId: -1,
      isFather: false,
      addDialogvisible: false
    //   treeProps: {
    //     children: 'children',
    //     label: 'title'
    //   }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 根据某个id,获取上级的父菜单的名称
    // getFatherName
    // 刷新数据
    update() {
      getResourceTree().then(res => {
        // 寻找根目录
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].name === '根目录') {
            this.treeData = res.data[index].children
            break
          }
        }
        // this.treeData = res.data[2].children
        // 遍历，删除第三层数据，只展示两层数据
        this.loading = false
        for (var index in this.treeData) {
          for (var j in this.treeData[index].children) {
            delete this.treeData[index].children[j].children
          }
        }
        this.defaultCheckedKeys = this.treeData[0]
        // 初始化的时候，设置点击事件
        this.$nextTick(function() {
          this.$refs.dataTree.setCurrentKey(this.defaultCheckedKeys.id)
          this.handleNodeClick(this.defaultCheckedKeys)
        })
      })
    },
    handleDelete(value) {
      if (typeof value !== 'number') {
        value = this.detailData.id
      }
      // 调用删除的接口
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        deleteMenuInformation(value).then(() => {
          // this.$message.success('成功')

          // 刷新数据
          this.update()
        })
      })
    },
    init() {
      this.loading = true
      getResourceTree().then(res => {
        // 寻找根目录
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].name === '根目录') {
            this.treeData = res.data[index].children
            break
          }
        }
        // this.treeData = res.data[2].children
        // 遍历，删除第三层数据，只展示两层数据
        this.loading = false
        for (var index in this.treeData) {
          for (var j in this.treeData[index].children) {
            delete this.treeData[index].children[j].children
          }
        }
        this.defaultCheckedKeys = this.treeData[0]
        // 初始化的时候，设置点击事件
        this.$nextTick(function() {
          this.$refs.dataTree.setCurrentKey(this.defaultCheckedKeys.id)
          this.handleNodeClick(this.defaultCheckedKeys)
        })
      })
    },

    //  编辑按钮
    handleEdit(value) {
      if (typeof value !== 'number') {
        // 是详情的额编辑按钮
        value = this.detailData.id
      }
      this.editId = value
      this.addDialogvisible = true
      this.isEdit = true
    },
    handleCancelChild() {
      this.addDialogvisible = false
    },
    // 新建一级系统菜单
    handleAdd() {
      this.isEdit = false
      this.isFather = true
      this.addDialogvisible = true
    },
    // 新建子系统菜单的按钮
    addChildMenu() {
      this.isEdit = false
      this.isFather = false
      this.addDialogvisible = true
    },
    // dialog点击了确定
    handleChild() {
      this.loading = true
      this.addDialogvisible = false
      // 刷新数据
      this.update()
    },
    // 左侧的节点点击事件
    async  handleNodeClick(value) {
      this.loading = true;
      value = value.id
      for (var index in this.treeData) {
        if (this.treeData[index].id === value) {
          // 是外层的一级菜单,需要将该名称赋值给children内的各个值
          await getMenuList({
            'id': this.treeData[index].parent_id
          }).then(res => {
            this.treeData[index].parentName = res.data[0].name
            for (let j = 0; j < this.treeData[index].children.length; j++) {
              this.treeData[index].children[j].parentName = this.treeData[index].name
            }
            this.detailData = this.treeData[index]
            this.tableData = this.treeData[index].children
            this.loading = false;
          })
        } else {
          // 在第二层内进行寻找
          for (var j in this.treeData[index].children) {
            if (this.treeData[index].children[j].id === value) {
              await getMenuList({
                'id': this.treeData[index].children[j].parent_id
              }).then(res => {
                this.treeData[index].children[j].parentName = res.data[0].name
                this.detailData = this.treeData[index].children[j]
                this.tableData = []
                this.loading = false;
              })
              // this.detailData = this.treeData[index].children[j]
              // this.tableData = []
            }
          }
        }
      }
      this.fatherMenuId = value
      //   发起请求
    }

  }
}

</script>
<style lang='scss' scoped>
.el-main{
    padding-top: 0;
}
.bottom {
  margin-top: 20px;
}
.addBtn {
  margin-bottom: 20px;
}
.head_save_btn {
  float: right;
  padding: 0;
}
.right-button-group{
    padding-bottom: 0;
}
.pagination{
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0;

}
.aside-style{
  position: relative;
}
.div-style{
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: scroll;
}
.el-main{
  padding-bottom: 0;
}
.wider{
  font-weight: bolder;
}
</style>
