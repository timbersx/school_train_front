<!--/*
 * @Name: municipalEvent
 * @Module:  src/views/municipalEvent/municipalSchoolRegistration/index
 * @Desc: municipalEvent
 * @Author:  automatic code
 * @Date:  2021-05-20 15:10:34
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
      :api-method="getTrainEventSchoolAdminInfo"
      :prop-list="propList"
      :table-lang-title="pageTitle"
      operations-width="240px"
      :api-object="{ordering:'-id',train_event__enroll_type__code: 'XXTJ'}"
      cancel-init
    >
      <template #search="{ form }">
        <el-form-item :label="$t('annualTrainPlanInfo.year')">
          <el-select
            v-model="form.train_event__plan__year__id"
            :placeholder="$t('annualTrainPlanInfo.year')"
            clearable
          >
            <el-option v-for="item in year_Operations" :key="item.id" :value="item.id" :label="item.year" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程类别">
          <el-select v-model="form.train_event__course_type__id" :placeholder="'课程类别'" filterable clearable style="width: 100%;">
            <el-option v-for="item in category_Operations" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('trainEventInfo.name')">
          <el-input
            v-model="form.train_event__name__contains"
            :placeholder="$t('trainEventInfo.name')"
            clearable
          />
        </el-form-item>
      </template>
      <!-- <template #checked="scope">
        <el-button type="text" @click="handleShowTeacherClick(scope.row, 'checked')">
          {{ scope.row.select_teachers.checked_amount }}
        </el-button>
      </template> -->
      <template #recommend="scope">
        <el-button type="text" @click="handleRecommendedClick(scope.row)">
          {{ scope.row.select_teachers.recommended_amount }}
        </el-button>
      </template>
      <template #operation="scope">
        <el-button type="text" @click="handleDetailClick(scope.row)">
          {{ $t('route.detail') }}
        </el-button>
        <el-button type="text" @click="handleRecommendTeacherClick(scope.row)">
          {{ '推荐教师' }}
        </el-button>
        <el-button type="text" @click="handleCheckPassedTeacherClick(scope.row)">
          {{ '查看已通过教师' }}
        </el-button>
        <!-- <el-button type="text" @click="handleRegistrationClick(scope.row)">
          {{ '报名' }}
        </el-button> -->
      </template>
    </et-control-table>
    <DetailDialog :visible.sync="showDetailDialog" :edit-id="editId" />
    <transition name="dialog-fade">
      <TeacherList
        :visible.sync="teacherSelectDialogVisible"
        :organizations="organizations"
        :edit-id="editId"
        @save="handleSave"
      />
    </transition>
    <TeacherDialog :visible.sync="showTeacherDialog" :edit-id="editId" :show-select="false" :teacher-selection="teachers" :group-selection="teacherGroup" />
    <PassTeacherDialog :visible.sync="showPassTeacherDialog" :edit-id="editId" />
  </div>
</template>

<script>
import DetailDialog from './operations/detail'
import TeacherList from './operations/teacherSelect'
import TeacherDialog from './operations/teacherDialog'
import PassTeacherDialog from './operations/passedTeacher'

import EtControlTable from '@/components/EtControlTable'
import { getAnnualTrainPlanYearList } from '@/api/municipalPlan/municipalPlanDeclaration'
import { getOperationsRoute } from '@/utils/operations'
import { getSysconst } from '@/api/utils'
import {
  getTrainEventSchoolAdminInfo,
  getCourseCategoryList
  // schoolEnroll
} from '@/api/municipalEvent/municipalSchoolRegistration'

const pageTitle = 'municipalPlanDeclaration'
export default {
  components: {
    EtControlTable,
    DetailDialog,
    TeacherList,
    TeacherDialog,
    PassTeacherDialog
  },
  data() {
    const formatSpeaker = (row) => row.train_event && row.train_event.speaker_list && row.train_event.speaker_list.map(i => i.name).join('、')
    return {
      pageTitle,
      list: [],
      year_Operations: [],
      status_Operations: [],
      category_Operations: [],
      propList: [
        { name: 'train_event.plan.year.year', label: 'year' }, { name: 'train_event.name', label: 'train_event' }, { name: 'train_event.organization', label: 'organization' },
        { name: 'train_event.speaker_list', label: 'speaker', format: formatSpeaker }, { name: 'train_event.train_hour', label: 'train_hour' }, { name: 'train_event.start_date', label: 'start_date' },
        { name: 'train_event.end_date', label: 'end_date' }, { name: 'status', format: this.statusFormat }, 'amount', { name: 'select_teachers.pass_amount', label: 'checked' }, { name: 'recommend', slot: true }
      ],
      recognizeRoute: {},
      showDetailDialog: false,
      editId: '',
      teacherSelectDialogVisible: false,
      organizations: [],
      showTeacherDialog: false,
      showPassTeacherDialog: false,
      teacherGroup: [],
      teachers: []
    }
  },
  created() {
    this.init()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteEnter(to, from, next) {
    if (!(~from.path.indexOf(pageTitle))) {
      sessionStorage.removeItem('pageData')
    }
    next()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteLeave(to, from, next) {
    if (~to.path.indexOf(pageTitle)) {
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
    getTrainEventSchoolAdminInfo,
    init() {
      Promise.all([
        getAnnualTrainPlanYearList({ is_active: true, ordering: 'year', limit: 1000 }),
        getSysconst('Train_Event_School_Status'),
        getCourseCategoryList({ limit: 10000, status: true, ordering: '-id' })
      ]).then(response => {
        this.year_Operations = response[0].data
        this.status_Operations = response[1].data
        this.category_Operations = response[2].data
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
        this.$set(this.$refs.table.formInline, 'train_event__plan__year__id', yearId)
      } else if (this.year_Operations.length > 0) {
        this.$set(this.$refs.table.formInline, 'train_event__plan__year__id', this.year_Operations[0].id)
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
    },
    handleRecommendedClick(row) {
      this.editId = row.id
      this.teacherGroup = row.teacher_groups
      this.teachers = row.teachers
      this.showTeacherDialog = true
    },
    handleDetailClick(row) {
      this.showDetailDialog = true
      this.editId = row.train_event.id
    },
    handleRecommendTeacherClick(row) {
      this.editId = row.id
      this.teacherSelectDialogVisible = true
      this.organizations = row.organizations
    },
    // handleShowTeacherClick(scope, status) {
    //   console.log(scope, status)
    // },
    handleCheckPassedTeacherClick(row) {
      this.editId = row.id
      this.showPassTeacherDialog = true
    },
    // handleRegistrationClick(row) {
    //   this.$confirm('报名后将无法撤销，您是否确认报名?', '提示', {
    //     confirmButtonText: '确认',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       schoolEnroll(row.id).then(response => {
    //         this.$message.success('报名成功！')
    //         this.handleSave()
    //       })
    //     })
    //     .catch(() => {
    //       return false
    //     })
    // },
    handleSave() {
      this.$refs.table.getListData()
    }
  }
}
</script>

<style lang="scss" scoped>
.attach-text {
  color: #409EFF;
  cursor: pointer;
}

.dialog-fade-enter-active {
  animation: dialog-fade-in .3s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out .3s;
}

</style>
