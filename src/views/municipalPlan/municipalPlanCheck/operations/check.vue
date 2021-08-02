<!--/*
 * @Name: educationBureauEvaluation check
 * @Module:  src/views/educationBureauEvaluation/operations/check
 * @Desc: educationBureauEvaluation check
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
      <!-- <el-button type="primary" @click="handleUpload">{{
        this.$t("button.upload")
      }}</el-button> -->
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <el-container class="form-container">
      <el-main>
        <h2 style="text-align: center">
          {{ year }}年度太仓市中小学、幼儿园市级培训项目评价
        </h2>
        <h4 style="text-align: center">{{ school }}</h4>
        <et-plan-detail :plan-id="editId" :is-show-back="false" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import {
  getPlanScorePoints,
  educationSubmitCheck,
  readAnnualTrainplanInfo
} from '@/api/municipalPlan/municipalPlanCheck'
import EtPlanDetail from '@/components/EtPlanDetailMunicipal'
export default {
  components: {
    Sticky,
    EtPlanDetail
  },
  data() {
    return {
      editId: 0,
      loading: true,
      formData: {},
      listLoading: false,
      listColumnsCGPX: [
        'score_point__desc',
        'score_point__max_score',
        'evaluate_score',
        'evaluate_reason'
      ],
      listColumns: [
        'indicatorA',
        'indicatorB',
        'score_point__desc',
        'score_point__max_score',
        'evaluate_score',
        'evaluate_reason'
      ],
      list: [],
      school: '',
      year: '',
      recursionCount: 0,
      funds: null,
      trainplanData: { plan_type: { code: '' }},
      educationSubmitData: {
        education_funds: '',
        funds_education_status: '',
        funds_education_approve_comment: ''
      },
      rules: {
        approve_comment: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      },
      rulesWithFunds: {
        funds: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        approve_comment: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    const { id, school, year } = this.$route.query
    this.editId = id
    this.school = school
    this.year = year
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      getPlanScorePoints(this.editId)
        .then((res) => {
          this.getIndicatorList(res.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      readAnnualTrainplanInfo(this.editId).then((res) => {
        this.trainplanData = res.data
      })
    },
    getIndicatorList(data) {
      let indicatorList = {}
      const recursionIndicatorList = []
      data.map((item) => {
        indicatorList = item
        indicatorList['indicatorA'] = item.indicator_name_list[0]
        indicatorList['indicatorB'] = item.indicator_name_list[1]
        recursionIndicatorList.push(indicatorList)
      })
      this.list = recursionIndicatorList
    },
    handleReturn() {
      this.$router.go(-1)
    },
    handleUpload() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          educationSubmitCheck({
            plan: this.editId,
            ...this.educationSubmitData
          }).then((res) => {
            this.$router.go(-1)
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
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
