<template>
  <div class="dashboard-container" v-if="!hideAll">
    <div>
      <el-container class="form-container">
        <el-main>
          <!-- 左侧试题类型部分 -->
          <div :style="$isMobile?{'padding-top':'50px'}:{'padding-top':'20px'}">
            <el-row>
              <el-col v-if="!$isMobile" :span="!$isMobile ?3: 0" class="exam-info">
                <el-card class="box-card" shadow="hover">
                  <div class="clearfix count-question">
                    <el-col>
                      <span>
                        {{$t('paper.total')}}:&nbsp;&nbsp;
                        <span
                          style="color:#409EFF"
                        >{{totalQuestions}}</span>
                        &nbsp;&nbsp;{{$t('paper.total_label')}}
                      </span>
                    </el-col>
                    <el-col>
                      <span>
                        已&ensp;&ensp;选:&nbsp;&nbsp;
                        <span style="color:#409EFF">{{answered}}</span>
                        &nbsp;&nbsp;{{$t('paper.total_label')}}
                      </span>
                    </el-col>
                    <el-col>
                      <span>
                        未&ensp;&ensp;选:&nbsp;&nbsp;
                        <span
                          style="color:#409EFF"
                        >{{totalQuestions-answered}}</span>
                        &nbsp;&nbsp;{{$t('paper.total_label')}}
                      </span>
                    </el-col>
                  </div>
                </el-card>

                <el-card class="box-card cardSecond" shadow="hover">
                  <div slot="header" class="clearfix">题目信息</div>
                  <div>
                    <em
                      v-for="(em_item,index) in questionsList"
                      :key="em_item.id"
                      :class="emClass(em_item.question_type, index)"
                      @click="handleGotoQuestion('T01-'+index)"
                      style="margin-right: 10px;font-size:13px;cursor: pointer;"
                    >
                      {{index+1}}
                      <i :class="['el-icon-caret-top','book-hidden']" />
                    </em>
                  </div>
                </el-card>
                <!-- <span class="schoolTitle">选择学校信息</span>
                <div class="school-select">
                  <el-select v-model="selectedSchool" placeholder="请选择您的学校" filterable clearable>
                    <el-option
                      v-for="item in schoolOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div> -->
              </el-col>

              <el-col
                :span="!$isMobile ? 21:24"
                class="question_center_body"
                :style="$isMobile?{'margin-left':'0px','margin-top':'-10px'}:'  '"
              >
                <!-- 右侧试题部分 -->
                <div :class="{question_body: !$isMobile}">
                  <el-card class="box-card" ref="refQuestionItems">
                    <div
                      v-for="(item_question,index) in questionsList"
                      :key="item_question.id"
                      :id="'T01-'+index"
                    >
                      <div>
                        <div class="question_index">{{index+1}}.</div>
                        <div class="question_stem" v-html="item_question.question_stem"></div>
                      </div>
                      <div class="question_choice">
                        <!-- 单选题 -->
                        <div v-if="item_question.question_type=='T01'">
                          <div v-for="(item_t01_radio,i) in item_question.question_choice" :key="i">
                            <el-radio
                              v-model="exam_answer[index]"
                              :label="item_t01_radio"
                              class="t01-radio"
                            >
                              <!-- model值的含义：大类型的id+试题Id+选项id -->
                              <span>{{item_t01_radio.value}}</span>
                            </el-radio>
                            <br />
                          </div>
                        </div>
                        <!-- 多选题 -->
                        <div v-if="item_question.question_type=='T02'">
                          <el-checkbox-group v-model="exam_answer[index]">
                            <div
                              v-for="(item_t02_check, i) in item_question.question_choice"
                              :key="i"
                            >
                              <el-checkbox :label="item_t02_check">
                                <span>{{item_t02_check.value}}</span>
                              </el-checkbox>
                            </div>
                          </el-checkbox-group>
                        </div>
                        <div v-if="item_question.question_type=='T05'">
                          <el-input
                            v-model="exam_answer[index]"
                            type="textarea"
                            :rows="2"
                            style="margin: 5px 0; width: 500px"
                          />
                        </div>
                      </div>
                      <br style="clear:both;" />
                      <el-divider></el-divider>
                    </div>
                    <el-row v-if="$isMobile">
                      <span class="schoolTitle">选择学校信息: &nbsp;</span>

                      <el-select
                        v-model="selectedSchool"
                        placeholder="请选择您的学校"
                      >
                        <el-option
                          v-for="item in schoolOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                      <el-divider></el-divider>
                    </el-row>
                    
                    <el-row class="bottom-btn" style="margin-top: 20px">
                      <el-button
                        class="center-submit"
                        @click="handleSubmit"
                        type="success"
                        v-loading="loadingbtn"
                        :disabled="disableBtn"
                      >提交问卷</el-button>
                    </el-row>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script> 
