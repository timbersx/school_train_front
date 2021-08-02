<!--/*
 * @Name: school training expert manage
 * @Module:  src/views/traineventmanage/schoolTrainingExpertManage/index
 * @Desc: school training expert manage
 * @Author:  automatic code
 * @Date:  2021-02-01 09:20:00
 * @Last Modified by:   shenyj
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class="app-container">
    <div>
      <el-form :inline="true" :model="search" label-suffix=":" class="demo-form-inline">
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
        <el-form-item :label="$t('trainingExpertManage.name')">
          <el-input
            v-model="search.name__contains"
            :placeholder="$t('trainingExpertManage.name')"
            style="margin-left: 0"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('trainingExpertManage.phone')">
          <el-input
            v-model="search.phone__contains"
            :placeholder="$t('trainingExpertManage.phone')"
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
        <el-form-item>
          <et-button-list @btnListClick="handleBtnClick"></et-button-list>
        </el-form-item>
      </el-form>
    </div>
    <div>
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
          :label="$t(`trainingExpertManage.${item}`)"
          :formatter="handleFormatter"
        />

        <el-table-column :label="$t('table.actions')" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetailClick(scope.row)">{{
              $t("route.detail")
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
    </div>
  </div>
</template>

<script>
import { schoolExpertInfo } from "@/api/schoolBasedManage/schoolTrainingExpertManage";
import EtButtonList from "@/components/EtButtonList";
import { getOperationsRoute } from "@/utils/operations";
import { getOrganizationTypeList } from '@/api/systemmanage/organizationType'
import { getOrganizationInfoList } from '@/api/systemmanage/organizationInfo'

export default {
  components: {
    EtButtonList
  },
  data() {
    return {
      search: {},
      list: null, //table数据
      listChecked: null, //table数据
      listLoading: false, //是否显示loading
      listSelection: [], //选择的行数据
      listParameters: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10,
      },
      listColumns: [
        "school",
        "name",
        "phone",
        "id_card",
        "bank_card",
        "bank",
        "title",
        "post",
        "workplace",
      ], //表中显示的列
      showOperations: false, //是否显示操作列
      detailRoute: {}, //操作列详情
      editRoute: {}, //操作列编辑
      deleteRoute: {}, //操作列删除
      checkRoute: {},
      apiQueryData: {}, //调用接口传递的参数
      organizationTypeList: [],
      organizationList: [],
      organizationLoading: false
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
      this.checkRoute = getOperationsRoute(obj, currentPath, "check", true);

      if (
        JSON.stringify(this.detailRoute) != "{}" ||
        JSON.stringify(this.editRoute) != "{}" ||
        JSON.stringify(this.deleteRoute) != "{}"
      ) {
        this.showOperations = true;
      }
      Promise.all([
        getOrganizationTypeList({ limit: 10000 })
      ]).then(response => {
        this.organizationTypeList = response[0].data
      })
      this.getSchoolExpertInfo();
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
    /* =======table事件 end=======*/

    /* =======搜索事件 begin=======*/
    handleFilter() {
      //搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        ...this.search,
      };
      this.getSchoolExpertInfo();
    },
    /* =======搜索事件 end=======*/

    /* =======翻页事件 begin=======*/
    handleSizeChange(val) {
      this.listParameters.limit = val;
      this.apiQueryData.limit = this.listParameters.limit;
      this.getSchoolExpertInfo();
    },
    handleCurrentChange(val) {
      this.listParameters.page = val;
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1);
      this.getSchoolExpertInfo();
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
      this.$router.push({ path: item.path });
    },
    /* =======按钮列表事件，方法名称事先约定好 end=======*/
    handleStatusClick(tab, event) {
      this.getSchoolExpertInfo();
    },
    getSchoolExpertInfo() {
      this.listLoading = true;
      const submitData = Object.assign({ ordering: '-id' }, this.apiQueryData)
      schoolExpertInfo(submitData)
        .then((res) => {
          this.list = res.data;
            this.listParameters.total = res.count;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    handleFormatter(row, column) {
      // 格式化
      switch (column.property) {
        case 'school':
          return row.school.name
        default:
          return row[column.property];
      }
    },
    handleDetailClick(row) {
    // 如有详情的路由则转向detail页面
      if (this.detailRoute !=  {}) {
        this.$router.push({
          path: this.detailRoute.path,
          query: { id: row.id }
        })
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
    }
  },
};
</script>

<style lang='scss' scoped>
.el-table .warning-row {
  background: #f5c0c0;
}
.el-main {
  padding-top: 0;
}
</style>