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
        />

        <!-- <div style="margin-top: 20px; font-size: 14px" v-if="identity">
          建议审定项目经费 {{trainplanData.funds_expert ? trainplanData.funds_expert.funds : 0}} (万元)
        </div>
        <div style="margin-top: 20px; font-size: 14px" v-if="identity">
          <el-row>
            <span style="float: left; margin-right: 10px">审核意见:</span>
            <pre class="word-break">{{trainplanData.funds_expert ? trainplanData.funds_expert.approve_comment : '无'}}</pre>
          </el-row>
        </div> -->
        <el-form label-width="160px" label-suffix=":" v-if="identity">
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
        </el-card>

        <el-card shadow="never" style="margin: 0 20px 20px">
          <div slot="header" class="clearfix">
            <span>教育局审核结果</span>
          </div>
          <el-form label-width="120px" label-suffix=":">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('expertEvaluation.status')">
                <span>{{getTrainplanStatus(trainplanData.status)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('expertEvaluation.funds_education_result')">
                <span>{{trainplanData.funds_education ? trainplanData.funds_education.funds : ''}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('expertEvaluation.funds_education_approve_comment')">
                <span>{{trainplanData.funds_education ? trainplanData.funds_education.approve_comment : ''}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import { getPlanScorePoints, readAnnualTrainplanInfo, expertCheck, getUserExpertIdentity } from "@/api/schoolBasedManage/expertEvaluation";
import EtEvaluationTable from "@/components/EtEvaluationTable";
import { getSysconst } from '@/api/utils'
import EtPlanDetail from "@/components/EtPlanDetail";
export default {
  components: {
    Sticky,
    EtEvaluationTable,
    EtPlanDetail
  },
  data() {
    return {
      editId: 0,
      loading: true,
      formData: {},
      trainplanData: {funds: "", status: "", funds_education: {funds: "", approve_comment: ""}},
      listLoading: false,
      listColumns: [
        "indicatorA",
        "indicatorB",
        "score_point__desc",
        "score_point__max_score",
        "evaluate_score",
        "evaluate_reason"
      ],
      list: [],
      school: "",
      year: "",
      recursionCount: 0,
      funds: null,
      trainPlanCheckStatusList: [],
      identity: 0
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
      getSysconst('Train_Plan_Check_Status').then(res => {
        this.trainPlanCheckStatusList = res.data;
      })
      getPlanScorePoints(this.editId)
        .then((res) => {
          this.getIndicatorList(res.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
        readAnnualTrainplanInfo(this.editId).then(res => {
          this.trainplanData = res.data;
        })
    },
    getIndicatorList(data) {
      let indicatorList = {};
      let recursionIndicatorList = [];
      data.map((item) => {
        indicatorList = item
        indicatorList["indicatorA"] = item.indicator_name_list[0];
        indicatorList["indicatorB"] = item.indicator_name_list[1];
        recursionIndicatorList.push(indicatorList)
      })
      this.list = recursionIndicatorList;
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleUploadCheck() {
      let isFillEvaluateScore = [];
      this.list.map(item => {
        isFillEvaluateScore.push(item.evaluate_score ? 1 : 0)
      })
      if(isFillEvaluateScore.includes(0)){
        this.$message.error(this.$t("message.checkFiled"))
      }else{
        if(this.funds){
          expertCheck({plan: this.editId, funds: this.funds}).then(res => {
            this.$router.go(-1)
          })
        }else{
          this.$message.error(this.$t("message.checkFundsFiled"))
        }
      }
    },
    getTrainplanStatus(status){
      if(status){
        let getStatus = this.trainPlanCheckStatusList.find(item => item.code == status)
      return getStatus.name
      }
      return
      
    }

  },
};
</script>

<style lang='scss' scoped>
.word-break{
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
  margin: 0;
  width: 80%;
  float: left;
  font-size: 14px;
  color: #606266
}
</style>
