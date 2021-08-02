<!--/*
 * @Name: schoolBasedTrainingHome categorydialog
 * @Module:  src/views/schoolBasedTeachers/schoolBasedTrainingHome/categorydialog
 * @Desc: schoolBasedTrainingHome categorydialog
 * @Author:  automatic code
 * @Date:  2021-02-22 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :title="'课程类别: '+categoryName"
      width="850px"
      :before-close="handleClose"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <el-divider />
      <el-main class="main-position">
        <h2 class="head-title">培训活动详情:</h2>
        <el-form
          v-if="Object.keys(formData).length!==0"
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
            <div
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
            </div>

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
        <div v-if="Object.keys(formData).length===0" class="el-tree__empty-block">
          <span class="el-tree__empty-text">暂无数据</span>
        </div>
        <h2 class="head-title">上传的材料:</h2>
        <div v-for="item in attachments" :key="item.id" class="file-content">
          <p>
            <i class="el-icon-document" />
            <span class="">{{ item.local_file_name }}</span>
            <el-button
              type="text"
              class="btn-space"
              :disabled="!item.preview_url || item.preview_url.length === 0"
              @click="handleReview(item)"
            >预览</el-button>
            <el-button type="text" @click="handleDownload(item)">下载</el-button>
          </p>
          <el-image-viewer v-if="showViewer" :url-list="urlList" :on-close="closeViewer" style="z-index: 5000;" />
        </div>
        <div v-if="attachments.length===0" class="el-tree__empty-block">
          <span class="el-tree__empty-text">暂无数据</span>
        </div>
        <h2 class="head-title">签到记录:</h2>
        <div class="file-content">
          <p v-for="item in siginRecord" :key="item.id">
            {{ item.sign_in_time }}
          </p>
        </div>
        <div v-if="siginRecord.length===0" class="el-tree__empty-block">
          <span class="el-tree__empty-text">暂无数据</span>
        </div>
      </el-main>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("button.close") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import fileDownload from 'js-file-download'
import { getSysconst, downloadAttachment } from '@/api/utils'
import { getTeacherCompleteDetailInfo } from '@/api/schoolBasedTeachers/schoolBasedTrainingHome'
export default {
  components: {
    ElImageViewer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    categoryApiId: {
      type: [String, Number],
      default: ''
    },
    categoryName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      teacherListDialogVisible: false,
      organizations_teacher_operations: [],
      isChooseTeacherGroups: 0,
      formData: {},
      status_Operations: [],
      attachments: [],
      urlList: [],
      showViewer: false,
      siginRecord: []
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
    visible(va) {
      if (va) {
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  methods: {
    init() {
      if (!this.categoryApiId) {
        return false
      }
      Promise.all([
        getSysconst('Train_Event_Status'),
        getTeacherCompleteDetailInfo(this.categoryApiId)
      ]).then((response) => {
        this.status_Operations = response[0].data
        this.formData = response[1].data.train_event
        this.attachments = response[1].data.attachments
        this.siginRecord = response[1].data.sign_in_records
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
    },
    handleReview(item) {
      if (item.preview_url !== null) {
        this.urlList = JSON.parse(item.preview_url).map(item => {
          return item.file_url
        })
        this.showViewer = true
      }
    },
    closeViewer() {
      this.showViewer = false
    },
    handleDownload(item) {
      downloadAttachment(item.id).then(res => {
        fileDownload(res, item.local_file_name)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.form-search {
  margin-top: 20px;
}
.main-position {
    overflow: auto;
    max-height: 550px;
    padding-top: 0;
}
.head-title {
  font-size: 20px;
  font-weight: 900;
  padding-left: 20px;
}
.file-content {
  font-size: 15px;
  padding: 0 0 0 80px;
  line-height: 1;
  height: 1;
}
</style>
