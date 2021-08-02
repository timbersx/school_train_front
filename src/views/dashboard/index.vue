<template>
  <div v-if="showContent">
    <div class="top-container">
      <el-card>
        <el-select v-model="selectYear" style="width: 320px" @change="handleYearChange">
          <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
        </el-select>
        <em class="head-title">年度校本培训</em>
        <el-divider class="divider-position" />
        <p v-loading="courseLoading">
          <span class="course-pad"><em>要求学时</em>: {{ sumCourse.total_hours }}</span>
          <span class="course-pad"><em>已完成学时</em>: {{ sumCourse.complete_hours }}</span>
          <span class="course-pad"><em>待完成学时</em>: {{ sumCourse.incomplete_hours }}</span>
        </p>
      </el-card>
    </div>
    <!-- 课程提示 -->
    <div v-loading="courseLoading" class="tips-container">
      <div class="flex-container">
        <div v-for="(item, index) in groupCourse" :key="index" :class="{ 'flex-item': true, 'tips-space': index<groupCourse.length-1 }">
          <el-card>
            <div slot="header" class="clearfix">
              <em>{{ item.name }}</em>
            </div>
            <p>要求学时: {{ item.hours }}</p>
            <p>已完成学时: {{ item.complete_hour }}</p>
            <p>待完成学时: {{ item.incomplete_hour }}</p>
          </el-card>
        </div>
      </div>
    </div>
    <div class="dashboard-container clearfix">
      <!-- 可报名的培训活动 -->
      <el-card class="card-item">
        <template #header class="clearfix">
          <span class="tittle-font">可报名的培训活动</span>
        </template>
        <et-table-generate
          ref="table1"
          :api-method="getTeacherEnrollingEventInfo"
          :label-list="labelList1"
          :prop-list="propList1"
          :api-object="apiObj1"
          operations-width="100px"
          cancel-init
          show-operations
        >
          <template #search="scope">
            <el-form-item :label="'年度'">
              <el-select v-model="scope.form.plan__year__id" :placeholder="'年度'" filterable clearable style="width: 100%;">
                <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
              </el-select>
            </el-form-item>
            <el-form-item label="课程类别">
              <el-select v-model="scope.form.train_event__course_type__id" :placeholder="'课程类别'" filterable clearable style="width: 100%;">
                <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="scope.form.name" :placeholder="'活动名称'" clearable style="width: 100%;" />
            </el-form-item>
          </template>
          <template #check_enroll="scope">
            <el-button v-if="scope.row.check_enroll===true" type="text" @click="handleApproveCommentClick(scope.row)">{{ formatCheck(scope.row) }}</el-button>
            <span v-else>{{ formatCheck(scope.row) }}</span>
          </template>
          <template #operation="scope">
            <el-button v-if="scope.row.check_enroll===null" type="text" @click="handleSiginClick(scope.row)">报名</el-button>
            <el-button type="text" @click="handleDetailClick(scope.row)">详情</el-button>
          </template>
        </et-table-generate>
      </el-card>

      <!-- 待确认的培训活动 -->
      <el-card v-if="showContent" class="card-item">
        <template #header class="clearfix">
          <span class="tittle-font">待确认的培训活动</span>
        </template>
        <et-table-generate
          ref="table2"
          :api-method="getTeacherConfirmingEventInfo"
          :label-list="labelList2"
          show-operations
          operations-width="125px"
          cancel-init
          :prop-list="propList2"
        >
          <template #search="scope">
            <el-form-item :label="'年度'">
              <el-select v-model="scope.form.train_event__plan__year__id" :placeholder="'年度'" filterable clearable style="width: 100%;">
                <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
              </el-select>
            </el-form-item>
            <el-form-item label="课程类别">
              <el-select v-model="scope.form.train_event__course_type__id" :placeholder="'课程类别'" filterable clearable style="width: 100%;">
                <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="scope.form.train_event__name__icontains" :placeholder="'活动名称'" clearable style="width: 100%;" />
            </el-form-item>
          </template>
          <template #operation="scope">
            <el-button v-if="!scope.row.confirm" type="text" @click="handleJoinClick(scope.row)">确认参加</el-button>
            <el-button type="text" @click="handleDetailClick(scope.row.train_event)">详情</el-button>
          </template>
        </et-table-generate>
      </el-card>

      <!-- 已参加的培训活动 -->
      <el-card v-if="showContent" class="card-item">
        <template #header class="clearfix">
          <span class="tittle-font">已参加的培训活动</span>
        </template>
        <et-table-generate
          ref="table3"
          :api-method="getTeacherActiveEventInfo"
          :label-list="labelList3"
          show-operations
          cancel-init
          operations-width="180px"
          :prop-list="propList3"
        >
          <template #search="scope">
            <el-form-item label="年度">
              <el-select v-model="scope.form.train_event__plan__year__id" :placeholder="'年度'" filterable clearable style="width: 100%;">
                <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
              </el-select>
            </el-form-item>
            <el-form-item label="课程类别">
              <el-select v-model="scope.form.train_event__course_type__id" :placeholder="'课程类别'" filterable clearable style="width: 100%;">
                <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="scope.form.train_event__name__icontains" :placeholder="'活动名称'" clearable style="width: 100%;" />
            </el-form-item>
          </template>
          <template #operation="scope">
            <el-button type="text" :disabled="scope.row.train_event.status === 1" @click="handleApplyHours(scope.row)">上传材料</el-button>
            <el-button type="text" :disabled="scope.row.train_event.status === 1" @click="handleFillPaper(scope.row)">填写问卷</el-button>
            <!-- <el-button type="text" @click="handleDetailClick(scope.row.train_event)">详情</el-button> -->
          </template>
        </et-table-generate>
      </el-card>

      <!-- 已完成的培训活动 -->
      <el-card v-if="showContent" class="card-item">
        <template #header class="clearfix">
          <span class="tittle-font">已完成的培训活动</span>
        </template>
        <et-table-generate
          ref="table4"
          :api-method="getTeacherCompleteEventsInfo"
          :label-list="labelList4"
          show-operations
          cancel-init
          :prop-list="propList4"
        >
          <template #search="scope">
            <el-form-item label="年度">
              <el-select v-model="scope.form.train_event__plan__year__id" :placeholder="'年度'" filterable clearable style="width: 100%;">
                <el-option v-for="item in yearList" :key="item.id" :value="item.id" :label="item.year" />
              </el-select>
            </el-form-item>
            <el-form-item label="课程类别">
              <el-select v-model="scope.form.train_event__course_type__id" :placeholder="'课程类别'" filterable clearable style="width: 100%;">
                <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称">
              <el-input v-model="scope.form.train_event__name__icontains" :placeholder="'活动名称'" clearable style="width: 100%;" />
            </el-form-item>
          </template>
          <template #operation="scope">
            <el-button type="text" @click="handleCategoryDetailClick(scope.row)">详情</el-button>
          </template>
        </et-table-generate>
      </el-card>
      <ApplyHoursDialog :visible.sync="showApplyDialog" :event-id="eventId" :event-name="eventName" />
      <CommentDialog :visible.sync="showCommentDialog" :check-data="checkData" />
      <CategoryDialog :visible.sync="showCateDialog" :category-name="categoryName" :category-api-id="categoryApiId" />
      <DetailDialog :visible.sync="showDetailDialog" :edit-id="editId" />
      <fill-paper-list-dialog :visible.sync="fillPaperDialogStatus" :event-id="eventId" />
    </div>
  </div>

