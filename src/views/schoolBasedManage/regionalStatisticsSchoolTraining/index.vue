<!--/*
 * @Name: TrainEventClassHourInfo
 * @Module:  src/views/traineventmanage/trainEventClassHourInfo/index
 * @Desc: TrainEventClassHourInfo
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
    <div class='app-container'>
        <et-drawer :drawerVisible.sync='drawerVisible' direction='top' :confirmBtnName="$t('button.search')" :scroll="true" @close='handleExactSearchCancle' @cancle='handleExactSearchCancle' @confirm='handleExactSearchConfirm' height='50%' @reset='handleExactSearchReset'>
            <el-form ref='exactSearchForm' label-width='100px' :model='exactSearchData' label-suffix=':'>
                <el-col :span='8'>
                    <el-form-item :label="$t('regionalStatisticsSchoolTraining.train_event')" prop='train_event'>
                        <el-select v-model='exactSearchData.train_event__name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'train_event__name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.train_event__name.type !='train_event__name__isnull' && exactSearchData.train_event__name.type !='train_event__name__notnull'" v-model='exactSearchData.train_event__name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item :label="$t('regionalStatisticsSchoolTraining.class_hour')" prop='hours'>
                        <el-select v-model='exactSearchData.hours.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in intFilter" :key="item.value" :label="item.label" :value="'hours'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.hours.type !='hours__isnull' && exactSearchData.hours.type !='hours__notnull'" v-model='exactSearchData.hours.value' class='exactSearchInput' type='number'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item :label="$t('regionalStatisticsSchoolTraining.person_count')" prop='teacher'>
                        <el-select v-model='exactSearchData.teacher__name.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'teacher__name'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.teacher__name.type !='teacher__name__isnull' && exactSearchData.teacher__name.type !='teacher__name__notnull'" v-model='exactSearchData.teacher__name.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item :label="$t('regionalStatisticsSchoolTraining.year')" prop='remark'>
                        <el-select v-model='exactSearchData.remark.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'remark'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.remark.type !='remark__isnull' && exactSearchData.remark.type !='remark__notnull'" v-model='exactSearchData.remark.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item :label="$t('regionalStatisticsSchoolTraining.budget')" prop='remark'>
                        <el-select v-model='exactSearchData.remark.type' :placeholder="$t('common.select')" class='exactSearchSelect' popper-class='exactSearchSelectZIndex'>
                            <el-option v-for="item in charFilter" :key="item.value" :label="item.label" :value="'remark'+item.value">
                            </el-option>
                        </el-select>
                        <el-input v-show="exactSearchData.remark.type !='remark__isnull' && exactSearchData.remark.type !='remark__notnull'" v-model='exactSearchData.remark.value' class='exactSearchInput' type='text'></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </et-drawer>
        <div class='filter-container' style='float: left;'>
            <el-input v-model='searchKey' :placeholder="$t('common.searchKey')" style='width: 300px;' class='filter-item' @keyup.enter.native='handleFilter' />
            <el-button type='primary' icon='el-icon-search' class='filter-item' @click='handleFilter'>{{ $t('button.search') }}</el-button>
            <el-button type='primary' icon='el-icon-zoom-in' class='filter-item' @click="drawerVisible = true">{{ $t('button.exactSearch') }}</el-button>
        </div>
        <et-button-list @btnListClick='handleBtnClick'></et-button-list>
        <el-table v-loading='listLoading' :data='list' border fit highlight-current-row @selection-change='handleSelectionChange' :row-class-name='tableRowClassName' stripe>
            <el-table-column :label="$t('common.sequence')" width='50'>
                <template slot-scope='scope'>
              <span>{{scope.$index+(listParameters.page-1) * listParameters.limit + 1}}</span>
</template>
          </el-table-column>
          <el-table-column
              v-for='(item, index) in listColumns'
              :key='index'
              :prop='item'
              :label="$t(`regionalStatisticsSchoolTraining.${item}`)"
           >
<template slot-scope='scope'>
    <span>{{item | getColumnContent(scope.row[item])}}</span>
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
  </div>
</template>

<script>
import { getTrainEventClassHourInfoList, deleteTrainEventClassHourInfo, exportTrainEventClassHourInfo } from '@/api/traineventmanage/trainEventClassHourInfo'
import EtButtonList from '@/components/EtButtonList'
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
    filters: {
        //返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
        //item:字段名称，content:字段内容
        getColumnContent(item, content) {
            switch (item) {
                //    case 'train_event':
                //        return content==null?content:content.name
                //    case 'teacher':
                //        return content==null?content:content.name
                default: return content
            }
        }
    },
    data() {
        return {
            searchKey: '',
            list: null, //table数据
            listLoading: true, //是否显示loading
            listSelection: [], //选择的行数据
            listParameters: {
                total: 0, //数据总数,默认为0
                pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
                page: 1,
                limit: 10,
            },
            listColumns: ['year', 'school', 'train_event', 'person_count', 'class_hour', 'budget'], //表中显示的列
            showOperations: false, //是否显示操作列
            detailRoute: {}, //操作列详情
            editRoute: {}, //操作列编辑
            deleteRoute: {}, //操作列删除
            drawerVisible: false, //是否显示精确查找
            apiQueryData: {}, //调用接口传递的参数
            exactSearchData: { //精确查找的model
                train_event__name: { value: '', type: '', value_range: '' },
                hours: { value: '', type: '', value_range: '' },
                teacher__name: { value: '', type: '', value_range: '' },
                remark: { value: '', type: '', value_range: '' },
            },
            charFilter,
            intFilter,
            dateFilter,
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
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

            if (JSON.stringify(this.detailRoute) != '{}' || JSON.stringify(this.editRoute) != '{}' || JSON.stringify(this.deleteRoute) != '{}') { this.showOperations = true }
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
            //           this.listLoading = true
            //           getTrainEventClassHourInfoList(this.apiQueryData
            // ).then(response => {              this.list = response.data
            //               this.listParameters.total = response.count
            //               this.listLoading = false
            //               // 删除后，当前页面没有数据了，则返回上一页
            //               if (this.list.length <= 0 && this.listParameters.total > 0){
            //                   this.apiQueryData.offset = this.apiQueryData.offse-this.listParameters.limit
            //                   this.getListData()
            //               }
            //           })
            this.list = [{
                    person_count: '600',
                    school: '太仓市金仓湖小学',
                    class_hour: '10',
                    train_event: '2020年度第四季度校本培训活动',
                    year: '2020',
                    budget: '5000'
                },
                {
                    person_count: '500',
                    school: '太仓市金仓湖小学',
                    class_hour: '20',
                    train_event: '2020年度第三季度校本培训活动',
                    year: '2020',
                    budget: '4000'
                },
                {
                    person_count: '300',
                    school: '太仓市金仓湖小学',
                    class_hour: '13',
                    train_event: '2020年度第二季度校本培训活动',
                    year: '2020',
                    budget: '5000'
                },
                {
                    person_count: '200',
                    school: '太仓市金仓湖小学',
                    class_hour: '10',
                    train_event: '2020年度第一季度校本培训活动',
                    year: '2020',
                    budget: '3000'
                },
                {
                    person_count: '300',
                    school: '太仓市实验小学',
                    class_hour: '20',
                    train_event: '2020年度第四季度校本培训活动',
                    year: '2020',
                    budget: '2000'
                },
                {
                    person_count: '250',
                    school: '太仓市实验小学',
                    class_hour: '13',
                    train_event: '2020年度第三季度校本培训活动',
                    year: '2020',
                    budget: '1900'
                },
                {
                    person_count: '142',
                    school: '太仓市实验小学',
                    class_hour: '11',
                    train_event: '2020年度第二季度校本培训活动',
                    year: '2020',
                    budget: '1763'
                },
                {
                    person_count: '230',
                    school: '太仓市实验小学',
                    class_hour: '12',
                    train_event: '2020年度第一季度校本培训活动',
                    year: '2020',
                    budget: '2000'
                },
                {
                    person_count: '231',
                    school: '太仓市新区中学',
                    class_hour: '13',
                    train_event: '2020年度第四季度校本培训活动',
                    year: '2020',
                    budget: '2312'
                },
                {
                    person_count: '132',
                    school: '太仓市新区中学',
                    class_hour: '23',
                    train_event: '2020年度第三季度校本培训活动',
                    year: '2020',
                    budget: '12332'
                }
            ]
            this.listLoading = false
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
                        deleteTrainEventClassHourInfo(row.id).then(response => {
                            this.$message.success(this.$t('message.deleteSuccess'))
                            this.getListData();
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }
        },
        /* =======table 操作列事件 end=======*/

        /* =======搜索事件 begin=======*/
        handleFilter() {
            //搜索事件，需要根据具体页面查询条件编写
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

        /* =======按钮列表事件，方法名称事先约定好 begin=======*/
        handleBtnClick(btnItem) {
            //1.根据传过来的btnItem构造方法名称，并调用已写好的该方法，如btnItem.meta.title为add,则调用页面中写好的addBtnClick方法
            this[`${btnItem.meta.title}BtnClick`](btnItem)
            // //2.直接跳转路由页面
            // this.$router.push({ path:btnItem.path})
        },
        addBtnClick(item) {
            this.$router.push({ path: item.path })
        },
        exportBtnClick(item) {
            let exportData = { ...this.apiQueryData }
            delete exportData.limit
            delete exportData.offset
            exportTrainEventClassHourInfo(exportData).then(response => {
                fileDownload(response, `${this.$t('route.trainEventClassHourInfo')}.xls`)
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
}
</script>

<style lang='scss'>
.el-table .warning-row {
    background: #f5c0c0;
}
</style>