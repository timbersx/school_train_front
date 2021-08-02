<!--/*
 * @Name: Auth
 * @Module:  src/views/auth/index
 * @Desc: 用户管理
 * @Author: Elliot.Wang
 * @Date: 2019-06-16 13:51:52
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-06-16 13:51:52
 * @Param: [Type] [Name]  - Desc
 * @example:
*/-->

<template>
    <div class='app-container'>
        <div class='filter-container' style='float: left;'>
            <el-input v-model="searchKey" :placeholder="$t('common.searchKey')" style='width: 300px;' class='filter-item' @keyup.enter.native='handleFilter' />
            <el-button type='primary' icon='el-icon-search' class='filter-item' @click="handleFilter">{{ $t('button.search') }}</el-button>
        </div>
        <et-button-list @btnListClick='handleBtnClick'></et-button-list>
        <el-table v-loading='listLoading' :data='list' border fit highlight-current-row @selection-change='handleSelectionChange' :row-class-name='tableRowClassName' stripe>
            <el-table-column :label="$t('common.sequence')" width='50'>
                <template slot-scope='scope'>
              <span>{{scope.$index+(listParameters.page-1) * listParameters.limit + 1}}</span>
</template>
      </el-table-column>
      <!-- <el-table-column
        v-for='(item, index) in listColumns'
        :key='index'
        :prop='item'
        :label="$t(`auth.${item}`)"
        :formatter="handleFormatter"
      >
<template slot-scope='scope'>
    <span>{{item | getColumnContent(scope.row[item])}}</span>
</template>
      </el-table-column> -->
      <el-table-column
        prop="username"
        :label="$t(`auth.username`)"
      >
      </el-table-column>
      <el-table-column
        prop="nick_name"
        :label="$t(`auth.nick_name`)"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        :label="$t(`auth.mobile`)"
      >
      </el-table-column>
    //   <el-table-column
    //     prop="user_type"
    //     :label="$t(`auth.user_type`)"
    //     :formatter="handleFormatter"
    //   >
    //   </el-table-column>
      <el-table-column
        prop="user_role"
        :label="$t(`auth.user_role`)"
      >
<template slot-scope='scope'>
    <span v-for="item in scope.row.user_role" :key="item.id" style="margin-right: 10px">{{item.name}}</span>
</template>
      </el-table-column>
      <el-table-column
        v-if="showOperations"
        fixed='right'
        :label="$t('common.operations')"
        width="200"
      >
<template slot-scope="scope">
    <el-button @click='handleDetailClick(scope.row)' type='text' size='small' v-if="JSON.stringify(detailRoute)!='{}'">
        {{ $t('route.detail') }}</el-button>
    <el-button @click='handleEditClick(scope.row)' type='text' size='small' v-if="JSON.stringify(editRoute)!='{}'">{{ $t('route.edit') }}</el-button>
    <el-button @click='handleDeleteClick(scope.row)' type='text' size='small' style="color:red" v-if="JSON.stringify(deleteRoute)!='{}'">{{ $t('route.delete') }}</el-button>
    <el-button @click='handleResetPasswordsClick(scope.row)' type='text' size='small' v-if="JSON.stringify(resetPasswordsRoute)!='{}'">{{ $t('route.resetPasswords') }}</el-button>
</template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :page-sizes='listParameters.pageSizes'
      layout='total, sizes, prev, pager, next, jumper'
      :total='listParameters.total'
      class='pagination-container'
    ></el-pagination>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dialogData"
        label-width="100px"
      >
        <el-form-item
          :label="$t('auth.password')"
          prop="newPasswords"
        >
          <el-input v-model="dialogData.newPasswords"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="handleChangePasswords()"
        >{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getAuthList, deleteAuth, updateAuth, exportAuth } from '@/api/systemmanage/auth'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import { filterUserTypeName } from '@/utils/userType'
import { resetPassword } from '@/api/systemmanage/user'
import fileDownload from 'js-file-download'
import { arry_user_type } from '@/utils/userType'
import { getSysconst } from '@/api/utils'

