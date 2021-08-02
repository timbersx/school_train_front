<!--/*
 * @Name: schoolBasedTrainingStatistics
 * @Module:  src/views/traineventmanage/schoolBasedTrainingStatistics/index
 * @Desc: SchoolBasedTrainingStatistics
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
      <el-form-item :label="$t('trainEventImplementationRecordInfo.plan')">
        <el-select
          v-model="searchKey"
          filterable
          style="width: 300px"
          class="filter-item"
          @change="handlePlanChange"
        >
          <el-option v-for="item in planList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" class="filter-item" @click="handleFilter">{{ $t('button.search') }}</el-button>
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
      <el-table-column :label="$t('common.sequence')" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index+(listParameters.page-1) * listParameters.limit + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`schoolBasedTrainingStatistics.${item}`)"
        :width="item === 'target' ? '350px' : ''"
      >
        <template slot-scope="scope">
          <span>{{ item | getColumnContent(scope.row[item], scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('schoolBasedTrainingStatistics.confirm_amount')">
        <template slot-scope="scope">
          <el-button type="text" @click="handleConfirmAmountClick(scope.row)">{{ scope.row.enroll_confirm_amount.confirm_amount }}</el-button>
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

    <ConfirmDialog :visible.sync="showConfirmDialog" :api-id="eventId" />
  </div>
</template>

<script>
import ConfirmDialog from './operations/ConfirmDialog'
import { getSchoolBaseTrainInfoList, exportSchoolBaseTrainInfo } from '@/api/traineventmanage/schoolBasedTrainingStatistics'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import { getAnnualTrainPlanSchoolInfoList } from '@/api/traineventmanage/annualTrainPlanInfo'
import { charFilter, intFilter, dateFilter } from '@/api/filterType'

export default {
  components: {
    EtButtonList,
    ConfirmDialog
  },
  filters: {
    // 返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
    // item:字段名称，content:字段内容
    getColumnContent(item, content, row) {
      switch (item) {
        case 'course_type':
          return content == null ? content : content.name
        case 'target':
          return row.plan && row.plan[item]
        case 'confirm_amount':
          return row.enroll_confirm_amount && row.enroll_confirm_amount[item]
        default:
          return content
      }
    }
  },
  data() {
    return {
      searchKey: '',
      list: [], // table数据
      listLoading: false, // 是否显示loading
      listSelection: [], // 选择的行数据
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: ['course_type', 'start_date', 'end_date', 'position', 'target', 'train_hour', 'confirm_amount'], // 表中显示的列
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      apiQueryData: {}, // 调用接口传递的参数
      charFilter,
      intFilter,
      dateFilter,
      planList: [],
      planName: '',
      showConfirmDialog: false,
      eventId: ''
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

      if (JSON.stringify(this.detailRoute) !== '{}' || JSON.stringify(this.editRoute) !== '{}' || JSON.stringify(this.deleteRoute) !== '{}') { this.showOperations = true }
      this.getSearchList()
    },
    getSearchList() {
      Promise.all([getAnnualTrainPlanSchoolInfoList({ offset: 0, limit: 10000, ordering: '-id' })]).then(response => {
        this.planList = response[0].data
        if (response[0].data.length > 0) {
          this.searchKey = response[0].data[0].id
          this.planName = response[0].data[0].name
          this.handleFilter()
        }
      })
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
      const submitData = Object.assign({ ordering: 'train_hour' }, this.apiQueryData)
      getSchoolBaseTrainInfoList(submitData).then(response => {
        const result = response.data
        this.list = result
        this.listParameters.total = response.count
        this.listLoading = false
        // 删除后，当前页面没有数据了，则返回上一页
        if (result.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset = (Math.ceil(this.listParameters.total / this.listParameters.limit) - 1) * this.listParameters.limit
          this.getListData()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    /* =======table事件 end=======*/
    /* =======table 操作列事件 begin=======*/
    handleDetailClick(row) {
      // 如有详情的路由则转向detail页面
      if (JSON.stringify(this.detailRoute) !== {}) {
        this.$router.push({
          path: this.detailRoute.path,
          query: { id: row.id }
        })
      }
    },
    handleEditClick(row) {
      // 如有编辑的路由则转向eidt页面
      if (JSON.stringify(this.editRoute) !== {}) {
        this.$router.push({
          path: this.editRoute.path,
          query: { id: row.id }
        })
      }
    },
    // handleDeleteClick(row) {
    //   // 如有删除的路由则弹出删除提示框并调用删除接口删除
    //   if (JSON.stringify(this.deleteRoute) !== {}) {
    //     this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
    //       confirmButtonText: this.$t('button.confirm'),
    //       cancelButtonText: this.$t('button.cancel'),
    //       type: 'warning'
    //     })
    //       .then(async() => {
    //         deleteTrainEventClassHourInfo(row.id).then(response => {
    //           this.$message.success(this.$t('message.deleteSuccess'))
    //           this.getListData()
    //         })
    //       })
    //       .catch(err => {
    //         console.error(err)
    //       })
    //   }
    // },
    /* =======table 操作列事件 end=======*/

    /* =======搜索事件 begin=======*/
    handleFilter() {
      // 搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        plan__id: this.searchKey
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
      this.apiQueryData.offset = this.listParameters.limit * (this.listParameters.page - 1)
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
    exportBtnClick(item) {
      if (this.searchKey === '') {
        return false
      }
      const exportData = { ...this.apiQueryData, ordering: 'train_hour' }
      delete exportData.limit
      delete exportData.offset
      exportSchoolBaseTrainInfo(exportData).then(response => {
        fileDownload(response, `${this.planName}.xls`)
      })
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/
    handlePlanChange(val) {
      this.planName = this.planList.find(i => i.id === val).name
    },
    /* =======精确查找事件 end=======*/
    handleConfirmAmountClick(row) {
      this.showConfirmDialog = true
      this.eventId = row.id
    }
  }
}
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>
