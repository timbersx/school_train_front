<!--/*
 * @Name: TrainEventImplementationRecordInfo detail
 * @Module:  src/views/trainEventImplementationRecordInfo/operations/detail
 * @Desc: TrainEventImplementationRecordInfo detail
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
              {{ extData.name }}
            </el-form-item>
          </el-col>
          <el-col v-for="(item, index) in extList" v-show="formData.train_event" :key="index" :span="12">
            <el-form-item
              :label="$t(`trainEventImplementationRecordInfo.${item}`)"
            >{{ detailValue(item) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('trainEventImplementationRecordInfo.attachments')">
              <el-button v-for="item in attachList" :key="item.id" type="text" class="attach-list" @click="handleAttachClick(item)">
                <i class="el-icon-document" /> {{ item.local_file_name }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('trainEventImplementationRecordInfo.report')"
              prop="remark"
            >
              <div v-html="formData.report" />
              <!-- <tinymce v-model="formData.report" :height="350" width="90%" /> -->
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
// import Tinymce from '@/components/Tinymce'
import fileDownload from 'js-file-download'
import { downloadAttachment } from '@/api/utils'
import { readTrainEventImplementationRecordInfo } from '@/api/municipalEvent/municipalEventRecords'
import { readTrainEventInfo } from '@/api/municipalEvent/municipalEventCreation'
export default {
  components: {
    Sticky
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
        ]
      },
      extData: {},
      extList: ['plan', 'start_date', 'end_date', 'train_person', 'train_hour', 'enroll_amount', 'confirm_amount'],
      attachList: []
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
          report: recordInfo.report
        }
        // this.handleChange(recordInfo.train_event.id)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleReturn() {
      this.$router.go(-1)
    },
    handleChange(val) {
      this.extData = this.train_event_Operations.find(i => i.id === val) || {}
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
.attach-list {
  padding-right: 25px;
}
.word-break {
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: "Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif";
  margin: 0;
  width: 80%;
  float: left;
  font-size: 14px;
  color: #606266
}
</style>
