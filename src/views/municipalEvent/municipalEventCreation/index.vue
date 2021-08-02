<!--/*
 * @Name: TrainEventInfo
 * @Module:  src/views/traineventmanage/trainEventInfo/index
 * @Desc: TrainEventInfo
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
      style="margin-top: 20px"
    >
      <el-form-item :label="$t('trainEventCheckInfo.year')">
        <el-select
          v-model="search.plan__year__id"
          :placeholder="$t('common.select')"
          filterable
          value-key="id"
        >
          <el-option
            v-for="item in year_Operations"
            :key="item.id"
            :label="item.year"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('trainEventFundsRecordInfo.train_event')">
        <el-input
          v-model="search.name__contains"
          :placeholder="$t('table.input')"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item :label="$t('trainEventInfo.plan')">
        <el-input
          v-model="search.plan__name__contains"
          :placeholder="$t('trainEventInfo.plan')"
          clearable
        />
      </el-form-item> -->

      <!-- <el-form-item :label="$t('trainEventInfo.start_date')">
        <el-date-picker
          v-model="search.start_date"
          type="date"
          :placeholder="$t('trainEventInfo.start_date')"
          clearable
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item :label="$t('trainEventInfo.end_date')">
        <el-date-picker
          v-model="search.end_date"
          type="date"
          :placeholder="$t('trainEventInfo.end_date')"
          clearable
          value-format="yyyy-MM-dd"
        />
      </el-form-item> -->

      <el-form-item :label="$t('trainEventInfo.trainEventStatus')">
        <el-select
          v-model="search.status"
          :placeholder="$t('trainEventInfo.trainEventStatus')"
          clearable
        >
          <el-option v-for="item in status_Operations" :key="item.code" :value="item.code" :label="item.name" />
        </el-select>
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
        :label="$t(`trainEventInfo.${item}`)"
        :formatter="handelFormatter"
      />

      <el-table-column
        v-if="showOperations"
        fixed="right"
        :label="$t('common.operations')"
        width="400"
      >
        <template slot-scope="scope">
          <el-button
            v-if="JSON.stringify(detailRoute) != '{}'"
            type="text"
            size="small"
            @click="handleDetailClick(scope.row)"
          >{{ $t("route.detail") }}</el-button>
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 1"
            type="text"
            size="small"
            @click="handleEditClick(scope.row)"
          >{{ $t("route.edit") }}</el-button>
          <el-button
            v-if="scope.row.status === 1 || scope.row.status === 2"
            type="text"
            size="small"
            @click="handleSignSetAndQRCodeViewClick(scope.row)"
          >{{ $t("trainEventInfo.signSetAndQRCodeView") }}</el-button>
          <el-button
            v-if="scope.row.status === 1 || scope.row.status === 2"
            type="text"
            size="small"
            @click="handleResourcesClick(scope.row)"
          >{{ $t("trainEventInfo.viewResources") }}</el-button>
          <el-button
            v-if="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3"
            type="text"
            size="small"
            @click="handleTeacherListViewClick(scope.row)"
          >{{ $t("trainEventInfo.signUpListView") }}</el-button>
          <el-button
            v-if="scope.row.status === 2"
            type="text"
            size="small"
            @click="handleQuestionnaireClick(scope.row)"
          >{{ '问卷管理' }}</el-button>
          <el-button
            v-if="scope.row.status === 2"
            type="text"
            size="small"
            @click="handleExportSignInListClick(scope.row)"
          >{{ '导出签到记录' }}</el-button>
          <el-button
            v-if="scope.row.status === 2"
            type="text"
            size="small"
            @click="handleSignUpFinClick(scope.row)"
          >{{ '结束活动' }}</el-button>
          <el-button
            v-if="scope.row.status === 0"
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
    <sign-set-and-qrcode-view
      :visible.sync="signSetAndQrcodeViewDialogVisible"
      :edit-id="editId"
    />
    <teacher-sign-up-list-view
      :visible.sync="teacherListDialogVisible"
      :edit-id="editId"
    />
     <resource-pushing :visible.sync="resourcePushingDialogVisible" :resources="fileResources" :isView="true" />
  </div>
</template>

<script>
import {
  getTrainEventInfoList,
  deleteTrainEventInfo,
  exportTrainEventInfo,
  upSignTrainEventInfo,
  exportSignInList
} from '@/api/municipalEvent/municipalEventCreation'
import {
  getAnnualTrainPlanYearList
} from '@/api/municipalPlan/municipalPlanDeclaration'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import { getSysconst } from '@/api/utils'
import SignSetAndQrcodeView from './operations/signSetAndQrcodeView'
import TeacherSignUpListView from './operations/teacherSignUpListView'
import ResourcePushing from './operations/resourcePushing';

export default {
  components: {
    EtButtonList,
    SignSetAndQrcodeView,
    TeacherSignUpListView,
    ResourcePushing
  },
  filters: {
    // 返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
    // item:字段名称，content:字段内容
    // getColumnContent(item, content) {
    //   switch (item) {
    //     case "teachers":
    //       let showValue = "";
    //       content.forEach((element) => {
    //         showValue += "、" + element.name;
    //       });
    //       return showValue.substring(1);
    //     case "plan":
    //       return content == null ? content : content.name;
    //     case "school":
    //       return content == null ? content : content.name;
    //     default:
    //       return content;
    //   }
    // },
  },
  data() {
    return {
      search: {},
      list: null, // table数据
      listLoading: true, // 是否显示loading
      listSelection: [], // 选择的行数据
      resourcePushingDialogVisible: false,
      fileResources: [],
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
        // "remark",
        // "school",
        // "budget",
        // "project_nature",
        // "train_type",
        // "enrollment_method",
        // "train_form",
        // "section_subject",
      ], // 表中显示的列
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      drawerVisible: false, // 是否显示精确查找
      apiQueryData: {}, // 调用接口传递的参数
      enrollment_method_Operations: [],
      project_nature_Operations: [],
      train_type_Operations: [],
      train_form_Operations: [],
      section_subject_Operations: [],
      status_Operations: [],
      signSetAndQrcodeViewDialogVisible: false,
      teacherListDialogVisible: false,
      editId: -1,
      year_Operations: []
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
      this.questionnaireRoute = getOperationsRoute(obj, currentPath, 'questionnaire', true)

      if (
        JSON.stringify(this.detailRoute) != '{}' ||
        JSON.stringify(this.editRoute) != '{}' ||
        JSON.stringify(this.deleteRoute) != '{}'
      ) {
        this.showOperations = true
      }

      Promise.all([
        getSysconst('Project_Enrollment_Method'),
        getSysconst('Project_Nature'),
        getSysconst('Train_Type'),
        getSysconst('Train_Form'),
        getSysconst('Section_Subject'),
        getSysconst('Train_Event_Status')
      ]).then((response) => {
        this.enrollment_method_Operations = response[0].data
        this.project_nature_Operations = response[1].data
        this.train_type_Operations = response[2].data
        this.train_form_Operations = response[3].data
        this.section_subject_Operations = response[4].data
        this.status_Operations = response[5].data
      })

      getAnnualTrainPlanYearList({is_active: true,ordering: 'year', limit: 100}).then(res => {
        this.year_Operations = res.data
        this.apiQueryData.plan__year__id = res.data.find(item => item.year == new Date().getFullYear() ).id
        this.$set(this.search, 'plan__year__id', this.apiQueryData.plan__year__id)
        this.getListData()
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
      getTrainEventInfoList({ ...this.apiQueryData, ordering: '-id'}).then((response) => {
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
            deleteTrainEventInfo(row.id).then((response) => {
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
    addQuestionnaireBtnClick(item){
      console.log(item);
    },
    addBtnClick(item) {
      this.$router.push({ path: item.path })
    },
    exportBtnClick(item) {
      const exportData = { ...this.apiQueryData }
      delete exportData.limit
      delete exportData.offset
      exportTrainEventInfo(exportData).then((response) => {
        fileDownload(response, `${this.$t('route.trainEventInfo')}.xls`)
      })
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/
    /* =======精确查找事件 begin=======*/
    handleExactSearchCancle() {},
    handleExactSearchConfirm() {
      this.apiQueryData = exactSearchFilterData(
        this.listParameters.limit,
        this.listParameters.limit * (this.listParameters.page - 1),
        this.exactSearchData
      )
      this.getListData()
    },
    handleExactSearchReset() {
      for (const item in this.exactSearchData) {
        this.exactSearchData[item].type = ''
        this.exactSearchData[item].value = ''
        this.exactSearchData[item].value_range = ''
      }
    },
    /* =======精确查找事件 end=======*/

    handelFormatter(row, column) {
      switch (column.property) {
        case 'plan':
          return row.plan.name
        case 'train_person':
          return row.train_person.name
          // case "enrollment_method":
          //   return this.enrollment_method_Operations.find((item) => {
          //     if (item.code == row.enrollment_method) {
          //       return item;
          //     }
          //   }).name;

          // case "project_nature":
          //   return this.project_nature_Operations.find((item) => {
          //     if (item.code == row.project_nature) {
          //       return item;
          //     }
          //   }).name;

          // case "train_type":
          //   return this.train_type_Operations.find((item) => {
          //     if (item.code == row.train_type) {
          //       return item;
          //     }
          //   }).name;
          // case "train_form":
          //   return this.train_form_Operations.find((item) => {
          //     if (item.code == row.train_form) {
          //       return item;
          //     }
          //   }).name;

          // case "section_subject":
          //   return this.section_subject_Operations.find((item) => {
          //     if (item.code == row.section_subject) {
          //       return item;
          //     }
          //   }).name;

        case 'status':
          const status = this.status_Operations.find((item) => {
            if (item.code == row.status) {
              return item
            }
          })
          return status.name

        default:
          return row[column.property]
      }
    },
    handleSignSetAndQRCodeViewClick(row) {
      this.editId = row.id
      this.signSetAndQrcodeViewDialogVisible = true
    },
    handleResourcesClick(row){
      this.fileResources = row.resources
      this.resourcePushingDialogVisible = true
    },
    handleTeacherListViewClick(row) {
      this.editId = row.id
      this.teacherListDialogVisible = true
    },
    handleSignUpFinClick(row) {
      upSignTrainEventInfo(row.id).then(res => {
        this.getListData()
      })
    },
    handleQuestionnaireClick(row){
      this.$router.push({
          path: this.questionnaireRoute.path,
          query: { id: row.id }
      })
    },
    handleExportSignInListClick(row){
      exportSignInList({sign_in__id: row.id}).then(res => {
        fileDownload(res, `${row.name}-签到记录.xls`)
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
