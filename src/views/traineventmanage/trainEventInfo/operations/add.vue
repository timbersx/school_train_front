<!--/*
 * @Name: TrainEventInfo add
 * @Module:  src/views/trainEventInfo/operations/edit
 * @Desc: TrainEventInfo add
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
      <el-button
        :loading="loading"
        style="margin-left: 10px"
        type="primary"
        @click="handleSubmitForm"
        >{{ this.$t("button.save") }}</el-button
      >
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
          :rules="getRules"
        >
          <el-col :span="24">
            <el-form-item :label="$t('trainEventInfo.plan')" prop="plan">
              <el-select
                v-model="formData.plan"
                class="areaItems"
                :placeholder="$t('common.select')"
                filterable
                value-key="id"
                @change="handelPlanOptionChange"
              >
                <el-option
                  v-for="item in plan_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.end_date }}
                  </span>
                  <span
                    style="
                      float: right;
                      color: #8492a6;
                      font-size: 13px;
                      margin-right: 5px;
                    "
                    >{{ item.start_date }} {{ item.start_date ? " 至" : "" }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.name')" prop="name">
              <el-input v-model="formData.name" class="items"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.start_date')"
              prop="start_date"
            >
              <el-date-picker
                v-model="formData.start_date"
                type="datetime"
                :placeholder="plan_start_date"
                class="items"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.end_date')"
              prop="end_date"
            >
              <el-date-picker
                v-model="formData.end_date"
                type="datetime"
                :placeholder="plan_end_date"
                class="items"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organization')"
              prop="organization"
            >
              <el-input
                v-model="formData.organization"
                class="items"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.cooperation_organization')"
              prop="cooperation_organization"
            >
              <el-input
                v-model="formData.cooperation_organization"
                class="items"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_amount')"
              prop="train_amount"
            >
              <el-input
                v-model="formData.train_amount"
                type="number"
                class="items"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_person')"
              prop="train_person"
            >
              <el-select
                v-model="formData.train_person"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                value-key="id"
              >
                <el-option
                  v-for="item in school_teachers_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.position')"
              prop="position"
            >
              <el-select
                ref="position"
                v-model="formData.position"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                clearable
                value-key="code"
                @change="handelPositionChange"
                :filter-method="handelPositionFilterChange"
                @blur="handelPositionBlur"
                @visible-change="handelPositionVisibleChange"
                @focus="handelPositionFocus"
              >
                <el-option
                  v-for="item in PXDD_Operations"
                  :key="item.code"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
              
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_hour')"
              prop="train_hour"
            >
              <el-input
                v-model="formData.train_hour"
                type="number"
                class="items"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.course_type')"
              prop="course_type"
            >
              <el-select
                v-model="formData.course_type"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                value-key="id"
              >
                <el-option
                  v-for="item in KCLB_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.train_type')"
              prop="train_type"
            >
              <el-select
                v-model="formData.train_type"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                value-key="id"
              >
                <el-option
                  v-for="item in PXLX_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organize_type')"
              prop="organize_type"
            >
              <el-select
                v-model="formData.organize_type"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                value-key="id"
              >
                <el-option
                  v-for="item in ZZFS_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-col :span="12">
              <el-form-item :label="$t('trainEventInfo.speaker')" prop="speaker">
                <el-select
                  v-model="formData.speaker"
                  class="items"
                  :placeholder="$t('common.select')"
                  filterable
                  value-key="id"
                  @change="handelSpeakerChange"
                >
                  <el-option
                    v-for="item in ZJR_Operations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item style="margin-left:-140px;" :prop="speaker_code == 'GGJS' ? 'gg_teachers' : 'wp_experts'">
              <el-select
                v-model="formData[speaker_code == 'GGJS' ? 'gg_teachers' : 'wp_experts']"
                style="width: 80%"
                :placeholder="$t('common.select')"
                filterable
                value-key="id"
                multiple
              >
                <el-option
                  v-for="item in speakers_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              </el-form-item>
            </el-col>
            
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.organizations')"
              prop="organizations"
            >
              <el-select
                v-model="formData.organizations"
                class="items"
                :placeholder="$t('common.select')"
                multiple
                filterable
                value-key="id"
                @change="handelOrganizationsChange"
              >
                <el-option
                  v-for="item in organizations_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventInfo.enrollment_method')"
              prop="enroll_type"
            >
              <el-select
                v-model="formData.enroll_type"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                value-key="id"
                @change="enrollTypeGroupChange"
              >
                <el-option
                  v-for="item in BMFS_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <div v-if="choosedEnrollType == 'ZDDR'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.isChooseTeacherGroups')"
                prop="select_teacher_group"
              >
                <el-select
                  v-model="formData.select_teacher_group"
                  class="items"
                  :placeholder="$t('common.select')"
                  filterable
                  value-key="id"
                  @change="handelSelectTeacherGroupChange"
                >
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div> -->

          <!-- <div
            style="width: 100%; float: left"
            v-if="isChooseTeacherGroups == 1"
          > -->
          <div v-if="choosedEnrollType == 'ZDDR'">
            <el-col :span="12">
              <el-form-item :label="$t('trainEventInfo.select_teacher_group')">
                <el-button
                  type="primary"
                  size="small"
                  @click="handelChooseTeachersClick"
                  >选择</el-button
                >
                <el-button type="primary" size="small" @click="handelChoosedTeachersClick">查看已选择</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.deadline')"
                prop="deadline"
              >
                <el-date-picker
                  v-model="formData.deadline"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.deadline')"
                prop="deadline"
              >
                <el-date-picker
                  v-model="formData.deadline"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col> -->
          </div>
          <!-- </div> -->

          <!-- <div
            style="width: 100%; float: left"
            v-if="isChooseTeacherGroups == 2"
          >
            <el-col :span="12">
              <el-form-item :label="$t('trainEventInfo.select_teacher_group')">
                <el-button
                  type="primary"
                  size="small"
                  @click="handelChooseTeachersClick"
                  >选择</el-button
                >
                <el-button type="primary" size="small" @click="handelChoosedTeachersClick">查看已选择</el-button>
              </el-form-item>
            </el-col>

            
          </div> -->

          <div v-if="choosedEnrollType == 'XDXK'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.organization_types')"
                prop="organization_types"
              >
                <el-select
                  v-model="formData.organization_types"
                  class="items"
                  :placeholder="$t('common.select')"
                  multiple
                  filterable
                  value-key="id"
                >
                  <el-option
                    v-for="item in organization_types_Operations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.subjects')"
                prop="subjects"
              >
                <el-select
                  v-model="formData.subjects"
                  class="items"
                  :placeholder="$t('common.select')"
                  multiple
                  filterable
                  value-key="id"
                >
                  <el-option
                    v-for="item in subjects_Operations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount')"
                prop="enroll_amount_sub"
              >
                <el-input
                  v-model="formData.enroll_amount_sub"
                  class="items"
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_sub"
              >
                <el-date-picker
                  v-model="formData.enroll_start_date_sub"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_sub"
              >
                <el-date-picker
                  v-model="formData.enroll_end_date_sub"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="choosedEnrollType == 'ZYBM'">
            <!-- <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount')"
                prop="enroll_amount_free"
              >
                <el-input
                  v-model="formData.enroll_amount_free"
                  class="items"
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_free"
              >
                <el-date-picker
                  v-model="formData.enroll_start_date_free"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_free"
              >
                <el-date-picker
                  v-model="formData.enroll_end_date_free"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </div>

          <div v-if="choosedEnrollType == 'SHBM'">
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_amount_che')"
                prop="enroll_amount_che"
              >
                <el-input
                  v-model="formData.enroll_amount_che"
                  class="items"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_start_date')"
                prop="enroll_start_date_che"
              >
                <el-date-picker
                  v-model="formData.enroll_start_date_che"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('trainEventInfo.enroll_end_date')"
                prop="enroll_end_date_che"
              >
                <el-date-picker
                  v-model="formData.enroll_end_date_che"
                  type="datetime"
                  :placeholder="$t('common.selectDate')"
                  class="items"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </div>

          <el-col :span="12">
            <el-form-item :label="$t('trainEventInfo.status')" prop="status">
              <el-select
                v-model="formData.status"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                value-key="code"
              >
                <el-option
                  v-for="item in status_Operations"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('trainEventInfo.explain')" prop="explain">
              <el-input type="textarea" v-model="formData.explain" rows="4" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>

    <teacher-list-dialog
      :visible.sync="teacherListDialogVisible"
      :organizations="formData.organizations"
      :groupSelection="groupSelection"
      :teacherleSelection="teacherleSelection"
      @chooseTeacherList="getChoosedTeacherList"
    />
      <!-- :isChooseTeacherGroups="isChooseTeacherGroups" -->
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import {
  createTrainEventInfo,
  getOrganizations,
  getSchoolTeachers,
  getOrganizationsTeachers,
  getCourseTypeInfo,
  getOrganizationTypesSubjects,
  getSpeakers
} from "@/api/traineventmanage/trainEventInfo";
import { getAnnualTrainPlanSchoolInfoList } from "@/api/traineventmanage/annualTrainPlanInfo";
import { getDataDictItemList } from "@/api/systemmanage/dataDictItem"; 
import { getSchoolList } from "@/api/schoolBasedManage/trainFieldMaintain"; 

import { getSysconst } from "@/api/utils";
import TeacherListDialog from "./teacherList";

export default {
  components: {
    Sticky,
    TeacherListDialog,
  },
  data() {
    const speakerValidator = (rule, value, callback) => {
      if (!value && value !== '0') {
        callback(new Error('该项为必填项'))
      } else {
        const ggTeacher = this.formData.gg_teachers
        const wpTeacher = this.formData.wp_experts

        if (!ggTeacher && !wpTeacher) {
          callback(new Error('主讲人不能为空'))
        }
        if (typeof value === 'object' && value.length === 0) {
          callback(new Error('主讲人不能为空'))
        }
        callback()
      }
    }
    return {
      loading: true, //是否显示loading
      plan_start_date: '',
      plan_end_date: '',
      teacherListDialogVisible: false,
      plan_Operations: [],
      organizations_Operations: [],
      school_teachers_Operations: [],
      KCLB_Operations: [],
      PXLX_Operations: [],
      ZZFS_Operations: [],
      ZJR_Operations: [],
      BMFS_Operations: [],
      status_Operations: [],
      school_Operations: [],
      PXDD_Operations: [],
      organization_types_Operations: [],
      subjects_Operations: [],
      organizations_teacher_operations: [],
      isChooseTeacherGroups: 0,
      formData: {},
      groupSelection: [],
      teacherleSelection: [],
      choosedEnrollType: '',
      teacher_groups: [],
      teachers: [],
      speakers_list: [],
      speaker: '',
      speaker_code: '',
      rules: {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        plan: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        start_date: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        end_date: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        organization: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        cooperation_organization: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        train_amount: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        train_person: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        position: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        train_hour: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        course_type: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        train_type: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        organize_type: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        speakers_list: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        organizations: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        enrollment_method: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        speaker: [
          {
            required: true,
            message: this.$t("validate.required"),
          },
          // {
          //   validator: speakerValidator
          // }
        ],
        gg_teachers: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: 'blur'
          },
          {
            validator: speakerValidator,
            trigger: 'blur'
          }
        ],
        wp_experts: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: 'blur'
          },
          {
            validator: speakerValidator,
            trigger: 'blur'
          }
        ],
      },
    };
  },
  computed: {
    getRules(){
      if(this.choosedEnrollType == 'ZDDR'){
        let deadline = { deadline: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur',
          },
        ]}
        return Object.assign(this.rules,deadline)
      }else{
        return this.rules
      }
    }
    
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      Promise.all([
        getAnnualTrainPlanSchoolInfoList({ limit: 10000, offset: 0, status: 2, ordering: '-id' }),
        getOrganizations({ limit: 10000, offset: 0 }),
        getSchoolTeachers({ limit: 10000, offset: 0 }),
        getCourseTypeInfo(),
        getDataDictItemList({ type_code: "PXLX" }),
        getDataDictItemList({ type_code: "ZZFS" }),
        getDataDictItemList({ type_code: "ZJR" }),
        getDataDictItemList({ type_code: "BMFS" }),
        getSysconst("Train_Event_Status"),
        getSchoolList(),
      ]).then((response) => {
        this.plan_Operations = response[0].data;
        this.organizations_Operations = response[1].data;
        this.school_teachers_Operations = response[2].data;
        this.KCLB_Operations = response[3].data;
        this.PXLX_Operations = response[4].data;
        this.ZZFS_Operations = response[5].data;
        this.ZJR_Operations = response[6].data;
        this.BMFS_Operations = response[7].data;
        this.status_Operations = response[8].data;
        this.PXDD_Operations = response[9].data;
        this.loading = false;
      });
    },
    handelOrganizationsChange(val) {
      getOrganizationsTeachers({ organizations: val }).then((res) => {
        this.organizations_teacher_operations = res.data;
      });
    },
    handleSubmitForm() {
      console.log(this.formData.position);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          let teacher_groups = this.teacher_groups.map(item => {
            return item.id
          });
          let teachers = this.teachers.map(item => {
            return item.id
          });
          this.formData.teacher_groups = teacher_groups
          this.formData.teachers = teachers
          createTrainEventInfo(this.formData)
            .then((response) => {
              this.$message.success(this.$t("message.saveSuccess"));
              this.loading = false;
              this.$router.go(-1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleTeacherListSubmit() {
      this.teacherListDialogVisible = false;
    },
    handelChooseTeachersClick() {
      this.groupSelection = []
      this.teacherleSelection = []
      this.teacherListDialogVisible = true;
    },
    handelChoosedTeachersClick() {
      this.groupSelection = this.teacher_groups;
      this.teacherleSelection = this.teachers
      this.teacherListDialogVisible = true;
    },
    getChoosedTeacherList(val) {
      this.teacherListDialogVisible = false;
      this.teacher_groups = val.groupSelection;
      this.teachers = val.teacherleSelection;
    },
    handelSelectTeacherGroupChange(val) {
      this.groupSelection = [];
      this.teacherleSelection = [];
      this.teacher_groups = [];
      this.teachers = [];
      if (val) {
        this.isChooseTeacherGroups = 1;
      } else {
        this.isChooseTeacherGroups = 2;
      }
    },
    handelPlanOptionChange(val){
      this.plan_Operations.map(item => {
        if(item.id === val){
          this.plan_start_date = item.start_date;
          this.plan_end_date = item.end_date;
          this.$set(this.formData, 'organization', item.organization)
          this.$set(this.formData, 'cooperation_organization', item.cooperation_organization)
        }
      })
    },
    enrollTypeGroupChange(val){
      this.BMFS_Operations.map(item => {
        if(item.id === val){
          this.choosedEnrollType = item.code
          if(item.code === 'ZDDR'){
            if(this.formData.select_teacher_group !== null){
              if(this.formData.select_teacher_group){
                this.isChooseTeacherGroups = 1
              }else{
                this.isChooseTeacherGroups = 2
              }
            }else{
              this.isChooseTeacherGroups = 0
            }
          }else if(item.code === 'XDXK'){
            this.formData.enroll_amount_sub = this.formData.train_amount
            getOrganizationTypesSubjects({organizations: this.formData.organizations}).then(res => {
              this.organization_types_Operations = res.data.organization_types
              this.subjects_Operations = res.data.subjects
            })
            this.isChooseTeacherGroups = 0
          }else if(item.code === 'ZYBM'){
            this.formData.enroll_amount_free = this.formData.train_amount
            this.isChooseTeacherGroups = 0
          }
          else{
            this.isChooseTeacherGroups = 0
          }
        }
      })
    },
    handelSpeakerChange(val){
      this.$set(this.formData, 'gg_teachers', [])
      this.$set(this.formData, 'wp_experts', [])
      this.speaker_code = this.ZJR_Operations.find(item => item.id === val).code
      getSpeakers({speaker: val}).then(res => {
        this.speakers_list = res.data
      })
    },
    handelPositionChange(val){
    },
    handelPositionFilterChange(val){
      this.$set(this.formData, 'position', val)
    },
    handelPositionBlur(val){
    },
    handelPositionVisibleChange(val){
      if(!val){
       let input = this.$refs.position.$children[0].$refs.input
       input.blur()
      }
    },
    handelPositionFocus(val){
      let value = val.target.value;
      setTimeout(() => {
        let input = this.$refs.position.$children[0].$refs.input;
          input.value = value;
          this.$set(this.formData, 'position', value)
      })
    }
  },
};
</script>

<style lang='scss' scoped>
</style>
