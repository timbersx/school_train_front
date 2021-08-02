<!--/*
 * @Name: TrainEventCheckInfo
 * @Module:  src/views/traineventmanage/trainEventCheckInfo/index
 * @Desc: TrainEventCheckInfo
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:35
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class="app-container">
    <div style="margin-top: 20px">
      <el-form
        :inline="true"
        :model="search"
        label-suffix=":"
        class="demo-form-inline"
      >
        <el-form-item :label="$t('trainEventCheckInfo.year')">
          <el-select
            v-model="search.train_event__plan__year__id"
            :placeholder="$t('common.select')"
            clearable
          >
            <el-option
              v-for="item in year_options"
              :key="item.id"
              :label="item.year"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('trainEventClassHourInfo.train_event')">
          <el-input
            v-model="search.train_event__name__contains"
            :placeholder="$t('table.input')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('schoolType.schooltype')">
          <el-select
            v-model="search.train_event__school__organization_type__id"
            :placeholder="$t('common.select')"
            @change="handelOrgTypeListChange"
            clearable
          >
            <el-option
              v-for="item in orgTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('trainEventCheckInfo.orgInfo')">
          <el-select
            v-model="search.train_event__organization"
            :placeholder="$t('common.select')"
            clearable
            filterable
          >
            <el-option
              v-for="item in orgInfoList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
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
    </div>
    <el-main style="padding-top: 0">
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
            <el-table-column :label="$t('common.sequence')" width="50">
              <template slot-scope="scope">
                <span>{{
                  scope.$index +
                  (listParameters.page - 1) * listParameters.limit +
                  1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in listColumns"
              :key="index"
              :prop="item"
              :label="$t(`trainEventCheckInfo.${item}`)"
            >
              <template slot-scope="scope">
                <span>{{ item | getColumnContent(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showOperations"
              fixed="right"
              :label="$t('common.operations')"
              width="130"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleDetailClick(scope.row)"
                  type="text"
                  size="small"
                  v-if="JSON.stringify(detailRoute) != '{}'"
                  >{{ "考核" }}</el-button
                >
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
            :data="list"
            border
            fit
            highlight-current-row
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            stripe
          >
            <el-table-column :label="$t('common.sequence')" width="50">
              <template slot-scope="scope">
                <span>{{
                  scope.$index +
                  (listParameters.page - 1) * listParameters.limit +
                  1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in listColumns"
              :key="index"
              :prop="item"
              :label="$t(`trainEventCheckInfo.${item}`)"
            >
              <template slot-scope="scope">
                <span>{{ item | getColumnContent(scope.row) }}</span>
              </template>
            </el-table-column>
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
  </div>
</template>

<script>
import {
  getTrainEventCheckInfoList,
  deleteTrainEventCheckInfo,
  exportTrainEventCheckInfo,
} from "@/api/traineventmanage/trainEventCheckInfo";
import { getAnnualTrainPlanYearList } from "@/api/traineventmanage/annualTrainPlanInfo";
import { getOrganizationTypeList } from "@/api/systemmanage/organizationType";
import { getOrganizationInfoList } from "@/api/systemmanage/organizationInfo";
import EtButtonList from "@/components/EtButtonList";
import { getOperationsRoute } from "@/utils/operations";
import fileDownload from "js-file-download";
import EtDrawer from "@/components/EtDrawer";
import { charFilter, intFilter, dateFilter } from "@/api/filterType";
import { exactSearchFilterData } from "@/utils/exactSearchFilter";

export default {
  components: {
    EtButtonList,
    EtDrawer,
  },
  filters: {
    //返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
    //item:字段名称，content:字段内容
    getColumnContent(item, content) {
      switch (item) {
        case "train_event_name":
          return content == null ? content : content.train_event.name;
        case "year":
          return content == null ? content : content.train_event.plan.year.year;
        case "school":
          return content == null ? content : content.train_event.school.name;
        case "plan":
          return content == null ? content : content.train_event.plan.name;
        case "train_project":
          return content == null ? content : content.name;
        case "check_user":
          return content.check_user
            ? content.check_user.username
            : content.check_user;

        case "result":
          // if (!content.result) {
          //   return content.result;
          // }
          if (content.result === 1) {
            return "通过";
          } else if (content.result === 2) {
            return "不通过";
          }else{
            return "未考核";
          }

        default:
          return content[item];
      }
    },
  },
  data() {
    return {
      search: {},
      searchKey: "",
      list: null, //table数据
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
        "train_event_name",
        "year",
        "plan",
        "school",
        "result",
        "check_user",
        "check_time",
        "remark",
      ], //表中显示的列
      showOperations: false, //是否显示操作列
      detailRoute: {}, //操作列详情
      editRoute: {}, //操作列编辑
      deleteRoute: {}, //操作列删除
      drawerVisible: false, //是否显示精确查找
      apiQueryData: {}, //调用接口传递的参数
      year_options: [],
      orgTypeList: [],
      orgInfoList: [],
      activeStatus: "waitCheck",
      exactSearchData: {
        //精确查找的model
        train_project: { value: "", type: "", value_range: "" },
        result: { value: "", type: "", value_range: "" },
        check_user__name: { value: "", type: "", value_range: "" },
        check_time: { value: "", type: "", value_range: "" },
        remark: { value: "", type: "", value_range: "" },
      },
      charFilter,
      intFilter,
      dateFilter,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const obj = Array.from(this.$store.state.permission.addRoutes); //路由转换为数组
      let currentPath = this.$route.fullPath
        .substr(this.$route.fullPath.lastIndexOf("/") + 1)
        .toLowerCase(); //当前路由的最后字符内容
      let indexOfParams = currentPath.indexOf("?");
      if (indexOfParams > 0) {
        currentPath = currentPath.substr(0, indexOfParams);
      }
      this.detailRoute = getOperationsRoute(obj, currentPath, "detail", true);
      this.editRoute = getOperationsRoute(obj, currentPath, "edit", true);
      this.deleteRoute = getOperationsRoute(obj, currentPath, "delete", true);

      if (
        JSON.stringify(this.detailRoute) != "{}" ||
        JSON.stringify(this.editRoute) != "{}" ||
        JSON.stringify(this.deleteRoute) != "{}"
      ) {
        this.showOperations = true;
      }
      Promise.all([
        getAnnualTrainPlanYearList({
          is_active: true,
          ordering: "year",
          limit: 100,
        }),
        getOrganizationTypeList({ limit: 1000 }),
      ]).then((res) => {
        this.apiQueryData.train_event__plan__year__id = res[0].data.find(
          (item) => item.year == new Date().getFullYear()
        ).id;
        this.$set(
          this.search,
          "train_event__plan__year__id",
          this.apiQueryData.train_event__plan__year__id
        );
        this.year_options = res[0].data;
        this.orgTypeList = res[1].data;

        this.getListData();
      });
    },
    /* =======table事件 begin=======*/
    tableRowClassName({ row, rowIndex }) {
      //  table 行背景class,如下为 字段status == deleted时，该行的class 为 warning-row
      // if (row.status === 'deleted') {
      //   return 'warning-row'
      // }
      return "";
    },
    handleSelectionChange(val) {
      this.listSelection = val;
    },
    getListData() {
      this.listLoading = true;
      this.apiQueryData.train_event__status = 3;
      if(this.activeStatus == 'waitCheck'){
        this.apiQueryData.result = 0
        this.apiQueryData.result__gt = ''
      }else{
        this.apiQueryData.result = ''
        this.apiQueryData.result__gt = 0
      }
      getTrainEventCheckInfoList(this.apiQueryData).then((response) => {
        this.list = response.data;
        this.listParameters.total = response.count;
        this.listLoading = false;
        // 删除后，当前页面没有数据了，则返回上一页
        if (this.list.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset =
            this.apiQueryData.offse - this.listParameters.limit;
          this.getListData();
        }
      });
    },
    /* =======table事件 end=======*/
    /* =======table 操作列事件 begin=======*/
    handleDetailClick(row) {
      //如有详情的路由则转向detail页面
      if (this.detailRoute != {}) {
        this.$router.push({
          path: this.detailRoute.path,
          query: { id: row.id, event: row.train_event.id },
        });
      }
    },
    handleEditClick(row) {
      //如有编辑的路由则转向eidt页面
      if (this.editRoute != {}) {
        this.$router.push({
          path: this.editRoute.path,
          query: { id: row.id, event: row.train_event.id },
        });
      }
    },
    handleDeleteClick(row) {
      //如有删除的路由则弹出删除提示框并调用删除接口删除
      if (this.deleteRoute != {}) {
        this.$confirm(this.$t("confirm.delete"), this.$t("confirm.warning"), {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          type: "warning",
        })
          .then(async () => {
            deleteTrainEventCheckInfo(row.id).then((response) => {
              this.$message.success(this.$t("message.deleteSuccess"));
              this.getListData();
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    /* =======table 操作列事件 end=======*/

    /* =======搜索事件 begin=======*/
    handleFilter() {
      //搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        search: this.searchKey,
        ...this.search,
      };
      this.getListData();
    },
    /* =======搜索事件 end=======*/

    /* =======翻页事件 begin=======*/
    handleSizeChange(val) {
      this.listParameters.limit = val;
      this.apiQueryData.limit = this.listParameters.limit;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.listParameters.page = val;
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1);
      this.getListData();
    },
    handleSizeCheckedChange(val) {
      this.listParametersChecked.limit = val;
      this.apiQueryCheckedData.limit = this.listParametersChecked.limit;
      this.getListData();
    },
    handleCurrentCheckedChange(val) {
      this.listParametersChecked.page = val;
      this.apiQueryCheckedData.offset =
        this.listParametersChecked.limit *
        (this.listParametersChecked.page - 1);
      this.getListData();
    },
    /* =======翻页事件 end=======*/

    /* =======按钮列表事件，方法名称事先约定好 begin=======*/
    handleBtnClick(btnItem) {
      //1.根据传过来的btnItem构造方法名称，并调用已写好的该方法，如btnItem.meta.title为add,则调用页面中写好的addBtnClick方法
      this[`${btnItem.meta.title}BtnClick`](btnItem);
      // //2.直接跳转路由页面
      // this.$router.push({ path:btnItem.path})
    },
    addBtnClick(item) {
      this.$router.push({ path: item.path, event: row.train_event.id });
    },
    exportBtnClick(item) {
      let exportData = { ...this.apiQueryData };
      delete exportData.limit;
      delete exportData.offset;
      exportTrainEventCheckInfo(exportData).then((response) => {
        fileDownload(response, `${this.$t("route.trainEventCheckInfo")}.xls`);
      });
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/
    /* =======精确查找事件 begin=======*/
    handleExactSearchCancle() {},
    handleExactSearchConfirm() {
      this.apiQueryData = exactSearchFilterData(
        this.listParameters.limit,
        this.listParameters.limit * (this.listParameters.page - 1),
        this.exactSearchData
      );
      this.getListData();
    },
    handleExactSearchReset() {
      for (let item in this.exactSearchData) {
        this.exactSearchData[item].type = "";
        this.exactSearchData[item].value = "";
        this.exactSearchData[item].value_range = "";
      }
    },
    handelOrgTypeListChange(val) {
      getOrganizationInfoList({ organization_type__id: val, limit: 1000 }).then(
        (res) => {
          this.orgInfoList = res.data;
        }
      );
    },
    handleStatusClick(tab, event) {
      this.getListData();
    },
    /* =======精确查找事件 end=======*/
  },
};
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>