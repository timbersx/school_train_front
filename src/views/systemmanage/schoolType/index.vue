<!--/*
 * @Name: SchoolType
 * @Module:  src/views/systemmanage/schoolType/index
 * @Desc: SchoolType
 * @Author:  automatic code
 * @Date:  2020-06-11 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <AddDialog
      :visible.sync="addDialogVisible"
      @update-save="handleUpdateSave"
    />
    <DetailDialog :id="editID" :visible.sync="detailDialogVisible" />
    <EditDialog
      :id="editID"
      :visible.sync="editDialogVisible"
      @update-save="handleUpdateSave"
    />

    <div class="filter-container" style="float: left">
      <el-input
        v-model="searchKey"
        :placeholder="$t('common.searchKey')"
        style="width: 300px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        class="filter-item"
        @click="handleFilter"
      >{{ $t("button.search") }}</el-button>
    </div>
    <et-button-list @btnListClick="handleBtnClick" />
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
          <span>{{
            scope.$index + (listParameters.page - 1) * listParameters.limit + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`schoolType.${item}`)"
      >
        <template slot-scope="scope">
          <span>{{ item | getColumnContent(scope.row[item]) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showOperations"
        fixed="right"
        :label="$t('common.operations')"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="JSON.stringify(detailRoute) != '{}'"
            type="text"
            @click="handleDetailClick(scope.row)"
          >{{ $t("route.detail") }}</el-button>
          <el-button
            v-if="JSON.stringify(editRoute) != '{}'"
            type="text"
            @click="handleEditClick(scope.row)"
          >{{ $t("route.edit") }}</el-button>
          <el-button
            v-if="JSON.stringify(deleteRoute) != '{}'"
            type="text"
            style="color: red"
            @click="handleDeleteClick(scope.row)"
          >{{ $t("route.delete") }}</el-button>
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
  getSchoolTypeList,
  deleteSchoolType
} from '@/api/systemmanage/schoolType'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import AddDialog from './operations/add'
import DetailDialog from './operations/detail'
import EditDialog from './operations/edit'

export default {
  components: {
    EtButtonList,
    AddDialog,
    DetailDialog,
    EditDialog
  },
  filters: {
    getColumnContent(item, content) {
      switch (item) {
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
      editID: '',
      list: null, // table数据
      listLoading: true, // 是否显示loading
      listSelection: [], // 选择的行数据
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: ['name', 'code', 'remark'], // 表中显示的列
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      drawerVisible: false, // 是否显示精确查找
      apiQueryData: {} // 调用接口传递的参数
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
      getSchoolTypeList(this.apiQueryData).then(response => {
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
      if (JSON.stringify(this.detailRoute) !== '{}') {
        this.editID = row.id
        this.detailDialogVisible = true
      }
    },
    handleEditClick(row) {
      if (JSON.stringify(this.editRoute) !== '{}') {
        this.editID = row.id
        this.editDialogVisible = true
      }
    },
    handleDeleteClick(row) {
      if (JSON.stringify(this.deleteRoute) !== '{}') {
        this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
          .then(async() => {
            deleteSchoolType(row.id).then(response => {
              this.$message.success(this.$t('message.deleteSuccess'))
              this.getListData()
            })
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    handleFilter() {
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        search: this.searchKey
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
    }
  }
}
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>
