<!--/*
 * @Name: trainEventClassHourInfo
 * @Module:  src/views/traineventmanage/trainEventClassHourInfo/index
 * @Desc: trainEventClassHourInfo
 * @Author:  automatic code
 * @Date:  2021-01-22 15:10:34
 * @Last Modified by: f
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <!-- 页面跳转保留原页面需要加上👉：cancel-init -->
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <et-control-table
      ref="table"
      :api-method="getSchoolTrainEventClassHourInfoList"
      :prop-list="propList"
      :table-lang-title="pageTitle"
      operations-width="100px"
      show-selection
      cancel-init
      :row-key="(row)=>row.id"
      :api-object="apiObject"
      @selection-change="handleSelectionChange"
      @search="handleSearchTable"
    >
      <template #search="{ form }">
        <el-form-item label="教师名称">
          <el-input v-model="form.teacher__name__icontains" :placeholder="'教师名称'" clearable />
        </el-form-item>
        <el-form-item label="是否有证明材料">
          <el-select v-model="form.attachments__id__isnull" filterable clearable :placeholder="'是否有证明材料'">
            <el-option :label="'有'" :value="false" />
            <el-option :label="'无'" :value="true" />
          </el-select>
        </el-form-item>
      </template>
      <template #searchbtn>
        <el-form-item>
          <el-button
            class="Btn"
            type="primary"
            @click="handleExportClick"
          >
            导出
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            class="Btn"
            type="primary"
            @click="handleBatchRecognize"
          >
            批量认定
          </el-button>
        </el-form-item>
      </template>
      <template #attachments="scope">
        <p v-for="item in scope.row.attachments" :key="item.id" type="text"><span class="attach-text" @click="handleAttachClick(item)">{{ item.local_file_name }}</span></p>
      </template>
      <template #operation="scope">
        <el-button type="text" @click="handleRecognizeClick(scope.row)">{{ '认定学时' }}</el-button>
      </template>
    </et-control-table>

    <BatchRecognize :visible.sync="showBatchRecognize" :item-list="itemList" @save="handleBatchSave" />
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import EtControlTable from '@/components/EtControlTable'
import BatchRecognize from './BatchRecognize'
import fileDownload from 'js-file-download'
import { downloadAttachment } from '@/api/utils'
import { getOperationsRoute } from '@/utils/operations'
import { getAnnualTrainPlanSchoolInfoList } from '@/api/traineventmanage/annualTrainPlanInfo'
import { getSchoolTrainEventClassHourInfoList, exportClassHourInfo } from '@/api/traineventmanage/trainEventClassHourInfo'
const pageTitle = 'trainEventClassHourInfo'
export default {
  components: {
    Sticky,
    EtControlTable,
    BatchRecognize
  },
  data() {
    return {
      pageTitle,
      list: [],
      planList: [],
      propList: [
        { name: 'train_event.name', label: 'train_event' }, { name: 'teacher.name', label: 'teacher' },
        { name: 'train_event.train_hour', label: 'train_hour' }, 'hours', { name: 'attachments', slot: true, width: '290px' },
        { name: 'status', format: (row) => row.status ? '已认定' : '未认定' }
      ],
      recognizeRoute: {},
      apiObject: {
        ordering: '-id',
        train_event__id: this.$route.query.pId
      },
      itemList: [],
      showBatchRecognize: false
    }
  },
  created() {
    this.init()
  },
  // 页面跳转保留原页面需要加上👇
  mounted() {
    const sessionData = sessionStorage.getItem('sonpageData')
    if (sessionData) {
      Object.assign(this.$refs.table, JSON.parse(sessionData))
      this.$refs.table.getListData()
    } else {
      this.$refs.table.getListData()
    }
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteEnter(to, from, next) {
    if (!(~from.path.indexOf('recognize'))) {
      sessionStorage.removeItem('sonpageData')
    }
    next()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteLeave(to, from, next) {
    if (~to.path.indexOf('recognize')) {
      sessionStorage.setItem('sonpageData', JSON.stringify({
        apiQueryData: this.$refs.table.apiQueryData,
        listParameters: this.$refs.table.listParameters,
        formInline: this.$refs.table.formInline
      }))
    } else {
      sessionStorage.removeItem('sonpageData')
    }
    next()
  },
  methods: {
    getSchoolTrainEventClassHourInfoList,
    init() {
      Promise.all([
        getAnnualTrainPlanSchoolInfoList('Train_Plan_Check_Status')
      ]).then(response => {
        this.planList = response[0].data
      })
      this.getRoutes()
    },
    handleRecognizeClick(row) {
      this.$router.push({
        path: '/school/trainEventClassHourInfo/recognize',
        query: { tId: row.id, pId: row.teacher.id, eId: row.train_event.id }
      })
    },
    handleAttachClick(item) {
      downloadAttachment(item.id).then(res => {
        fileDownload(res, item.local_file_name)
      })
    },
    getRoutes() {
      const obj = Array.from(this.$store.state.permission.addRoutes) // 路由转换为数组
      let currentPath = this.$route.fullPath
        .substr(this.$route.fullPath.lastIndexOf('/') + 1)
        .toLowerCase() // 当前路由的最后字符内容
      const indexOfParams = currentPath.indexOf('?')
      if (indexOfParams > 0) {
        currentPath = currentPath.substr(0, indexOfParams)
      }
      this.recognizeRoute = getOperationsRoute(obj, currentPath, 'recognize', true)
      if (
        JSON.stringify(this.recognizeRoute) !== '{}'
      ) {
        this.showOperations = true
      }
    },
    handleReturn() {
      this.$router.go(-1)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.itemList = val
    },
    handleBatchRecognize() {
      if (this.itemList.length === 0) return this.$message.error('请先选择教师！')
      this.showBatchRecognize = true
    },
    handleBatchSave() {
      this.showBatchRecognize = false
      this.$refs.table.getListData()
      // this.$refs.table.clearSelection()
    },
    handleExportClick() {
      const exportData = { ...this.$refs.table.apiQueryData, ...this.apiObject }
      exportClassHourInfo(exportData).then(response => {
        fileDownload(response, '学时认定.xls')
      })
    },
    handleSearchTable() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
.attach-text {
  color: #409EFF;
  cursor: pointer;
}
</style>
