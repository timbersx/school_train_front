<!--/*
 * @Name: questionnaire
 * @Module:  src/views/questionnaire/questionnaire/index
 * @Desc: questionnaire
 * @Author:  shenyj
 * @Date:  2021-06-21 14:37:00
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class="app-container">
    <detail-dialog :detailData="detailData" :visible.sync="detailDialogVisible"/>
    <release-dialog :detailData="detailData" :visible.sync="releaseDialogVisible" @updateSave="handleUpdateSave"/>
    <access-dialog :detailData="detailData" :visible.sync="accessDialogVisible"/>
    <edit-dialog :detailData="detailData" :visible.sync="editDialogVisible" @updateSave="handleUpdateSave"/>
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>

    <div class="filter-container" style="float: left;">
      <el-input
        v-model="searchKey"
        :placeholder="$t('common.searchKey')"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        class="filter-item"
        @click="handleFilter"
      >{{ $t('button.search') }}</el-button>
      <el-button
        type="primary"
        class="filter-item"
        @click="addBtnClick"
      >{{ $t('button.add') }}</el-button>
    </div>
    <!-- <et-button-list @btnListClick="handleBtnClick"></et-button-list> -->
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
          <span>{{scope.$index+(listParameters.page-1) * listParameters.limit + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`questionnaire.${item}`)"
        :formatter="handleFormatter"
      />
      <el-table-column fixed="right" :label="$t('common.operations')" width="350">
        <template slot-scope="scope">
          <el-button
            @click="handleDetailClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status !== 0"
          >{{ $t('route.detail') }}</el-button>
          <el-button
            @click="handleEditClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status === 0"
          >{{ $t('route.edit') }}</el-button>
          <!-- <el-button
            @click="handleAccessAddressClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status !== 0"
          >{{ $t('questionnaire.access_address') }}</el-button> -->
          <el-button
            @click="handleViewQuestionsClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status !== 0"
          >{{ $t('questionnaire.viewQuestions') }}</el-button>
          <el-button
            @click="handleSetQuestionClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status === 0"
          >{{ $t('questionnaire.set_question') }}</el-button>
          <el-button
            @click="handlePublishClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status === 0"
          >{{ $t('table.publish') }}</el-button>

          <el-button
            @click="handleSummaryClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status > 0"
          >{{ '汇总'}}</el-button>

          <el-button
            @click="handleAnalysisClick(scope.row)"
            type="text"
            v-if="scope.row.publish_status === 3 || scope.row.publish_status === 2" 
          >{{ '问卷分析详情'}}</el-button>

          <el-button
            @click="handleClosePaperClick(scope.row)"
            type="text"
            style="color:red"
            v-if="scope.row.publish_status === 1" 
          >{{ '关闭问卷'}}</el-button>
          
          <el-button
            @click="handleDeleteClick(scope.row)"
            type="text"
            style="color:red"
            v-if="scope.row.publish_status !== 3"
          >{{ $t('route.delete') }}</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-divider></el-divider>
      <div class="form-search">
      <el-form
        ref="dialogDataForm"
        label-width="150px"
        :model="dialogData"
        label-suffix=":"
        :rules="dialogDataRules"
        class="dialog-form-space"
      >
        <el-col :span="24">
          <el-form-item :label="$t('questionnaire.name')" prop="name">
            <el-input v-model="dialogData.name" type="text" maxlength="50" class="items"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="$t('questionnaire.project')" prop="project">
            <el-select
              v-model="dialogData.project"
              class="items"
              :placeholder="$t('common.select')"
              filterable
              value-key="code"
              style="width: 100%;"
              :disabled="true"
            >
              <el-option
                v-for="item in projectInfoList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?handleAddDialogData():handleUpdateDialogData()"
        >{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPaperList, deletePaper, exportPaper, createPaper, closePaper } from "@/api/municipalEvent/questionnaire";
import { getSumaryAnalysis } from '@/api/municipalEvent/questionnaireAnalysis'
import EtButtonList from "@/components/EtButtonList";
import fileDownload from "js-file-download";
import { getSysconst } from "@/api/utils";
import { getTrainEventInfoList } from '@/api/municipalEvent/municipalEventCreation';
import DetailDialog from "./operations/detail";
import ReleaseDialog from "./operations/release";
import AccessDialog from "./operations/access";
import EditDialog from "./operations/edit";
import Sticky from "@/components/Sticky";

export default {
  components: {
    EtButtonList,
    DetailDialog,
    ReleaseDialog,
    AccessDialog,
    EditDialog,
    Sticky
  },
  data() {
    return {
      detailData: {},
      searchKey: "",
      list: null, //table数据
      listLoading: false, //是否显示loading
      listSelection: [], //选择的行数据
      listParameters: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: [
        "name",
        "project",
        "start_date",
        "end_date",
        "total_score",
        "publish_status"
      ], //表中显示的列
      showOperations: false, //是否显示操作列
      detailRoute: {}, //操作列详情
      editRoute: {}, //操作列编辑
      deleteRoute: {}, //操作列删除
      drawerVisible: false, //是否显示精确查找
      apiQueryData: {}, //调用接口传递的参数
      addPath: "", //新增页面的路由
      //dialog相关内容
      publishStatusList: [],
      projectInfoList: [],
      dialogData: {},
      dialogFormVisible: false,
      dialogStatus: "",
      detailDialogVisible: false,
      releaseDialogVisible: false,
      accessDialogVisible: false,
      editDialogVisible: false,
      textMap: {
        update: this.$t("button.edit"),
        create: this.$t("button.add")
      },
      dialogPvVisible: false,
      dialogDataRules: {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        project: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ]
      },
      project__id: -1
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.apiQueryData.project__id = this.$route.query.id
      
      Promise.all([
        getSysconst("Publish_Status"),
        getTrainEventInfoList({ limit: 100000000, offset: 0 })
      ]).then(response => {
        this.publishStatusList = response[0].data;
        this.projectInfoList = response[1].data;
        this.getListData();
      });
    },
    /* =======table事件 begin=======*/
    tableRowClassName({ row, rowIndex }) {
      return "";
    },
    handleSelectionChange(val) {
      this.listSelection = val;
    },
    handleUpdateSave() {
      this.detailDialogVisible = false;
      this.releaseDialogVisible = false;
      this.accessDialogVisible = false;
      this.editDialogVisible = false;
      this.getListData();
    },
    getListData() {
      this.listLoading = true;
      getPaperList(this.apiQueryData).then(response => {
        this.list = response.data;
        this.listParameters.total = response.count;
        this.listLoading = false;
        //删除后，当前页面没有数据了，则返回上一页
        if (this.list.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset =
            this.apiQueryData.offset - this.listParameters.limit;
          this.getListData();
        }
      });
    },
    /* =======table事件 end=======*/
    /* =======table 操作列事件 begin=======*/
    handleDetailClick(row) {
      this.detailData = row;
      this.detailDialogVisible = true;
      //如有详情的路由则转向detail页面
      // if (this.detailRoute != {}) {
      //   this.$router.push({
      //     path: this.detailRoute.path,
      //     query: { id: row.id }
      //   });
      // }

    },
    handleEditClick(row) {
      //如有编辑的路由则转向eidt页面
      this.detailData = row;
      this.editDialogVisible = true
    },
    handleAccessAddressClick(row) {
      this.detailData = row;
      this.accessDialogVisible = true;
    },
    handleSetQuestionClick(row) {
      window.sessionStorage.setItem('param', JSON.stringify(row))
      this.$router.push({
        path: "set"
      });
    },
    handleViewQuestionsClick(row) {
      window.sessionStorage.setItem('param', JSON.stringify(row))
      this.$router.push({
        name: 'ViewQuestion问卷管理',
        params: { param: JSON.stringify(row) }
      })
    },
    handlePublishClick(row) {
      this.detailData = row;
      this.releaseDialogVisible = true;
    },
    handleSummaryClick(row) {
      this.listLoading = true
      getSumaryAnalysis(row.id).then(() => {
        this.$message.success(this.$t('questionnaireAnalysis.summarySuccess'))
        this.listLoading = false
        this.getListData()
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAnalysisClick(row){
      this.$router.push({
        path: "school",
        query: {paperId: row.id}
      });
    },
    handleDeleteClick(row) {
      //如有删除的路由则弹出删除提示框并调用删除接口删除
      if (this.deleteRoute != {}) {
        this.$confirm(this.$t("confirm.delete"), this.$t("confirm.warning"), {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          type: "warning"
        })
          .then(async () => {
            deletePaper(row.id).then(response => {
              this.$message.success(this.$t("message.deleteSuccess"));
              this.getListData();
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    handleClosePaperClick(row){
      closePaper(row.id, {}).then(res => {
        this.$message.success(this.$t("message.closeSuccess"));
        this.getListData();
      }).catch(err => {
            console.error(err);
          });
    },
    /* =======table 操作列事件 end=======*/

    /* =======搜索事件 begin=======*/
    handleFilter() {
      //搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        search: this.searchKey
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
    /* =======翻页事件 end=======*/

    /* =======按钮列表事件，方法名称事先约定好 begin=======*/
    handleBtnClick(btnItem) {
      //1.根据传过来的btnItem构造方法名称，并调用已写好的该方法，如btnItem.meta.title为add,则调用页面中写好的addBtnClick方法
      this[`${btnItem.meta.title}BtnClick`](btnItem);
      // //2.直接跳转路由页面
      // this.$router.push({ path:btnItem.path})
    },
    addBtnClick() {
      // this.createRoute = item;
      //   this.$router.push({ path: item.path })
      this.resetDialogData();
      this.$set(this.dialogData, 'project', parseInt(this.$route.query.id))
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dialogDataForm"].clearValidate();
      });
    },
    exportBtnClick(item) {
      let exportData = { ...this.apiQueryData };
      delete exportData.limit;
      delete exportData.offset;
      exportPaper(exportData).then(response => {
        fileDownload(response, `${this.$t("route.paper")}.xls`);
      });
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/
    /*=========Dialog事件 begin============= */
    resetDialogData() {
      this.dialogData = {};
    },
    handleAddDialogData() {
      this.$refs["dialogDataForm"].validate(valid => {
        if (valid) {
          createPaper(this.dialogData).then(res => {
            this.$router.push({
              path: 'addQuestionnaire',
              query: res.data
            });
          });
        } else {
          return false;
        }
      });
    },
    handleUpdateDialogData() {},
    handleFormatter(row, column) {
      switch (column.property) {
        case "project":
          return row.project.name;
        case "publish_status":
          return this.publishStatusList.filter(
            item => item.code === row.publish_status
          )[0].name;

        default:
          return row[column.property];
      }
    },
    handleReturn() {
      this.$router.go(-1);
    },

    /*=========Dialog事件 end============= */
  }
};
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>