export default {
    components: {
        EtButtonList
    },
    filters: {
        //返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
        //item:字段名称，content:字段内容
        getColumnContent(item, content) {
            switch (item) {
                // case 'user_type'://处理列表中显示用户类型
                //   return filterUserTypeName(content) 
                case 'user_role': //处理列表中显示用户角色
                      debugger
                    // let columnContent = ' '
                    // // let  arry_user_type=['A', 'C']
                    // if (content.length > 0) {
                    //     content.forEach(element => {

                    //         if (element.code && arry_user_type.findIndex(item => {
                    //                 return item == element.code
                    //             }) < 0)
                    //             columnContent += ' ' + element.name
                    //     })
                    // } else {
                    //     columnContent = ''
                    // }
                    // return columnContent
                    return content[0].name
                default:
                    return content
            }
        }
    },
    data() {
        return {
            dialogFormVisible: false,
            dialogData: {
                id: -1,
                newPasswords: ''
            },
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
            listColumns: ['username', 'nick_name', 'mobile', 'user_role'], //表中显示的列
            showOperations: false, //是否显示操作列
            detailRoute: {}, //操作列详情
            editRoute: {}, //操作列编辑
            deleteRoute: {}, //操作列删除
            resetPasswordsRoute: {}, //重置密码 
            userTypeOptions: [],
            rules: {
                newPasswords: [{
                    required: true,
                    message: this.$t("validate.required"),
                    trigger: "blur"
                }]
            }
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
        this.resetPasswordsRoute = getOperationsRoute(obj, currentPath, 'resetpasswords', true)

        if (JSON.stringify(this.detailRoute) != '{}' || JSON.stringify(this.editRoute) != '{}' || JSON.stringify(this.deleteRoute) != '{}' || JSON.stringify(this.resetPasswordsRoute) != '{}')
            this.showOperations = true
        Promise.all([
            getSysconst('User_Type'),
            this.getListData()
        ]).then(response => {
            this.userTypeOptions = response[0].data
        })

    },
    methods: {
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
            getAuthList({
                limit: this.listParameters.limit,
                offset: this.listParameters.limit * (this.listParameters.page - 1),
                search: this.searchKey
            }).then(response => {
                this.list = response.data;
                this.listParameters.total = response.count;
                this.listLoading = false;
            });
        },
        /* =======table事件 end=======*/
        /* =======table 操作列事件 begin=======*/
        handleDetailClick(row) {
            //如有详情的路由则转向detail页面
            if (this.detailRoute != {}) {
                this.$router.push({
                    path: this.detailRoute.path,
                    query: { id: row.id }
                })
            }
        },
        handleEditClick(row) {
            //如有编辑的路由则转向eidt页面
            if (this.editRoute != {}) {
                this.$router.push({
                    path: this.editRoute.path,
                    query: { id: row.id }
                })
            }
        },
        handleDeleteClick(row) {
            //如有删除的路由则弹出删除提示框并调用删除接口删除
            if (this.deleteRoute != {}) {
                this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
                        confirmButtonText: this.$t('button.confirm'),
                        cancelButtonText: this.$t('button.cancel'),
                        type: 'warning'
                    })
                    .then(async () => {
                        deleteAuth(row.id).then(response => {
                            this.$message.success(this.$t('message.deleteSuccess'))
                            this.getListData();
                        })
                    })
                    .catch(err => {
                        console.error(err);
                    })
            }
        },
        handleResetPasswordsClick(row) {
            this.resetDialogData()
            this.dialogFormVisible = true
            this.dialogData.id = row.id
        },
        /* =======table 操作列事件 end=======*/

        /* =======搜索事件 begin=======*/
        handleFilter() {
            //搜索事件，需要根据具体页面查询条件编写
            this.getListData()
        },
        /* =======搜索事件 end=======*/

        /* =======翻页事件 begin=======*/
        handleSizeChange(val) {
            this.listParameters.limit = val;
            this.getListData();
        },
        handleCurrentChange(val) {
            this.listParameters.page = val;
            this.getListData();
        },
        /* =======翻页事件 end=======*/

        /* =======按钮列表事件，方法名称事先约定好 begin=======*/
        handleBtnClick(btnItem) {
            //1.根据传过来的btnItem构造方法名称，并调用已写好的该方法，如btnItem.meta.title为add,则调用页面中写好的addBtnClick方法

            this[`${btnItem.meta.title}BtnClick`](btnItem)
            // //2.直接跳转路由页面
            // this.$router.push({ path:btnItem.path})
        },
        addBtnClick(item) {
            this.$router.push({ path: item.path });
        },
        exportBtnClick(item) {
            let exportData = { ...this.apiQueryData }
            delete exportData.limit
            delete exportData.offset
            exportAuth(exportData).then(response => {
                fileDownload(response, `${this.$t('route.auth')}.xls`)
            })
        },
        /* =======按钮列表事件，方法名称事先约定好 end=======*/

        /* =======修改密码事件 begin=======*/
        resetDialogData() {
            this.dialogData = {
                id: -1,
                newPasswords: ''
            }
        },
        handleChangePasswords() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    resetPassword(this.dialogData.id, { pwd: this.dialogData.newPasswords }).then(response => {
                        this.$message.success(this.$t("message.saveSuccess"))

                        this.resetDialogData()

                        this.loading = false
                        this.dialogFormVisible = false
                    })
                } else {
                    return false;
                }
            });
        },
        // handleFormatter(row, column) {
        //     // 格式化 
        //     switch (column.property) {
        //         case 'user_type':


        //             let result = ''
        //             log
        //             result = this.userTypeOptions.filter(item => item.code === row.user_type)[0].name
        //             return result
        //     }
        // },

        /* =======修改密码事件 end=======*/
    }
}
</script>

<style lang='scss'>
.el-table .warning-row {
    background: #f5c0c0;
}
</style>
