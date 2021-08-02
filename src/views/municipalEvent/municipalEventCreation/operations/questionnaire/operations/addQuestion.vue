<!--/*
 * @Name: Question add
 * @Module:  src/views/question/operations/add
 * @Desc: Question add
 * @Author:  automatic code
 * @Date:  2020-06-28 11:01:00
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <el-dialog
    :visible.sync="visible"
    :title="$t('table.edit')"
    @close="handleClose"
    :before-close="handleClose"
    width="1200px"
  >
    <div
      class="app-container"
      v-loading="loading"
      :element-loading-text="loadingText"
    >
      <!-- 题目必填部分 -->
      <el-form
        ref="dataForm"
        :loading="loading"
        :model="formData"
        label-suffix
        :rules="rules"
      >
        <el-container class="form-container">
          <el-main>
            <!-- <el-col :span="6">
            <el-form-item :label="$t('question.code')" prop="code">
              <el-input
                v-model="formData.code"
                :placeholder="$t('common.select')"
                class="question-items"
              />
            </el-form-item>
          </el-col> -->

            <el-col :span="6">
              <el-form-item
                :label="$t('question.question_type')"
                prop="question_type"
              >
                <el-select
                  v-model="formData.question_type"
                  :placeholder="$t('common.select')"
                  filterable
                  value-key="code"
                  @change="handleChangeType"
                  class="question-items"
                >
                  <el-option
                    v-for="item in questionTypeList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label="$t('question.score')" prop="max_score">
                <el-input
                  v-model.number="formData.max_score"
                  type="number"
                  maxlength="50"
                  class="question-items"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item
                :label="$t('question.question_stem')"
                prop="question_stem"
              >
                <el-input
                  type="textarea"
                  v-model="formData.question_stem"
                  class="question-area-items"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-main>
        </el-container>
      </el-form>
      <!-- 单选题部分 -->
      <el-form
        v-if="showQuestionForm"
        ref="singleChoiceForm"
        :loading="loading"
        :model="formData"
        label-suffix
        label-position="top"
        style="padding-top: 20px"
      >
        <el-container class="form-container">
          <el-main>
            <el-form-item
              :label="
                showQuestionForm == 'T02'
                  ? $t('question.multiple_choice_options')
                  : $t('question.single_choice_options')
              "
              style="margin-bottom: 0px; margin-top: -10px"
            ></el-form-item>
            <el-form-item
              v-for="(item, index) in formData.question_choice"
              :key="index"
            >
              <el-row :gutter="20">
                <el-col
                  :span="1"
                  style="text-align: center; padding: 9px 0"
                  v-if="index === 0"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    circl
                    @click="addSignleChoice(index)"
                  ></el-button>
                </el-col>
                <el-col :span="20" :offset="index > 0 ? 1 : 0">
                  <el-input type="textarea" v-model="item.value"></el-input>
                </el-col>
                <el-col :span="2" style="text-align: center">
                  <el-input
                    type="number"
                    v-model.number="item.score"
                    :placeholder="$t('question.score')"
                    class="scoreInput"
                  ></el-input>
                </el-col>
                <el-col :span="1" v-if="index > 0">
                  <div class="deleteButton">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="dleteSignleChoice(index)"
                    ></el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-main>
        </el-container>
      </el-form>

      <!-- 备注 -->
      <el-form
        v-if="showRemarks"
        :loading="loading"
        label-suffix
        label-position="top"
        style="padding-top: 20px"
      >
        <el-container class="form-container">
          <el-main>
            <el-form-item :label="$t('question.remark')">
              <el-input type="textarea" v-model="formData.remark"></el-input>
            </el-form-item>
          </el-main>
        </el-container>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t("button.cancel") }}</el-button>
      <el-button type="primary" @click="handleSubmitForm(false)">{{
        $t("button.save")
      }}</el-button>
      <el-button type="primary" @click="handleSubmitForm(true)" v-if="!this.editData">{{
        $t("button.saveAndAdd")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Sticky from "@/components/Sticky";
import { getSysconst } from "@/api/utils";
import { getLetterByIndex } from "@/utils/lib";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: [Object, String],
      default: "",
    },
  },
  inject: ["reload"],
  components: {
    Sticky,
  },
  data() {
    return {
      loading: true, //是否显示loading
      showRemarks: false, //是否显示题目解析
      showQuestionForm: "", //要显示的题目答案部分
      questionRemark: "", //备注信息
      loadingText: "", //加载时显示的文字内容
      questionTypeList: [],
      formData: {
        question_choice: [{ value: "", score: "", index: "A", id: 0 }],
      },
      //单选题内容
      singleChoiceQuestion: {
        maxId: 0,
        answer: -1,
        content: [],
      },
      // 多选题内容
      multipleChoiceQuestion: {
        maxId: 0,
        content: [],
      },
      //判断题内容
      yesNoQuestion: {
        answer: "Yes",
      },
      //填空题内容
      blanksQuestion: {
        firstContent: { value: "" },
        content: [],
      },
      //问答题
      askQuestion: {
        answer: "",
      },
      //填空题内容
      blanksQuestion: {
        firstContent: { value: "" },
        content: [],
      },
      //排故题内容
      troubleshootQuestion: {
        firstContent: { value: "" },
        content: [],
      },
      rules: {
        max_score: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        question_type: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        question_stem: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.init();
  },
  watch: {
    visible(status) {
      if (status) {
        console.log(
          this.editData
        );
        if (this.editData) {
          this.formData = this.editData;

          if(this.editData.question_type === "T05"){
            this.showRemarks = false;
            this.showQuestionForm = false
          }else{
            this.showRemarks = true;
            this.showQuestionForm = this.editData.question_type;
          }
        }else{
            this.formData = {
              question_choice: [{ value: "", score: "", index: "A", id: 0 }],
            };
            this.showRemarks = false;
            this.showQuestionForm = false;
        }
      }
    },
  },
  methods: {
    init() {
      Promise.all([getSysconst("Question_Type")]).then((response) => {
        this.questionTypeList = response[0].data;
        this.loading = false;
      });
    },
    OpenSuccess() {
      //保存成功弹出提示
      this.$confirm(
        this.$t("question.submitSuccessDetail"),
        this.$t("question.submitSuccessTitle"),
        {
          confirmButtonText: this.$t("question.confirmButtonText"),
          cancelButtonText: this.$t("question.cancelButtonText"),
          type: "success",
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = this.$t(
                "question.confirmButtonLoading"
              );
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          },
        }
      )
        .then(() => {
          this.reload();
        })
        .catch(() => {
          this.$router.replace({ path: "/exammanage/question" });
        });
    },
    //提交保存，如果isAdd为false，则保存后返回列表页，如isAdd为true，则刷新页面继续添加
    handleSubmitForm(isAdd) {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (isAdd) {
            this.$emit("addQuestions", this.formData);
            this.formData = {
              question_choice: [{ value: "", score: "", index: "A", id: 0 }],
            };
            this.showRemarks = false;
            this.showQuestionForm = false;
          } else {
              if(this.editData){
                this.$emit("editQuestions", this.formData);
              }else{
                this.$emit("addQuestions", this.formData);
              }
            this.$emit("update:visible", false);
          }
          //   createQuestion(this.formData)
          //     .then((res) => {
          //       if (res.message === "success") {
          //         this.$message.success(this.$t("message.saveSuccess"));
          //       }
          //       if (isAdd) {
          //         this.formData = {
          //           question_choice: [
          //             { value: "", score: "", index: "A", id: 0 },
          //           ],
          //         };
          //         this.showRemarks = false;
          //         this.showQuestionForm = false;
          //       } else {
          //         this.$router.go(-1);
          //       }
          //     })
          //     .catch((err) => {
          //       console.error(err);
          //     });
          this.loading = false;
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    handleReturn() {
      this.$router.go(-1);
    },
    //新增单选题选项
    addSignleChoice() {
      this.loading = true;
      this.formData.question_choice.push({
        value: "",
        score: "",
        index: getLetterByIndex(this.formData.question_choice.length),
        id: this.formData.question_choice.length,
      });

      // this.loadingText = this.$t("button.addChoice") + "...";
      // setTimeout(() => {
      //   this.singleChoiceQuestion.maxId++;
      //   this.singleChoiceQuestion.content.push({
      //     id: this.singleChoiceQuestion.maxId,
      //     value: ""
      //   });
      this.loading = false;
      // }, 40);
    },
    //删除单选题选项
    dleteSignleChoice(index) {
      this.formData.question_choice.splice(index, 1);
      // //如果是删除的单选题是选中的答案,将答案默认选中第一个
      // if (val == this.singleChoiceQuestion.answer) {
      //   this.singleChoiceQuestion.answer = 0;
      // }
      // //如果删除的单选题的id与this.singleChoiceQuestion.singleChoiceMaxId相同，this.singleChoiceQuestion.singleChoiceMaxId减1
      // if (val == this.singleChoiceQuestion.maxId) {
      //   this.singleChoiceQuestion.maxId--;
      // }
      // this.singleChoiceQuestion.content.splice(
      //   this.singleChoiceQuestion.content.findIndex(item => item.id == val),
      //   1
      // );
    },
    //多选题
    addMultipleChoice() {
      this.loading = true;
      this.loadingText = this.$t("button.addChoice") + "...";
      setTimeout(() => {
        this.multipleChoiceQuestion.maxId++;
        this.multipleChoiceQuestion.content.push({
          id: this.multipleChoiceQuestion.maxId,
          value: "",
          check: false,
        });
        this.loading = false;
      }, 40);
    },
    dleteMultipleChoice(val) {
      if (val == this.multipleChoiceQuestion.maxId) {
        this.multipleChoiceQuestion.maxId--;
      }
      this.multipleChoiceQuestion.content.splice(
        this.multipleChoiceQuestion.content.findIndex((item) => item.id == val),
        1
      );
    },
    //  填空题
    addBlanks() {
      this.blanksQuestion.content.push({ value: "" });
    },
    dleteBlanks(index) {
      //根据索引删除
      this.blanksQuestion.content.splice(index, 1);
    },
    //  排故题
    addTroubleshoot() {
      this.troubleshootQuestion.content.push({ value: "" });
    },
    dleteTroubleshoot(index) {
      //根据索引删除
      this.troubleshootQuestion.content.splice(index, 1);
    },
    handleChangeType(val) {
      //选中题目题型，显示题目解析
      this.loading = true;
      this.loadingText = this.$t("question.questionLoading");
      if(val === "T05"){
        this.showRemarks = false;
        this.showQuestionForm = false;
        this.$nextTick(() => {
            this.loading = false;
          });
          this.formData.question_choice = []
      }else{
        setTimeout(() => {
          this.showRemarks = true;
          this.showQuestionForm = val;
          this.formData.question_choice = [
            { value: "", score: "", index: "A", id: 0 }
          ];
          this.$nextTick(() => {
            this.loading = false;
          });
        }, 100);
      }
      
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang='scss' scoped>
.ckedtor-inline {
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  outline: "1px solid blue" !important;
}

.ckedtor-width100 {
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  outline: "1px solid blue" !important;
  width: 100% !important;
  margin-right: 5px !important;
  float: left !important;
}

.ckedtor-inline-questions {
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  outline: "1px solid blue" !important;
  width: 93% !important;
  margin-right: 5px !important;
}

.choices {
  float: left;
  margin-top: 20px;
  margin-right: 0px;
}

.check-choices {
  float: left;
  margin-top: 20px;
  margin-right: 10px;
}

.deleteButton {
  float: left;
  margin-top: 10px;
}

.blanks {
  width: 95%;
  float: left;
  padding-right: 10px;
}
.question-items {
  width: 70%;
}
.question-area-items {
  width: 92.5%;
}
.scoreInput {
  width: 80px;
  padding: 9px 0;
}
</style>
