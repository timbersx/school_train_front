<!--/*
 * @Name: evaluationStandardManage
 * @Module:  src/views/schoolBasedManage/evaluationStandardManage/index
 * @Desc: evaluationStandardManage
 * @Author:  automatic code
 * @Date:  2020-05-28 13:45:38
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <el-container v-loading="wholeLoading" style="margin-top: 20px">
      <!-- 左侧区域 -->
      <el-aside>
        <et-standard-evaluate-tree
          :title="$t('evaluationStandardManage.pointerItem')"
          :tree-props="defaultProps"
          :is-show-search="true"
          :search-title="$t('indicatorManage.search')"
          @nodeClick="handleNodeClick"
        />
      </el-aside>

      <!-- 右侧区域 -->
      <el-main height="100vh">
        <el-card class="box-card-with-search" :body-style="{padding: '20px', minHeight: '500px'}">
          <div slot="header" class="clearfix pre-space">
            <span class="card-head-title score-point">{{ $t("evaluationStandardManage.score") }}</span>
            <span v-show="!addBtnDisable && selectedIndicatorTitle" class="head_title_min">
              <span class="score-point">{{ selectedIndicatorTitle }}</span>
              <span class="score-point">{{ $t('indicatorManage.score') }}:{{ score.score }}</span>
              <span
                class="score-point"
              >{{ $t('indicatorManage.fill_score_assigned') }}:{{ score.score_assigned }}</span>
              <span
                class="score-point"
              >{{ $t('indicatorManage.fill_score_left') }}:{{ score.score_left }}</span>
            </span>
          </div>
          <!-- 新增按钮和 -->
          <div class="button_group">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('button.add') }}</el-button>
          </div>

          <!-- 表格 -->
          <el-table
            ref="scoreTable"
            v-loading="loading"
            :data="scoreData"
            tooltip-effect="dark"
            style="width: 100%"
            border
            stripe
          >
            <el-table-column prop="desc" :label="$t('evaluationStandardManage.desc')">
              <template slot-scope="scope">
                <pre class="scorePointBreak">{{scope.row.desc}}</pre>
              </template>
            </el-table-column>
            <el-table-column prop="max_score" :label="$t('evaluationStandardManage.max_score')"  width="120px"/>
            <el-table-column prop="order_no" :label="$t('evaluationStandardManage.order_no')"  width="120px"/>
            <el-table-column :label="$t('table.actions')" width="180px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)"
                >{{ $t('table.edit') }}</el-button>
                <el-button
                  type="text"
                  class="red_button"
                  @click="handleDelete(scope)"
                >{{ $t('table.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>

    <add-dialog
      :add-dialog-visible.sync="addDialogVisible"
      :selected-indicator="selectedIndicatorTitle"
      :selected-indicator-id="selectedIndicatorId"
      @addScore="handleAddSubmit"
      @addScoreAndSave="handleAddSubmitAndSave($event)"
    />

    <edit-dialog
      :edit-dialog-visible.sync="editDialogVisible"
      :selected-score="selectedScore"
      :selected-indicator-id="selectedIndicatorId"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script>
import { getScorePointInfo, readScorePointInfo, delScorePointInfo } from '@/api/schoolBasedManage/evaluationStandardManage'
import { readIndicatorinfo } from '@/api/schoolBasedManage/indicatorManage'
import EtStandardEvaluateTree from '@/components/EtStandardEvaluateTree'
import EditDialog from './operations/edit'
import AddDialog from './operations/add'
export default {
  components: {
    AddDialog,
    EditDialog,
    EtStandardEvaluateTree,
  },
  data() {
    return {
      indicatorInfo: [], // 指标项数据
      defaultProps: { label: 'title', children: 'children' },
      // 当前选择的指标项id
      selectedIndicatorId: '',
      scoreData: [], // 得分点数据
      filterText: '',
      addDialogVisible: false,
      editDialogVisible: false,
      selectedIndicatorTitle: '',
      selectedScore: {},
      loading: false,
      // 选择的指标项的得分信息
      score: { score: '', score_assigned: '', score_left: '' },
      addFillVisible: false,
      scoreId: '', // 用户选择指标后才能
      isInit: false,
      detailDrawerVisible: false,
      addBtnDisable: true,
      wholeLoading: false
    }
  },
  computed: {
    operationVisible() {
      if (this.selectedIndicatorId && this.isInit === true && this.addBtnDisable === false) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.indicatorTree.filter(val)
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    },
    // 树节点点击
    handleNodeClick(item) {
      console.log(item);
      this.wholeLoading = true
      if (item.children.length === 0) {
        this.selectedIndicatorTitle = item.title
        this.selectedIndicatorId = item.key
        this.addBtnDisable = false
        // 根据选择的指标项，获取得分点
        if(item.key){
        this.getTableList()
        }else{
          this.wholeLoading = false
        }
      } else {
        this.wholeLoading = false
        this.scoreData = []
        this.selectedIndicatorId = ''
        this.selectedIndicatorTitle = ''
        this.addBtnDisable = true
        if (this.isInit) {
          this.$message.error(this.$t('tree.hasChildrenAddWaring'))
        }
      }
    },
    // 获取得分点数据
    getTableList() {
      this.loading = true
      getScorePointInfo({ limit: 100000, offset: 0, indicator__id: this.selectedIndicatorId }).then(response => {
        this.scoreData = response.data
        this.wholeLoading = false
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.wholeLoading = false
      })

      readIndicatorinfo(this.selectedIndicatorId).then(res => {
        this.score.score = res.data.score
        this.score.score_assigned = res.data.score_assigned
        this.score.score_left = res.data.score_left
      }).catch(() => {
        this.loading = false
      })
    },
    handleEdit(data) {
      this.selectedScore = Object.assign({}, data)
      console.log(this.selectedScore);
      this.editDialogVisible = true
      // this.getTableList()
    },
    handleDelete(scope) {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        delScorePointInfo(scope.row.id).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('confirm.deleteSucced')
          })
        }).then(() => {
          this.getTableList()
        })
      })
    },
    handleAdd() {
      this.addDialogVisible = true
    },
    handleDetail(data) {
      this.scoreId = Object.assign({}, data).id
      this.detailDrawerVisible = true
    },
    handleAddSubmit() {
      this.getTableList()
      this.addDialogVisible = false
    },
    handleAddSubmitAndSave(data) {
      this.scoreId = Object.assign({}, data).id
      this.addDialogVisible = false
      this.getTableList()
      this.addFillVisible = true
    },
    handleEditSubmit() {
      this.getTableList()
      this.editDialogVisible = false
    },
    handleFill(scoreData) {
      this.addFillVisible = true
      this.scoreId = scoreData.id
    }
  }
}
</script>

<style lang='scss' scoped>
.label_input {
  display: flex;
  justify-content: center;
  align-items: center;
}
aside.el-aside {
  padding: 0 20px 0 0;
  width: auto!important;
}
header.el-header {
  margin-top: 20px;
}
main.el-main {
  padding: 0;
}
.button_group {
  margin-bottom: 20px;
}
.red_button {
  color: red;
}
.head_title_min {
  font-size: 14px;
  font-weight: bold;
}
.score-point {
  margin-right: 10px;
}
.box-card-with-search{
  height: 100%;
}
</style>
