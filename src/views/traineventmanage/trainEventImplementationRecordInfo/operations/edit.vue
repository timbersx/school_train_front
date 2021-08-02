<!--/*
 * @Name: TrainEventImplementationRecordInfo edit
 * @Module:  src/views/trainEventImplementationRecordInfo/operations/edit
 * @Desc: TrainEventImplementationRecordInfo edit
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
              :label="$t('trainEventImplementationRecordInfo.train_event')"
              prop="train_event"
            >
              {{ eventName }}
            </el-form-item>
          </el-col>
          <el-col v-for="(item, index) in extList" v-show="formData.train_event" :key="index" :span="12">
            <el-form-item
              :label="$t(`trainEventImplementationRecordInfo.${item}`)"
            >{{ detailValue(item) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventImplementationRecordInfo.name')" prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventImplementationRecordInfo.attachments')">
              <et-upload-item v-model="formData.attachments" accept-type=".doc, .docx, .xls, .xlsx, .pdf" :attachment-list="attachList" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('trainEventImplementationRecordInfo.report')"
              prop="remark"
            >
              <tinymce id="profile" v-model="formData.report" :height="350" width="90%" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import EtUploadItem from '@/components/EtUploadItem'

import { updateSchoolTrainEventImplementationRecordInfo, readTrainEventImplementationRecordInfo } from '@/api/traineventmanage/trainEventImplementationRecordInfo'
import { readTrainEventInfo } from '@/api/traineventmanage/trainEventInfo'
export default {
  components: {
    Sticky,
    Tinymce,
    EtUploadItem
  },
  data() {
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
        name: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ]
      },
      extData: {},
      extList: ['plan', 'start_date', 'end_date', 'train_person', 'train_hour', 'enroll_amount', 'confirm_amount'],
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
        readTrainEventImplementationRecordInfo(this.$route.query.tId)
      ]).then((response) => {
        const result0 = response[0].data
        this.extData = result0
        this.eventName = result0.name
        const recordInfo = response[1].data
        this.attachList = recordInfo.attachments
        this.formData = {
          train_event: recordInfo.train_event.id,
          attachments: recordInfo.attachments.map(i => i.id),
          report: recordInfo.report,
          name: recordInfo.name
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
          this.Loading = true
          const submitData = Object.assign({}, this.formData)
          updateSchoolTrainEventImplementationRecordInfo(this.$route.query.tId, submitData).then(response => {
            this.$emit('save', response)
            this.Loading = false
            this.$message.success(this.$t('message.saveSuccess'))
            this.$router.go(-1)
            this.form = {}
          }).catch(() => {
            this.Loading = false
            // this.$router.go(-1)
            this.form = {}
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
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
