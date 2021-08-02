<template>
  <div v-loading="loading" class="app-container">
    <paper-top :name="paperData.name" :count="questionsNumber" @export="handleExportSchool" />
    <school-info :data="listData" />
  </div>
</template>

<script>
import PaperTop from './content/paperTop'
import SchoolInfo from './content/schoolInfo'

import { readPaper } from '@/api/municipalEvent/questionnaire'
import fileDownload from 'js-file-download'
import { getPaperEvaluateObjectAnalysis, exportQuestionnaireAnalysisInfo } from '@/api/municipalEvent/questionnaireAnalysis'
export default {
  components: {
    PaperTop,
    SchoolInfo
  },
  data() {
    return {
      schoolId: '',
      paperId: '',
      paperData: {},
      listData: [],
      loading: false,
      questionsNumber: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      let schoolId = this.$route.query.schoolId
      if (schoolId === null) {
        schoolId = ''
      }
      this.schoolId = schoolId
      this.paperId = this.$route.query.paperId
      Promise.all([
        readPaper(this.$route.query.paperId),
        getPaperEvaluateObjectAnalysis(this.$route.query.paperId, { school: schoolId })
      ]).then(response => {
        this.paperData = Object.assign({}, response[0].data)
        const listData = response[1].data.question_detail
        this.listData = listData
        // 题目数量
        this.questionsNumber = this.fixAllQuestionsNumber(this.listData)
        this.loading = false
      }).catch(() => {
        this.loading = false
        // 有数据后需删除
      })
    },
    fixAllQuestionsNumber(question_detail) {
      // console.log(question_detail);
      // let count = 0
      // question_detail.map(item => {
      //   count += item.questions.length
      // })
      return question_detail.length
    },
    handleExportSchool() {
      exportQuestionnaireAnalysisInfo(this.paperId, { school: this.schoolId }).then(response => {
        fileDownload(response, `${this.$t('questionnaireAnalysis.exportAnalysis')}_${this.paperData.name}.xls`)
      })
    },
    // 排序比较函数
    handleCompare(obj1, obj2) {
      const id1 = obj1.id
      const id2 = obj2.id
      if (id1 < id2) {
        return -1
      } else if (id1 > id2) {
        return 1
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
