<!--/*
 * @Name: education bureau evaluation
 * @Module:  src/views/schoolBasedManage/educationBureauEvaluation/index
 * @Desc: education bureau evaluation
 * @Author:  automatic code
 * @Date:  2021-01-29 15:25:11
 * @Last Modified by:   shenyj
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <el-form :inline="true" :model="search" label-suffix=":" class="demo-form-inline" style="padding: 20px 20px 0 20px">
      <el-form-item label="年度">
        <el-select
          v-model="search.year__id"
          filterable
          placeholder="年度"
          clearable
        >
          <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('educationBureauEvaluation.name')">
        <el-input
          v-model="search.name__contains"
          :placeholder="$t('educationBureauEvaluation.name')"
          clearable
        />
      </el-form-item>
      <el-form-item label="学段">
        <el-select
          v-model="search.school__organization_type__id"
          filterable
          clearable
          placeholder="学段"
          @change="handleOrgTypeChange"
        >
          <el-option v-for="item in organizationTypeList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-select
          v-model="search.school__id"
          filterable
          clearable
          placeholder="学校"
          :loading="organizationLoading"
          @focus="handleOrganizationFocus"
        >
          <el-option v-for="item in organizationList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >{{ $t("button.search") }}</el-button>

        <el-button
          type="primary"
          @click="handleExport"
        >{{ $t("route.export") }}</el-button>

        <el-button
          v-if="activeStatus == 'commonWaitCheck' || activeStatus == 'uniqueWaitCheck'"
          type="primary"
          :disabled="listSelection.length == 0"
          @click="handleBatchCheck"
        >{{ $t("button.batchCheck") }}</el-button>

      </el-form-item>
      <el-form-item>
        <et-button-list @btnListClick="handleBtnClick" />
      </el-form-item>

    </el-form>
    <el-main>
      <el-tabs v-model="activeStatus" @tab-click="handleStatusClick">
        <el-tab-pane label="常规培训待审核" name="commonWaitCheck">
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
              type="selection"
              width="60"
            />
            <el-table-column
              v-for="(item, index) in listColumns"
              :key="index"
              :prop="item"
              :label="$t(`educationBureauEvaluation.${item}`)"
              :formatter="handleFormatter"
            />

            <el-table-column :label="$t('table.actions')" width="260">
              <template slot-scope="scope">
                <el-button type="text" @click="handleCheck(scope.row)">{{
                  $t("route.detail")
                }}</el-button>

                <el-button type="text" @click="handleCheckPass(scope.row)">{{
                  $t("educationBureauEvaluation.check_pass")
                }}</el-button>

                <el-button type="text" @click="handleCheckNoPass(scope.row)">{{
                  $t("educationBureauEvaluation.check_no_pass")
                }}</el-button>

              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-sizes="listParameters.pageSizes"
            :current-page.sync="listParameters.page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParameters.total"
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>

        <el-tab-pane label="特色培训待审核" name="uniqueWaitCheck">
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
              type="selection"
              width="60"
            />
            <el-table-column
              v-for="(item, index) in listColumns"
              :key="index"
              :prop="item"
              :label="$t(`educationBureauEvaluation.${item}`)"
              :formatter="handleFormatter"
            />
            <el-table-column
              prop="education_funds"
              :label="$t(`educationBureauEvaluation.education_funds`)"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.fast_education_funds" :placeholder="$t('table.input')" @blur="handelEducationFundsBlur(scope.row)" />
              </template>
            </el-table-column>

            <el-table-column :label="$t('table.actions')" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="handleCheck(scope.row)">{{
                  $t("route.detail")
                }}</el-button>
                <!-- <el-button type="text" @click="handleCheckNoPass(scope.row)">{{
                  $t("educationBureauEvaluation.check_no_pass")
                }}</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-sizes="listParameters.pageSizes"
            :current-page.sync="listParameters.page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParameters.total"
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>

        <el-tab-pane label="常规培训已审核" name="commonChecked">
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
              v-for="(item, index) in listColumnsChecked"
              :key="index"
              :prop="item"
              :label="$t(`educationBureauEvaluation.${item}`)"
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
            :page-sizes="listParameters.pageSizes"
            :current-page.sync="listParameters.page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParameters.total"
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>

        <el-tab-pane label="特色培训已审核" name="uniqueChecked">
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
              v-for="(item, index) in [...listColumnsChecked, 'education_funds']"
              :key="index"
              :prop="item"
              :label="$t(`educationBureauEvaluation.${item}`)"
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
            :page-sizes="listParameters.pageSizes"
            :current-page.sync="listParameters.page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParameters.total"
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <batch-check :visible.sync="batchDialogVisible" :plans="listSelection" :active-status="activeStatus" @checked="handeCheckedChange" />
    <check-no-pass :visible.sync="checkNoPassVisible" @approve="handeApproveChange" />
  </div>
</template>

<script>
import {
  annualTrainplanInfo,
  categoryExport,
  educationSubmitCheck,
  deleteTrainEventClassHourInfo,
  exportTrainEventClassHourInfo
} from '@/api/municipalPlan/municipalPlanCheck'
import { getOrganizationTypeList } from '@/api/systemmanage/organizationType'
import { getOrganizationInfoList } from '@/api/systemmanage/organizationInfo'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import { getAnnualTrainPlanYearList } from '@/api/municipalPlan/municipalPlanDeclaration'
import fileDownload from 'js-file-download'
import { getSysconst } from '@/api/utils'
import BatchCheck from './operations/batchCheck'
import CheckNoPass from './operations/checkNoPass'

export default {
  components: {
    EtButtonList,
    BatchCheck,
    CheckNoPass
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
        // 'organization_type',
        // 'school',
        // "plan_type",
        'start_date',
        'end_date',
        'funds',
        'funds_expert'
      ], // 表中显示的列
      listColumnsChecked: [
        'name',
        'year',
        // 'organization_type',
        // 'school',
        // "plan_type",
        'start_date',
        'end_date',
        'status',
        'funds',
        'funds_expert'
      ],
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      checkRoute: {},
      drawerVisible: false, // 是否显示精确查找
      apiQueryData: {}, // 调用接口传递的参数
      apiQueryCheckedData: {},
      activeStatus: 'commonWaitCheck',
      trainPlanCheckStatusList: [],
      yearList: [],
      organizationTypeList: [],
      organizationList: [],
      organizationLoading: false,
      batchDialogVisible: false,
      checkNoPassVisible: false,
      checkNoPassData: {}
    }
  },
  created() {
    const educationActiveStatus = sessionStorage.getItem('educationActiveStatus')
    if (educationActiveStatus) {
      this.activeStatus = JSON.parse(educationActiveStatus)
    }
    this.init()
  },
  beforeDestroy() {
    sessionStorage.setItem('educationActiveStatus', JSON.stringify(this.activeStatus))
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
        JSON.stringify(this.detailRoute) !== '{}' ||
        JSON.stringify(this.editRoute) !== '{}' ||
        JSON.stringify(this.deleteRoute) !== '{}'
      ) {
        this.showOperations = true
      }
      getSysconst('Train_Plan_Check_Status').then(res => {
        this.trainPlanCheckStatusList = res.data
      })
      this.getSearchList(this.activeStatus)
      // this.getAnnualTrainplanInfo(this.activeStatus)
    },
    /* =======table事件 begin=======*/
    tableRowClassName({ row, rowIndex }) {
      //  table 行背景class,如下为 字段status == deleted时，该行的class 为 warning-row
      // if (row.status === 'deleted') {
      //   return 'warning-row'
      // }
      return ''
    },
    getSearchList() {
      Promise.all([
        getAnnualTrainPlanYearList({ is_active: true, limit: 10000, ordering: 'year', plan_type__code: 'CGPX' }),
        getOrganizationTypeList({ limit: 10000 })
      ]).then(response => {
        this.yearList = response[0].data
        this.organizationTypeList = response[1].data
        if (response[0].data.length > 0) {
          this.handleDefaultYear()
          this.handleFilter()
        }
      })
    },
    handleExport() {
      const activeStatus = this.activeStatus
      let getData
      let exportName
      switch (activeStatus) {
        case 'commonWaitCheck':
          exportName = '常规培训待审核'
          getData = { flow: 2, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'CGPX' }
          break
        case 'uniqueWaitCheck':
          exportName = '特色培训待审核'
          getData = { flow: 2, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'TSPX' }
          break
        case 'commonChecked':
          exportName = '常规培训已审核'
          getData = { flow: 3, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'CGPX' }
          break
        case 'uniqueChecked':
          exportName = '特色培训已审核'
          getData = { flow: 3, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'TSPX' }
          break
      }
      categoryExport(getData).then(res => {
        fileDownload(res, `${exportName}.xls`)
      })
    },
    handleBatchCheck() {
      this.batchDialogVisible = true
    },
    handeCheckedChange() {
      this.batchDialogVisible = false
      this.getAnnualTrainplanInfo(this.activeStatus)
    },
    handleDefaultYear() {
      const currentYear = new Date().getFullYear()
      let yearId = ''
      this.yearList.forEach(item => {
        if (item.year === currentYear) {
          yearId = item.id
        }
      })
      if (yearId) {
        this.$set(this.search, 'year__id', yearId)
      } else if (this.yearList.length > 0) {
        this.$set(this.search, 'year__id', this.yearList[0].id)
      }
    },
    handleSelectionChange(val) {
      this.listSelection = val
    },
    /* =======table事件 end=======*/
    /* =======table 操作列事件 begin=======*/
    handleDeleteClick(row) {
      // 如有删除的路由则弹出删除提示框并调用删除接口删除
      if (JSON.stringify(this.deleteRoute !== '{}')) {
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
      this.listSelection = []
      this.apiQueryData.offset = 0
      this.listParameters.page = 1
      sessionStorage.setItem('educationActiveStatus', JSON.stringify(this.activeStatus))
      this.getAnnualTrainplanInfo(this.activeStatus)
    },
    getAnnualTrainplanInfo(activeStatus) {
      this.listLoading = true
      let getData
      switch (activeStatus) {
        case 'commonWaitCheck':
          getData = { flow: 2, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'CGPX' }
          break
        case 'uniqueWaitCheck':
          getData = { flow: 2, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'TSPX' }
          break
        case 'commonChecked':
          getData = { flow: 3, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'CGPX' }
          break
        case 'uniqueChecked':
          getData = { flow: 3, ...this.apiQueryData, ...this.search, ordering: '-id', plan_type__code: 'TSPX' }
          break
      }
      annualTrainplanInfo(getData).then(res => {
        // if(activeStatus === 'waitCheck'){

        // }else{
        //   this.listChecked = res.data;
        //   this.listParametersChecked.total = res.count
        // }
        this.list = res.data
        this.listParameters.total = res.count
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCheck(row) {
      this.$router.push({
        path: this.checkRoute.path,
        query: { id: row.id, year: row.year.year, school: row.school && row.school.name }
      })
    },
    handleCheckPass(row) {
      let checkData
      if (this.activeStatus === 'commonWaitCheck') {
        checkData = { plan: row.id, status: 2, approve_comment: '' }
      } else {
        checkData = { plan: row.id, funds: row.fast_education_funds, status: 2, approve_comment: '' }
      }
      educationSubmitCheck(checkData).then(res => {
        this.$message.success(this.$t('message.checkEduSuccess'))
        this.getAnnualTrainplanInfo(this.activeStatus)
      })
    },
    handleCheckNoPass(row) {
      this.checkNoPassData = row
      this.checkNoPassVisible = true
    },
    handeApproveChange(val) {
      let checkData
      if (this.activeStatus === 'commonWaitCheck') {
        checkData = { plan: this.checkNoPassData.id, status: 2, approve_comment: val.approve_comment }
      } else {
        checkData = { plan: this.checkNoPassData.id, funds: this.checkNoPassData.fast_education_funds, status: 2, approve_comment: val.approve_comment }
      }
      educationSubmitCheck(checkData).then(res => {
        this.$message.success(this.$t('message.checkEduSuccess'))
        this.getAnnualTrainplanInfo(this.activeStatus)
      })
      this.checkNoPassVisible = false
    },
    handleDetail(row) {
      this.$router.push({
        path: this.detailRoute.path,
        query: { id: row.id, year: row.year.year, school: row.school && row.school.name }
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
        case 'funds_expert':
          return row.funds_expert ? row.funds_expert.funds : ''
        case 'status':
          var status = this.trainPlanCheckStatusList.find(item => item.code === row.status)
          return status.name
        case 'funds_education':
          return row.funds_education ? row.funds_education.approve_comment : ''
        case 'plan_type':
          return row.plan_type.name
        case 'education_funds':
          return row.funds_education ? row.funds_education.funds : ''
        default:
          return row[column.property]
      }
    },
    handleOrgTypeChange() {
      // 清空学校
      this.organizationList = []
      this.$set(this.search, 'school__id', '')
    },
    handleOrganizationFocus() {
      if (!this.search.school__organization_type__id) {
        this.organizationList = []
        return false
      }
      this.organizationLoading = true
      getOrganizationInfoList({
        organization_type__id: this.search.school__organization_type__id,
        limit: 10000
      }).then((response) => {
        this.organizationLoading = false
        this.organizationList = response.data
      }, () => (this.organizationLoading = false))
    },
    handelEducationFundsBlur(row) {
      educationSubmitCheck({ plan: row.id, funds: row.fast_education_funds, status: 2, approve_comment: '' }).then(res => {
        this.$message.success(this.$t('message.checkEduSuccess'))
        this.getAnnualTrainplanInfo(this.activeStatus)
      })
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
