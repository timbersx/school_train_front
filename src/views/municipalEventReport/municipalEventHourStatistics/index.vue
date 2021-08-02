<!--/*
 * @Name: RegionalStatisticsTable
 * @Module:  src/views/schoolBasedManage/regionalStatisticsTable/index
 * @Desc: SchoolBasedTrainingStatistics
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container regional-statistics">
    <el-form
      :inline="true"
      label-suffix=":"
      class="demo-form-inline"
    >
      <el-form-item label="年度">
        <el-select
          v-model="formData.train_event__plan__year__id"
          filterable
          placeholder="年度"
        >
          <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
        </el-select>
      </el-form-item>
      <el-form-item label="学段">
        <el-select
          v-model="formData.teacher__school__organization_type__id"
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
          v-model="formData.teacher__school__id"
          filterable
          clearable
          placeholder="学校"
          :loading="organizationLoading"
          @focus="handleOrganizationFocus"
        >
          <el-option v-for="item in organizationList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="教师姓名">
        <el-input v-model="formData.teacher__name" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('button.search') }}</el-button>
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
        :width="item==='id_card' ? '170px' : ''"
        :label="$t(`regionalTeacherHourStatistics.${item}`)"
      >
        <template slot-scope="scope">
          <span>{{ item | getColumnContent(scope.row[item], scope.row) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column v-for="(item, index) in extColums" :key="'uni' + index" :label="item.name + '学时数'">
        <template slot-scope="scope">
          <el-button type="text" @click="handleTeacherClick(scope.row, scope.row.course_type_list[index].class_hour_list, item.name)">{{ scope.row.course_type_list[index].train_hours }}</el-button>
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
    <el-dialog :title="'详情'" :visible.sync="showDetailDialog" :before-close="handleCloseDialog" width="80%">
      <el-divider />
      <div class="app-container">
        <transition name="el-fade-in-linear">
          <et-control-table
            v-if="showDetailDialog"
            ref="table"
            table-lang-title="regionalTeacherHourStatistics"
            :api-method="getTeachersHourAnalysisDetail"
            :prop-list="propList"
            :api-object="detailObj"
            :show-operations="false"
            disable-search
          />
        </transition>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">{{ $t("button.close") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EtControlTable from '@/components/EtControlTable'
import { getOrganizationTypeList } from '@/api/systemmanage/organizationType'
import { getOrganizationInfoList } from '@/api/systemmanage/organizationInfo'
import { getTeacherHourStatisticsInfo, exportTeacherHourAnalysis, getTeachersHourAnalysisDetail } from '@/api/municipalEventReport/municipalEventHourStatistics'
import EtButtonList from '@/components/EtButtonList'
import { getAnnualTrainPlanYearList } from '@/api/traineventmanage/annualTrainPlanInfo'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import { charFilter, intFilter, dateFilter } from '@/api/filterType'

export default {
  components: {
    EtButtonList,
    EtControlTable
  },
  filters: {
    // 返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
    // item:字段名称，content:字段内容
    getColumnContent(item, content, row) {
      switch (item) {
        case 'course_type':
          return content == null ? content : content.name
        case 'id_card':
          return row.teacher && row.teacher[item]
        case 'name':
          return row.teacher && row.teacher.name
        case 'school':
          return row.teacher && row.teacher.school && row.teacher.school.name
        case 'organization_type':
          return row.teacher && row.teacher.school && row.teacher.school.organization_type && row.teacher.school.organization_type.name
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
      listColumns: ['year', 'organization_type', 'school', 'name', 'id_card', 'total_hours'], // 表中显示的列
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      apiQueryData: {}, // 调用接口传递的参数
      charFilter,
      intFilter,
      dateFilter,
      yearList: [],
      organizationTypeList: [],
      organizationList: [],
      planName: '校本培训教师学时统计',
      showDetailDialog: false,
      detailList: [],
      extColums: [],
      detailObj: {},
      currentPlan: '',
      propList: [
        // { label: 'organization_type', name: 'school.organization_type.name' },
        { name: 'teacher.name', label: 'name' }, { name: 'train_event.course_type.name', label: 'course_type' },
        { label: 'train_event', name: 'train_event.name' }, { label: 'start_date', name: 'train_event.start_date' }, { label: 'end_date', name: 'train_event.end_date' },
        { label: 'train_hour', name: 'train_event.train_hour' }, 'hours'
      ],
      '详情': '',
      formData: {},
      organizationLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    getTeachersHourAnalysisDetail,
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
      Promise.all([
        getAnnualTrainPlanYearList({ is_active: true, limit: 10000, ordering: 'year' }),
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
    handleDefaultYear() {
      const currentYear = new Date().getFullYear()
      let yearId = ''
      this.yearList.forEach(item => {
        if (item.year === currentYear) {
          yearId = item.id
        }
      })
      if (yearId) {
        this.$set(this.formData, 'train_event__plan__year__id', yearId)
      } else if (this.yearList.length > 0) {
        this.$set(this.formData, 'train_event__plan__year__id', this.yearList[0].id)
      }
    },
    /* =======table事件 begin=======*/
    tableRowClassName({ row, rowIndex }) {
      return ''
    },
    handleSelectionChange(val) {
      this.listSelection = val
    },
    getListData() {
      this.listLoading = true
      const submitData = Object.assign({}, this.apiQueryData)
      getTeacherHourStatisticsInfo(submitData).then(response => {
        const result = response.data
        this.list = result
        if (result && result.length > 0) {
          console.log(result[0].course_type_list);
          this.extColums = result[0].course_type_list
        } else {
          this.extColums = []
        }
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
    handleTeacherClick(row, course) {
      // 如有详情的路由则转向detail页面
      this.showDetailDialog = true
      if (course) {
        this.detailObj = { class_hour_list: course }
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
    /* =======搜索事件 begin=======*/
    handleFilter() {
      // 搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        ...this.formData
      }
      this.getListData()
    },
    /* =======搜索事件 end=======*/

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
      if (!this.formData.train_event__plan__year__id) {
        return false
      }
      const exportData = { ...this.apiQueryData }
      // delete exportData.limit
      // delete exportData.offset
      exportTeacherHourAnalysis(exportData).then(response => {
        fileDownload(response, `${this.planName}.xls`)
      })
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/
    handlePlanChange(val) {
      if (!val) {
        this.planName = ''
        return ''
      }
      this.planName = this.planList.find(i => i.id === val).name
      // this.handleFilter()
    },
    handleCloseDialog() {
      this.showDetailDialog = false
    },
    handleOrgTypeChange() {
      // 清空学校
      this.organizationList = []
      this.$set(this.formData, 'teacher__school__id', '')
    },
    handleOrganizationFocus() {
      if (!this.formData.teacher__school__organization_type__id) {
        this.organizationList = []
        return false
      }
      this.organizationLoading = true
      getOrganizationInfoList({
        organization_type__id: this.formData.teacher__school__organization_type__id,
        limit: 10000
      }).then((response) => {
        this.organizationLoading = false
        this.organizationList = response.data
      }, () => (this.organizationLoading = false))
    }
  }
}
</script>

<style lang='scss' scoped>
.el-table .warning-row {
  background: #f5c0c0;
}
/deep/ .el-dialog {
    .el-dialog__body {
      max-height: 550px !important;
      min-height: 100px;
      overflow-y: auto;
    }
  }
</style>
