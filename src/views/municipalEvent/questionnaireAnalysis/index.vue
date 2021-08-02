<template>
  <div class="app-container">
    <el-container>
      <el-col height="100%" style="padding: 0">
        <el-card class="box-card">
          <el-form ref="searchForm" label-suffix=":" :inline="true">
            <el-form-item :label="$t('questionnaire.name')">
              <el-input
                v-model="searchKey"
                :placeholder="$t('common.searchKey')"
                style="width: 300px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="margin-left:20px"
                @click="handleFilter"
              >{{ $t("route.list") }}</el-button>
            </el-form-item>
          </el-form>

          <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            fit
            highlight-current-row
          >
            <el-table-column :label="$t('common.sequence')" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index+(listParameters.page-1) * listParameters.limit + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column
              v-for="(item, index) in listColumns"
              :key="index"
              :prop="item"
              :label="$t(`questionnaire.${item}`)"
            >
              <template slot-scope="scope">
                <span>{{ getColumnContent(item, scope.row[item]) }}</span>
              </template>
            </el-table-column>

            <el-table-column fixed="right" :label="$t('common.operations')" width="180">
              <template slot-scope="scope">
                <div v-if="showOperation(scope.row)">
                  <el-button
                    type="text"
                    @click="handleSummaryClick(scope.row)"
                  >{{ $t('questionnaire.summary') }}</el-button>
                  <el-button
                    v-if="JSON.stringify(detailRoute)!=='{}'"
                    type="text"
                    @click="handleDetailClick(scope.row)"
                  >{{ $t('route.detail') }}</el-button>
                  <el-button
                    type="text"
                    @click="handleDeleteClick(scope.row)"
                  >{{ $t('questionnaire.export') }}</el-button>
                </div>
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
        </el-card>
      </el-col>
    </el-container>
  </div>
</template>

<script>

import {
  getPaperList
} from '@/api/municipalEvent/questionnaire'
import {
  exportQuestionnaireAnalysisAllInfo, getSumaryAnalysis
} from '@/api/municipalEvent/questionnaireAnalysis'
import { getSysconst } from '@/api/utils'
import { getOperationsRoute } from '@/utils/operations'
import fileDownload from 'js-file-download'
export default {
  components: {

  },

  data() {
    return {
      apiQueryData: {}, // 调用接口传递的参数
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listSelection: [], // 选择的行数据
      searchKey: '',
      listLoading: false,
      list: [],
      listColumns: ['name', 'project', 'publish_status'], // 表中显示的列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      publishStatusList: []
    }
  },
  computed: {
    showOperation() {
      return function(data) {
        return data.publish_status > 0
      }
    }
  },
  created() {
    getSysconst('Publish_Status').then(response => {
      this.publishStatusList = response.data
    })
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
      this.schoolRoute = getOperationsRoute(obj, currentPath, 'delete', true)
      if (JSON.stringify(this.detailRoute) !== '{}' || JSON.stringify(this.editRoute) !== '{}' || JSON.stringify(this.schoolRoute) !== '{}') { this.showOperations = true }
      this.getListData()
    },
    /* =======按钮列表事件，方法名称事先约定好 begin=======*/
    handleBtnClick(btnItem) {
      // 1.根据传过来的btnItem构造方法名称，并调用已写好的该方法，如btnItem.meta.title为add,则调用页面中写好的addBtnClick方法
      this[`${btnItem.meta.title}BtnClick`](btnItem)
      // //2.直接跳转路由页面
      // this.$router.push({ path:btnItem.path})
    },
    handleFilter() {
      // 过滤事件
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        search: this.searchKey
      }
      this.getListData()
    },
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
    getColumnContent(item, content) {
      switch (item) {
        case 'project':
          return content.name
        case 'publish_status':
          return this.publishStatusList.filter(
            item => item.code === content
          )[0].name
        default:
          return content
      }
    },
    getListData() {
      this.listLoading = true
      getPaperList(this.apiQueryData).then(response => {
        this.list = response.data
        this.listParameters.total = response.count
        this.listLoading = false
        // 删除后，当前页面没有数据了，则返回上一页
        if (this.list.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset =
            this.apiQueryData.offset - this.listParameters.limit
          this.getListData()
        }
      })
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
    handleDetailClick(row) {
      // 如有详情的路由则转向detail页面
      if (this.detailRoute !== {}) {
        this.$router.push({
          path: this.detailRoute.path,
          query: { id: row.id }
        })
      }
    },
    handleDeleteClick(row) {
      exportQuestionnaireAnalysisAllInfo(row.id).then(response => {
        fileDownload(response, `${this.$t('questionnaireAnalysis.exportAnalysis')}_${row.name}.xls`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
