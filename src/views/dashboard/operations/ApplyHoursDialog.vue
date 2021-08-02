<!--/*
 * @Name: schoolBasedTrainingHome applyhours
 * @Module:  src/views/schoolBasedTeachers/schoolBasedTrainingHome/applyhours
 * @Desc: schoolBasedTrainingHome applyhours
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
      :title="'培训活动'+eventName"
      width="700px"
      :before-close="handleClose"
      @close="handleClose"
    >
      <el-divider />
      <div class="form-search">
        <el-form
          ref="dataForm"
          v-loading="loading"
          label-width="150px"
          :model="formData"
          label-suffix=":"
          class="clearfix"
          :rules="rules"
        >
          <el-col :span="24">
            <el-form-item :label="$t('schoolBasedTrainingHome.attachments')" prop="attachments">
              <et-upload-item v-model="formData.attachments" need-preview class="items" :attachment-list="attachList" />
              <div class="el-upload__tip">允许上传的文件类型Word、Excel、Pdf、图片、TXT、压缩文件</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('schoolBasedTrainingHome.explain')" prop="explain">
              <el-input
                v-model="formData.explain"
                type="textarea"
                maxlength="100"
                class="items"
                style="width: 500px"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("button.cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmitForm">{{
          $t("button.save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EtUploadItem from '@/components/EtUploadItem'
import { getTeacherEventHoursInfo, teacherSetHours } from '@/api/schoolBasedTeachers/schoolBasedTrainingHome'
export default {
  components: {
    EtUploadItem
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    eventId: {
      type: [String, Number],
      default: ''
    },
    eventName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      formData: {},
      rules: {
        explain: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      },
      attachList: []
    }
  },
  watch: {
    visible(va) {
      if (va) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.loading = true
      getTeacherEventHoursInfo(this.eventId).then(response => {
        this.loading = false
        const res = response.data
        this.attachList = res.attachments
        this.formData = {
          attachments: res.attachments.map(i => i.id),
          explain: res.explain
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          teacherSetHours(this.eventId, this.formData)
            .then(response => {
              this.$message.success(this.$t('message.saveSuccess'))
              this.loading = false
              this.formData = {}
              this.attachList = []
              this.$emit('update:visible')
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.loading = false
          return false
        }
      })
    },
    handleClose() {
      this.formData = {}
      this.attachList = []
      this.$emit('update:visible')
    }
  }
}
</script>

<style lang='scss' scoped>
.form-search {
  margin-top: 20px;
}
</style>
