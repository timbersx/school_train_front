<!--/*
 * @Name: trainEventFundsRecordInfo
 * @Module:  src/views/traineventmanage/trainEventFundsRecordInfo/index
 * @Desc: trainEventFundsRecordInfo
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
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
      <el-form-item :label="$t('annualTrainPlanInfo.year')">
        <el-select
          v-model="search.plan__year__id"
          :placeholder="$t('annualTrainPlanInfo.year')"
          clearable
        >
          <el-option v-for="item in year_Operations" :key="item.id" :value="item.id" :label="item.year" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('trainEventInfo.name')">
        <el-input
          v-model="search.name__contains"
          :placeholder="$t('trainEventInfo.name')"
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
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      stripe
    >
      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`trainEventInfo.${item}`)"
        :formatter="handelFormatter"
      />

      <el-table-column
        v-if="showOperations"
        fixed="right"
        :label="$t('common.operations')"
        width="220"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="handleAddRecordsClick(scope.row)">
            新增经费记录
          </el-button>
          <el-button type="text" @click="handleCheckRecordsClick(scope.row)">
            查看经费记录
          </el-button>
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
  getTrainEventInfoList,
  exportTrainEventInfo,
  upSignTrainEventInfo
} from '@/api/traineventmanage/trainEventInfo'
import { getAnnualTrainPlanYearList } from '@/api/traineventmanage/annualTrainPlanInfo'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import { getSysconst } from '@/api/utils'

export default {
  filters: {
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
        'name',
        'plan',
        'train_person',
        'train_hour',
        'train_amount',
        'start_date',
        'end_date',
        'status'
      ], // 表中显示的列
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      drawerVisible: false, // 是否显示精确查找
      apiQueryData: {}, // 调用接口传递的参数
      status_Operations: [],
      year_Operations: [],
      signSetAndQrcodeViewDialogVisible: false,
      teacherListDialogVisible: false,
      editId: -1
    }
  },
  created() {
    this.init()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteEnter(to, from, next) {
    if (!(~from.path.indexOf('trainEventFundsRecordInfo'))) {
      sessionStorage.removeItem('pageData')
    }
    next()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteLeave(to, from, next) {
    if (~to.path.indexOf('trainEventFundsRecordInfo')) {
      sessionStorage.setItem('pageData', JSON.stringify({
        apiQueryData: this.apiQueryData,
        listParameters: this.listParameters,
        search: this.search
      }))
    } else {
      sessionStorage.removeItem('pageData')
    }
    next()
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
        JSON.stringify(this.detailRoute) !== '{}' ||
        JSON.stringify(this.editRoute) !== '{}' ||
        JSON.stringify(this.deleteRoute) !== '{}'
      ) {
        this.showOperations = true
      }
      Promise.all([
        getSysconst('Train_Event_Status'),
        getAnnualTrainPlanYearList({ is_active: true, ordering: 'year', limit: 1000 })
      ]).then((response) => {
        this.status_Operations = response[0].data
        this.year_Operations = response[1].data
        this.handleDefaultYear()
        this.getList()
      }).catch(() => {
        this.getList()
      })
    },
    handleDefaultYear() {
      const currentYear = new Date().getFullYear()
      let yearId = ''
      this.year_Operations.forEach(item => {
        if (item.year === currentYear) {
          yearId = item.id
        }
      })
      if (yearId) {
        this.$set(this.search, 'plan__year__id', yearId)
      } else if (this.year_Operations.length > 0) {
        this.$set(this.search, 'plan__year__id', this.year_Operations[0].id)
      }
    },
    getList() {
      const sessionData = sessionStorage.getItem('pageData')
      if (sessionData) {
        Object.assign(this, JSON.parse(sessionData))
        this.getListData()
      } else {
        this.handleFilter()
      }
    },
    getListData() {
      this.listLoading = true
      getTrainEventInfoList({ ...this.apiQueryData, ordering: '-id', status: 2 }).then((response) => {
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
    handleAddRecordsClick(row) {
      this.$router.push({ path: '/school/trainEventFundsRecordInfo/add', query: { pId: row.id }})
    },
    exportBtnClick(item) {
      const exportData = { ...this.apiQueryData }
      delete exportData.limit
      delete exportData.offset
      exportTrainEventInfo(exportData).then((response) => {
        fileDownload(response, `${this.$t('route.trainEventInfo')}.xls`)
      })
    },
    handelFormatter(row, column) {
      const status = this.status_Operations.find((item) => {
        return item.code === row.status
      })
      switch (column.property) {
        case 'plan':
          return row.plan.name
        case 'train_person':
          return row.train_person.name
        case 'status':
          return status.name
        default:
          return row[column.property]
      }
    },
    handleCheckRecordsClick(row) {
      this.$router.push({ path: '/school/trainEventFundsRecordInfo/checkFundsRecord', query: { pId: row.id }})
    },
    handleTeacherListViewClick(row) {
      this.editId = row.id
      this.teacherListDialogVisible = true
    },
    handleSignUpFinClick(row) {
      upSignTrainEventInfo({ status: 3 }, row.id).then(res => {
        this.getListData()
      })
    }
  }
}
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>
