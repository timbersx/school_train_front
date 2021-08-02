<!--/*
 * @Name: TrainEventInfo detail
 * @Module:  src/views/trainEventInfo/operations/detail
 * @Desc: TrainEventInfo detail
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->
<template>
  <div v-loading="loading" class="app-container">
    <el-dialog
      :visible.sync="visible"
      class="dialog-height"
      width="750px"
      height="50%"
      :title="'详情'"
      :before-close="handleClose"
      @close="handleClose"
    >
      <el-divider />
      <el-main class="main-position">
        <el-form
          ref="dataForm"
          :loading="loading"
          label-width="150px"
          :model="formData"
          label-suffix=":"
          class="clearfix"
        >
          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.name')" prop="name">
              <span>{{ formData.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.plan')" prop="plan">
              <span>{{ formData.plan && formData.plan.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.start_date')"
              prop="start_date"
            >
              <span>{{ formData.start_date }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.end_date')"
              prop="end_date"
            >
              <span>{{ formData.end_date }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organization')"
              prop="organization"
            >
              <span>{{ formData.organization }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.cooperation_organization')"
              prop="cooperation_organization"
            >
              <span>{{ formData.cooperation_organization }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_amount')"
              prop="train_amount"
            >
              <span>{{ formData.train_amount }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_person')"
              prop="train_person"
            >
              <span>{{ formData.train_person && formData.train_person.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.position')"
              prop="position"
            >
              <span>{{ formData.position }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_hour')"
              prop="train_hour"
            >
              <span>{{ formData.train_hour }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.course_type')"
              prop="course_type"
            >
              <span>{{ formData.course_type && formData.course_type.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_type')"
              prop="train_type"
            >
              <span>{{ formData.train_type && formData.train_type.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organize_type')"
              prop="organize_type"
            >
              <span>{{ formData.organize_type && formData.organize_type.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.speaker')" prop="speaker">
              <span>{{ formData.speaker_list && formData.speaker_list.map(i=>i.name).join('、') }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organizations')"
              prop="organizations"
            >
              <span
                v-for="org in (formData.organizations || [])"
                :key="org.id"
                style="margin-right: 5px"
              >{{ org.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.enrollment_method')"
              prop="enroll_type"
            >
              <span>{{ formData.enroll_type && formData.enroll_type.name }}</span>
            </el-form-item>
          </el-col>

          <div v-if="formData.enroll_type && formData.enroll_type.code == 'ZDDR'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.isChooseTeacherGroups')"
                prop="select_teacher_group"
              >
                <span>{{ formData.select_teacher_group ? "是" : "否" }}</span>
              </el-form-item>
            </el-col>
            <!-- <div
              v-if="formData.select_teacher_group"
              style="width: 100%; float: left"
            >
              <el-col :span="12">
                <el-form-item :label="$t('trainEventInfo.select_teacher_group')">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handelChooseTeachersClick"
                  >查看已选择</el-button>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('trainEventInfo.deadline')"
                  prop="deadline"
                >
                  <span>{{ formData.deadline }}</span>
                </el-form-item>
              </el-col>
            </div> -->

            <div
              v-if="!formData.select_teacher_group"
              style="width: 100%; float: left"
            >
              <el-col :span="24">
                <el-form-item
                  :label="$t('trainEventInfo.select_teacher_group')"
                  prop="teachers"
                >
                  <span
                    v-for="item in (formData.teachers || [])"
                    :key="item.id"
                    style="margin-right: 10px"
                  >
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{
                      item.phone
                    }}</span>
                    <span
                      style="
                      float: right;
                      color: #8492a6;
                      font-size: 13px;
                      margin-right: 10px;
                    "
                    >{{ item.school && item.school.name }}</span>
                  </span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :label="$t('trainEventInfo.deadline')"
                  prop="deadline"
                >
                  <span>{{ formData.deadline }}</span>
                </el-form-item>
              </el-col>
            </div>
          </div>

          <div v-if="formData.enroll_type && formData.enroll_type.code == 'XDXK'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.organization_types')"
                prop="organization_types"
              >
                <span
                  v-for="types in formData.organization_types"
                  :key="types.id"
                  style="margin-right: 5px"
                >{{ types.name }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.subjects')"
                prop="subjects"
              >
                <span
                  v-for="subjects in formData.subjects"
                  :key="subjects.id"
                  style="margin-right: 5px"
                >{{ subjects.name }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount')"
                prop="enroll_amount_sub"
              >
                <span>{{ formData.enroll_amount_sub }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_sub"
              >
                <span>{{ formData.enroll_start_date_sub }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_sub"
              >
                <span>{{ formData.enroll_end_date_sub }}</span>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="formData.enroll_type && formData.enroll_type.code == 'ZYBM'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount')"
                prop="enroll_amount_free"
              >
                <span>{{ formData.enroll_amount_free }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_free"
              >
                <span>{{ formData.enroll_start_date_free }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_free"
              >
                <span>{{ formData.enroll_end_date_free }}</span>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="formData.enroll_type && formData.enroll_type.code == 'SHBM'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount')"
                prop="enroll_amount_che"
              >
                <span>{{ formData.enroll_amount_che }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_che"
              >
                <span>{{ formData.enroll_start_date_che }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_che"
              >
                <span>{{ formData.enroll_end_date_che }}</span>
              </el-form-item>
            </el-col>
          </div>

          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.status')" prop="status">

              <span>{{ statusValue(formData.status) }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('trainEventInfo.explain')" prop="explain">
              <span>{{ formData.explain }}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
      <div slot="footer" class="dialog-footer footer-padding">
        <el-button @click="handleClose">{{ $t("button.close") }}</el-button>
      </div>
    </el-dialog>

    <!-- <teacher-list-dialog
      :visible.sync="teacherListDialogVisible"
      :organizations="formData.organizations"
      @chooseTeacherList="getChoosedTeacherList"
    /> -->
  </div>
</template>

<script>
import {
  readTrainEventInfo
} from '@/api/municipalEvent/municipalSchoolRegistration'
import { getSysconst } from '@/api/utils'
// import TeacherListDialog from './teacherList'

export default {
  components: {
    // TeacherListDialog
  },
  props: {
    editId: {
      type: [Number, String],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      teacherListDialogVisible: false,
      organizations_teacher_operations: [],
      isChooseTeacherGroups: 0,
      formData: {},
      status_Operations: []
    }
  },
  computed: {
    statusValue() {
      return (status) => {
        if (this.status_Operations.length > 0) {
          return this.status_Operations.find(item => {
            return item.code === status
          }).name
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  methods: {
    init() {
      Promise.all([
        getSysconst('Train_Event_Status'),
        readTrainEventInfo(this.editId)
      ]).then((response) => {
        this.status_Operations = response[0].data
        this.formData = response[1].data
        this.loading = false
      })
    },
    handelChooseTeachersClick() {
      this.teacherListDialogVisible = true
    },
    getChoosedTeacherList(val) {
      this.formData.teacher_groups = val.groupSelection
      this.formData.teachers = val.teacherleSelection
    },
    handleClose() {
      this.$emit('update:visible')
    }
  }
}
</script>

<style lang='scss' scoped>

.main-position {
    overflow: auto;
    max-height: 550px;
}
.footer-padding {
  margin-top: 20px;
}
</style>
