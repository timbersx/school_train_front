<!--/*
 * @Name: EtControlTable
 * @Module:
 * @Desc:
 * @Author:
 * @Date: 2020-11-11 10:09:22
 * @Last Modified by:
 * @Last Modified time: 2020-11-11 10:09:22
 * @param {function} [apiMethod]          - table数据用到的api
 * @param {array} [labelList]             - 表头数组
 * @param {array} [propList]              - 对应表头变量名的数组(如：['teacher.name', 'code', 'project.file.name'])
 * @param {boolean} [showOperations]      - 是否展示操作列；默认是false
 * @param {string}} [operationsWidth]     - 自定义操作列的宽度
 * @slot name=search                      - 顶部搜索部分的插槽 参数：form (绑定到form上的对象，父组件使用时需要搭配<el-form-item>并绑定v-model)
    example: <template #search="scope">
               <el-form-item label="姓名">
                 <el-input v-model="scope.form.xm__contains" :placeholder="$t('table.input')" clearable />
              </el-form-item>
            </template>
 * @slot name=operation                   - 操作列表格的插槽 参数：row(用法同el-table-column的插槽)
 *
 * @example:
      <et-table-generate
        ref="table"
        v-model
        :api-method="getFileCateInfoList"
        :prop-list="propList"
        show-operations
        operations-width="300"
      ></et-table-generate>
*/-->

<template>
  <div>
    <el-form
      v-if="!disableSearch"
      :inline="true"
      label-suffix=":"
      :model="formInline"
      class="demo-form-inline"
    >
      <!-- 页眉的搜索部分 -->
      <slot name="search" :form="formInline" />
      <el-form-item v-if="!disableSearchBtn" class="searchBtn">
        <el-button
          class="Btn"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >{{ $t("button.search") }}</el-button>
      </el-form-item>
      <el-form-item v-if="showAddBtn" class="searchBtn">
        <el-button
          class="Btn"
          type="primary"
          @click="handleAdd"
        >{{ $t("button.add") }}</el-button>
      </el-form-item>
      <slot name="searchbtn" :form="formInline" />
      <!-- <el-form-item class="searchBtn">
        <el-button
          style="margin-bottom: 20px"
          type="primary"
          @click="addBtnClick"
        >{{ $t('button.edit') }}</el-button>
      </el-form-item> -->
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="controltable"
      v-loading="listLoading"
      :data="table"
      border
      fit
      highlight-current-row
      stripe
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-table-column v-if="showIndex" :label="$t('common.sequence')" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index+(listParameters.page-1) * listParameters.limit + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSelection"
        reserve-selection
        type="selection"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in propList"
        :key="index"
        :label="
          typeof item === 'object'
            ? $t(tableLangTitle + '.' + (item.label || item.name))
            : $t(tableLangTitle + '.' + item)
        "
        :prop="typeof item === 'object' ? item.name : item"
        :formatter="tableFormat(index)"
        :width="typeof item === 'object' ? item.width : ''"
      >
        <template v-if="typeof item === 'object' && item.slot === true" #default="scope">
          <slot :name="typeof item === 'object' ? item.name : item" :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="showOperations"
        :label="$t('common.operations')"
        :width="operationsWidth"
      >
        <template #default="scope">
          <slot name="operation" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      :page-sizes="listParameters.pageSizes"
      :current-page.sync="listParameters.page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listParameters.total"
      class="pagination-container"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 列表api方法
    apiMethod: {
      type: Function,
      default: null
    },
    // 每次调用api所需的额外参数
    apiObject: {
      type: Object,
      default() {
        return {}
      }
    },
    apiId: {
      type: null,
      default: ''
    },
    // props列表
    propList: {
      type: Array,
      default() {
        return []
      }
    },
    // 展示操作列
    showOperations: {
      type: Boolean,
      default: true
    },
    // 操作列宽度
    operationsWidth: {
      type: String,
      default: ''
    },
    // 禁用搜索框
    disableSearch: {
      type: Boolean,
      default: false
    },
    // 禁用搜索按钮
    disableSearchBtn: {
      type: Boolean,
      default: false
    },
    // 取消初始化调用
    cancelInit: {
      type: Boolean,
      default: false
    },
    // 国际化对象名
    tableLangTitle: {
      type: String,
      default: ''
    },
    // 是否展示新增按钮
    showAddBtn: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // table
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      apiQueryData: {
        limit: 10,
        offset: 0
      },
      listLoading: false,
      formInline: {},
      table: []
    }
  },
  computed: {
    tableFormat() {
      return (index) => {
        return typeof this.propList[index] === 'object' ? this.propList[index].format : null
      }
    }
  },
  created() {
    !this.cancelInit && this.init()
  },
  methods: {
    init() {
      this.getListData()
    },
    handleFilter() {
      this.apiQueryData = Object.assign({
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1)
      }, this.formInline)
      this.getListData()
      this.$emit('search', this.apiQueryData)
    },
    // 翻页事件
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
    getListData() {
      this.listLoading = true
      const submitData = Object.assign({}, this.apiQueryData, this.apiObject)
      const submitList = this.apiId ? [this.apiId, submitData] : [submitData]
      // 调用接口：
      if (!this.apiMethod) {
        this.listLoading = false
        return false
      }
      this.apiMethod(...submitList).then(response => {
        const result = response.data
        this.table = result
        this.listParameters.total = response.count
        this.listLoading = false
        // 删除后，当前页面没有数据了，则返回上一页
        if (result.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset = (Math.ceil(this.listParameters.total / this.listParameters.limit) - 1) * this.listParameters.limit
          this.getListData()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    clearListData() {
      this.list = []
      this.formInline = {}
    },
    handleAdd() {
      this.$emit('addClick')
    },
    clearSelection() {
      this.$refs.controltable.clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  box-shadow: 1px 1px 3px rgba(0, 0, 0, .3);
}
</style>
