<template>
  <div v-loading="loading" class="app-container">
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button @click="handleRecognize(true)">{{
        '认定'
      }}</el-button>
      <!-- <el-button @click="handleRecognize(false)">{{
        '不认定'
      }}</el-button> -->
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
          :rules="rules"
          label-suffix=":"
          class="clearfix"
        >
          <el-col v-for="(item, index) in extList" :key="index" :span="12">
            <el-form-item
              :label="$t(`trainEventClassHourInfo.${item}`)"
            >{{ detailValue(item) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('trainEventClassHourInfo.hours')"
              prop="hours"
            >
              <el-input v-model="formData.hours" class="items" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item :label="$t('trainEventClassHourInfo.attachments')">
              <el-button v-for="item in attachList" :key="item.id" type="text" class="attach-list" @click="handleAttachClick(item)">
                <i class="el-icon-document" /> {{ item.local_file_name }}
              </el-button>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item
              :label="$t(`trainEventClassHourInfo.explain`)"
            >{{ formData.explain }}</el-form-item>
          </el-col>
        </el-form>
        <!-- <el-divider /> -->
        <div>
          <el-tabs v-model="activeName" class="tabs-position">
            <el-tab-pane label="签到记录" name="first">
              <div v-if="signRecordsList.length===0" class="el-tree__empty-block">
                <span class="el-tree__empty-text">暂无数据</span>
              </div>
              <div v-else class="form-container clearfix">
                <div class="sign-box">
                  <p class="sign-title">签到要求开始时间</p>
                  <div v-for="(item, index) in signRecordsList" :key="index">
                    <p>{{ item.start_date || '暂无' }}</p>
                  </div>
                </div>
                <div class="sign-box">
                  <p class="sign-title">签到要求结束时间</p>
                  <div v-for="(item, index) in signRecordsList" :key="index">
                    <p>{{ item.end_date || '暂无' }}</p>
                  </div>
                </div>
                <div class="sign-box">
                  <p class="sign-title">实际签到时间</p>
                  <div v-for="(item, index) in signRecordsList" :key="index">
                    <p>{{ item.sign_in_record.sign_in_time || '暂无' }}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="证明材料" name="second">
              <div v-if="attachList.length===0" class="el-tree__empty-block">
                <span class="el-tree__empty-text">暂无数据</span>
              </div>
              <div v-for="item in attachList" :key="item.id">
                <el-button type="text" class="attach-list" size="small" @click="handleAttachClick(item)">
                  <span style="fontSize: 14px;"><i class="el-icon-document" /> {{ item.local_file_name }}</span>
                </el-button>
                <el-button
                  type="text"
                  class="btn-space"
                  size="small"
                  style="fontSize: 14px;"
                  :disabled="!item.preview_url || item.preview_url.length === 0"
                  @click="handleReview(item)"
                >预览</el-button>
                <el-button type="text" style="fontSize: 14px;" size="small" @click="handleDownload(item)">下载</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
    <el-image-viewer v-if="showViewer" :url-list="urlList" :on-close="closeViewer" />
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import fileDownload from 'js-file-download'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { downloadAttachment } from '@/api/utils'
import { readTrainEventClassHourInfo, recognizeTrainEventClassHourInfo, getSiginInRecordsInfo } from '@/api/municipalEvent/municipalEventHours'
export default {
  components: {
    Sticky,
    ElImageViewer
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    return {
      tId: '',
      loading: false,
      extList: ['train_event', 'plan', 'train_hour', 'teacher'],
      attachList: [],
      formData: {},
      extData: {},
      rules: {
        hours: [
          {
            required: true,
            message: this.$t('validate.required')
          },
          {
            validator: checkNumber,
            trigger: 'blur'
          }
        ]
      },
      activeName: 'first',
      signList: [],
      signRecordsList: [],
      showViewer: false,
      urlList: []
    }
  },
  computed: {
    detailValue() {
      return (prop) => {
        switch (prop) {
          case 'train_event':
            return this.extData.name
          case 'plan':
            return this.extData[prop] ? this.extData[prop].name : ''
          case 'train_hour':
            return this.extData[prop]
          case 'teacher':
            return this.formData[prop] ? this.formData[prop].name : ''
          default:
            return this.formData[prop]
        }
      }
    }
  },
  created() {
    this.tId = this.$route.query.tId
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        readTrainEventClassHourInfo(this.$route.query.tId),
        getSiginInRecordsInfo(this.$route.query.eId, { teacher: this.$route.query.pId })
      ]).then(response => {
        const classHour = response[0].data
        this.formData = classHour
        this.attachList = classHour.attachments
        this.extData = classHour.train_event
        this.signList = response[1].data.sign_in_records
        this.signRecordsList = response[1].data.sign_ins
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleReturn() {
      this.$router.go(-1)
    },
    handleAttachClick(item) {
      downloadAttachment(item.id).then(res => {
        fileDownload(res, item.local_file_name)
      })
    },
    handleRecognize(value) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          recognizeTrainEventClassHourInfo(this.tId, { status: value, hours: this.formData.hours }).then(response => {
            this.$message.success(this.$t('message.saveSuccess'))
            this.$router.go(-1)
            this.loading = false
          })
        } else {
          return false
        }
      })
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

<style lang="scss" scoped>
.tabs-position {
  margin: 25px;
}
.form-container {
  padding: 10px 20px;
}
.sign-box {
  width: 250px;
  float: left;
  font-size: 14px;
  p {
    line-height: 40px;
    margin: 0;
  }
}
.btn-space {
  padding-left: 30px;
}
.sign-title {
  // color: #606266;
  font-weight: 700;
}
// .attach-list {
//   width: 300px;
// }
</style>
