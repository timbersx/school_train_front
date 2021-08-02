<!--/*
 * @Name: Questionnaire viewQuestion
 * @Module:  src/views/municipalEvent/operations/viewQuestion
 * @Desc: Questionnaire viewQuestion
 * @Author:  shenyj
 * @Date:  2021-06-21 14:37:00
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class="app-container" v-loading="loading">
    <el-drawer
      :visible.sync="drawer"
      size="40%"
      :modal-append-to-body="false"
      custom-class="projectBatchElDrawer"
      :show-close="false"
    >
      <div class="filter-container" style="float: left;">
        <el-input
          v-model="searchKey"
          :placeholder="$t('common.searchKey')"
          style="width: 300px;"
          class="filter-item"
          @keyup.enter.native="handelFilter"
          clearable
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          class="filter-item"
          @click="handelFilter"
        >{{ $t('button.search') }}</el-button>

        <el-button
          v-if="questionListTemp.length > 0"
          type="primary"
          class="filter-item"
          @click="handelConfirm"
        >{{ $t('button.confirm') }}</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="questionList"
        border
        fit
        highlight-current-row
        stripe
        @selection-change="handelQuestionChange"
        ref="multipleQuestionTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column
          v-for="(item, index) in listColumns"
          :key="index"
          :prop="item"
          :label="$t(`question.${item}`)"
          :formatter="handelFormatter"
        />
        <el-table-column prop="question_stem" :label="$t('question.question_stem')">
          <template slot-scope="scope">
            <span v-html="scope.row['question_stem']"></span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handelSizeChange"
        @current-change="handelCurrentChange"
        :page-sizes="listParameters.pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listParameters.total"
        class="pagination-container"
      ></el-pagination>
    </el-drawer>

    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px;">
      <el-button type="primary" @click="handelReturn">{{this.$t('button.return')}}</el-button>
    </sticky>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">{{$t('questionnaire.project')}}：{{project}}</el-col>
        <el-col :span="6">{{$t('questionnaire.name')}}：{{baseinfo.name}}</el-col>
      </el-row>
    </el-card>
    <el-container>
      <!-- 左侧试题类型部分 -->
      <el-aside style="height: 100%; margin-top: 20px">
        <sticky :z-index="10" :stickyTop="60" class-name="paper-left">
          <el-card class="box-card" style="margin-bottom:10px;font-weight: bold;">
            <span>
              {{$t('questionnaire.total')}}:&nbsp;&nbsp;
              <span
                style="color:#409EFF"
              >{{ questionsList.length }}</span>
              &nbsp;&nbsp;{{$t('questionnaire.total_label')}}
            </span>
            <br />
            <br />
            <span>
              {{$t('questionnaire.total_score')}}:&nbsp;&nbsp;
              <span
                style="color:#409EFF"
              >{{totalScore}}</span>
              &nbsp;&nbsp;{{$t('questionnaire.total_score_label')}}
            </span>

            <div class="blocktitle">
              <div v-for="(item, index) in indicatorList" :key="index">
                <span>{{item.name}}</span>
                &nbsp;&nbsp;&nbsp;( {{item.number}}{{$t('paper.total_label')}}，{{item.score}}{{$t('paper.total_score_label')}} )
                <br />
                <br />
              </div>
            </div>
          </el-card>
        </sticky>
      </el-aside>
      <el-main style="padding-right: 0">
        <!-- 右侧试题部分 -->

        <el-card class="box-card" style="margin-bottom:10px" ref="refQuestionItems">
          <el-dialog
            :visible="randomChoiceQuestion"
            :title="$t('questionnaire.randomChoiceQuestions')"
            @close="handelRandomChoiceClose"
            :before-close="handelRandomChoiceClose"
          >
            <el-divider></el-divider>
            <div class="form-search">
              <el-form
                ref="dataForm"
                :loading="loading"
                label-width="150px"
                :model="randomData"
                label-suffix=":"
                :rules="rules"
                class="dialog-form-space"
              >
                <el-col :span="24">
                  <el-col :span="14">
                    <el-form-item :label="$t('question.single_choice')" prop="single_choice">
                      <el-input
                        v-model="randomData.single_count"
                        type="number"
                        maxlength="100"
                        class="items"
                        @change="handelQuestionSingleChange"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item :label="$t('questionnaire.availableQuestionCount')">
                      <span>{{randomData.available_single_count - randomData.single_count}}</span>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="14">
                    <el-form-item :label="$t('question.multiple_choice')" prop="multiple_choice">
                      <el-input
                        v-model="randomData.multiple_count"
                        type="number"
                        maxlength="100"
                        class="items"
                        @change="handelQuestionMultipleChange"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item :label="$t('questionnaire.availableQuestionCount')">
                      <span>{{randomData.available_multiple_count - randomData.multiple_count}}</span>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handelRandomChoiceClose">{{ $t('button.cancel') }}</el-button>
              <el-button type="primary" @click="handelRandomChoiceSubmit">{{ $t('button.save') }}</el-button>
            </div>
          </el-dialog>

          <div
            v-for="(item, index) in questionsList"
            :key="item.id"
            :id="item.id"
            :style="{'margin-top': index === 0 ? '-20px' : ''}"
          >
            <div class="chooseTitle">
              <span style="width: 80%; display: inline-block">{{item.question_stem}}
              <span>{{`(${item.max_score + $t('questionnaire.total_score_label')})`}}</span>
              </span>
              <div class="chooseTools">
                <p>{{item.indicator_name}}</p>
              </div>
            </div>
            <div style="margin: 20px 0">
              <p
                class="chooseSelect"
                v-for="questionItem in item.question_choice"
                :key="questionItem.id"
                :id="questionItem.id"
              >
                <span class="chooseIndex">{{questionItem.index}}</span>
                {{questionItem.value}}
                <span>{{`(${questionItem.score + $t('questionnaire.total_score_label')})`}}</span>
              </p>
            </div>
            <div :style="{'display': index == questionsList.length -1 ? 'none' : ''}">
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import { getSysconst } from "@/api/utils";
import { moveUpItem, moveDownRecord } from "@/utils/lib";
import {
  getAvailableQuestion,
  choiceQuestionRandom,
  paperQuestionUpdate,
  readPaper
} from "@/api/municipalEvent/questionnaire";
export default {
  components: {
    Sticky
  },
  computed: {
    totalScore() {
      let questionsItem = this.questionsList.map(item => {
        return item;
      });
      if (questionsItem.length <= 0) {
        return 0;
      } else {
        let totalScore = 0;
        questionsItem.forEach(item => {
          totalScore += parseInt(item.max_score);
        });
        return totalScore;
      }
    }, //总分

  },
  data() {
    return {
      rules: {
        single_choice: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        indicatorList: [],
        multiple_choice: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ]
      },
      randomData: {
        selected_questions: [],
        available_single_count: 0,
        available_multiple_count: 0,
        single_count: 0,
        multiple_count: 0
      },
      randomChoiceQuestion: false,
      collapse_activeName: "1",
      activeName: "first",
      loading: true, //是否显示loading
      baseinfo: {}, //从index页面传递过来的数据
      selectParams: {
        multiple: false,
        clearable: true,
        placeholder: this.$t('common.select')
      },
      treeParams: {
        clickParent: false,
        filterable: false,
        "check-strictly": true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "children",
          label: "title",
          value: "key"
        }
      },
      indicatorList: [],
      questionsList: [],
      drawer: false,
      project: "",
      indicatorTreeData: [],
      questionnaireTypeList: [],
      questionTypeList: [],
      listLoading: false,
      apiQueryData: {},
      searchKey: "",
      listParameters: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      questionList: [],
      questionListTemp: [],
      listColumns: ["code", "question_type"]
    };
  },
  created() {
    Promise.all([
      // getSysconst("Questionnaire_Type"),
      getSysconst("Question_Type")
    ]).then(response => {
      let baseinfo = JSON.parse(sessionStorage.getItem('param'))
      this.baseinfo = baseinfo;
      // let questionnaireTypeList = response[0].data;
      // this.questionnaireTypeList = response[0].data;
      this.questionTypeList = response[0].data;


      this.project = baseinfo.project.name;
      if (baseinfo.paper_question) {

      }
      this.getQuestionListData();
      this.init();
    });
  },
  methods: {
    init() {
      this.loading = false;
    },
    handelSubmitForm() {
      paperQuestionUpdate(this.baseinfo.id, {
        total_score: this.totalScore,
        paper_question: this.questionsList
      }).then(res => {
        sessionStorage.removeItem('param')
        this.$router.go(-1)
      });
    },
    handelReturn() {
      sessionStorage.removeItem('param')
      this.$router.go(-1);
    },
    _searchFun(value) {
      for (let i = 0; i < this.$refs.treeSelect.length; i++) {
        this.$refs.treeSelect[i].$refs.tree.filter(value);
      }
    },
    treeDataUpdateFun(data) {
      this.treeParams.data = data;
    },
    handelChoiceQuestion() {
      this.drawer = true;
      this.$nextTick(() => {
        this.$refs.multipleQuestionTable.clearSelection();
      });
    },

    handelRandomChoiceQuestions() {
      this.randomChoiceQuestion = true;
      this.randomData.selected_questions = this.questionsList.map(
        item => item.id
      );
      getAvailableQuestion(this.baseinfo.id, {
        selected_questions: this.randomData.selected_questions
      }).then(res => {
        this.randomData.available_multiple_count =
          res.data.available_multiple_count;
        this.randomData.available_single_count =
          res.data.available_single_count;
      });
    },
    getQuestionListData() {
      readPaper(this.baseinfo.id).then(res => {
        console.log(res);
        if(res.data.paper_question){
          this.questionsList = res.data.paper_question;
        }
      })
    },
    handelFilter() {
      //搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        search: this.searchKey,
      };
      this.getQuestionListData();
    },
    handelConfirm() {
      this.drawer = false;
      this.questionsList = this.questionListTemp;

    },
    handelSizeChange(val) {
      this.listParameters.limit = val;
      this.apiQueryData.limit = this.listParameters.limit;
      this.getQuestionListData();
    },
    handelCurrentChange(val) {
      this.listParameters.page = val;
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1);
      this.getQuestionListData();
    },
    handelFormatter(row, column) {
      switch (column.property) {
        case "question_type":
          return this.questionTypeList.filter(
            item => item.code === row.question_type
          )[0].name;
        default:
          return row[column.property];
      }
    },
    handelQuestionChange(val) {
      this.questionListTemp = val;
    },
    handelRandomChoiceClose() {
      this.randomChoiceQuestion = false;
    },
    handelRandomChoiceSubmit() {
      choiceQuestionRandom(this.baseinfo.id, this.randomData).then(res => {
        this.questionsList = res.data.single_choice_questions.concat(
          res.data.multiple_choice_questions
        );

        this.randomChoiceQuestion = false;
      });


    },
    handelQuestionSingleChange(e) {
      if (e > this.randomData.available_single_count) {
        this.randomData.single_count = this.randomData.available_single_count;
      } else {
        this.randomData.single_count = e;
      }
    },
    handelQuestionMultipleChange(e) {
      if (e > this.randomData.available_multiple_count) {
        this.randomData.multiple_count = this.randomData.available_multiple_count;
      } else {
        this.randomData.multiple_count = e;
      }
    },
    handelDeleteQuestion(e) {
      let index = this.questionsList.findIndex(item => item.id === e.id);
      this.questionsList.splice(index, 1);
      if (index > this.questionsList.length) {
        moveDownRecord(this.questionsList, index);
      }
    },
    handelUpQuestion(e) {
      let index = this.questionsList.findIndex(item => item.id === e.id);
      moveUpItem(this.questionsList, index);
    },
    handelDownQuestion(e) {
      let index = this.questionsList.findIndex(item => item.id === e.id);
      moveDownRecord(this.questionsList, index);
    }
  }
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