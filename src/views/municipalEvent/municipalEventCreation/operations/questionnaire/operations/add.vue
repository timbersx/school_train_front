<!--/*
 * @Name: Questionnaire add
 * @Module:  src/views/municipalEvent/operations/add
 * @Desc: Questionnaire add
 * @Author:  shenyj
 * @Date:  2021-06-21 14:37:00
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class="app-container" v-loading="loading">

    <sticky :z-index="10" class-name="sub-navbar" class="stickySpace">
      <el-button
        :loading="loading"
        class="stickyBtnSpace"
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
      <el-aside class="asideSpace">
        <sticky :z-index="10" :stickyTop="60" class-name="paper-left">
          <el-card class="box-card box-card-space">
            <span>
              {{ $t("questionnaire.total") }}:&nbsp;&nbsp;
              <span class="totalLengthColor">{{ questionsList.length }}</span>
              &nbsp;&nbsp;{{ $t("questionnaire.total_label") }}
            </span>
            <br />
            <br />
            <span>
              {{ $t("questionnaire.total_score") }}:&nbsp;&nbsp;
              <span class="totalLengthColor">{{ totalScore }}</span>
              &nbsp;&nbsp;{{ $t("questionnaire.total_score_label") }}
            </span>
          </el-card>
        </sticky>
      </el-aside>
      <el-main style="padding-right: 0">
        <!-- 右侧试题部分 -->

        <el-card class="box-card mainSpace" ref="refQuestionItems">
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
            :key="index"
            :id="item.id"
            :style="{ 'margin-top': index === 0 ? '-20px' : '' }"
          >
            <div class="chooseTitle">
              <span class="questionStemSpace">
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
                    class="el-icon-delete cursorPointer"
                    @click="handelDeleteQuestion(item, index)"
                  ></i>
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  :content="$t('questionnaire.up')"
                  placement="right"
                >
                  <i
                    class="el-icon-upload2 cursorPointer"
                    @click="handelUpQuestion(item, index)"
                  ></i>
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  :content="$t('questionnaire.down')"
                  placement="right"
                >
                  <i
                    class="el-icon-download cursorPointer"
                    @click="handelDownQuestion(item, index)"
                  ></i>
                </el-tooltip>
              </div>
            </div>
            <div class="chooseSelectWarpSpace">
              <p
                class="chooseSelect"
                v-for="questionItem in item.question_choice"
                :key="questionItem.id"
                :id="questionItem.id"
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
    <add-question-dialog :visible.sync="addQuestionDialogVisible" @addQuestions="getAddQuestions"/>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import { getSysconst } from "@/api/utils";
import { moveUpItem, moveDownRecord } from "@/utils/lib";
import { getTrainEventInfoList } from '@/api/municipalEvent/municipalEventCreation';
import {  paperQuestionUpdate } from "@/api/municipalEvent/questionnaire";
import AddQuestionDialog from './addQuestion';
export default {
  components: {
    Sticky,
    AddQuestionDialog
  },
  computed: {
    totalScore() {
      let questionsItem = this.questionsList.map((item) => {
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
    }, //总分
  },
  data() {
    return {
      loading: true, //是否显示loading
      baseinfo: {}, //从index页面传递过来的数据
      questionsList: [],
      project: "",
      questionTypeList: [],
      addQuestionDialogVisible: false
    };
  },
  created() {
    Promise.all([
      getTrainEventInfoList({ limit: 100000000, offset: 0 }),
      getSysconst("Question_Type"),
    ]).then((response) => {
      let baseinfo = JSON.parse(JSON.stringify(this.$route.query));
      this.baseinfo = baseinfo;
      this.questionTypeList = response[1].data;
      let projectInfoList = response[0].data;
      this.project = projectInfoList.filter(
        (item) => item.id === parseInt(baseinfo.project)
      )[0].name;

      this.init();
    });
  },
  methods: {
    init() {
      this.loading = false;
    },
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
          }).then((res) => this.$router.go(-1));
      } else {
        this.$message.error("没有选择题目，无法保存!");
      }
    },
    handelReturn() {
      this.$router.go(-1);
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
    getRowKeys(row){
      return row.id
    },
    handelAddQuestion(){
      this.addQuestionDialogVisible = true;
    },
    getAddQuestions(val){
      this.questionsList.push(val)
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
  span {
    margin-left: 20px;
  }
  .chooseTools {
    float: right;
    i {
      margin: 0 5px;
    }
  }
}
.chooseSelect {
  // span {
  //   margin-left: 20px;
  // }
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
.pullLeft {
  float: left;
}
.searchWidth {
  width: 300px;
}
.stickySpace {
  margin-bottom: 20px;
}
.stickyBtnSpace {
  margin-left: 10px;
}
.asideSpace {
  height: 100%;
  margin-top: 20px;
}
.box-card-space {
  margin-bottom: 10px;
  font-weight: bold;
}
.totalLengthColor {
  color: #409eff;
}
.mainSpace {
  margin-bottom: 10px;
}
.questionStemSpace {
  width: 70%;
  display: inline-block;
}
.cursorPointer {
  cursor: pointer;
}
.chooseSelectWarpSpace {
  margin: 20px 0;
}
</style>