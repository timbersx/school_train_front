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
    <et-control-table
      ref="table"
      :api-method="getTrainEventInfoList"
      :prop-list="propList"
      :table-lang-title="pageTitle"
      operations-width="100px"
      :api-object="{status:2,ordering:'-id'}"
      cancel-init
    >
      <template #search="{ form }">
        <el-form-item :label="$t('annualTrainPlanInfo.year')">
          <el-select
            v-model="form.plan__year__id"
            :placeholder="$t('annualTrainPlanInfo.year')"
            clearable
          >
            <el-option v-for="item in year_Operations" :key="item.id" :value="item.id" :label="item.year" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('trainEventInfo.name')">
          <el-input
            v-model="form.name__contains"
            :placeholder="$t('trainEventInfo.name')"
            clearable
          />
        </el-form-item>
      </template>
      <template #attachments="scope">
        <p v-for="item in scope.row.attachments" :key="item.id" type="text"><span class="attach-text" @click="handleAttachClick(item)">{{ item.local_file_name }}</span></p>
      </template>
      <template #operation="scope">
        <el-button v-if="JSON.stringify(recognizeRoute) != '{}'" type="text" @click="handleRecognizeClick(scope.row)">{{ '查看教师' }}</el-button>
      </template>
    </et-control-table>
  </div>
</template>

<script>
import EtControlTable from '@/components/EtControlTable'
import fileDownload from 'js-file-download'
import { downloadAttachment } from '@/api/utils'
import { getAnnualTrainPlanYearList } from '@/api/municipalPlan/municipalPlanDeclaration'
import { getOperationsRoute } from '@/utils/operations'
import { getSysconst } from '@/api/utils'
import { getTrainEventInfoList } from '@/api/municipalEvent/municipalEventHours'
const pageTitle = 'trainEventClassHourInfo'
export default {
  components: {
    EtControlTable
  },
  data() {
    return {
      pageTitle,
      list: [],
      year_Operations: [],
      status_Operations: [],
      propList: [
        { name: 'name', label: 'train_event' }, { name: 'plan.name', label: 'plan' }, { name: 'train_person.name', label: 'train_person' },
        { name: 'train_hour', label: 'train_hour' }, 'train_amount', 'start_date', 'end_date', { name: 'eventstatus', format: this.statusFormat }
      ],
      recognizeRoute: {}
    }
  },
  created() {
    this.init()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteEnter(to, from, next) {
    if (!(~from.path.indexOf('municipalEventHours'))) {
      sessionStorage.removeItem('pageData')
    }
    next()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteLeave(to, from, next) {
    if (~to.path.indexOf('municipalEventHours')) {
      sessionStorage.setItem('pageData', JSON.stringify({
        apiQueryData: this.$refs.table.apiQueryData,
        listParameters: this.$refs.table.listParameters,
        formInline: this.$refs.table.formInline
      }))
    } else {
      sessionStorage.removeItem('pageData')
    }
    next()
  },
  methods: {
    getTrainEventInfoList,
    init() {
      Promise.all([
        getAnnualTrainPlanYearList({ is_active: true, ordering: 'year', limit: 1000 }),
        getSysconst('Train_Event_Status')
      ]).then(response => {
        this.year_Operations = response[0].data
        this.status_Operations = response[1].data
        this.$nextTick(() => {
          this.handleDefaultYear()
          this.getList()
        })
      })
      this.getRoutes()
    },
    handleDefaultYear() {
      const currentYear = new Date().getFullYear()
      let yearId = ''
      this.year_Operations.forEach(item => {
        if (item.year === currentYear) {
          yearId = item.id
        }
      })
      if (yearId) {
        this.$set(this.$refs.table.formInline, 'plan__year__id', yearId)
      } else if (this.year_Operations.length > 0) {
        this.$set(this.$refs.table.formInline, 'plan__year__id', this.year_Operations[0].id)
      }
    },
    getList() {
      const sessionData = sessionStorage.getItem('pageData')
      if (sessionData) {
        Object.assign(this.$refs.table, JSON.parse(sessionData))
        this.$refs.table.getListData()
      } else {
        this.$refs.table.handleFilter()
      }
    },
    handleRecognizeClick(row) {
      if (JSON.stringify(this.recognizeRoute) !== '{}') {
        this.$router.push({
          path: this.recognizeRoute.path,
          query: { pId: row.id }
        })
      }
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
      this.recognizeRoute = getOperationsRoute(obj, currentPath, 'teacherList', true)
      if (
        JSON.stringify(this.recognizeRoute) !== '{}'
      ) {
        this.showOperations = true
      }
    },
    statusFormat(row) {
      let result = ''
      this.status_Operations.forEach(i => {
        if (row.status === i.code) {
          result = i.name
        }
      })
      return result
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
