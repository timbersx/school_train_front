<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="$t('trainEventInfo.setSignupDate')"
      @close="handleReturn"
    >
      <el-divider />

      <div v-loading="loading">
        <el-main class="form-container">
          <el-form
            ref="dataForm"
            :loading="loading"
            label-width="150px"
            :model="formData"
            label-suffix=":"
            :rules="rules"
          >
            <el-form-item :label="$t('trainEventInfo.signUpStartDate')" prop="start_date">
              <el-date-picker
                v-model="formData.start_date"
                type="datetime"
                :placeholder="$t('common.selectDate')"
                class="items"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
            <el-form-item :label="$t('trainEventInfo.signUpEndDate')" prop="end_date">
              <el-date-picker
                v-model="formData.end_date"
                type="datetime"
                :placeholder="$t('common.selectDate')"
                class="items"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-form>
        </el-main>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px">
        <el-button @click="handleReturn">{{
          this.$t("button.cancel")
        }}</el-button>
        <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="primary"
          @click="handleSubmitForm"
        >{{ this.$t("button.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { createTrainEventSigninInfo, readTrainEventSigninInfo, updateTrainEventSigninInfo } from "@/api/municipalEvent/municipalEventCreation"

export default {
  name: 'SetSignupDate',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: Number,
      default: -1
    },
    editDetailId: {
      type: Number,
      default: -1
    }
  },
  data() {
    const validStartDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('该项为必填项'))
      } else {
        if (this.formData.end_date) {
          this.$refs.dataForm.validateField('end_date')
        }
        callback()
      }
    }
    const validEndDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('该项为必填项'))
      } else {
        if (this.formData.start_date && moment(this.formData.start_date).isAfter(value)) {
          callback(new Error('签到结束时间不得小于签到开始时间'))
        }
        callback()
      }
    }
    return {
      loading: false, // 是否显示loading
      list: null,
      formData: {},
      rules: {
        start_date: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          },
          {
            validator: validStartDate,
            trigger: 'blur'
          }
        ],
        end_date: [
          {
            validator: validEndDate,
            trigger: 'blur'
          },
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.formData.train_event = this.editId
        this.init(newValue)
      }
    }
  },
  methods: {
    init() {
      if (this.editDetailId > 0) {
        readTrainEventSigninInfo(this.editDetailId).then(res => {
          this.formData = res.data
          this.formData.train_event = this.editId
        })
      }
    },
    handleReturn() {
      this.formData = {}
      this.$refs.dataForm.resetFields()
      this.$emit('update:visible', false)
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true

          if (this.editDetailId > 0) {
            updateTrainEventSigninInfo(this.formData, this.editDetailId)
              .then((response) => {
                this.formData = {}
                this.$message.success(this.$t('message.saveSuccess'))
                this.loading = false
                this.$emit('setChange', true)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            createTrainEventSigninInfo(this.formData)
              .then((response) => {
                this.formData = {}
                this.$message.success(this.$t('message.saveSuccess'))
                this.loading = false
                this.$emit('setChange', true)
              })
              .catch(() => {
                this.loading = false
              })
          }
        } else {
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
