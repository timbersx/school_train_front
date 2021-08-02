<!--/*
 * @Name: TrainFieldMaintain
 * @Module:  src/views/traineventmanage/trainFieldMaintain/index
 * @Desc: TrainFieldMaintain
 * @Author:  shenyj
 * @Date:  2021-04-19 15:10:34
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <el-form
      :inline="true"
      label-suffix=":"
      class="demo-form-inline"
    >
      <el-form-item :label="$t('trainFieldMaintain.name')">
        <el-input
          v-model="search.name__contains"
          :placeholder="$t('table.input')"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >{{ $t("button.search") }}</el-button>
      </el-form-item>
      <el-form-item>
        <et-button-list @btnListClick="handleBtnClick" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`trainFieldMaintain.${item}`)"
        :formatter="handelFormatter"
      />

      <el-table-column
        v-if="showOperations"
        fixed="right"
        :label="$t('common.operations')"
        width="300"
      >
        <template slot-scope="scope">
          <el-button
            v-if="JSON.stringify(detailRoute) != '{}'"
            type="text"
            size="small"
            @click="handleDetailClick(scope.row)"
          >{{ $t("route.detail") }}</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleEditClick(scope.row)"
          >{{ $t("route.edit") }}</el-button>
          <el-button
            type="text"
            size="small"
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
  getSchoolList,
  delSchoolList,
} from '@/api/schoolBasedManage/trainFieldMaintain'

import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'

export default {
  components: {
    EtButtonList,
  },
  data() {
    return {
      search: {},
      list: null, // table数据
      listLoading: true, // 是否显示loading
      listSelection: [], // 选择的行数据
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: [
          'code',
        'name',
        'explain',
        'organization',
      ], // 表中显示的列
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      apiQueryData: {}, // 调用接口传递的参数
      editId: -1,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
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
        JSON.stringify(this.detailRoute) != '{}' ||
        JSON.stringify(this.editRoute) != '{}' ||
        JSON.stringify(this.deleteRoute) != '{}'
      ) {
        this.showOperations = true
      }
      this.getListData()
    },
    /* =======table事件 begin=======*/
    tableRowClassName({ row, rowIndex }) {
      //  table 行背景class,如下为 字段status == deleted时，该行的class 为 warning-row
      // if (row.status === 'deleted') {
      //   return 'warning-row'
      // }
      return ''
    },
    handleSelectionChange(val) {
      this.listSelection = val
    },
    getListData() {
      this.listLoading = true
      console.log(this.apiQueryData);
      getSchoolList({ ...this.apiQueryData, ordering: '-id'}).then((response) => {
        this.list = response.data
        this.listParameters.total = response.count
        this.listLoading = false
        // 删除后，当前页面没有数据了，则返回上一页
        if (this.list.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset =
            this.apiQueryData.offse - this.listParameters.limit
          this.getListData()
        }
      })
    },
    /* =======table事件 end=======*/
    /* =======table 操作列事件 begin=======*/
    handleDetailClick(row) {
      // 如有详情的路由则转向detail页面
      if (this.detailRoute != {}) {
        this.$router.push({
          path: this.detailRoute.path,
          query: { id: row.id }
        })
      }
    },
    handleEditClick(row) {
      // 如有编辑的路由则转向eidt页面
      if (this.editRoute != {}) {
        this.$router.push({
          path: this.editRoute.path,
          query: { id: row.id }
        })
      }
    },
    handleDeleteClick(row) {
      // 如有删除的路由则弹出删除提示框并调用删除接口删除
      if (this.deleteRoute != {}) {
        this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
          .then(async() => {
            delSchoolList(row.id).then((response) => {
              this.$message.success(this.$t('message.deleteSuccess'))
              this.getListData()
            })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    /* =======table 操作列事件 end=======*/

    /* =======搜索事件 begin=======*/
    handleFilter() {
      // 搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        ...this.search
      }
      this.getListData()
    },
    /* =======搜索事件 end=======*/

    /* =======翻页事件 begin=======*/
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
    /* =======翻页事件 end=======*/

    /* =======按钮列表事件，方法名称事先约定好 begin=======*/
    handleBtnClick(btnItem) {
      // 1.根据传过来的btnItem构造方法名称，并调用已写好的该方法，如btnItem.meta.title为add,则调用页面中写好的addBtnClick方法
      this[`${btnItem.meta.title}BtnClick`](btnItem)
      // //2.直接跳转路由页面
      // this.$router.push({ path:btnItem.path})
    },
    addBtnClick(item) {
      this.$router.push({ path: item.path })
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/

    handelFormatter(row, column) {
      switch (column.property) {
        case 'organization':
          return row.organization.name
        default:
          return row[column.property]
      }
    },
  }
}
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>
