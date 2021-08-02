<template>
  <div class="app-container">
    <el-card class="card-top">
      <span class="text-title card-head-title">
        {{data.name}}&nbsp;&nbsp;
        <!-- <span
          class="min-text"
        >{{data.start_date}}&nbsp;至&nbsp;{{data.end_date}}</span>-->
      </span>
      <el-button
        class="button-return"
        type="primary"
        @click="handleReturn"
      >{{ this.$t('button.return') }}</el-button>
    </el-card>

    <!-- 图表部分 -->
    <el-card class="card-center">
      <paper-view :data="vchartdata" />
    </el-card>

    <el-card class="card-bottom">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        stripe
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <!-- 学校名称 -->
        <el-table-column :label="$t('questionnaireAnalysis.evaluate_object')">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="schoolBtnClick(scope.row)"
            >{{ scope.row.school ? scope.row.school.name : '' }}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-for="(item, index) in listColumns"
          :key="index"
          :prop="item"
          :label="$t(`questionnaireAnalysis.${item}`)"
        >
          <template slot-scope="scope">
            <span>{{ item | getColumnContent(scope.row[item]) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import paperView from './content/paperView'

import { getOperationsRoute } from '@/utils/operations'

import { readPaper } from '@/api/municipalEvent/questionnaire'
import { getPaperAnalysis } from '@/api/municipalEvent/questionnaireAnalysis'

export default {
  components: {
    paperView
  },
  filters: {
    // 返回每列显示的内容，用于处理外键等需要处理等内容，如无特别处理的，则直接返回内容
    // item:字段名称，content:字段内容
    getColumnContent(item, content) {
      switch (item) {
        // project发布状态需要修改（后续）
        case 'project':
          return content.name
        default:
          return content
      }
    }
  },
  props: {

  },
  data() {
    return {
      id: '',
      loading: false,
      // 以下表格数据
      data: {},
      listLoading: false,
      list: [], // 后续修改：
      listSelection: {},
      listColumns: ['paper_obj_count', 'total_score', 'paper_avg_score'],
      vchartdata: []
    }
  },
  created() {
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
      this.deleteRoute = getOperationsRoute(obj, currentPath, 'school', true)
      if (JSON.stringify(this.detailRoute) !== '{}' || JSON.stringify(this.editRoute) !== '{}' || JSON.stringify(this.deleteRoute) !== '{}') { this.showOperations = true }
      this.id = this.$route.query.id
      this.loading = true
      readPaper(this.id).then(response => {
        this.data = Object.assign({}, response.data)
      })
      this.getTableList()
    },
    handleReturn() {
      this.$router.go(-1)
    },
    handleSelectionChange(val) {
      this.listSelection = val
    },
    getTableList() {
      this.listLoading = true
      getPaperAnalysis(this.$route.query.id).then(response => {
        const res = response.data
        res.forEach((item, index) => {
          if(index > 0){
            item.id = item.school.id
          }
        })
        // vchart的数据
        const vchart = JSON.parse(JSON.stringify(res))
        vchart.forEach((item, index) => {
          if(index > 0){
          item.school = item.school.name
          }
        })
        this.vchartdata = vchart
        this.list = res
      })

      this.listLoading = false
    },
    schoolBtnClick(row) {
      console.log(row);
      console.log(this.id);
      this.$router.push({
        path: 'school',
        query: { schoolId: row.id, paperId: this.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.button-return {
  float: right;
}
.text-title {
  float: left;
  line-height: 36px;
  .min-text {
    font-size: 14px;
    font-weight: bold;
  }
}
.card-top /deep/ .el-card__body {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }
}
.card-center {
  margin-top: 20px;
}
.card-bottom {
  margin-top: 20px;
}
</style>
