<template>
  <div class="app-container">
    <div v-loading="pageLoading" class="box-card form-container">
      <el-form
        ref="form"
        :model="form"
        label-width="220px"
        label-suffix=":"
        class="dialog-form-space"
      >
        <el-row>
          <el-col v-for="(item, index) in typeList" :key="index" :span="labelSpan(item)">
            <el-form-item :label="$t('annualTrainPlanInfo.' + item)">
              <span class="pre-space">{{ detailValue(item, form) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
        <el-image-viewer v-if="showViewer" :url-list="urlList" :on-close="closeViewer" />
      </div>
    </div>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import fileDownload from 'js-file-download'
import { getSysconst, downloadAttachment } from '@/api/utils'
import { readAnnualTrainplanInfo } from '@/api/municipalPlan/municipalPlanCheck'

export default {
  components: {
    ElImageViewer
  },
  props: {
    planId: {
      type: [Number, String],
      default: ''
    },
    isShowBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageLoading: false,
      typeList: [],
      form: {},
      statusList: [],
      flowList: [],
      attachments: [],
      urlList: [],
      showViewer: false,
      activeName: 'first'
    }
  },
  computed: {
    detailValue() {
      return (item, form) => {
        switch (item) {
          case 'approve_comment': {
            return form.funds_education ? form.funds_education.approve_comment : '暂无'
          }
          case 'funds_final': {
            return form.funds_education ? form.funds_education.funds : '暂无'
          }
          case 'plan_type': case 'plan_category': {
            return form[item] && form[item].name
          }
          case 'year': {
            return form[item] && form[item].year
          }
          case 'status': {
            const carry = this.statusList.find(i => i.code === form.status)
            return carry === undefined ? '' : carry.name
          }
          case 'flow': {
            const carry = this.flowList.find(i => i.code === form.flow)
            return carry === undefined ? '' : carry.name
          }
          default:
            return form[item]
        }
      }
    },
    labelSpan() {
      return (item) => {
        const mutiLables = ['implementation_background', 'target', 'stage_task', 'organize_type', 'participants', 'expected_results', 'funds_purpose', 'budget_estimate']
        return mutiLables.some(i => i === item) ? 22 : 11
      }
    }
  },
  watch: {
    planId: {
      handler(val) {
        if (val > 0) {
          this.init(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    init(val) {
      this.pageLoading = true
      Promise.all(
        [getSysconst('Train_Plan_Check_Status'),
          getSysconst('Train_Plan_Check_Flow'),
          readAnnualTrainplanInfo(val)]
      ).then(response => {
        this.statusList = response[0].data
        this.flowList = response[1].data
        const result2 = response[2].data
        if (result2.plan_type && !result2.plan_type.type) {
          this.typeList = ['plan_type', 'name', 'year', 'director', 'start_date', 'end_date']
        } else {
          this.typeList = ['plan_type', 'name', 'year', 'director', 'start_date', 'end_date', 'funds',
            'organization', 'cooperation_organization', 'plan_category', 'implementation_background', 'target', 'stage_task',
            'organize_type', 'participants', 'expected_results', 'funds_purpose', 'budget_estimate']
        }
        result2.attachments && (this.attachments = result2.attachments)
        this.form = result2
        this.pageLoading = false
      })
    },
    handleReturn() {
      this.$router.go(-1)
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
.file-content {
  font-size: 15px;
  padding: 0 0 0 120px;
  line-height: 1;
  height: 1;
}
.btn-space {
  margin-left: 20px;
}
.box-card {
  padding: 10px 0 0 0;
  min-height: 200px;
}
.pre-space {
  white-space: pre-wrap;
}
</style>