</template>

<script>
import EtTableGenerate from '@/components/EtTableGenerate'
import ApplyHoursDialog from './operations/ApplyHoursDialog'
import CategoryDialog from './operations/CategoryDialog'
import DetailDialog from './operations/detail'
import CommentDialog from './operations/CommentDialog'
import FillPaperListDialog from './operations/fillPaperList'


import { getUserInfo } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { setUserFirstrout, getUserFirstrout } from '@/utils/auth'
import { getSysconst } from '@/api/utils'
import {
  getTeacherEnrollingEventInfo,
  teacherEnroll,
  getTeacherConfirmingEventInfo,
  teacherConfirm,
  getTeacherActiveEventInfo,
  getTeacherCompleteEventsInfo,
  getTeacherHoursAnalysisInfo
} from '@/api/schoolBasedTeachers/schoolBasedTrainingHome'
import { getCourseCategoryList } from '@/api/systemmanage/courseCategory'
import { getAnnualTrainPlanYearList } from '@/api/traineventmanage/annualTrainPlanInfo'
export default {
  name: 'Dashboard',
  components: {
    EtTableGenerate,
    ApplyHoursDialog,
    CategoryDialog,
    DetailDialog,
    CommentDialog,
    FillPaperListDialog
  },
  data() {
    const formatCheck = (row) => {
      return row.check_enroll === false ? '报名未审核' : (row.check_enroll === true ? '审核未通过' : '未报名')
    }
    const formatSpeaker = (row) => row.train_event && row.train_event.speaker_list && row.train_event.speaker_list.map(i => i.name).join('、')
    return {
      trainFormList: [],
      statusList: [],
      yearList: [],
      labelList1: ['年度', '培训活动名称', '组织单位', '主讲人', '培训学时', '开始日期', '结束日期', '报名状态'],
      propList1: [{ name: 'plan.year.year', width: '60px' }, 'name', 'organization', { name: 'speaker_list', format: (row) => row.speaker_list && row.speaker_list.map(i => i.name).join('、') }, 'train_hour', 'start_date', 'end_date', { name: 'check_enroll', format: formatCheck, slot: true }],
      labelList2: ['年度', '培训活动名称', '组织单位', '主讲人', '培训学时', '开始日期', '结束日期'],
      propList2: [{ name: 'train_event.plan.year.year', width: '60px' }, 'train_event.name', 'train_event.organization', { name: 'train_event.speaker_list', format: formatSpeaker }, 'train_event.train_hour', 'train_event.start_date', 'train_event.end_date'],
      labelList3: ['年度', '培训活动名称', '组织单位', '主讲人', '培训学时', '开始日期', '结束日期', '活动状态'],
      propList3: [{ name: 'train_event.plan.year.year', width: '60px' }, 'train_event.name', 'train_event.organization', { name: 'train_event.speaker_list', format: formatSpeaker }, 'train_event.train_hour', 'train_event.start_date', 'train_event.end_date', { name: 'status', format: (row) => row.train_event.status === 1 ? '活动未开始' : '活动已开始' }],
      labelList4: ['年度', '培训活动名称', '组织单位', '主讲人', '培训学时', '开始日期', '结束日期'],
      propList4: [{ name: 'train_event.plan.year.year', width: '60px' }, 'train_event.name', 'train_event.organization', { name: 'train_event.speaker_list', format: formatSpeaker }, 'train_event.train_hour', 'train_event.start_date', 'train_event.end_date'],
      showContent: false,
      showApplyDialog: false,
      eventId: '',
      eventName: '',
      showCateDialog: false,
      categoryName: '',
      categoryApiId: '',
      showDetailDialog: false,
      editId: '',
      selectYear: '',
      sumCourse: {},
      groupCourse: [],
      courseLoading: false,
      apiObj1: {},
      categoryList: [],
      showCommentDialog: false,
      checkData: {},
      fillPaperDialogStatus: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'permission_routes',
      'top_nav_menus_active_index'
    ])
  },
  beforeRouteEnter(to, from, next) {
    setUserFirstrout(from.path.toLowerCase())
    //  sessionStorage.setItem("funa_exam_from_route", from.path.toLowerCase());
    next(vm => {
      vm.url = from.path
    })
  },
  created: function() {
    // 加载用户的第一个模块的第一个菜单
    // console.log(getUserInfo().user_role)
    if (getUserInfo().user_role.some(item => item.code === 'Teacher')) {
      this.showContent = true
      this.getSearchList()
    } else {
      if (sessionStorage.getItem('funa_exam_from_route') === '/login') {
        if (getUserFirstrout() === '/login') {
          if (this.permission_routes[0].children.length > 0) {
            const to =
          this.permission_routes[0].path +
          '/' +
          this.permission_routes[0].children[0].path
            this.$router.push({ path: to })
          }
        }
      }
    }
  },
  methods: {
    getTeacherEnrollingEventInfo,
    getTeacherConfirmingEventInfo,
    getTeacherActiveEventInfo,
    getTeacherCompleteEventsInfo,
    getSearchList() {
      Promise.all([
        getSysconst('Train_Form'),
        getSysconst('Train_Event_Status'),
        getAnnualTrainPlanYearList({ limit: 10000, ordering: '-id' }),
        getCourseCategoryList({ limit: 10000, status: true, ordering: '-id' })]).then(response => {
        this.trainFormList = response[0].data
        this.statusList = response[1].data
        this.yearList = response[2].data
        this.categoryList = response[3].data
        this.handleDefaultYear()
        this.handleYearChange()
      })
    },
    handleDefaultYear() {
      const currentYear = new Date().getFullYear()
      let yearId = ''
      this.yearList.forEach(item => {
        if (item.year === currentYear) {
          yearId = item.id
        }
      })
      if (yearId) {
        this.selectYear = yearId
      } else if (this.yearList.length > 0) {
        this.selectYear = this.yearList[0].id
      }
    },
    handleSiginClick(row) {
      this.$confirm('报名后将无法撤销，您是否确认报名?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          teacherEnroll(row.id).then(response => {
            this.$message.success('报名成功！')
            this.$refs.table1.getListData()
            this.$refs.table2.getListData()
          })
        })
        .catch(() => {
          return false
        })
    },
    handleDetailClick(row) {
      this.showDetailDialog = true
      this.editId = row.id
    },
    handleJoinClick(row) {
      this.$confirm('确认后将无法撤销，您是否确认参加?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          teacherConfirm(row.id).then(response => {
            this.$message.success('参加成功！')
            this.$refs.table2.getListData()
            this.$refs.table3.getListData()
          })
        })
        .catch(() => {
          return false
        })
    },
    handleApplyHours(row) {
      this.eventId = row.train_event.id
      this.eventName = row.train_event.name
      this.showApplyDialog = true
    },
    handleFillPaper(row) {
      this.eventId = row.train_event.id
      this.fillPaperDialogStatus = true
    },
    handleCategoryDetailClick(row) {
      this.categoryName = row.train_event.name
      this.categoryApiId = row.id
      this.showCateDialog = true
    },
    handleYearChange() {
      // this.init()
      this.courseLoading = true
      getTeacherHoursAnalysisInfo({ year: this.selectYear }).then(response => {
        this.courseLoading = false
        this.sumCourse = response.data
        this.groupCourse = response.data.course_type_list || []
      }, () => (this.courseLoading = false))
      this.$nextTick(() => {
        this.$refs['table1'].formInline = { 'plan__year__id': this.selectYear }
        this.$refs['table1'].handleFilter()
        this.$refs['table2'].formInline = { 'train_event__plan__year__id': this.selectYear }
        this.$refs['table2'].handleFilter()
        this.$refs['table3'].formInline = { 'train_event__plan__year__id': this.selectYear }
        this.$refs['table3'].handleFilter()
        this.$refs['table4'].formInline = { 'train_event__plan__year__id': this.selectYear }
        this.$refs['table4'].handleFilter()
      })
    },
    handleApproveCommentClick(row) {
      this.checkData = row.check_data
      this.showCommentDialog = true
    },
    formatCheck(row) {
      return row.check_enroll === false ? '报名未审核' : (row.check_enroll === true ? '审核未通过' : '未报名')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0px 10px 0 10px;
  // display: flex;
  // flex-wrap: wrap;
}
.card-item {
  margin: 10px;
}
.tittle-font {
  font-weight: 800;
  font-size: 1.2em;
}
.top-container {
  padding: 20px 20px 0 20px;
  text-align: center;
  font-size: 17px;
  .head-title {
    font-size: 20px;
  }
  .course-pad {
    padding-right: 45px;
  }
}
.divider-position {
  margin: 20px 0;
}
em {
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
}
.tips-container {
  padding: 10px 20px 0;
}
.flex-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .flex-item {
    flex: 1;
    width: 19%;
    max-width: 19%;
    min-width: 19%;
  }
}
</style>
