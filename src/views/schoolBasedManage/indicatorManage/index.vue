<!--/*
 * @Name: indicatorManage
 * @Module:  src/views/indicatorManage
 * @Desc: indicatorManage
 * @Author:  automatic code
 * @Date:  2021-01-25 13:45:38
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->
<template>
  <div class="app-container">
    <add-dialog
      :node-id="nodeId"
      :visible="addDialogVisible"
      @update="addSuccessFirst"
      @cancel="handleDialogCancel"
    />
    <edit-dialog
      :node-id="nodeId"
      :visible="editDialogVisible"
      @update="addSuccess"
      @cancel="handleDialogCancel"
    />
    <el-container style="margin-top: 20px">
      <!-- 侧边，指标项的树形数据 -->
      <el-aside class="aside-style" style="height: 82vh">
        <el-card class="asideCard-style">
          <div slot="header" class="clearfix">
            <span class="titleStyle">{{ $t('evaluationStandardManage.pointerItem') }}</span>
            <el-button
              v-if="showBtn"
              class="head_save_btn"
              type="text"
              @click="handleAdd"
            >{{ $t('indicatorManage.add') }}</el-button>
          </div>
          <!-- 树形控件 -->
          <el-tree
            ref="dataTree"
            v-loading="loading"
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
      <!-- 左侧部分 -->
      <el-main>
        <el-row>
          <!-- 左上详情部分 -->
          <el-form label-width="100px" label-suffix=":" v-loading="loading">
            <el-card style="height: 239px">
              <div slot="header" class="clearfix">
                <span class="titleStyle">{{ $t('indicatorManage.detail') }}</span>
              </div>
              <div v-if="treeData.length > 0">
                <!-- 上级指标 -->
                <el-col :span="8">
                  <el-form-item :label="$t('indicatorManage.parent')">
                    <span>{{ indicatorInformation.fatherIndicatorName }}</span>
                  </el-form-item>
                </el-col>
                <!-- 项目名称 -->
                <el-col :span="8">
                  <el-form-item :label="$t('indicatorManage.name')">
                    <span>{{ indicatorInformation.name }}</span>
                  </el-form-item>
                </el-col>
                <!-- 监测分值 -->
                <el-col :span="8">
                  <el-form-item :label="$t('indicatorManage.monitorScore')">
                    <span>{{ indicatorInformation.score }}</span>
                  </el-form-item>
                </el-col>
                <!-- 排序 -->
                <el-col :span="8">
                  <el-form-item :label="$t('indicatorManage.order_no')">
                    <span>{{ indicatorInformation.order_no }}</span>
                  </el-form-item>
                </el-col>
                <!-- 说明 -->
                <el-col :span="12">
                  <el-form-item :label="$t('indicatorManage.desc')">
                    <span>{{ indicatorInformation.desc }}</span>
                  </el-form-item>
                </el-col>
                <!-- 两个按钮 -->
                <el-col class="right-button-group">
                  <el-button
                    v-if="showBtn"
                    type="primary"
                    @click="handleDetailEdit(indicatorInformation)"
                  >{{ $t('button.edit') }}</el-button>
                  <!-- 删除按钮 -->
                  <el-button v-if="showBtn" @click="handleDetailDelete">{{ $t('button.delete') }}</el-button>
                </el-col>
              </div>
              <div
                v-if="treeData.length === 0"
                class="noIndicatorInfo"
              >{{ $t('indicatorManage.noneData') }}</div>
            </el-card>
          </el-form>
        </el-row>

        <!-- 左下的表格部分 -->
        <el-row>
          <el-card class="leftBottom" v-loading="loading" style="height: 55.3vh">
            <div slot="header" class="clearfix">
              <span class="titleStyle">{{ $t('indicatorManage.childItem') }}</span>
              <span
                class="tableTitle"
              >{{ $t('indicatorManage.leftIndicator') }}:{{ indicatorInformation.score_left }} 分，</span>
            </div>
            <el-button
              v-if="showBtn&&treeData.length !== 0"
              class="tableBtn"
              type="primary"
              @click="handleAddChild(indicatorInformation)"
            >{{ $t('indicatorManage.addChildItem') }}</el-button>

            <el-table :data="tableData" style="width: 100%" border :stripe="true">
              <el-table-column prop="name" :label="$t('indicatorManage.childItemName')" />
              <el-table-column prop="score" :label="$t('indicatorManage.monitorScore')" />
              <el-table-column prop="order_no" :label="$t('indicatorManage.order_no')" />
              <el-table-column prop="desc" :label="$t('indicatorManage.meaning')" />
              <el-table-column :label="$t('table.actions')" width="100">
                <!-- 表格内的两个按钮 -->
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleChildEdit(scope)"
                  >{{ $t('button.edit') }}</el-button>
                  <el-button
                    style="color:red"
                    type="text"
                    @click="handleChildDelete(scope)"
                  >{{ $t('button.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import {
  getTreeData,
  getIndicatorinfo,
  readIndicatorinfo,
  delIndicatorinfo
} from '@/api/schoolBasedManage/indicatorManage'
import AddDialog from './operations/add'
import EditDialog from './operations/edit'

export default {
  components: { AddDialog, EditDialog },
  data() {
    return {
      showBtn: true,
      currentFlow: [],
      nodeId: -1,
      editDialogVisible: false,
      addDialogVisible: false,
      tableQuery: { limit: 100000 },
      nodeKey: 'key',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      treeData: [],
      indicatorInformation: {},
      tableData: [],
      loading: false,
      defaultCheckedKeys: -1,
      nodeData: {}
    }
  },
  created(){
    this.getTreeDataInformation()
  },
  methods: {
    handleDialogCancel() {
      this.addDialogVisible = false
      this.editDialogVisible = false
    },
    addSuccess() {
      this.addDialogVisible = false
      this.editDialogVisible = false
      // 刷新数据,包括树形数据，详情数据，表格数据
      this.getTreeCurrentDataInformation()
    },
    addSuccessFirst() {
      this.addDialogVisible = false
      this.editDialogVisible = false
      // 刷新数据,包括树形数据，详情数据，表格数据
      if(Object.keys(this.nodeData).length === 0) {
       this.getTreeDataInformation() 
      } else {
        this.getTreeCurrentDataInformation()
      }
    },
    // 根据指标的id获取表格的子指标的数据
    getTableData(indicator) {
      this.loading = true
      getIndicatorinfo({parent__id: indicator.key}).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    // 根据指标的id获取指标的详细信息,并设置上级的指标信息
    getIndicatorDetail(indicatorId) {
      this.loading = true
      if(indicatorId > -1){
        readIndicatorinfo(indicatorId).then(res => {
          this.indicatorInformation = res.data
          this.indicatorInformation.parent === null ? this.indicatorInformation.fatherIndicatorName = '无' : this.indicatorInformation.fatherIndicatorName = this.indicatorInformation.parent.name
          this.loading = false
        })
      }
    },
    // 确定默认选中的项目和默认的点击事件
    defaultCheckedSelected() {
      this.$nextTick(function () {
        this.$refs.dataTree.setCurrentKey(this.defaultCheckedKeys[this.nodeKey])
        this.handleNodeClick(this.defaultCheckedKeys)
      })
    },
    // 根据项目的id获取树形数据
    getTreeDataInformation() {
      this.loading = true
      getTreeData().then(res => {
        this.loading = false
        this.treeData = res.data
        this.defaultCheckedKeys = this.treeData[0]
        this.defaultCheckedSelected()
      })
    },
    // treeData获取当前的(new)
    getTreeCurrentDataInformation() {
      this.loading = true
      getTreeData().then(res => {
        this.loading = false
        this.treeData = res.data
        this.defaultCheckedKeys = Object.assign({},this.nodeData)
        this.nodeData = {}
        this.defaultCheckedSelected()
      })
    },
    handleNodeClick(indicator) {
      // 记录当前的选中的指标项
      console.log(indicator);
      this.nodeId = indicator.key
      this.nodeData = indicator
      this.getIndicatorDetail(indicator.key)
      this.getTableData(indicator)
    },

    handleAdd() {
      this.nodeId = -1
      this.addDialogVisible = true
    },
    handleAddChild(scope) {
      this.nodeId = scope.id
      this.addDialogVisible = true
    },
    handleChildEdit(scope) {
      this.nodeId = scope.row.id
      this.editDialogVisible = true
    },
    handleDetailEdit(scope) {
      this.nodeId = scope.id
      this.editDialogVisible = true
    },
    handleChildDelete(scope) {
      this.nodeId = scope.row.id
      this.handleSubDetailDelete()
    },
    handleDetailDelete() {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        delIndicatorinfo(this.nodeId).then(() => {
          this.getTreeDataInformation()
          this.$message({
            type: 'success',
            message: this.$t('confirm.deleteSucced')
          })
        })
      })
    },
    handleSubDetailDelete() {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        delIndicatorinfo(this.nodeId).then(() => {
          this.getTreeCurrentDataInformation()
          this.$message({
            type: 'success',
            message: this.$t('confirm.deleteSucced')
          })
        })
      })
    },
  }
}
</script>
<style lang='scss' scoped>
.head_save_btn {
  float: right;
  padding: 0;
}
.el-main {
  padding-top: 0;
  padding-bottom: 0;
}
.titleStyle {
  font-weight: bold;
}
.right-button-group {
  text-align: right;
  padding-right: 0;
  padding-top: 10px;
}
.el-form-item {
  margin-bottom: 0;
}
.aside-style {
  position: relative;
}
.asideCard-style {
  position: absolute;
  height: 100%;
  width: 100%;
  // overflow: scroll;
}
.leftBottom {
  margin-top: 20px;
  // margin-left: 20px;
}
.noIndicatorInfo {
  color: #909399;
  text-align: center;
  padding: 63px 0;
  font-size: 14px;
}
.tableBtn {
  margin-bottom: 20px;
}
.tableTitle {
  padding-left: 20px;
  font-size: 80%;
}
</style>
