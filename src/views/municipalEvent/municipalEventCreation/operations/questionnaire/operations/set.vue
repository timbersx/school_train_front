<!--/*
 * @Name: Questionnaire set
 * @Module:  src/views/municipalEvent/operations/set
 * @Desc: Questionnaire set
 * @Author:  shenyj
 * @Date:  2021-06-21 14:37:00
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
        @click="handelSubmitForm"
        >{{ this.$t("button.save") }}</el-button
      >
      <el-button type="primary" @click="handelReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12"
          >{{ $t("questionnaire.project") }}：{{ project }}</el-col
        >
        <el-col :span="12"
          >{{ $t("questionnaire.name") }}：{{ baseinfo.name }}</el-col
        >
      </el-row>
    </el-card>
    <el-container>
      <!-- 左侧试题类型部分 -->
      <el-aside style="height: 100%; margin-top: 20px">
        <sticky :z-index="10" :sticky-top="60" class-name="paper-left">
          <el-card
            class="box-card"
            style="margin-bottom: 10px; font-weight: bold"
          >
            <div>
              {{ $t("questionnaire.total") }}:&nbsp;&nbsp;
              <span style="color: #409eff">{{ questionsList.length }}</span>
              &nbsp;&nbsp;{{ $t("questionnaire.total_label") }}
            </div>
            <div style="margin-top: 10px">
              {{ $t("questionnaire.total_score") }}:&nbsp;&nbsp;
              <span style="color: #409eff">{{ totalScore }}</span>
              &nbsp;&nbsp;{{ $t("questionnaire.total_score_label") }}
            </div>

          </el-card>
        </sticky>
      </el-aside>
      <el-main style="padding-right: 0">
        <!-- 右侧试题部分 -->
        <el-card
          ref="refQuestionItems"
          class="box-card"
          style="margin-bottom: 10px"
        >
          <div slot="header" class="clearfix">
            <el-col :span="24">
              <el-button type="primary" @click="handelAddQuestion">{{
                $t("questionnaire.addQuestions")
              }}</el-button>
              <el-button
                v-if="questionsList.length > 0"
                type="primary"
                icon="el-icon-delete"
                @click="handelDeleteAllQuestion"
                >{{ $t("questionnaire.deleteAll") }}</el-button
              >
            </el-col>
          </div>
          <div
            v-for="(item, index) in questionsList"
            :id="item.id"
            :key="index"
            :style="{ 'margin-top': index === 0 ? '-20px' : '' }"
          >
            <div class="chooseTitle">
              <span style="width: 70%; display: inline-block">
                {{ item.question_stem }}
                <span>{{
                  `(${item.max_score + $t("questionnaire.total_score_label")})`
                }}</span>
              </span>
              <div class="chooseTools">

                <el-tooltip
                  effect="dark"
                  :content="$t('questionnaire.delete')"
                  placement="right"
                >
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="handelDeleteQuestion(item, index)"
                  />
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  :content="$t('questionnaire.up')"
                  placement="right"
                >
                  <i
                    class="el-icon-upload2"
                    style="cursor: pointer"
                    @click="handelUpQuestion(item, index)"
                  />
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  :content="$t('questionnaire.down')"
                  placement="right"
                >
                  <i
                    class="el-icon-download"
                    style="cursor: pointer"
                    @click="handelDownQuestion(item, index)"
                  />
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  :content="$t('questionnaire.edit')"
                  placement="right"
                >
                  <i
                    class="el-icon-edit"
                    style="cursor: pointer"
                    @click="handelEditQuestion(item, index)"
                  />
                </el-tooltip>
              </div>
            </div>
            <div style="margin: 20px 0">
              <p
                v-for="questionItem in item.question_choice"
                :id="questionItem.id"
                :key="questionItem.id"
                class="chooseSelect"
              >
                <span class="chooseIndex">{{ questionItem.index }}</span>
                {{ questionItem.value }}
                <span>{{
                  `(${
                    questionItem.score + $t("questionnaire.total_score_label")
                  })`
                }}</span>
              </p>
            </div>
            <div
              :style="{
                display: index == questionsList.length - 1 ? 'none' : '',
              }"
            >
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
     <add-question-dialog :visible.sync="addQuestionDialogVisible" :editData="editQusetionData" @addQuestions="getAddQuestions" @editQuestions="editQuestions"/>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import { getSysconst } from "@/api/utils";
import { moveUpItem, moveDownRecord } from "@/utils/lib";
import {  paperQuestionUpdate } from "@/api/municipalEvent/questionnaire";
import AddQuestionDialog from './addQuestion';
export default {
  components: {
    Sticky,
    AddQuestionDialog
  },
  data() {
    return {
      loading: true, // 是否显示loading
      baseinfo: {}, // 从index页面传递过来的数据
      questionsList: [],
      project: "",
      questionTypeList: [],
      questionList: [],
      addQuestionDialogVisible: false,
      editQusetionData: {},
      editIndex: -1
    };
  },
  computed: {
    totalScore() {
      const questionsItem = this.questionsList.map((item) => {
        return item;
      });
      if (questionsItem.length <= 0) {
        return 0;
      } else {
        let totalScore = 0;
        questionsItem.forEach((item) => {
          totalScore += parseInt(item.max_score * 100) / 100;
        });
        return totalScore;
      }
    }, // 总分
  },
  created() {
    Promise.all([
      getSysconst("Question_Type"),
    ]).then((response) => {
      let baseinfo = JSON.parse(sessionStorage.getItem('param'))
      this.baseinfo = baseinfo;
      this.questionTypeList = response[0].data;
      this.project = baseinfo.project.name;
      if (baseinfo.paper_question) {
        this.questionsList = baseinfo.paper_question;
      }
      this.loading = false;
    });
  },
  methods: {
    handelSubmitForm() {
      if (this.questionsList.length > 0) {
        var questionsList = this.questionsList;
        for (let i = 0; i < questionsList.length; i++) {
          questionsList[i]["order_no"] = i + 1;
          questionsList[i]["id"] = i + 1;
        }
        paperQuestionUpdate(this.baseinfo.id, {
          total_score: this.totalScore,
          paper_question: questionsList,
        }).then(() =>{
          sessionStorage.removeItem('param')
          this.$router.go(-1)
        });
      } else {
        this.$message.error("没有选择题目，无法保存!");
      }
    },
    handelReturn() {
      sessionStorage.removeItem('param')
      this.$router.go(-1);
    },
    handelAddQuestion(){
      this.editQusetionData = ""
      this.editIndex = -1
      this.addQuestionDialogVisible = true;
    },
    handelDeleteAllQuestion() {
      this.questionsList = [];
    },
    handelDeleteQuestion(e, index) {
      this.questionsList.splice(index, 1);
      if (index > this.questionsList.length) {
        moveDownRecord(this.questionsList, index);
      }
    },
    handelUpQuestion(e, index) {
      moveUpItem(this.questionsList, index);
    },
    handelDownQuestion(e, index) {
      moveDownRecord(this.questionsList, index);
    },
    handelEditQuestion(e, index) {
      this.editQusetionData = e
      this.editIndex = index
      this.addQuestionDialogVisible = true;
    },
    getRowKeys(row){
      return row.id
    },
    getAddQuestions(val){
      this.questionsList.push(val)
    },
    editQuestions(val){
      if(this.editIndex > -1){
        this.$set(this.questionsList, this.editIndex, val)
      }
    }
  },
};
</script>

<style lang='scss'>
.showcollapse {
  .el-collapse-item__header {
    font-size: 17px !important;
  }
}

.score-input {
  width: 50px;
  .el-input__inner {
    height: 25px;
    line-height: 25px;
  }
}

.projectBatchElDrawer {
  padding: 0 20px;
  overflow: auto;
}
</style>

<style lang="scss" scoped>
.card-icon {
  float: right;
  cursor: pointer;
}
.chooseTitle {
  margin-top: 20px;
  // span {
  //   margin-left: 20px;
  // }
  .chooseTools {
    float: right;
    .el-tree-select {
      display: inline-block;
      margin-right: 10px;
    }
    i {
      margin: 0 5px;
    }
  }
}
.chooseSelect {
  span {
    margin-left: 20px;
  }
  .chooseIndex {
    font-size: 12px;
    margin-left: 0;
    border: 1px solid #bfc1c7;
    border-radius: 100px 100px 100px 100px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    padding: 2px 5px;
    text-align: center;
    margin-right: 5px;
  }
}
.blocktitle {
  margin-top: 20px;
  padding: 20px 0;
}
</style>
