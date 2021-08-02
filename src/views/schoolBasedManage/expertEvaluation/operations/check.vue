<!--/*
 * @Name: expertEvaluation check
 * @Module:  src/views/expertEvaluation/operations/check
 * @Desc: expertEvaluation check
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class="app-container" v-loading="loading">
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleUploadCheck" v-if="identity">{{
        this.$t("button.uploadCheck")
      }}</el-button>
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <el-container class="form-container">
      <el-main>
        <h2 style="text-align: center">
          {{ year }}年度太仓市中小学、幼儿园校本培训项目评价
        </h2>
        <h4 style="text-align: center">{{ school }}</h4>
        <et-plan-detail :planId="editId" :isShowBack="false" />
        <el-card shadow="never" style="margin: 0 20px 20px">
          <div slot="header" class="clearfix">
            <span>专家审核</span>
          </div>
          <et-evaluation-table
            :list="list"
            :listColumns="listColumns"
            :isSpanMethod="true"
            spanColumnsKey="indicatorA"
          >
            <template v-slot:scoreColumn>
              <el-table-column :label="$t('expertEvaluation.evaluate_score')">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.evaluate_score"
                    type="number"
                    @blur="expertEvaluateScoreBlur(scope.row)"
                    @input="changeSelfEvaluate(scope.row)"
                    style="width: 100px"
                    min="0"
                    max="102400"
                  />
                </template>
              </el-table-column>
              <el-table-column :label="$t('expertEvaluation.evaluate_reason')">
                <template slot-scope="scope">
                  <el-input
                    type="textarea"
                    v-model="scope.row.evaluate_reason"
                    @blur="expertEvaluateReasonBlur(scope.row)"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
            </template>
            <template v-slot:expertColumn v-if="identity">
              <el-table-column :label="$t('expertEvaluation.evaluateExpert')">
                <template slot-scope="scope">
                  <span>{{ scope.row.evaluate_user__nick_name }}</span>
                </template>
              </el-table-column>
            </template>
          </et-evaluation-table>
          <el-form label-width="160px" v-if="identity" ref="identityData" label-suffix=":" :model="identityData" :rules="approveCommentRules">
            <el-row>
              <el-col :span="24">
                <el-form-item label="建议审定项目经费" prop="funds">
                  <el-input
                    v-model="identityData.funds"
                    size="small"
                    type="number"
                    style="width: 80px;"
                  /> (万元)
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="审核意见" prop="approve_comment">
                  <el-input
                    v-model="identityData.approve_comment"
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!-- <div style="margin-top: 20px; font-size: 14px" v-if="identity">
            <span style="color: red; margin-right: 5px">*</span><span style="font-weight: bold">建议审定项目经费:</span><el-input
              v-model="funds"
              size="small"
              type="number"
              style="width: 80px; margin: 0 10px"
            /><span style="font-weight: bold">(万元)</span>
          </div> -->
          <!-- <el-row v-if="identity">
            <el-form
              v-loading="loading"
              label-width=""
              label-suffix=":"
              :rules="identity ? approveCommentRules : ''"
              v-model="approve_comment"
            >
              <el-form-item
                :label="$t('expertEvaluation.approve_comment')"
                prop="approve_comment"
              >
                <el-input
                  v-model="approve_comment"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-form>
          </el-row> -->
          <!-- <div style="margin-top: 20px;" v-if="identity">
            <span style="margin-right: 10px; position: relative; top: -76px"><span style="color: red">*</span>审核意见</span>
          </div> -->
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import {
  getPlanScorePoints,
  expertScoreReason,
  expertCheck,
  expertSubmitCheck,
  getUserExpertIdentity,
} from "@/api/schoolBasedManage/expertEvaluation";
import EtEvaluationTable from "@/components/EtEvaluationTable";
import EtPlanDetail from "@/components/EtPlanDetail";
export default {
  components: {
    Sticky,
    EtEvaluationTable,
    EtPlanDetail,
  },
  data() {
    return {
      editId: 0,
      loading: true,
      formData: {},
      listLoading: false,
      approve_comment: "",
      identityData: {
        funds: '',
        approve_comment: '',
      },
      listColumns: [
        "indicatorA",
        "indicatorB",
        "score_point__desc",
        "score_point__max_score",
      ],
      approveCommentRules: {
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
      },
      list: [],
      school: "",
      year: "",
      recursionCount: 0,
      funds: null,
      identity: 0,
    };
  },
  created() {
    let { id, school, year } = this.$route.query;
    this.editId = id;
    this.school = school;
    this.year = year;
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      getUserExpertIdentity().then((res) => {
        this.identity = res.data.identity;
      });
      getPlanScorePoints(this.editId)
        .then((res) => {
          this.getIndicatorList(res.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getIndicatorList(data) {
      let indicatorList = {};
      let recursionIndicatorList = [];
      data.map((item) => {
        indicatorList = item;
        indicatorList["indicatorA"] = item.indicator_name_list[0];
        indicatorList["indicatorB"] = item.indicator_name_list[1];
        recursionIndicatorList.push(indicatorList);
      });
      console.log(recursionIndicatorList);
      recursionIndicatorList.map(item => {
        if(item.evaluate_reason){
          this.identityData.approve_comment += item.indicatorB + ': ' + item.evaluate_reason + '\n'
        }
      })
      this.list = recursionIndicatorList;
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleUploadCheck() {
      let isFillEvaluateScore = [];
      let isFillReason = [];
      this.list.map((item) => {
        isFillEvaluateScore.push(item.evaluate_score ? 1 : 0);
      });

      if (isFillEvaluateScore.includes(0)) {
        this.$message.error(this.$t("message.checkFiled"));
      } else {
        this.list.map((item) => {
          if (item.evaluate_score < item.score_point__max_score) {
            isFillReason.push(item.evaluate_reason ? 1 : 0);
          }
        });
        if (isFillReason.includes(0)) {
          this.$message.error(this.$t("message.checkReasonFiled"));
        } else {
            this.$refs["identityData"].validate(valid => {
              if (valid) {
                expertSubmitCheck(this.editId, this.identityData).then((res) => {
                  this.$router.go(-1);
                });
              }
            })
          // } else {
          //   this.$message.error(this.$t("message.checkFundsFiled"));
          // }
        }
      }
    },
    changeSelfEvaluate(value) {
      if (value.evaluate_score - 0 > value.score_point__max_score) {
        value.evaluate_score = parseFloat(value.score_point__max_score);
      }
      if (value.evaluate_score - 0 < 0) {
        value.evaluate_score = 0;
      }
      if (value.evaluate_score - 0 === 0) {
        value.evaluate_score = 0;
      }
    },
    expertEvaluateScoreBlur(row) {
      expertScoreReason(row.id, {
        evaluate_score: row.evaluate_score,
        evaluate_reason: row.evaluate_reason,
      }).then(() => {
        this.$message.success(this.$t("message.checkSuccess"));
      });
    },
    expertEvaluateReasonBlur(row) {
      if (row.evaluate_score || row.evaluate_score >= 0) {
        expertScoreReason(row.id, {
          evaluate_score: row.evaluate_score,
          evaluate_reason: row.evaluate_reason,
        }).then(() => {
          this.$message.success(this.$t("message.checkSuccess"));
        });
      } else {
        this.$message.error(this.$t("message.checkFiled"));
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
