<!--/*
 * @Name:
 * @Module:
 * @Desc:
 * @Author: Elliot.Wang
 * @Date: 2019-08-12 10:09:22
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-08-12 10:09:22
 * @param {Boolean} [showColumnList]    - table中显示的字段，默认为所有
 * @param {Boolean} [showConfirm]    - 是否显示确定按钮，默认显示,true
 * @param {Boolean} [showReset]    - 是否显示重置按钮，默认显示,true
 * @param {String} [dataFromCategory]    - 试题分类
 * @param {String} [dataFromType]    - 试题题型
 * @param {Array} [selectedIds]    - 已经选中的行
 * @param:  {Method} [change]  - 选项改变事件
 * @example:
 <et-student-table  @change='handleGetStudent'></et-student-table>
*/-->

<template>
  <div class='app-container'>
    <et-drawer
      :drawerVisible.sync='drawerVisible'
      direction='top'
      :confirmBtnName="$t('button.search')"
      :scroll="true"
      @close='handleExactSearchCancle'
      @cancle='handleExactSearchCancle'
      @confirm='handleExactSearchConfirm'
      height='50%'
      @reset='handleExactSearchReset'
    >
      <el-form
        ref='exactSearchForm'
        label-width='100px'
        :model='exactSearchData'
        label-suffix=':'
      >
        <el-col :span='8'>
          <el-form-item
            :label="$t('question.code')"
            prop='code'
          >
            <el-select
              v-model='exactSearchData.code.type'
              :placeholder="$t('common.select')"
              class='exactSearchSelect'
              popper-class='exactSearchSelectZIndex'
            >
              <el-option
                v-for="item in charFilter"
                :key="item.value"
                :label="item.label"
                :value="'code'+item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="exactSearchData.code.type !='code__isnull' && exactSearchData.code.type !='code__notnull'"
              v-model='exactSearchData.code.value'
              class='exactSearchInput'
              type='text'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='8'>
          <el-form-item
            :label="$t('question.evaluation_type')"
            prop='evaluation_type'
          >
            <el-select
              v-model='exactSearchData.evaluation_type.value'
              :placeholder="$t('common.select')"
              filterable
              value-key='code'
              popper-class='exactSearchSelectZIndex'
              style="width:95%"
            >
              <el-option
                v-for='item in evaluation_type_Operations'
                :key='item.code'
                :label='item.name'
                :value='item.code'
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span='8'>
          <el-form-item
            :label="$t('question.course')"
            prop='course'
          >
            <el-select
              v-model='exactSearchData.course__name.type'
              :placeholder="$t('common.select')"
              class='exactSearchSelect'
              popper-class='exactSearchSelectZIndex'
            >
              <el-option
                v-for="item in charFilter"
                :key="item.value"
                :label="item.label"
                :value="'course__name'+item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="exactSearchData.course__name.type !='course__name__isnull' && exactSearchData.course__name.type !='course__name__notnull'"
              v-model='exactSearchData.course__name.value'
              class='exactSearchInput'
              type='text'
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span='8'>
          <el-form-item
            :label="$t('question.level')"
            prop='level'
          >
            <el-select
              v-model='exactSearchData.level__name.type'
              :placeholder="$t('common.select')"
              class='exactSearchSelect'
              popper-class='exactSearchSelectZIndex'
            >
              <el-option
                v-for="item in charFilter"
                :key="item.value"
                :label="item.label"
                :value="'level__name'+item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="exactSearchData.level__name.type !='level__name__isnull' && exactSearchData.level__name.type !='level__name__notnull'"
              v-model='exactSearchData.level__name.value'
              class='exactSearchInput'
              type='text'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='8'>
          <el-form-item
            :label="$t('question.question_stem')"
            prop='question_stem'
          >
            <el-select
              v-model='exactSearchData.question_stem.type'
              :placeholder="$t('common.select')"
              class='exactSearchSelect'
              popper-class='exactSearchSelectZIndex'
            >
              <el-option
                v-for="item in charFilter"
                :key="item.value"
                :label="item.label"
                :value="'question_stem'+item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="exactSearchData.question_stem.type !='question_stem__isnull' && exactSearchData.question_stem.type !='question_stem__notnull'"
              v-model='exactSearchData.question_stem.value'
              class='exactSearchInput'
              type='text'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='8'>
          <el-form-item
            :label="$t('question.question_choice')"
            prop='question_choice'
          >
            <el-select
              v-model='exactSearchData.question_choice.type'
              :placeholder="$t('common.select')"
              class='exactSearchSelect'
              popper-class='exactSearchSelectZIndex'
            >
              <el-option
                v-for="item in charFilter"
                :key="item.value"
                :label="item.label"
                :value="'question_choice'+item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="exactSearchData.question_choice.type !='question_choice__isnull' && exactSearchData.question_choice.type !='question_choice__notnull'"
              v-model='exactSearchData.question_choice.value'
              class='exactSearchInput'
              type='text'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='8'>
          <el-form-item
            :label="$t('question.question_answer')"
            prop='question_answer'
          >
            <el-select
              v-model='exactSearchData.question_answer.type'
              :placeholder="$t('common.select')"
              class='exactSearchSelect'
              popper-class='exactSearchSelectZIndex'
            >
              <el-option
                v-for="item in charFilter"
                :key="item.value"
                :label="item.label"
                :value="'question_answer'+item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="exactSearchData.question_answer.type !='question_answer__isnull' && exactSearchData.question_answer.type !='question_answer__notnull'"
              v-model='exactSearchData.question_answer.value'
              class='exactSearchInput'
              type='text'
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='8'>
          <el-form-item
            :label="$t('question.question_analysis')"
            prop='question_analysis'
          >
            <el-select
              v-model='exactSearchData.question_analysis.type'
              :placeholder="$t('common.select')"
              class='exactSearchSelect'
              popper-class='exactSearchSelectZIndex'
            >
              <el-option
                v-for="item in charFilter"
                :key="item.value"
                :label="item.label"
                :value="'question_analysis'+item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="exactSearchData.question_analysis.type !='question_analysis__isnull' && exactSearchData.question_analysis.type !='question_analysis__notnull'"
              v-model='exactSearchData.question_analysis.value'
              class='exactSearchInput'
              type='text'
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </et-drawer>
    <div
      class='filter-container'
      style='float: left;'
    >
      <el-input
        v-model='searchKey'
        :placeholder="$t('common.searchKey')"
        style='width: 300px;'
        class='filter-item'
        @keyup.enter.native='handleFilter'
      />
      <el-button
        type='primary'
        icon='el-icon-search'
        class='filter-item'
        @click='handleFilter'
      >{{ $t('button.search') }}</el-button>
      <el-button
        type='primary'
        icon='el-icon-zoom-in'
        class='filter-item'
        @click="drawerVisible = true"
      >{{ $t('button.exactSearch') }}</el-button>
    </div>

    <div
      class='filter-container'
      style='float: left;'
    >
      <el-button
        type='primary'
        class='filter-item'
        v-if="showConfirm"
        @click="handleConfirm"
      >{{ $t('button.confirm') }}</el-button>
      <el-button
        type='primary'
        class='filter-item'
        v-if="showReset"
        @click="handleReload"
      >{{ $t('button.reset') }}</el-button>
    </div>
    <el-table
      v-loading='listLoading'
      :data='list'
      border
      fit
      highlight-current-row
      @selection-change='handleSelectionChange'
      :row-class-name='tableRowClassName'
      stripe
      ref="questionTable"
      :row-key="getRowKeys"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      >
      </el-table-column>
      <el-table-column
        prop="code"
        :label="$t(`question.code`)"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="evaluation_type"
        :label="$t(`question.evaluation_type`)"
        width="150"
        :formatter="handleFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="course"
        :label="$t(`question.course`)"
        width="200"
      >
        <template slot-scope='scope'>
          <span>{{'course' | getColumnContent(scope.row['course'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        :label="$t(`question.level`)"
        width="100"
      >
        <template slot-scope='scope'>
          <span>{{'level' | getColumnContent(scope.row['level'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        :label="$t(`question.category`)"
        width="100"
        :formatter="handleFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        :label="$t(`question.type`)"
        width="100"
        :formatter="handleFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="question_stem"
        :label="$t(`question.question_stem`)"
        show-overflow-tooltip
      >
        <template slot-scope='scope'>
          {{scope.row['question_stem']}}
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
import { getQuestionList, deleteQuestion, exportQuestion } from '@/api/exammanage/question'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'
import { charFilter, intFilter, dateFilter } from '@/api/filterType'
import { exactSearchFilterData } from '@/utils/exactSearchFilter'
import { getSysconst } from '@/api/utils'
import EtDrawer from '@/components/EtDrawer'


export default {
    components: {
        EtDrawer
    },
    filters: {
        //返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
        //item:字段名称，content:字段内容
        getColumnContent(item, content) {
            switch (item) {
                case 'course':
                    return content == null ? content : content.name
                case 'level':
                    return content == null ? content : content.name
                default:
                    return content
            }
        }
    },
    props: {
        showColumnList: {
            type: Array,
            default: () => {
                return ['course', 'category', 'type', 'level', 'evaluation_type', 'code', 'question_stem']
            }
        },
        // 是否显示重置按钮
        showReset: {
            type: Boolean,
            default: true
        },
        // 是否显示确定按钮
        showConfirm: {
            type: Boolean,
            default: true
        },
        //试题分类
        dataFromCategory: {
            type: String,
            default: ''
        },
        //试题题型
        dataFromType: {
            type: String,
            default: ''
        },
        //已经选中的id
        selectedIds: {
            type: Array,
            default: function() {
                return []
            }
        },
        //所属课程
        dataFromCourse:{
          type:Number,
          default:-99
        }
    },
    watch: {
        dataFromCategory: {
            deep: true,
            handler(nv, ov) {
                this.init()
            }
        },
        dataFromType: {
            deep: true,
            handler(nv, ov) {
                // this.dataFromId = nv
                this.init()
            }
        },
        selectedIds: {
            deep: true,
            handler(nv, ov) {
                this.init()
            }
        }
    },
    data() {
        return {
            searchKey: '',
            list: [], //table数据
            listLoading: true, //是否显示loading
            listSelection: [], //选择的行数据
            listParameters: {
                total: 0, //数据总数,默认为0
                pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
                page: 1,
                limit: 10,
            },
            listColumns: this.showColumnList, //表中显示的列
            showOperations: false, //是否显示操作列
            detailRoute: {}, //操作列详情
            editRoute: {}, //操作列编辑
            deleteRoute: {}, //操作列删除
            drawerVisible: false, //是否显示精确查找
            apiQueryData: {}, //调用接口传递的参数
            exactSearchData: { //精确查找的model
                course__name: { value: '', type: '', value_range: '' },
                level__name: { value: '', type: '', value_range: '' },
                evaluation_type: { value: '', type: 'evaluation_type', value_range: '' },
                code: { value: '', type: '', value_range: '' },
                question_stem: { value: '', type: '', value_range: '' },
                question_choice: { value: '', type: '', value_range: '' },
                question_answer: { value: '', type: '', value_range: '' },
                question_analysis: { value: '', type: '', value_range: '' },
                remark: { value: '', type: '', value_range: '' },
            },
            charFilter,
            intFilter,
            dateFilter,
            category_Operations: {},
            type_Operations: {},
            evaluation_type_Operations: {},
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        /* =======table事件 begin=======*/
        getRowKeys(row) {
            return row.id
        },
        tableRowClassName({ row, rowIndex }) {
            //  table 行背景class,如下为 字段status == deleted时，该行的class 为 warning-row
            // if (row.status === 'deleted') {
            //   return 'warning-row'
            // }
            return ''
        },
        handleSelectionChange(val) {
            this.listSelection = val
            // this.$emit("selectStudent",this.listSelection)
        },

        init() {
            this.handleReset()
            Promise.all([
                    getSysconst('Paper_Type'),
                    getSysconst('Question_Type'),
                    getSysconst('Evaluate_Type'),
                ])
                .then(response => {
                    this.category_Operations = response[0].data
                    this.type_Operations = response[1].data //.filter(item => item.code.indexOf(this.dataFromCategory) == 0)
                    this.evaluation_type_Operations = response[2].data

                    this.getListData()
                })
        },
        getListData(reload = false) {
            this.listLoading = true
            this.apiQueryData.type = this.dataFromType
            this.apiQueryData.category = this.dataFromCategory
            if(this.dataFromCourse!=-99)
              {
                this.apiQueryData.course__id=this.dataFromCourse
              }

            getQuestionList(this.apiQueryData).then(response => {
                this.list = response.data
                this.listParameters.total = response.count
                if (reload == false) {
                    this.$nextTick(() => {
                        if (this.selectedIds.length > 0) {
                            let selectedItems = []
                            this.selectedIds.forEach(itemIds => {
                                let i = this.list.filter(item => item.id == itemIds)[0]
                                // let idIndex = this.list.findIndex(item => item.id == itemIds)
                                // if (idIndex > 0) {
                                if (i != null) {

                                    this.$refs.questionTable.toggleRowSelection(i, true)
                                }
                            })
                        }
                    })
                }
                if (reload == true) {

                    this.$nextTick(() => {
                        this.$refs.questionTable.clearSelection()
                    })
                }
                this.listLoading = false
            })
        },
        /* =======table事件 end=======*/
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
        },
        /* =======精确查找事件 end=======*/
        /* =======确定选择和重置事件 begin=======*/
        handleConfirm() {
            this.$emit("selectQuestion", this.listSelection)
        },
        handleReset() {
            this.listParameters = {
                total: 0, //数据总数,默认为0
                pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
                page: 1,
                limit: 10,
            }
            this.list = []
            this.listSelection = []
            this.apiQueryData = {}
            this.$nextTick(() => {
                this.$refs.questionTable.clearSelection()
            })
        },
        /* =======确定选择和重置事件 end=======*/
        handleFormatter(row, column) {
            // 格式化 
            switch (column.property) {
                case 'category':
                    return this.category_Operations.filter(item => item.code.indexOf(row.category) > -1)[0].name
                case 'type':
                    return this.type_Operations.filter(item => item.code.indexOf(row.type) > -1)[0].name
                case 'evaluation_type':
                    return this.evaluation_type_Operations.filter(item => item.code.indexOf(row.evaluation_type) > -1)[0].name
            }
        },
        handleReload() {
            this.handleReset()
            this.getListData(true)
        }
    }
}
</script>

<style lang='scss'>
.el-table .warning-row {
  background: #f5c0c0;
}
</style>