import Sticky from '@/components/Sticky'
import Hamburger from '@/components/Hamburger'
import { mapGetters } from "vuex";
import { readUserPaperList, submitUserPaper } from '@/api/municipalEvent/paper'
import { removeTopNavMenuIndex } from '@/utils/auth'

export default {
  components: {
    Sticky,
    Hamburger
  },
  computed: {
    ...mapGetters([
      "userInfo",
    ]),
    totalQuestions() {
      return this.questionsList.length
    }
  },
  watch: {
    exam_answer: {
      handler(val) {
        let answernum = 0
        val.forEach(item => {
          if (typeof item !== 'undefined' && !(item instanceof Array)) {
            answernum++
          } else if (typeof item == 'object' && item.length > 0) {
            answernum++
          }
        })
        this.answered = answernum
      },
      deep: true
    }
  },
  data() {
    return {
      coursePersonId: 0,
      loading: true, //是否显示loading
      type_questions: [],
      questionsList: [], //新增的试题类型数组
      loadingbtn: false,
      exam_answer: [], //考生答案
      has_answer: [], //已答题的试题id
      hideAll: false,
      arryAnswer: ['T02'],
      stringAnswer: ['T01', 'T03', 'T05', 'O01', 'O03'],
      arryObject: ['T04', 'O02'],
      answered: 0,
      schoolOptions: [],
      selectedSchool: '',
      disableBtn: false,
      drawer: false
    }
  },
  created: function () {
    this.init()
  },
  methods: {
    init() {
      if (sessionStorage.getItem('thePaperId') === 'null') {
        this.hideAll = true
        return this.$message.error('没有问卷信息！')
      }
      Promise.all([
        readUserPaperList(sessionStorage.getItem('thePaperId') - 0)
      ])
        .then(response => {
          let paperData = response[0].data
          if (paperData.publish_status === 2) {
            this.logout()
            return this.$message.error('问卷已结束！')
          }
          if (paperData.publish_status === 0) {
            this.hideAll = true
            return this.$message.error('暂无问卷信息！')
          }

          this.schoolOptions = paperData.questionnaire_objects
          this.questionsList = paperData.paper_question
          this.create_exam_answer()
          this.loading = false
        }).catch(response => {
        })
    },
    handleReturn() {
      this.$router.go(-1)
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('permission/reSetAllPermission')//清空store
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      removeTopNavMenuIndex()
      this.$router.push('/login')
    },
    //第一次进入页面，形成试题答案格式
    create_exam_answer() {
      this.exam_answer.length = this.questionsList.length
      this.questionsList.forEach((item, index) => {
        if (item.question_type === 'T02') {
          this.$set(this.exam_answer, index, [])
        }
      })
    },
    handleGotoQuestion(val) {
      document.getElementById(`${val}`).scrollIntoView(true) //滚动到指定的id位置
      if (!this.$isMobile) {
        window.scrollTo(0, document.documentElement.scrollTop - 110) //滚动距离顶部减少110
      }
      else {
        document.body.scrollTop = document.body.scrollTop - 110
        this.drawer = false
      }
    },
    //左侧答题试题选项的颜色变化
    emClass(questionType, questionId) {
      let return_class = 'icon'
      //1.判断是否在答案中，如有，则返回为已答题的样式 
      let answer = this.exam_answer[questionId]
      switch (questionType) {
        case 'T01':
          if (typeof answer !== 'undefined') {
            return_class = 'icon-active'
          }
          break
        case 'T02':
          if (answer.length > 0) {
            return_class = 'icon-active'
          }
          break
        case 'T05':
          if (typeof answer !== 'undefined') {
            return_class = 'icon-active'
          }
      }
      //如是已答题，则添加到已答题数组中
      //如未答题，则从已答题数组中删除
      return return_class
    },
    handleSubmit() {
      if (this.answered !== this.questionsList.length) {
        return this.$message.error(this.$t('exam.has_one_answer'))
      }
      // if (this.selectedSchool === '') {
      //   return this.$message.error(this.$t('请选择学校'))
      // }
      this.loadingbtn = true
      submitUserPaper(this.fixSubmitPaperData(this.exam_answer)).then(response => {
        this.$message.success('问卷填写成功！')
        this.loadingbtn = false
        this.disableBtn = true
      }).catch(() => {
        this.loadingbtn = false
      })
    },
    fixSubmitPaperData(answer) {
      // 用户id
      const postObj = {}
      // postObj.evaluate_object = this.selectedSchool
      postObj.paper_source = sessionStorage.getItem('thePaperId') - 0
      const defaultPaper = JSON.parse(JSON.stringify(this.questionsList))
      const answerout = []
      defaultPaper.forEach((item, index) => {
        let i = {
          id: item.id,
          max_score: item.max_score,
          question_answer: {
            answer: []
          }
        }
        if(item.question_type === "T05"){
          i.question_answer.answer =  [
            {
              id: 0,
              index: '',
              score: item.max_score,
              value: answer[index]
            }
          ]
        }else{
          if (answer[index] instanceof Object && !(answer[index] instanceof Array)) {
            i.question_answer.answer.push(answer[index])
          }
          if (answer[index] instanceof Array) {
            i.question_answer.answer.push(...answer[index])
          }
        }
        
        i.question_answer = i.question_answer
        answerout.push(i)
      })
      postObj.answer = answerout
      return postObj
    },
    toggleSideBar() {
      this.drawer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.exam-info {
  overflow: auto;
  height: calc(100% - 90px);
  top: 80px;
  display: inline-block;
  position: fixed;
}

.exam-info-right {
  overflow: auto;
  height: calc(100% - 90px);
  top: 80px;
  display: inline-block;
  position: fixed;
  .el-card {
    margin-bottom: 10px;
  }
}

.exam-info >>> .el-card__header {
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
}

.exam-info >>> .el-card {
  margin-bottom: 10px;
}

.exam-question {
  margin-left: 250px;
  margin-top: 80px;
  margin-right: 270px;
  height: 1000px;
  border: 1px solid #ebebeb;
}

.question_tips_body {
  padding-bottom: 20px;
}

.question_center_body {
  margin-left: 12.5%;
  margin-top: 40px;
}

.question_body {
  margin-left: 20px;
  margin-right: 0;
  .el-card {
    margin-bottom: 10px;
  }
}

.question_index {
  float: left;
  color: #1a8cfe;
}

.question_stem {
  padding-left: 20px;
}

.question_book {
  float: right;
}

.question_choice {
  float: left;
}

.question_tips {
  height: 15px;
  line-height: 15px;
  display: flex;
  font-size: 13px;
  margin-bottom: 5px;
  .icon {
    width: 15px !important;
    height: 15px !important;
  }
  .icon-active {
    width: 15px !important;
    height: 15px !important;
  }
  .el-icon-caret-top {
    color: #e6a23c;
    font-size: 25px;
    margin-left: -5px;
    margin-top: -5px;
    margin-right: -2px;
  }
}

.showcollapse {
  .el-collapse-item__header {
    font-size: 17px !important;
  }
}

// 使用深度作用选择器，重写el-radio样式
.t01-radio >>> .el-radio__input {
  float: left;
}

.check-choices >>> .el-checkbox__input {
  margin-top: -35px;
}

.box-card >>> .el-card__body {
  padding-bottom: 0px;
  font-size: 14px;
  line-height: 30px;
}

.blanks {
  width: 700px;
  float: left;
  padding-right: 10px;
}

.book-show {
  color: #e6a23c;
  font-size: 18px;
}

.book-hidden {
  color: transparent;
  font-size: 18px;
}
.bottom-btn {
  text-align: center;
  margin-bottom: 20px;
}
.exam-info-right-bottom {
  text-align: center;
  font-size: 14px;
  padding-top: 10px;
}

.exam-info-right-count-down {
  text-align: center;
  color: red;
  font-size: 30px;
  font-weight: 800;
}
.center-submit {
  width: 30%;
}
.exam-info-right-end-date {
  text-align: center;
  font-weight: 800;
  font-size: 16px;
}
.count-question {
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
}
.schoolTitle {
  font-weight: 700;
}
.school-select {
  margin-top: 10px;
}
.cardSecond {
  margin-bottom: 20px;
}
</style>
