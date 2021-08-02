<!--/*
 * @Name: TrainEventCheckInfo detail
 * @Module:  src/views/trainEventCheckInfo/operations/detail
 * @Desc: TrainEventCheckInfo detail
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:35
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div v-loading="loading" class="app-container">
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleCheckSuccess">考核通过</el-button>
      <!-- <el-button @click="handleCheckFail">考核不通过</el-button> -->
      <el-button @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <el-form
      :inline="true"
      label-suffix=":"
      :model="formData"
      class="demo-form-inline"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.year')">
            <span>{{ formData.train_event.plan.year.year }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.organization')">
            <span>{{ formData.train_event.organization }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.train_event_name')">
            <span>{{ formData.train_event.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.course_type')">
            <span>{{ formData.train_event.course_type.name }}</span>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="6">
          <el-form-item :label="$t('trainEventInfo.plan')">
            <span>{{formData.train_event.plan.name}}</span>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.start_date')">
            <span>{{ formData.train_event.start_date }}</span>
            <!-- <span v-if="formData.train_event.enroll_type.code == 'SHBM'">{{formData.train_event.enroll_start_date_che}}</span>
            <span v-else-if="formData.train_event.enroll_type.code == 'ZDDR'"></span>
            <span v-else-if="formData.train_event.enroll_type.code == 'XDXK'">{{formData.train_event.enroll_start_date_sub}}</span>
            <span v-else>{{formData.train_event.enroll_start_date_free}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.end_date')">
            <span>{{ formData.train_event.end_date }}</span>
            <!-- <span v-if="formData.train_event.enroll_type.code == 'SHBM'">{{formData.train_event.enroll_end_date_che}}</span>
            <span v-else-if="formData.train_event.enroll_type.code == 'ZDDR'"></span>
            <span v-else-if="formData.train_event.enroll_type.code == 'XDXK'">{{formData.train_event.enroll_end_date_sub}}</span>
            <span v-else>{{formData.train_event.enroll_end_date_free}}</span> -->
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item :label="$t('trainEventInfo.train_person')">
            <span>{{formData.train_event.train_person.name}}</span>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.train_amount')">
            <span>{{ formData.train_event.train_amount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('trainEventCheckInfo.train_hour')">
            <span>{{ formData.train_event.train_hour }}</span>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item :label="$t('trainEventInfo.enroll_amount')">
            <span v-if="formData.train_event.enroll_type.code == 'SHBM'">{{formData.train_event.enroll_amount_che}}</span>
            <span v-else-if="formData.train_event.enroll_type.code == 'ZDDR'"></span>
            <span v-else-if="formData.train_event.enroll_type.code == 'XDXK'">{{formData.train_event.enroll_amount_sub}}</span>
            <span v-else>{{formData.train_event.enroll_amount_free}}</span>
          </el-form-item>
        </el-col> -->

      </el-row>
    </el-form>

    <el-tabs v-model="activeName" v-loading="loading">
      <!-- <el-tab-pane label="培训活动" name="first">
        <et-table-generate
          ref="table1"
          :api-method="getTrainEventInfoList"
          :label-list="labelList1"
          :prop-list="propList1"
          operations-width="300"
          disable-search
          :api-object="apiObject1"
        ></et-table-generate>
      </el-tab-pane> -->
      <el-tab-pane label="活动实施记录" name="second">
        <et-table-generate
          ref="table2"
          :api-method="getTrainEventImplementationRecordInfoList"
          :label-list="labelList2"
          :prop-list="propList2"
          operations-width="300"
          disable-search
          :api-object="apiObject2"
        >
          <template #attachments="scope">
            <p v-for="item in scope.row.attachments" :key="item.id" type="text"><span class="attach-text" @click="handleAttachClick(item)">{{ item.local_file_name }}</span></p>
          </template>
        </et-table-generate>
      </el-tab-pane>
      <el-tab-pane label="经费使用情况" name="third">
        <et-table-generate
          ref="table3"
          :api-method="getTrainEventFundsRecordInfoList"
          :label-list="labelList3"
          :prop-list="propList3"
          operations-width="300"
          disable-search
          :api-object="apiObject2"
        />
      </el-tab-pane>
      <el-tab-pane label="活动签到记录" name="fourth">
        <et-table-generate
          ref="table4"
          :api-method="getTrainEventSigninRecordInfoList"
          :label-list="labelList4"
          :prop-list="propList4"
          operations-width="300"
          disable-search
          :api-object="apiObject2"
        />
      </el-tab-pane>
      <el-tab-pane label="学时认定情况" name="fifth">
        <et-table-generate
          ref="table5"
          :api-method="getTrainEventClassHourInfoList"
          :label-list="labelList5"
          :prop-list="propList5"
          operations-width="300"
          disable-search
          :api-object="apiObject2"
        />
      </el-tab-pane>
      <el-tab-pane label="参加教师" name="sixth">
        <et-table-generate
          ref="table6"
          :api-method="getTrainEventTeacherInfo"
          :label-list="labelList6"
          :prop-list="propList6"
          operations-width="300"
          disable-search
          :api-object="apiObject2"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EtTableGenerate from '@/components/EtTableGenerate'
import Sticky from '@/components/Sticky'
import { getSysconst } from '@/api/utils'
import { getUserInfo } from '@/utils/auth'
import fileDownload from 'js-file-download'
import { downloadAttachment } from '@/api/utils'
import {
  readTrainEventCheckInfo,
  getTrainEventImplementationRecordInfoList,
  getTrainEventFundsRecordInfoList,
  getTrainEventSigninRecordInfoList,
  getTrainEventClassHourInfoList,
  updateTrainEventCheckInfo,
  getTrainEventTeacherInfo
} from '@/api/municipalEvent/municipalEventExamine'
export default {
  components: {
    Sticky,
    EtTableGenerate
  },
  data() {
    const enrollmentMethodFormat = (row) => {
      const list = this.enrollmentMethodList.filter(
        (i) => i.code === row.enrollment_method
      )
      if (list.length > 0) {
        return list[0].name
      } else {
        return ''
      }
    }
    const project_natureFormat = (row) => {
      const list = this.projectNatureList.filter(
        (i) => i.code === row.project_nature
      )
      if (list.length > 0) {
        return list[0].name
      } else {
        return ''
      }
    }
    const train_typeFormat = (row) => {
      const list = this.trainTypeList.filter((i) => i.code === row.train_type)
      if (list.length > 0) {
        return list[0].name
      } else {
        return ''
      }
    }
    const train_formFormat = (row) => {
      const list = this.trainFormList.filter((i) => i.code === row.train_form)
      if (list.length > 0) {
        return list[0].name
      } else {
        return ''
      }
    }
    const statusFormat = (row) => {
      const list = this.statusList.filter((i) => i.code === row.status)
      if (list.length > 0) {
        return list[0].name
      } else {
        return ''
      }
    }
    return {
      editId: 0,
      loading: false, // 是否显示loading
      formData: { train_event: { enroll_type: {}, plan: {}, train_person: {}}},
      activeName: 'second',
      labelList1: [
        '名称',
        '年度培训计划',
        '培训开始时间',
        '培训结束时间',
        '创建学校',
        '经费预算',
        '项目报名方式',
        '项目性质',
        '培训类型',
        '培训形式',
        '培训人数',
        '培训学时',
        '学段学科',
        '状态'
      ],
      propList1: [
        'name',
        'plan.target',
        'start_date',
        'end_date',
        'school.name',
        'budget',
        { name: 'enrollment_method', format: enrollmentMethodFormat },
        { name: 'project_nature', format: project_natureFormat },
        { name: 'train_type', format: train_typeFormat },
        { name: 'train_form', format: train_formFormat },
        'train_amount',
        'train_hour',
        'section_subject',
        { name: 'status', format: statusFormat }
      ],
      labelList2: ['培训活动', '活动过程材料', '备注'],
      propList2: ['train_event.name', { name: 'attachments', slot: true }, 'remark'],
      labelList3: ['培训活动', '使用经费', '经费使用时间', '经费使用说明'],
      propList3: ['train_event.name', 'funds', 'funds_time', 'funds_explain'],
      labelList4: ['培训活动', '签到时间'],
      propList4: ['train_event.name', 'sign_in_time'],
      labelList5: ['培训活动', '学时', '教师', '备注'],
      propList5: ['train_event.name', 'hours', 'teacher.name', 'remark'],
      labelList6: ['教师姓名', '身份证号', '电话', '确认状态', '所属学校'],
      propList6: [
        'teacher.name',
        'teacher.id_card',
        'teacher.phone',
        { name: 'confirm', format: (row) => (row.confirm ? '是' : '否') },
        'teacher.school.name'
      ],
      apiObject1: {},
      apiObject2: {},
      userId: '',
      checkId: '',
      trainFormList: [],
      statusList: [],
      enrollmentMethodList: [],
      projectNatureList: [],
      trainTypeList: []
    }
  },
  created() {
    this.checkId = this.$route.query.id
    this.apiObject1 = { plan__id: this.$route.query.id }
    this.apiObject2 = { train_event__id: this.$route.query.event }
    this.userId = getUserInfo().id
    this.getSearchList()
    this.init()
  },
  methods: {
    getTrainEventImplementationRecordInfoList,
    getTrainEventFundsRecordInfoList,
    getTrainEventSigninRecordInfoList,
    getTrainEventClassHourInfoList,
    getTrainEventTeacherInfo,
    init() {
      Promise.all([readTrainEventCheckInfo(this.checkId)]).then((response) => {
        console.log(response[0].data)
        this.formData = response[0].data
        // this.formData.check_user = this.formData.check_user == null ? this.formData.check_user : this.formData.check_user.name
        this.loading = false
      })
    },
    handleReturn() {
      this.$router.go(-1)
    },
    handleCheckSuccess() {
      var nowDate = new Date()
      const dateStr = `${nowDate.getFullYear()}-${
        nowDate.getMonth() + 1
      }-${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`
      this.loading = true

      updateTrainEventCheckInfo(this.checkId, {
        result: 1,
        check_time: dateStr,
        check_user: this.userId
      })
        .then((response) => {
          this.$message.success('考核成功！')
          this.$router.go(-1)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$router.go(-1)
        })
    },
    handleCheckFail() {
      var nowDate = new Date()
      const dateStr = `${nowDate.getFullYear()}-${
        nowDate.getMonth() + 1
      }-${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`
      console.log(nowDate, dateStr)
      this.loading = true
      updateTrainEventCheckInfo(this.checkId, {
        result: 2,
        check_time: dateStr,
        check_user: this.userId
      })
        .then((response) => {
          this.$message.success('考核成功！')
          this.loading = false
          this.$router.go(-1)
        })
        .catch(() => {
          this.loading = false
          this.$router.go(-1)
        })
    },
    getSearchList() {
      Promise.all([
        getSysconst('Train_Form'),
        getSysconst('Train_Event_Status'),
        getSysconst('Project_Enrollment_Method'),
        getSysconst('Project_Nature'),
        getSysconst('Train_Type')
      ]).then((response) => {
        this.trainFormList = response[0].data
        this.statusList = response[1].data
        this.enrollmentMethodList = response[2].data
        this.projectNatureList = response[3].data
        this.trainTypeList = response[4].data
      })
    },
    handleAttachClick(item) {
      downloadAttachment(item.id).then(res => {
        fileDownload(res, item.local_file_name)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.attach-text {
  color: #409EFF;
  cursor: pointer;
}
</style>
