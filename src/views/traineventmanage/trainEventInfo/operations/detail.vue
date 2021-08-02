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
  <div class="app-container" v-loading="loading">
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <el-container class="form-container">
      <el-main>
        <el-form
          ref="dataForm"
          :loading="loading"
          label-width="150px"
          :model="formData"
          label-suffix=":"
        >
          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.name')" prop="name">
              <span>{{ formData.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.plan')" prop="plan">
              <span>{{ formData.plan.name }}</span>
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
              <span>{{ formData.train_person.name }}</span>
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
              <span>{{ formData.course_type.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_type')"
              prop="train_type"
            >
              <span>{{ formData.train_type.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organize_type')"
              prop="organize_type"
            >
              <span>{{ formData.organize_type.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.speaker')" prop="speaker">
              <!-- <span
                v-for="spk in formData.speaker"
                :key="spk.id"
                style="margin-right: 5px"
                >{{ spk.name }}</span
              > -->
              <span>{{formData.speaker.name}}</span>
            </el-form-item>
            </el-col>
            <el-col :span="10">
              <span v-if="formData.gg_teachers.length > 0">
                <span v-for="teachers in formData.gg_teachers" :key="teachers.id" style="margin-right: 5px; line-height: 45px; font-size: 14px;">
                  {{teachers.name}}
                </span>
              </span>
              <span v-else>
                <span v-for="experts in formData.wp_experts" :key="experts.id" style="margin-right: 5px; line-height: 45px; font-size: 14px;">
                  {{experts.name}}
                </span>
              </span>
            </el-col>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organizations')"
              prop="organizations"
            >
              <span
                v-for="org in formData.organizations"
                :key="org.id"
                style="margin-right: 5px"
                >{{ org.name }}</span
              >
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.enrollment_method')"
              prop="enroll_type"
            >
              <span>{{ formData.enroll_type.name }}</span>
            </el-form-item>
          </el-col>

          <!-- <div v-if="choosedEnrollType == 'ZDDR'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.isChooseTeacherGroups')"
                prop="select_teacher_group"
              >
                <span>{{ formData.select_teacher_group ? "是" : "否" }}</span>
              </el-form-item>
            </el-col>
          </div> -->

          <div v-if="choosedEnrollType == 'ZDDR'">
            <el-col :span="12">
              <el-form-item :label="$t('trainEventInfo.select_teacher_group')">
                <el-button
                  type="primary"
                  size="small"
                  @click="handelChooseTeachersClick"
                  >查看已选择</el-button
                >
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

          <!-- <div
            style="width: 100%; float: left"
            v-if="!formData.select_teacher_group"
          >
            <el-col :span="12">
              <el-form-item :label="$t('trainEventInfo.select_teacher_group')">
                <el-button
                  type="primary"
                  size="small"
                  @click="handelChooseTeachersClick"
                  >查看已选择</el-button
                >
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

          <div v-if="choosedEnrollType == 'XDXK'">
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
                <span>{{formData.enroll_amount_sub}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_sub"
              >
              <span>{{formData.enroll_start_date_sub}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_sub"
              >
              <span>{{formData.enroll_end_date_sub}}</span>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="choosedEnrollType == 'ZYBM'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount')"
                prop="enroll_amount_free"
              >
                <span>{{formData.enroll_amount_free}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_free"
              >
                <span>{{formData.enroll_start_date_free}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_free"
              >
                <span>{{formData.enroll_end_date_free}}</span>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="choosedEnrollType == 'SHBM'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount_che')"
                prop="enroll_amount_che"
              >
                <span>{{formData.enroll_amount_che}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_che"
              >
              <span>{{formData.enroll_start_date_che}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_che"
              >
                <span>{{formData.enroll_end_date_che}}</span>
              </el-form-item>
            </el-col>
          </div>

          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.status')" prop="status">

              <span>{{status_Operations.find(item => item.code == formData.status).name}}</span>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('trainEventInfo.explain')" prop="explain">
              <span>{{formData.explain}}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>

    <teacher-list-dialog
      :visible.sync="teacherListDialogVisible"
      :organizations="formData.organizations.map(item => item.id)"
      :groupSelection="groupSelection"
      :teacherleSelection="teacherleSelection"
      @chooseTeacherList="getChoosedTeacherList"
    />
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import {
  readTrainEventInfo,
} from "@/api/traineventmanage/trainEventInfo";
import { getSysconst } from "@/api/utils";
import TeacherListDialog from "./teacherList";

export default {
  components: {
    Sticky,
    TeacherListDialog,
  },
  data() {
    return {
      loading: true, //是否显示loading
      teacherListDialogVisible: false,
      organizations_teacher_operations: [],
      isChooseTeacherGroups: 0,
      formData: {plan: {}, train_person: {}, course_type: {}, train_type: {}, organize_type: {}, enroll_type: {},organizations: []},
      editId: 0,
      choosedEnrollType: "",
      groupSelection: [],
      teacherleSelection: [],
      status_Operations: [],
    };
  },
  created() {
    this.editId = this.$route.query.id;
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        getSysconst("Train_Event_Status"),
        readTrainEventInfo(this.editId),
      ]).then((response) => {
        console.log(response);
        this.status_Operations = response[0].data;
        this.formData = response[1].data;
        this.choosedEnrollType = response[1].data.enroll_type.code
        this.loading = false;
      });
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handelChooseTeachersClick() {
      this.groupSelection = this.formData.teacher_groups;
      this.teacherleSelection = this.formData.teachers
      this.teacherListDialogVisible = true;
    },
    getChoosedTeacherList(val) {
      this.formData.teacher_groups = val.groupSelection;
      this.formData.teachers = val.teacherleSelection;
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
