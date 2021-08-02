<!--/*
 * @Name: Manage auth group
 * @Module: src/views/authGroup/index
 * @Desc: Manage auth group 
 * @Author: Elliot.Wang
 * @Date: 2019-06-10 13:08:14
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-06-10 13:08:14
 * @Param: [Null] [Null]  - Desc Null 
 * @example:
*/-->

<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="float: left;"
    >
      <el-input
        v-model="searchKey"
        :placeholder="$t('authGroup.name')"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native='handleFilter'
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        class="filter-item"
        @click="handleFilter"
      >{{ $t('button.search') }}</el-button>
      <!-- <el-button
            type='primary'
            icon='el-icon-zoom-in'
            class='filter-item'
            @click="drawerVisible = true"
          >{{ $t('button.exactSearch') }}</el-button> -->
    </div>
    <et-button-list @btnListClick="handleBtnClick"></et-button-list>

    <el-table
      :loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      stripe
    >
      <el-table-column
        label="序号"
        width="50"
      >
        <template slot-scope="scope"><span>{{scope.$index+(listParameters.page-1) * listParameters.limit + 1}} </span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`authGroup.${item}`)"
      >
        <template slot-scope="scope">
          <span>{{scope.row[item]}}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showOperations"
        fixed='right'
        :label="$t('common.operations')"
        width="130"
      >
<template slot-scope="scope">
  <div v-if="scope.row.type==1">
    <!-- <el-button
                  @click='handleDetailClick(scope.row)'
                  type='text'
                  size='small'
                  v-if="JSON.stringify(detailRoute)!='{}'"
                >{{ $t('route.detail') }}</el-button> -->
    <el-button
      @click='handleEditClick(scope.row)'
      type='text'
      size='small'
      v-if="JSON.stringify(editRoute)!='{}'"
    >{{ $t('route.edit') }}</el-button>
    <el-button
      @click='handleDeleteClick(scope.row)'
      type='text'
      size='small'
      style="color:red"
      v-if="JSON.stringify(deleteRoute)!='{}'"
    >{{ $t('route.delete') }}</el-button>
  </div>
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dialogData"
        label-width="100px"
      >
        <el-form-item
          :label="$t('authGroup.name')"
          prop="name"
        >
          <el-input v-model="dialogData.name"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('authGroup.code')"
          prop="code"
        >
          <el-input v-model="dialogData.code"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('authGroup.remark')"
          prop="remark"
        >
          <el-input
            v-model="dialogData.remark"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
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
import {
    getAuthGroupList,
    updateAuthGroup,
    createAuthGroup,
    deleteAuthGroup,
    exportAuthGroup
} from "@/api/systemmanage/authGroup";
import EtButtonList from "@/components/EtButtonList"
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
import EtDrawer from '@/components/EtDrawer'
import { charFilter, intFilter, dateFilter } from '@/api/filterType'
import { exactSearchFilterData } from '@/utils/exactSearchFilter'

