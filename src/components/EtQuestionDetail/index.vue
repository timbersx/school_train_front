<!--/*
 * @Name:
 * @Module:
 * @Desc:
 * @Author: Elliot.Wang
 * @Date: 2019-09-18 16:04:32
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-09-18 16:04:32
 * @Param: {Arry} [questionsList]  - 已选中的项
 * @Param: {Arry} [evaluation_type_Operations]  - 评分方式
 * @Param: {Bool} [showDelete]  - 是否显示删除
 * @Param: {Bool} [showUp]  - 是否显示上移
 * @Param: {Bool} [showDown]  - 是否显示下移
 * @Param: {Bool} [showSetScore]  - 是否显示设置分数
 * @Param: {Bool} [scoreDisabled]  - 设置分数设置是否为Disabled
 * @example:
*/-->

<template>
  <div>
    <!-- {{questionsList}} -->
    <div
      v-for="item in questionsList"
      :key="item.id"
    >
      <div class="question_stem">
        <el-col :span="21">
          <div
            v-html="item.question_stem"
            style="margin-bottom:1em;"
          > </div>
        </el-col>
        <el-col :span="3">
          <div style="margin-top:1em;float:right;">
            <div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('paper.delete')"
                placement="top"
                v-if="showDelete"
              >
                <i
                  class="el-icon-delete"
                  style="cursor: pointer;"
                  @click="handleDelete(item.id)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('paper.up')"
                placement="top"
                v-if="showUp"
              >
                <i
                  class="el-icon-upload2"
                  style="padding-left:10px;cursor: pointer;"
                  @click="handleMoveUp(item.id)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('paper.down')"
                placement="top"
                v-if="showDown"
              >
                <i
                  class="el-icon-download"
                  style="padding-left:10px;cursor: pointer;"
                  @click="handleMoveDown(item.id)"
                ></i>
              </el-tooltip>
            </div>
            <div
              style="font-size:14px;margin-top:1em;"
              v-if="showSetScore"
            >
              <el-input
                class="score-input"
                v-model="item.score"
                @input="handleChangeScore"
                type="number"
                :disabled="scoreDisabled"
              ></el-input>&nbsp;&nbsp;{{$t('paper.total_score_label')}}
            </div>
          </div>
        </el-col>
      </div>
      <br style="clear:both;" />
      <div class="question_content">
        <div v-html="setQuestionChoice(item)"> </div>
      </div>
      <br style="clear:both;" />
      <el-divider></el-divider>
      <br style="clear:both;" />
    </div>
  </div>
</template>

