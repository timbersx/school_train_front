<!--/*
 * @Name: TrainEventFundsRecordInfo detail
 * @Module:  src/views/trainEventFundsRecordInfo/operations/detail
 * @Desc: TrainEventFundsRecordInfo detail
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
              :label="$t('trainEventFundsRecordInfo.train_event')"
              prop="train_event"
            >
              {{ extData.name }}
            </el-form-item>
          </el-col>
          <el-col v-for="(item, index) in extList" v-show="formData.train_event" :key="index" :span="12">
            <el-form-item
              :label="$t(`trainEventFundsRecordInfo.${item}`)"
            >{{ detailValue(item) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventFundsRecordInfo.funds_time')"
              prop="funds_time"
            >
              {{ formData.funds_time }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventFundsRecordInfo.funds_location')"
              prop="funds_location"
            >
              {{ formData.funds_location }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventFundsRecordInfo.witness')"
              prop="witness"
            >
              {{ formData.witness }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventFundsRecordInfo.efunds')"
              prop="funds"
            >
              {{ formData.funds }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('trainEventFundsRecordInfo.attachments')">
              <el-button v-for="item in attachList" :key="item.id" type="text" class="attach-list" @click="handleAttachClick(item)">
                <i class="el-icon-document" /> {{ item.local_file_name }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventFundsRecordInfo.funds_explain')"
              prop="funds_explain"
            >
              {{ formData.funds_explain }}
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import fileDownload from 'js-file-download'
import { downloadAttachment } from '@/api/utils'
import { readTrainEventFundsRecordInfo } from '@/api/municipalEvent/municipalEventFundsRecords'
import { readTrainEventInfo } from '@/api/municipalEvent/municipalSchoolRegistration'
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
</style>