export default {
    components: {
        EtButtonList,
        EtDrawer
    },
    data() {
        return {
            showOperations: false, //是否显示操作列
            detailRoute: {}, //操作列详情
            editRoute: {}, //操作列编辑
            deleteRoute: {}, //操作列删除
            searchKey: '',
            list: null, //table数据
            listLoading: true, //是否显示loading
            listSelection: [], //选择的行数据
            listParameters: {
                total: 0, //数据总数,默认为0
                pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
                page: 1,
                limit: 10
            },
            listColumns: ["name", 'code', 'remark'], //表中显示的列

            //dialog相关内容
            dialogFormVisible: false,
            dialogStatus: "",
            textMap: {
                update: this.$t("button.edit"),
                create: this.$t("button.add")
            },
            dialogPvVisible: false,

            dialogData: {
                id: 0,
                name: "",
                code: "",
                type: 1,
                remark: ""
            },
            rules: {
                name: [{
                    required: true,
                    message: this.$t("validate.required"),
                    trigger: "blur"
                }],
                code: [{
                    required: true,
                    message: this.$t("validate.required"),
                    trigger: "blur"
                }]
            },
            drawerVisible: false, //是否显示精确查找
            apiQueryData: {}, //调用接口传递的参数
            exactSearchData: { //精确查找的model
                name: { value: '', type: '', value_range: '' },
                code: { value: '', type: '', value_range: '' },
                remark: { value: '', type: '', value_range: '' },
            },
            charFilter,
            intFilter,
            dateFilter,
        };
    },
    created() {
        const obj = Array.from(this.$store.state.permission.addRoutes); //路由转换为数组
        let currentPath = this.$route.fullPath
            .substr(this.$route.fullPath.lastIndexOf('/') + 1)
            .toLowerCase() //当前路由的最后字符内容
        let indexOfParams = currentPath.indexOf('?')
        if (indexOfParams > 0) {
            currentPath = currentPath.substr(0, indexOfParams)
        }
        this.detailRoute = getOperationsRoute(obj, currentPath, 'detail', true)
        this.editRoute = getOperationsRoute(obj, currentPath, 'edit', true)
        this.deleteRoute = getOperationsRoute(obj, currentPath, 'delete', true)

        if (JSON.stringify(this.detailRoute) != '{}' || JSON.stringify(this.editRoute) != '{}' || JSON.stringify(this.deleteRoute) != '{}')
            this.showOperations = true
        this.getListData()
    },
    methods: {
        /* =======table 操作列事件 begin=======*/
        handleEditClick(row) {
            //如有编辑的路由则转向eidt页面
            if (this.editRoute != {}) {
                this.dialogData = Object.assign({}, row)
                this.dialogStatus = "update"
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs["dataForm"].clearValidate();
                });
            }
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
                        deleteAuthGroup(row.id).then(response => {
                            this.$message.success(this.$t("message.deleteSuccess"));
                            this.getListData();
                        })
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        },
        /* =======table 操作列事件 end=======*/
        /* =======table事件 begin=======*/
        tableRowClassName({ row, rowIndex }) {
            //  table 行背景class,如下为 字段status == deleted时，该行的class 为 warning-row
            // if (row.status === "deleted") {
            //   return "warning-row";
            // }
            return "";
        },
        handleSelectionChange(val) {
            this.listSelection = val;
        },
        getListData() {
            this.listLoading = true;
            getAuthGroupList(this.apiQueryData).then(response => {
                this.list = response.data;
                this.listParameters.total = response.count;
                this.listLoading = false;
                //删除后，当前页面没有数据了，则返回上一页
                if (this.list.length <= 0 && this.listParameters.total > 0) {
                    this.apiQueryData.offset = this.apiQueryData.offse - this.listParameters.limit
                    this.getListData()
                }
            })
        },

        /* =======table事件 end=======*/

        /* =======搜索事件 begin=======*/
        handleFilter() {
            //过滤事件
            this.apiQueryData = {
                limit: this.listParameters.limit,
                offset: this.listParameters.limit * (this.listParameters.page - 1),
                search: this.searchKey
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

        /* =======dialog事件 begin=======*/
        //重制dialog中的内容
        resetDialogData() {
            this.dialogData = {
                id: 0,
                name: ""
            };
        },
        handleAddDialogData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    createAuthGroup(this.dialogData).then(item => {
                        this.$message.success(this.$t("message.saveSuccess"));
                        this.dialogFormVisible = false;
                        this.getListData();
                    });
                } else {
                    return false;
                }
            });
        },
        handleUpdateDialogData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    updateAuthGroup(this.dialogData.id, this.dialogData).then(item => {
                        this.$message.success(this.$t("message.saveSuccess"));
                        this.dialogFormVisible = false;
                        this.getListData();
                    });
                } else {
                    return false;
                }
            });
        },
        /* =======dialog事件 end=======*/

        /* =======按钮列表事件，方法名称事先约定好 begin=======*/
        handleBtnClick(btnItem) {
            //1.根据传过来的btnItem构造方法名称，并调用已写好的该方法，如btnItem.meta.title为add,则调用页面中写好的addBtnClick方法
            this[`${btnItem.meta.title}BtnClick`](btnItem)

            //alert(`${btnItem.meta.title}BtnClick`)
            // //2.直接跳转路由页面
            // this.$router.push({ path:btnItem.path})
        },
        addBtnClick(item) {
            this.resetDialogData();
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        exportBtnClick(item) {
            let exportData = { ...this.apiQueryData }
            delete exportData.limit
            delete exportData.offset
            exportAuthGroup(exportData).then(response => {
                fileDownload(response, `${this.$t('route.authGroup')}.xls`)
            })
        },
        /* =======按钮列表事件，方法名称事先约定好 end=======*/
        /* =======精确查找事件 begin=======*/
        handleExactSearchCancle() {},
        handleExactSearchConfirm() {
            this.apiQueryData = exactSearchFilterData(this.listParameters.limit, this.listParameters.limit * (this.listParameters.page - 1), this.exactSearchData)
            this.getListData()
        },
        handleExactSearchReset() {
            for (let item in this.exactSearchData) {
                this.exactSearchData[item].type = ''
                this.exactSearchData[item].value = ''
                this.exactSearchData[item].value_range = ''
            }
        }
        /* =======精确查找事件 end=======*/
    }
};
</script>

<style lang="scss">
.el-table .warning-row {
  background: #f5c0c0;
}
</style>