<script>
import { moveUpItem, moveDownRecord } from '@/utils/lib'
import { getSysconst } from '@/api/utils'
export default {
    data() {
        return {
            // evaluation_type_Operations: {},
        }
    },
    props: {
        //已经选中的选项
        questionsList: {
            type: Array,
            default: function() {
                return []
            }
        },
        evaluation_type_Operations: {
            type: Array,
            default: function() {
                return []
            }
        },
        showDelete:{
          type:Boolean,
          default:true
        },
        showUp:{
          type:Boolean,
          default:true
        },
        showDown:{
          type:Boolean,
          default:true
        },
        showSetScore:{
          type:Boolean,
          default:true
        },
        scoreDisabled:{
          type:Boolean,
          default:false
        }
    },
    mounted() {
        // Promise.all([
        //         getSysconst('Evaluate_Type'),
        //     ])
        //     .then(response => {
        //       this.evaluation_type_Operations=response[0].data
        //     })
    },
    methods: {
        //设置试题内容
        setQuestionChoice(question) {
            let html = ''
            let answer = ''
            switch (question.type) {
                case 'T01':
                    this.qustionChoiceTitle = this.$t('question.single_choice_options')
                    html = '<ul style="list-style-type:none;margin:0px;padding:0px;">'
                    question.question_choice.forEach(item => {
                        html += '<li>'

                        if (item.id == question.question_answer.answer[0].id) {
                            html += `<div  style='float:left;padding-right:5px'> <em class='icon-active'>${item.index}</em></div><div style='color:#1A8CFE'>${item.value}</div>`

                            answer = `<div style='margin-top:1em'>${item.index}</div>`
                        } else {

                            html += `<div  style='float:left;padding-right:5px'><em class='icon'>${item.index}</em></div><div>${item.value}</div>`
                        }

                        html += '</li>'
                    })
                    html += '</ul>'
                    break
                case 'T02':
                    this.qustionChoiceTitle = this.$t('question.multiple_choice_options')
                    html = '<ul style="list-style-type:none;margin:0px;padding:0px;">'
                    question.question_choice.forEach(item => {
                        html += '<li>'

                        if (question.question_answer.answer.some(ii => ii.id == item.id)) {
                            html += `<div  style='float:left;padding-right:5px'> <em class='icon-active'>${item.index}</em></div><div style='color:#1A8CFE'>${item.value}</div>`

                            answer += `${item.index}`
                        } else {

                            html += `<div  style='float:left;padding-right:5px'><em class='icon'>${item.index}</em></div><div>${item.value}</div>`
                        }

                        html += '</li>'
                    })
                    answer = `<div style='margin-top:1em'>${answer}</div>`
                    html += '</ul>'
                    break
                case 'T03':
                    this.qustionChoiceTitle = this.$t('question.yes_no_answer')
                    if (question.question_answer.answer == 'Yes') {
                        html += `<span  style='color:#1A8CFE;'><i class="el-icon-circle-check" style='font-size:22px;'></i>&nbsp;&nbsp;<span>${this.$t('question.yes_no_answer_yes')}</span></span>`
                        html += `&nbsp;&nbsp;&nbsp;&nbsp;<span><i class="el-icon-circle-close"></i>&nbsp;&nbsp;${this.$t('question.yes_no_answer_no')}</span>`
                        answer = `<div style='margin-top:1em'>${this.$t('question.yes_no_answer_yes')}</div>`
                    } else {
                        html += `<span><i class="el-icon-circle-check" style='font-size:22px;'></i>&nbsp;&nbsp;<span>${this.$t('question.yes_no_answer_yes')}</span></span>`
                        html += `&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:#1A8CFE;'><i class="el-icon-circle-close" style='font-size:22px;'></i>&nbsp;&nbsp;${this.$t('question.yes_no_answer_no')}</span>`
                        answer = `<div style='margin-top:1em'>${this.$t('question.yes_no_answer_no')}</div>`
                    }
                    break
                case 'T04':
                    this.qustionChoiceTitle = this.$t('question.banks_options')
                    question.question_answer.answer.forEach(item => {
                        answer += `、${item.value}`
                    })
                    answer = `<div style='margin-top:1em'>${answer.substring(1,answer.length)}</div>`
                    break
                case 'T05':
                    this.qustionChoiceTitle = this.$t('question.ask_answer')
                    // html = question.question_answer.answer
                    answer = `<div style='margin-top:1em'>${question.question_answer.answer}</div>`
                    break
                case 'O01':
                    break
                case 'O02':
                    break
                case 'O03':
                    break
            }
            // html +=`<div style='margin-top:1em'> 答案：${answer}</div>`
            let evaluation_type_name=this.evaluation_type_Operations.filter(item => item.code.indexOf(question.evaluation_type) > -1)[0].name
            html += `<div> <span style='float:left;margin-top:1em'>${this.$t('question.evaluation_type')}：</span> <div style='float:left;margin-top:1em'>${evaluation_type_name}</div></div>`
            html += `<br style="clear:both;" />`
            html += `<div> <span style='float:left;margin-top:1em'>${this.$t('question.question_answer')}：</span> <div style='float:left'>${answer}</div></div>`
            html += `<br style="clear:both;" />`
            html += `<div><span style='float:left;margin-top:1em'> ${this.$t('question.question_analysis')}：</span> <div style='float:left'>${question.question_analysis}</div></div>`

            return html
        },
        //删除试题
        handleDelete(item_id) {
            let index = this.questionsList.findIndex(item => item.id == item_id)
            this.questionsList.splice(index, 1)
        },
        //上移
        handleMoveUp(item_id) {
            let index = this.questionsList.findIndex(item => item.id == item_id)
            moveUpItem(this.questionsList, index)
        },
        //下移

        handleMoveDown(item_id) {
            let index = this.questionsList.findIndex(item => item.id == item_id)
            moveDownRecord(this.questionsList, index)
        },
        handleChangeScore(val){
          this.$emit("scoreChange", val)
        }
    }
}
</script>

<style lang="scss">
.score-input {
  width: 50px;
  .el-input__inner {
    height: 25px;
    line-height: 25px;
    padding: 0px !important;
  }
}
</style>

<style lang="scss" scoped>
.question_stem {
  width: 100%;
}

.question_content {
  width: 100%;
}
</style>