<!--/*
 * @Name: training expert manage
 * @Module:  src/views/traineventmanage/trainingExpertManage/index
 * @Desc: training expert manage
 * @Author:  automatic code
 * @Date:  2021-02-01 09:20:00
 * @Last Modified by:   shenyj
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <div>
      <el-form
        :inline="true"
        label-suffix=":"
        class="demo-form-inline"
      >
        <el-form-item :label="$t('trainingExpertManage.name')">
          <el-input
            v-model="search.name__contains"
            :placeholder="$t('trainingExpertManage.name')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('trainingExpertManage.phone')">
          <el-input
            v-model="search.phone__contains"
            :placeholder="$t('trainingExpertManage.phone')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('trainingExpertManage.title')">
          <el-input
            v-model="search.title__contains"
            :placeholder="$t('trainingExpertManage.title')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('trainingExpertManage.post')"><el-input
          v-model="search.post__contains"
          :placeholder="$t('trainingExpertManage.post')"
          clearable
        />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            class="filter-item"
            @click="handleFilter"
          >{{ $t("button.search") }}</el-button>
        </el-form-item>
        <el-form-item>
          <et-button-list @btnListClick="handleBtnClick" />
        </el-form-item>
      </el-form>
    </div>
    <div>
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
          :label="$t(`trainingExpertManage.${item}`)"
          :formatter="handleFormatter"
        />
        <el-table-column :label="$t('table.actions')" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditClick(scope.row)">{{
              $t("route.edit")
            }}</el-button>
            <el-button type="text" style="color:red" @click="handleDeleteClick(scope.row)">{{
              $t("route.delete")
            }}</el-button>
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
  </div>
</template>

<script>
import {
  schoolExpertInfo,
  delSchoolExpertInfo
} from '@/api/traineventmanage/trainingExpertManage'

import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'

export default {
  components: {
    EtButtonList
  },
  data() {
    return {
      search: {},
      list: null, // table数据
      listChecked: null, // table数据
      listLoading: false, // 是否显示loading
      listSelection: [], // 选择的行数据
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: [
        'name',
        'phone',
        'id_card',
        'bank_card',
        'bank',
        'title',
        'post',
        'workplace'
      ], // 表中显示的列
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      checkRoute: {},
      apiQueryData: {} // 调用接口传递的参数
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
      this.checkRoute = getOperationsRoute(obj, currentPath, 'check', true)

      if (
        JSON.stringify(this.detailRoute) != '{}' ||
        JSON.stringify(this.editRoute) != '{}' ||
        JSON.stringify(this.deleteRoute) != '{}'
      ) {
        this.showOperations = true
      }
      this.getSchoolExpertInfo()
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
    /* =======table事件 end=======*/
    /* =======table 操作列事件 begin=======*/
    handleDeleteClick(row) {
      // 如有删除的路由则弹出删除提示框并调用删除接口删除
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      })
        .then(async() => {
          delSchoolExpertInfo(row.id).then((response) => {
            this.$message.success(this.$t('message.deleteSuccess'))
            this.getSchoolExpertInfo()
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleEditClick(row) {
      if (this.editRoute != {}) {
        this.$router.push({
          path: this.editRoute.path,
          query: { id: row.id }
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
      this.getSchoolExpertInfo()
    },
    /* =======搜索事件 end=======*/

    /* =======翻页事件 begin=======*/
    handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getSchoolExpertInfo()
    },
    handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1)
      this.getSchoolExpertInfo()
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
    getSchoolExpertInfo() {
      this.listLoading = true
      schoolExpertInfo(this.apiQueryData)
        .then((res) => {
          this.list = res.data
          this.listParameters.total = res.count
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
    handleFormatter(row, column) {
      // 格式化
      switch (column.property) {
        default:
          return row[column.property]
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-table .warning-row {
  background: #f5c0c0;
}
.el-main {
  padding-top: 0;
}
</style>
