<!--/*
 * @Name: education bureau evaluation
 * @Module:  src/views/schoolBasedManage/trainEventSignUpCheck/index
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
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <span style="float: left;paddingLeft: 20px">报名方式：{{enrollType}}</span>
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <!-- <el-header style="margin-top: 20px; height: 2em">
    </el-header> -->
    <el-main>
      <el-form
        :inline="true"
        label-suffix=":"
        class="demo-form-inline"
      >
        <el-form-item :label="$t('trainEventInfo.teacherName')">
          <el-input
            v-model="search.teacher__name__contains"
            :placeholder="$t('trainEventInfo.teacherName')"
            style="width: 300px; margin-left: 0"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >{{ $t("button.search") }}</el-button
          >
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeStatus" @tab-click="handleStatusClick">
        <el-tab-pane label="待审核" name="waitCheck">
          <el-table
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            stripe
          >
            <el-table-column
              v-for="(item, index) in listColumns"
              :key="index"
              :prop="item"
              :label="$t(`trainEventSignUpCheck.${item}`)"
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="listParameters.pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParameters.total"
            class="pagination-container"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="checked">
          <el-table
            v-loading="listLoading"
            :data="listChecked"
            border
            fit
            highlight-current-row
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            stripe
          >
            <el-table-column
              v-for="(item, index) in listColumnsChecked"
              :key="index"
              :prop="item"
              :label="$t(`trainEventSignUpCheck.${item}`)"
              :formatter="handleFormatter"
            />
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeCheckedChange"
            @current-change="handleCurrentCheckedChange"
            :page-sizes="listParametersChecked.pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParametersChecked.total"
            class="pagination-container"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <check-dialog
      :editID="editID"
      :visible.sync="checkDialogVisible"
      @updateSave="handleUpdateSave"
    />
  </div>
</template>

<script>
import { getTrainEventTeacherInfo } from "@/api/traineventmanage/trainEventSignUpCheck";
import Sticky from "@/components/Sticky";
import EtButtonList from "@/components/EtButtonList";
import CheckDialog from "./check";

export default {
  components: {
    EtButtonList,
    Sticky,
    CheckDialog
  },
  data() {
    return {
      search: {},
      list: null, //table数据
      listChecked: null, //table数据
      listLoading: true, //是否显示loading
      listSelection: [], //选择的行数据
      listParameters: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10,
      },
      listParametersChecked: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10,
      },
      listColumns: [
        "school",
        "name",
        "organization_type",
        "subject",
        "id_card",
        "phone",
        "enroll_time",
      ], //表中显示的列
      listColumnsChecked: [
        "school",
        "name",
        "organization_type",
        "subject",
        "id_card",
        "phone",
        "enroll_time",
        "check_time",
        "status",
        "approve_comment",
      ],
      showOperations: false, //是否显示操作列
      detailRoute: {}, //操作列详情
      editRoute: {}, //操作列编辑
      deleteRoute: {}, //操作列删除
      checkRoute: {},
      drawerVisible: false, //是否显示精确查找
      apiQueryData: {}, //调用接口传递的参数
      apiQueryCheckedData: {},
      activeStatus: "waitCheck",
      trainPlanCheckStatusList: [],
      checkDialogVisible: false,
      editID: -1,
      enrollType: ''
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.apiQueryData.train_event__id = this.$route.query.id;
      this.enrollType = this.$route.query.enrollType;
      this.apiQueryCheckedData.train_event__id = this.$route.query.id;
      this.getListData(this.activeStatus);
    },
    tableRowClassName({ row, rowIndex }) {
      return "";
    },
    handleSelectionChange(val) {
      this.listSelection = val;
    },
    handleFilter() {
      // this.apiQueryData = {
      //   limit: this.listParameters.limit,
      //   offset: this.listParameters.limit * (this.listParameters.page - 1),
      //   ...this.search,
      // };
      this.getListData(this.activeStatus);
    },

    handleSizeChange(val) {
      this.listParameters.limit = val;
      this.apiQueryData.limit = this.listParameters.limit;
      this.getListData(this.activeStatus);
    },
    handleCurrentChange(val) {
      this.listParameters.page = val;
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1);
      this.getListData(this.activeStatus);
    },
    handleSizeCheckedChange(val) {
      this.listParametersChecked.limit = val;
      this.apiQueryCheckedData.limit = this.listParametersChecked.limit;
      this.getListData(this.activeStatus);
    },
    handleCurrentCheckedChange(val) {
      this.listParametersChecked.page = val;
      this.apiQueryCheckedData.offset =
        this.listParametersChecked.limit *
        (this.listParametersChecked.page - 1);
      this.getListData(this.activeStatus);
    },

    handleStatusClick(tab, event) {
      this.getListData(this.activeStatus);
    },
    getListData(activeStatus) {
      this.listLoading = true;
      let getData =
        activeStatus === "waitCheck"
          ? { status: false, ...this.apiQueryData, ...this.search }
          : { status: true, ...this.apiQueryCheckedData, ...this.search };
      getTrainEventTeacherInfo(getData)
        .then((res) => {
          if (activeStatus === "waitCheck") {
            this.list = res.data;
            this.listParameters.total = res.count;
          } else {
            this.listChecked = res.data;
            this.listParametersChecked.total = res.count;
          }
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    handleCheck(row) {
      this.editID = row.id
      this.checkDialogVisible = true;
    },
    handleFormatter(row, column) {
      // 格式化
      switch (column.property) {
        case "name":
          return row.teacher.name;
        case "school":
          return row.teacher.school ? row.teacher.school.name : '';
        case "subject":
          return row.teacher.subject ? row.teacher.subject.name : '';
        case "phone":
          return row.teacher.phone;
        case "id_card":
          return row.teacher.id_card;
        case "organization_type":
          return row.teacher.school.organization_type.name;
        case "status":
          return row.status ? row.is_pass ? '审核通过' : '审核不通过' : '未审核';
        default:
          return row[column.property];
      }
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleUpdateSave() {
      this.checkDialogVisible = false;
      this.getListData(this.activeStatus);
    },
  },
};
</script>

<style lang='scss' scoped>
.el-table .warning-row {
  background: #f5c0c0;
}
.el-main {
  padding-top: 5px;
}
</style>