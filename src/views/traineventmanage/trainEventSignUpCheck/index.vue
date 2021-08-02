<!--/*
 * @Name: train event sign up check
 * @Module:  src/views/traineventmanage/trainEventSignUpCheck/index
 * @Desc: train event sign up check
 * @Author: shenyj
 * @Date:  2021-02-02 16:10:10
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
      <el-form-item :label="$t('trainEventInfo.name')">
        <el-input
          v-model="search.name__contains"
          :placeholder="$t('trainEventInfo.name')"
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

      <el-form-item :label="$t('trainEventInfo.start_date')">
        <el-date-picker
          v-model="search.start_date__gte"
          type="datetime"
          :placeholder="$t('trainEventInfo.start_date')"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>

      <el-form-item :label="$t('trainEventInfo.end_date')">
        <el-date-picker
          v-model="search.end_date__lte"
          type="datetime"
          :placeholder="$t('trainEventInfo.end_date')"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>

      <el-form-item><el-button
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t("button.search") }}</el-button></el-form-item>
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
        fixed="right"
        :label="$t('common.operations')"
        width="140"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleSignUpInfoAndchecklick(scope.row)"
          >{{ $t("button.signUpInfoAndcheck") }}</el-button>
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
  getTrainEventInfoList
} from '@/api/traineventmanage/trainEventInfo'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import { getSysconst } from '@/api/utils'

export default {
  components: {
    EtButtonList
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
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: [
        'name',
        'enroll_type',
        // 'plan',
        // 'train_amount',
        'enroll_amount',
        'confirm_amount',
        'start_date',
        'end_date',
        // 'status',
        'train_hour',

        // "remark",
        // "school",
        // "budget",
        // "project_nature",
        // "train_type",
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
      status_Operations: []
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
      this.viewRoute = getOperationsRoute(obj, currentPath, 'viewAndCheck', true)

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
      getTrainEventInfoList({ ...this.apiQueryData, ordering: '-id', enroll_type__code: 'SHBM' }).then((response) => {
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

    handleSignUpInfoAndchecklick(row) {
      this.$router.push({
        path: this.viewRoute.path,
        query: { id: row.id, enrollType: row.enroll_type.name }
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
        case 'enroll_type':
          return row.enroll_type.name
        case 'enroll_amount':
          return row.enroll_confirm_amount.enroll_amount
        case 'confirm_amount':
          return row.enroll_confirm_amount.confirm_amount
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
    }
  }
}
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>
