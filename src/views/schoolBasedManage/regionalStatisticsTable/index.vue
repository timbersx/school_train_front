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
          v-model="formData.plan__year__id"
          filterable
          placeholder="年度"
        >
          <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
        </el-select>
      </el-form-item>
      <el-form-item label="学段">
        <el-select
          v-model="formData.school__organization_type__id"
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
          v-model="formData.school__id"
          filterable
          clearable
          placeholder="学校"
          :loading="organizationLoading"
          @focus="handleOrganizationFocus"
        >
          <el-option v-for="item in organizationList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="$t('trainEventClassHourInfo.min_value')">
        <el-input
          v-model="formData.min_value"
          :placeholder="$t('trainEventClassHourInfo.min_value')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('trainEventClassHourInfo.max_value')">
        <el-input
          v-model="formData.max_value"
          :placeholder="$t('trainEventClassHourInfo.max_value')"
          clearable
        />
      </el-form-item> -->
      <el-form-item :label="'学时总计区间'">
        <div class="el-date-editor el-range-editor el-input__inner" @mouseenter="handleMouseEnter" @mouseleave="showClose = false">
          <input v-model="formData.min_value" placeholder="学时下限" class="el-range-input">
          <span class="el-range-separator">-</span>
          <input v-model="formData.max_value" placeholder="学时上限" class="el-range-input">
          <i
            :class="[showClose ? 'el-icon-circle-close' : '']"
            class="el-input__icon el-range__close-icon"
            @click="handleClickIcon(formData)"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('button.search') }}</el-button>
      </el-form-item>
      <el-form-item>
        <et-button-list @btnListClick="handleBtnClick" />
      </el-form-item>
    </el-form>
    <div class="big-title">
      <p style="marginTop: 0">学时总计：{{ totalData.total_hours }}</p>
      <el-row class="flex-container">
        <div v-for="(item, index) in totalData.course_type_list" :key="index">
          {{ item.course_type }}: {{ item.course_type_hours }}
        </div>
      </el-row>
    </div>
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
        :label="item === 'total_hours' ? '学时总计' : $t(`regionalStatisticsTable.${item}`)"
        :width="item === 'target' ? '350px' : ''"
      >
        <template slot-scope="scope">
          <span>{{ item | getColumnContent(scope.row[item], scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in extColumns" :key="index+'s'" :label="item.course_type">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetailClick(scope.row.course_type_data.course_type_list[index].event_list)">{{ scope.row.course_type_data.course_type_list[index].course_type_hours }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('common.operations')" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetailClick(scope.row)">{{ $t('route.detail') }}</el-button>
        </template>
      </el-table-column> -->
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
    <el-dialog :title="$t('route.detail')" :visible.sync="showDetailDialog" :before-close="handleCloseDialog" width="80%">
      <el-divider />
      <div class="app-container">
        <transition name="el-fade-in-linear">
          <et-control-table
            v-if="showDetailDialog"
            ref="table"
            table-lang-title="regionalStatisticsTable"
            :api-method="getCourseEvents"
            :prop-list="propList"
            :api-id="detailObj"
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
import { getCourseCategoryEventsInfo, exportCourseCategoryEvents, getCourseEvents, getCourseCategoryEventsTotalInfo } from '@/api/schoolBasedManage/regionalStatisticsTable'
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
        case 'target':
          return row.plan && row.plan[item]
        case 'confirm_amount':
          return row.enroll_confirm_amount && row.enroll_confirm_amount[item]
        case 'total_hours':
          return row.course_type_data && row.course_type_data.total_hours
        case 'organization_type':
          return row.school && row.school.organization_type && row.school.organization_type.name
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
      listColumns: ['year', 'school__organization_type__name', 'school__name', 'total_hours'], // 表中显示的列
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
      organizationLoading: false,
      planName: '校本培训学校学时统计',
      showDetailDialog: false,
      detailList: [],
      detailObj: {},
      propList: [
        { name: 'course_type.name', label: 'course_type' }, 'name', 'start_date', 'end_date',
        { label: 'confirm_amount', name: 'train_data.confirm_amount', width: '100px' },
        { label: 'total_hours', name: 'train_data.total_hours', width: '120px' },
        { label: 'class_hours', name: 'train_data.class_hours', width: '120px' }
      ],
      formData: {},
      extColumns: [],
      totalData: {
        total_hours: 0,
        course_type_list: []
      },
      showClose: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    getCourseEvents,
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
        this.$set(this.formData, 'plan__year__id', yearId)
      } else if (this.yearList.length > 0) {
        this.$set(this.formData, 'plan__year__id', this.yearList[0].id)
      }
    },
    /* =======table事件 begin=======*/
    tableRowClassName({ row, rowIndex }) {
      return ''
    },
    handleSelectionChange(val) {
      this.listSelection = val
    },
    getTitleDate() {
      const submitData = Object.assign({}, this.apiQueryData)
      getCourseCategoryEventsTotalInfo(submitData).then(response => {
        this.totalData = response.data
      })
    },
    getListData() {
      this.listLoading = true
      const submitData = Object.assign({}, this.apiQueryData)
      this.getTitleDate()
      getCourseCategoryEventsInfo(submitData).then(response => {
        const result = response.data
        this.list = result
        this.listParameters.total = response.count
        if (result.length > 0 && result[0].course_type_data) {
          this.extColumns = result[0].course_type_data.course_type_list
        } else {
          this.extColumns = []
        }
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
    handleDetailClick(event_list) {
      // 如有详情的路由则转向detail页面
      this.showDetailDialog = true
      this.detailObj = { event_list }
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
      if (!this.formData.plan__year__id) {
        return false
      }
      const exportData = { ...this.apiQueryData }
      delete exportData.limit
      delete exportData.offset
      exportCourseCategoryEvents(exportData).then(response => {
        fileDownload(response, `${this.planName}.xls`)
      })
    },
    handleCloseDialog() {
      this.showDetailDialog = false
    },
    handleOrgTypeChange() {
      // 清空学校
      this.organizationList = []
      this.$set(this.formData, 'school__id', '')
    },
    handleOrganizationFocus() {
      if (!this.formData.school__organization_type__id) {
        this.organizationList = []
        return false
      }
      this.organizationLoading = true
      getOrganizationInfoList({
        organization_type__id: this.formData.school__organization_type__id,
        limit: 10000
      }).then((response) => {
        this.organizationLoading = false
        this.organizationList = response.data
      }, () => (this.organizationLoading = false))
    },
    handleMouseEnter() {
      this.showClose = true
    },
    handleClickIcon(form) {
      delete form.max_value
      delete form.min_value
      this.showClose = false
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
.big-title {
  font-size: 20px;
  font-weight: 900;
  margin: 0 0 20px;
  text-align: center;
}
.flex-container {
  display: flex;
  justify-content: space-around;
}
</style>
