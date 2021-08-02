<!--/*
 * @Name: TrainEventFundsRecordInfo edit
 * @Module:  src/views/trainEventFundsRecordInfo/operations/edit
 * @Desc: TrainEventFundsRecordInfo edit
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div v-loading="loading" class="app-container">
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button
        :loading="loading"
        style="margin-left: 10px"
        type="primary"
        @click="handleSubmitForm"
      >{{ this.$t("button.save") }}</el-button>
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <el-container class="form-container">
      <el-main>
        <el-form
          ref="dataForm"
          :loading="loading"
          label-width="200px"
          :model="formData"
          label-suffix=":"
          :rules="rules"
        >
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventFundsRecordInfo.train_event')"
              prop="train_event"
            >
              {{ eventName }}
            </el-form-item>
          </el-col>
          <el-col v-for="(item, index) in extList" v-show="formData.train_event" :key="index" :span="12">
            <el-form-item
              :label="$t(`trainEventFundsRecordInfo.${item}`)"
            >{{ detailValue(item) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventFundsRecordInfo.funds_time')" prop="funds_time">
              <el-date-picker
                v-model="formData.funds_time"
                class="items"
                type="datetime"
                :placeholder="$t('trainEventFundsRecordInfo.funds_time')"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventFundsRecordInfo.funds_location')" prop="funds_location">
              <el-input v-model="formData.funds_location" class="items" clearable :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventFundsRecordInfo.witness')" prop="witness">
              <el-input v-model="formData.witness" class="items" clearable :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventFundsRecordInfo.efunds')" prop="funds">
              <el-input v-model="formData.funds" class="items" clearable :placeholder="$t('table.input')" @input="handleInputFunds" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventFundsRecordInfo.attachments')" prop="attachments">
              <et-upload-item v-model="formData.attachments" accept-type=".doc, .docx, .xls, .xlsx, .pdf" :attachment-list="attachList" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('trainEventFundsRecordInfo.funds_explain')" prop="funds_explain">
              <el-input v-model="formData.funds_explain" class="col-items" type="textarea" :rows="10" clearable :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import EtUploadItem from '@/components/EtUploadItem'

import { updateSchoolTrainEventFundsRecordInfo, readTrainEventFundsRecordInfo } from '@/api/municipalEvent/municipalEventFundsRecords'
import { readTrainEventInfo } from '@/api/municipalEvent/municipalSchoolRegistration'
export default {
  components: {
    Sticky,
    EtUploadItem
  },
  data() {
    const fundsValidate = (rule, value, callback) => {
      if (!value && value !== '0') {
        callback(new Error('该项为必填项'))
      } else {
        if (isNaN(Number(value))) {
          callback(new Error('请输入合法数字'))
        }
        if (Number(value) < 0) {
          callback(new Error('请输入大于或等于0的数值'))
        }
        callback()
      }
    }
    return {
      loading: false, // 是否显示loading
      train_event_Operations: [],
      attachment_Operations: [],
      formData: {},
      rules: {
        train_event: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
        funds_time: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
        funds_location: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
        witness: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
        attachments: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
        funds: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          },
          {
            validator: fundsValidate
          }
        ],
        funds_explain: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ]
      },
      extData: {},
      // extList: ['plan', 'start_date', 'end_date', 'train_person', 'train_hour', 'enroll_amount', 'confirm_amount']
      extList: ['plan', 'train_person'],
      attachList: [],
      eventName: ''
    }
  },
  computed: {
    detailValue() {
      return (prop) => {
        switch (prop) {
          case 'plan':
            return this.extData[prop] ? this.extData[prop].name : ''
          case 'train_person':
            return this.extData[prop] ? this.extData[prop].name : ''
          case 'enroll_amount':
            return this.extData.enroll_confirm_amount ? this.extData.enroll_confirm_amount.enroll_amount : ''
          case 'confirm_amount':
            return this.extData.enroll_confirm_amount ? this.extData.enroll_confirm_amount.confirm_amount : ''
          default:
            return this.extData[prop]
        }
      }
    }
  },
  created() {
    this.start()
  },
  methods: {
    start() {
      this.loading = true
      Promise.all([
        readTrainEventInfo(this.$route.query.pId),
        readTrainEventFundsRecordInfo(this.$route.query.tId)
      ]).then((response) => {
        const result0 = response[0].data
        this.extData = result0
        this.eventName = result0.name
        const recordInfo = response[1].data
        this.attachList = recordInfo.attachments
        this.formData = {
          train_event: recordInfo.train_event.id,
          attachments: recordInfo.attachments.map(i => i.id),
          funds_location: recordInfo.funds_location,
          funds_time: recordInfo.funds_time,
          funds_explain: recordInfo.funds_explain,
          funds: recordInfo.funds,
          witness: recordInfo.witness
        }
        // this.handleChange(recordInfo.train_event.id)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const submitData = Object.assign({}, this.formData)
          updateSchoolTrainEventFundsRecordInfo(this.$route.query.tId, submitData).then(response => {
            this.$emit('save', response)
            this.loading = false
            this.$message.success(this.$t('message.saveSuccess'))
            this.$router.go(-1)
            this.form = {}
          }).catch(() => {
            this.loading = false
            // this.$router.go(-1)
          })
        } else {
          return false
        }
      })
    },
    handleReturn() {
      this.$router.go(-1)
    },
    handleChange(val) {
      this.extData = this.train_event_Operations.find(i => i.id === val) || {}
    },
    handleInputFunds(value) {
      // 防抖已经准备好了👇（如果需要的话）
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (!isNaN(Number(value)) && Number(value) > 0) {
          const res = Math.floor(Number(value) * 100) / 100
          this.$set(this.formData, 'funds', res.toFixed(2))
        }
      }, 800)
    }
  }
}
</script>

<style lang='scss' scoped>
.col-items {
  width: calc(90% + 20px);
}
</style>
