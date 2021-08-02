<!--/*
 * @Name: Expert Evaluation
 * @Module:  src/views/traineventmanage/expertEvaluation/index
 * @Desc: Expert Evaluation
 * @Author:  automatic code
 * @Date:  2021-01-22 10:45:34
 * @Last Modified by:   shenyj
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <el-form
      :inline="true"
      label-suffix=":"
      style="padding: 20px 20px 0 20px"
      class="demo-form-inline"
    >
      <el-form-item :label="$t('expertEvaluation.name')">
        <el-input
          v-model="search.name__contains"
          :placeholder="$t('expertEvaluation.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('expertEvaluation.year')">
        <el-input
          v-model="search.year__year__contains"
          :placeholder="$t('expertEvaluation.year')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('expertEvaluation.start_date')">
        <el-date-picker
          v-model="search.start_date__gte"
          type="date"
          :placeholder="$t('expertEvaluation.start_date')"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('expertEvaluation.end_date')">
        <el-date-picker
          v-model="search.end_date__lte"
          type="date"
          :placeholder="$t('expertEvaluation.end_date')"
          value-format="yyyy-MM-dd"
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
    <el-main>
      <el-tabs v-model="activeStatus" @tab-click="handleStatusClick">
        <el-tab-pane label="待审核" name="waitCheck">
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
              :label="$t(`expertEvaluation.${item}`)"
              :formatter="handleFormatter"
            />

            <el-table-column :label="$t('table.actions')" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="handleCheck(scope.row)">{{
                  $t("button.check")
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
        </el-tab-pane>
        <el-tab-pane label="已审核" name="checked">
          <el-table
            v-loading="listLoading"
            :data="listChecked"
            border
            fit
            highlight-current-row
            :row-class-name="tableRowClassName"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-for="(item, index) in listColumnsChecked"
              :key="index"
              :prop="item"
              :label="$t(`expertEvaluation.${item}`)"
              :formatter="handleFormatter"
            />
            <el-table-column :label="$t('table.actions')" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetail(scope.row)">{{
                  $t("route.detail")
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-sizes="listParametersChecked.pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParametersChecked.total"
            class="pagination-container"
            @size-change="handleSizeCheckedChange"
            @current-change="handleCurrentCheckedChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import {
  deleteTrainEventClassHourInfo,
  exportTrainEventClassHourInfo
} from '@/api/traineventmanage/trainEventClassHourInfo'
import {
  annualTrainplanInfo
} from '@/api/schoolBasedManage/expertEvaluation'

import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import EtDrawer from '@/components/EtDrawer'
import { getSysconst } from '@/api/utils'

export default {
  components: {
    EtButtonList,
    EtDrawer
  },
  filters: {
    // 返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
    // item:字段名称，content:字段内容
    getColumnContent(item, content) {
      switch (item) {
        //    case 'train_event':
        //        return content==null?content:content.name
        //    case 'teacher':
        //        return content==null?content:content.name
        default:
          return content
      }
    }
  },
  data() {
    return {
      search: {},
      list: null, // table数据
      listChecked: null, // table数据
      listLoading: true, // 是否显示loading
      listSelection: [], // 选择的行数据
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listParametersChecked: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: [
        'name',
        'year',
        'organization_type',
        'school',
        'funds',
        'start_date',
        'end_date'
      ], // 表中显示的列
      listColumnsChecked: [
        'name',
        'year',
        'organization_type',
        'school',
        'funds',
        'start_date',
        'end_date',
        'status',
        'funds_education'
      ],
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      checkRoute: {},
      drawerVisible: false, // 是否显示精确查找
      apiQueryData: {}, // 调用接口传递的参数
      apiQueryCheckedData: {},
      activeStatus: 'waitCheck',
      trainPlanCheckStatusList: []
    }
  },
  created() {
    const expertActiveStatus = sessionStorage.getItem('expertActiveStatus')
    if (expertActiveStatus) {
      this.activeStatus = JSON.parse(expertActiveStatus)
    }
    this.init()
  },
  beforeDestroy() {
    sessionStorage.setItem('expertActiveStatus', JSON.stringify(this.activeStatus))
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
      getSysconst('Train_Plan_Check_Status').then(res => {
        this.trainPlanCheckStatusList = res.data
      })
      this.getAnnualTrainplanInfo(this.activeStatus)
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
      if (this.deleteRoute != {}) {
        this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
          .then(async() => {
            deleteTrainEventClassHourInfo(row.id).then((response) => {
              this.$message.success(this.$t('message.deleteSuccess'))
              this.getAnnualTrainplanInfo(this.activeStatus)
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
      this.getAnnualTrainplanInfo(this.activeStatus)
    },
    /* =======搜索事件 end=======*/

    /* =======翻页事件 begin=======*/
    handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getAnnualTrainplanInfo(this.activeStatus)
    },
    handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1)
      this.getAnnualTrainplanInfo(this.activeStatus)
    },
    handleSizeCheckedChange(val) {
      this.listParametersChecked.limit = val
      this.apiQueryCheckedData.limit = this.listParametersChecked.limit
      this.getAnnualTrainplanInfo(this.activeStatus)
    },
    handleCurrentCheckedChange(val) {
      this.listParametersChecked.page = val
      this.apiQueryCheckedData.offset =
        this.listParametersChecked.limit * (this.listParametersChecked.page - 1)
      this.getAnnualTrainplanInfo(this.activeStatus)
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
    exportBtnClick(item) {
      const exportData = { ...this.apiQueryData }
      delete exportData.limit
      delete exportData.offset
      exportTrainEventClassHourInfo(exportData).then((response) => {
        fileDownload(
          response,
          `${this.$t('route.trainEventClassHourInfo')}.xls`
        )
      })
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/
    handleStatusClick(tab, event) {
      this.search = {}
      this.getAnnualTrainplanInfo(this.activeStatus)
    },
    getAnnualTrainplanInfo(activeStatus) {
      this.listLoading = true
      const getData = activeStatus === 'waitCheck' ? { flow: 1, ...this.apiQueryData, ...this.search, ordering: '-id' } : { flow__gte: 2, plan_type__type: true, ...this.apiQueryCheckedData, ...this.search, ordering: '-id' }
      annualTrainplanInfo(getData).then(res => {
        if (activeStatus === 'waitCheck') {
          this.list = res.data
          this.listParameters.total = res.count
        } else {
          this.listChecked = res.data
          this.listParametersChecked.total = res.count
        }
        this.listLoading = false
      }).catch((err) => {
        this.listLoading = false
      })
    },
    handleCheck(row) {
      this.$router.push({
        path: this.checkRoute.path,
        query: { id: row.id, year: row.year.year, school: row.school.name }
      })
    },
    handleDetail(row) {
      this.$router.push({
        path: this.detailRoute.path,
        query: { id: row.id, year: row.year.year, school: row.school.name }
      })
    },
    handleFormatter(row, column) {
      // 格式化
      switch (column.property) {
        case 'organization_type':
          return row.school.organization_type.name
        case 'school':
          return row.school.name
        case 'year':
          return row.year.year
        case 'status':
          const status = this.trainPlanCheckStatusList.find(item => item.code == row.status)
          return status.name
        case 'funds_education':
          return row.funds_education ? row.funds_education.approve_comment : ''
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
