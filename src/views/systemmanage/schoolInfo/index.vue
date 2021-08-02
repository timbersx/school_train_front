<!--/*
 * @Name: SchoolInfo
 * @Module:  src/views/systemmanage/schoolInfo/index
 * @Desc: SchoolInfo
 * @Author:  automatic code
 * @Date:  2020-06-11 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <add-dialog :visible.sync="addDialogVisible" @update-save="handleUpdateSave" />
    <detail-dialog :id="editID" :visible.sync="detailDialogVisible" />
    <edit-dialog :id="editID" :visible.sync="editDialogVisible" @update-save="handleUpdateSave" />

    <div class="filter-container" style="float: left;">
      <el-form :inline="true" label-suffix=":">
        <!-- 页眉的搜索部分 -->
        <el-row>
          <el-form-item :label="$t('schoolInfo.name')">
            <el-input v-model="searchData.name__icontains" class="itemitem" clearable />
          </el-form-item>
          <el-form-item :label="$t('schoolInfo.code')">
            <el-input v-model="searchData.code__icontains" class="itemitem" clearable />
          </el-form-item>
          <el-form-item :label="$t('schoolInfo.organization_type')">
            <el-select v-model="searchData.organization_type__name" filterable clearable>
              <el-option
                v-for="(item, index) in schoolTypeList"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button
              class="Btn"
              type="primary"
              @click="handleFilter"
            >{{ $t('button.search') }}</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <et-button-list @btnListClick="handleBtnClick" />
    <!-- <div class="buttonList">
      <el-button class="syncUserBtn " :disabled="disableSyncBtn" @click="handleTotalShoolUserClick">{{ $t('button.syncTotalBase') }}</el-button>
      <el-button :disabled="disableSyncBtn" @click="handleIncrementShoolUserClick">{{ $t('button.syncIncrementBase') }}</el-button>
    </div> -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column :label="$t('common.sequence')" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index+(listParameters.page-1) * listParameters.limit + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`schoolInfo.${item}`)"
      >
        <template slot-scope="scope">
          <span>{{ item | getColumnContent(scope.row[item]) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showOperations"
        fixed="right"
        :label="$t('common.operations')"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            v-if="JSON.stringify(detailRoute)!='{}'"
            type="text"
            @click="handleDetailClick(scope.row)"
          >{{ $t('route.detail') }}</el-button>
          <el-button
            v-if="JSON.stringify(editRoute)!='{}'"
            type="text"
            @click="handleEditClick(scope.row)"
          >{{ $t('route.edit') }}</el-button>
          <el-button
            v-if="JSON.stringify(deleteRoute)!='{}'"
            type="text"
            style="color:red"
            @click="handleDeleteClick(scope.row)"
          >{{ $t('route.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="listParameters.pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listParameters.total"
      class="pagination-container"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  deleteSchoolInfo,
  exportSchoolInfo,
  getTotalSyncSchoolInfo,
  getIncrementSyncSchoolInfo
} from '@/api/systemmanage/schoolInfo'
import { getOrganizationInfoList } from '@/api/systemmanage/organizationInfo'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import AddDialog from './operations/add'
import DetailDialog from './operations/detail'
import EditDialog from './operations/edit'
import { getSchoolTypeList } from '@/api/systemmanage/schoolType'

export default {
  components: {
    EtButtonList,
    AddDialog,
    DetailDialog,
    EditDialog
  },
  filters: {
    // 返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
    // item:字段名称，content:字段内容
    getColumnContent(item, content) {
      switch (item) {
        case 'organization_type':
          return content == null ? content : content.name
        case 'user':
          return content == null ? content : content.nick_name
        default:
          return content
      }
    }
  },
  data() {
    return {
      searchKey: '',
      addDialogVisible: false,
      detailDialogVisible: false,
      editDialogVisible: false,
      editID: -1,
      list: null, // table数据
      listLoading: true, // 是否显示loading
      listSelection: [], // 选择的行数据
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: ['name', 'code', 'organization_type', 'remark'], // 表中显示的列, "user"
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      drawerVisible: false, // 是否显示精确查找
      apiQueryData: {}, // 调用接口传递的参数
      searchData: {},
      schoolTypeList: [],
      disableSyncBtn: false
    }
  },
  created() {
    const obj = Array.from(this.$store.state.permission.addRoutes) // 路由转换为数组
    let currentPath = this.$route.fullPath
      .substr(this.$route.fullPath.lastIndexOf('/') + 1)
      .toLowerCase() // 当前路由的最后字符内容
    const indexOfParams = currentPath.indexOf('?')
    if (indexOfParams > 0) {
      currentPath = currentPath.substr(0, indexOfParams)
    }
    this.detailRoute = getOperationsRoute(obj, currentPath, 'detail', true)
    this.editRoute = getOperationsRoute(obj, currentPath, 'edit', true)
    this.deleteRoute = getOperationsRoute(obj, currentPath, 'delete', true)

    if (
      JSON.stringify(this.detailRoute) !== '{}' ||
      JSON.stringify(this.editRoute) !== '{}' ||
      JSON.stringify(this.deleteRoute) !== '{}'
    ) {
      this.showOperations = true
    }
    this.getListData()
  },
  methods: {
    handleSelectionChange(val) {
      this.listSelection = val
    },
    handleUpdateSave() {
      this.addDialogVisible = false
      this.detailDialogVisible = false
      this.editDialogVisible = false
      this.getListData()
    },
    getListData() {
      this.listLoading = true
      getSchoolTypeList({ limit: 100000, offset: 0 }).then(res => {
        this.schoolTypeList = res.data
      })
      getOrganizationInfoList(this.apiQueryData).then((response) => {
        this.list = response.data
        this.listParameters.total = response.count
        this.listLoading = false
        if (this.list.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset = (Math.ceil(this.listParameters.total / this.listParameters.limit) - 1) * this.listParameters.limit
          this.getListData()
        }
      })
    },
    handleDetailClick(row) {
      this.editID = row.id
      this.detailDialogVisible = true
    },
    handleEditClick(row) {
      this.editID = row.id
      this.editDialogVisible = true
    },
    handleDeleteClick(row) {
      if (JSON.stringify(this.deleteRoute) !== '{}') {
        this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
          .then(async() => {
            deleteSchoolInfo(row.id).then((response) => {
              this.$message.success(this.$t('message.deleteSuccess'))
              this.getListData()
            })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    handleFilter() {
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        ...this.searchData
      }
      this.getListData()
    },
    handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getListData()
    },
    handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1)
      this.getListData()
    },
    handleBtnClick(btnItem) {
      this[`${btnItem.meta.title}BtnClick`](btnItem)
    },
    addBtnClick(item) {
      this.addDialogVisible = true
    },
    exportBtnClick(item) {
      const exportData = { ...this.apiQueryData }
      delete exportData.limit
      delete exportData.offset
      exportSchoolInfo(exportData).then((response) => {
        fileDownload(response, `${this.$t('route.schoolInfo')}.xls`)
      })
    },
    // 全量同步基础库
    handleTotalShoolUserClick() {
      this.listLoading = true
      this.disableSyncBtn = true
      getTotalSyncSchoolInfo().then(response => {
        this.listLoading = false
        this.disableSyncBtn = false
        this.$message.success(response.data)
      }).catch(() => {
        this.listLoading = false
        this.disableSyncBtn = false
      })
    },
    // 增量同步基础库
    handleIncrementShoolUserClick() {
      this.listLoading = true
      getIncrementSyncSchoolInfo().then(response => {
        this.listLoading = false
        this.disableSyncBtn = false
        this.$message.success(response.data)
      }).catch(() => {
        this.listLoading = false
        this.disableSyncBtn = false
      })
    }
  }
}
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
.syncUserBtn {
  margin-left: 15px;
}
.buttonList{
   float: left;
   margin-bottom: 10px
}
</style>
