<!--/*
 * @Name: TrainEventImplementationRecordInfo add
 * @Module:  src/views/trainEventImplementationRecordInfo/operations/add
 * @Desc: TrainEventImplementationRecordInfo add
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
              <el-input v-model="formData.name" class="items" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainEventImplementationRecordInfo.attachments')">
              <et-upload-item v-model="formData.attachments" accept-type=".doc, .docx, .png, .jpg, .pdf, .rar, .zip, .xls, .xlsx" />
              <div class="el-upload__tip">允许上传的文件类型Word、Excel、Pdf、图片、压缩文件</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('trainEventImplementationRecordInfo.report')"
              prop="remark"
            >
              <tinymce v-model="formData.report" :height="350" width="90%" />
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

import { createSchoolTrainEventImplementationRecordInfo } from '@/api/traineventmanage/trainEventImplementationRecordInfo'
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
        readTrainEventInfo(this.$route.query.pId)
      ]).then((response) => {
        const result = response[0].data
        this.extData = result
        this.$set(this.formData, 'train_event', result.id)
        this.eventName = result.name
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmitForm() {
      console.log(this.formData);
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.Loading = true
          const submitData = Object.assign({}, this.formData)
          console.log(submitData)
          createSchoolTrainEventImplementationRecordInfo(submitData).then(response => {
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
