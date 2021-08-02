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
  <div class="app-container" v-loading="loading">
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
          {{ year }}年度太仓市中小学、幼儿园校本培训项目评价
        </h2>
        <h4 style="text-align: center">{{ school }}</h4>
        <et-plan-detail :planId="editId" :isShowBack="false" />
        <!-- <el-card shadow="never"
          style="margin: 0 20px 20px"
          v-if="trainplanData.plan_type.code !== 'CGPX'"
        >
          <div slot="header" class="clearfix">
            <span>专家评审结果</span>
          </div>
          <et-evaluation-table
            :list="list"
            :listColumns="listColumns"
            :isSpanMethod="true"
            spanColumnsKey="indicatorA"
          />
          <el-form label-width="160px" label-suffix=":">
            <el-row>
              <el-col :span="24">
                <el-form-item label="建议审定项目经费">
                  <span>
                    {{ trainplanData.funds_expert ? trainplanData.funds_expert.funds : 0 }}(万元)
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="审核意见">
                  <pre class="word-break">{{
                    trainplanData.funds_expert
                      ? trainplanData.funds_expert.approve_comment
                      : "无"
                  }}</pre>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card> -->

        <!-- <el-card shadow="never" style="margin: 0 20px 20px">
          <div slot="header" class="clearfix">
            <span>教育局审核</span>
          </div>
          <el-form
            ref="dataForm"
            label-width="160px"
            label-suffix=":"
            :rules="
              trainplanData.plan_type.code === 'CGPX' ? rules : rulesWithFunds
            "
            :model="educationSubmitData"
          >
            <el-row v-if="trainplanData.plan_type.code !== 'CGPX'">
              <el-col :span="8">
                <el-form-item
                  prop="funds"
                  :label="$t('educationBureauEvaluation.education_funds')"
                >
                  <el-input
                    v-model="educationSubmitData.funds"
                    size="small"
                    type="number"
                    style="width: 80px; margin: 0 10px"
                  />(万元)
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  prop="status"
                  :label="
                    $t('educationBureauEvaluation.funds_education_result')
                  "
                >
                  <el-radio-group v-model="educationSubmitData.status">
                    <el-radio :label="2">审核通过</el-radio>
                    <el-radio :label="3">审核不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  prop="approve_comment"
                  :label="
                    $t(
                      'educationBureauEvaluation.funds_education_approve_comment'
                    )
                  "
                >
                  <el-input
                    type="textarea"
                    v-model="educationSubmitData.approve_comment"
                    rows="10"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import {
  getPlanScorePoints,
  educationSubmitCheck,
  expertSubmitCheck,
  readAnnualTrainplanInfo,
} from "@/api/schoolBasedManage/educationBureauEvaluation";
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
      listColumnsCGPX: [
        "score_point__desc",
        "score_point__max_score",
        "evaluate_score",
        "evaluate_reason",
      ],
      listColumns: [
        "indicatorA",
        "indicatorB",
        "score_point__desc",
        "score_point__max_score",
        "evaluate_score",
        "evaluate_reason",
      ],
      list: [],
      school: "",
      year: "",
      recursionCount: 0,
      funds: null,
      trainplanData: { plan_type: { code: "" } },
      educationSubmitData: {
        education_funds: "",
        funds_education_status: "",
        funds_education_approve_comment: "",
      },
      rules: {
        approve_comment: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
      },
      rulesWithFunds: {
        funds: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        approve_comment: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        status: [
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
    let { id, school, year } = this.$route.query;
    this.editId = id;
    this.school = school;
    this.year = year;
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      getPlanScorePoints(this.editId)
        .then((res) => {
          this.getIndicatorList(res.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      readAnnualTrainplanInfo(this.editId).then((res) => {
        this.trainplanData = res.data;
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
      this.list = recursionIndicatorList;
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleUpload() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          educationSubmitCheck({
            plan: this.editId,
            ...this.educationSubmitData,
          }).then((res) => {
            this.$router.go(-1);
          });
        }
      });
    },
  },
};
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
