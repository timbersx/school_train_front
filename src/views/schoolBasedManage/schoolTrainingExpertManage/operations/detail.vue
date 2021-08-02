<!--/*
 * @Name: trainingExpertManage add
 * @Module:  src/views/trainingExpertManage/operations/add
 * @Desc: trainingExpertManage add
 * @Author:  shenyj
 * @Date:  2021-02-01 15:10:34
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
        <el-form
          ref="dataForm"
          label-width="160px"
          label-suffix=":"
          :model="trainingExpertData"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                prop="name"
                :label="$t('trainingExpertManage.name')"
              >
                <span>{{ trainingExpertData.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="phone"
                :label="$t('trainingExpertManage.phone')"
              >
                <span>{{ trainingExpertData.phone }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="id_card"
                :label="$t('trainingExpertManage.id_card')"
              >
                <span>{{ trainingExpertData.id_card }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :placeholder="$t('table.input')"
                prop="bank_card"
                :label="$t('trainingExpertManage.bank_card')"
              >
                <span>{{ trainingExpertData.bank_card }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="bank"
                :label="$t('trainingExpertManage.bank')"
              >
                <span>{{ trainingExpertData.bank }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="title"
                :label="$t('trainingExpertManage.title')"
              >
                <span>{{ trainingExpertData.title }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="post"
                :label="$t('trainingExpertManage.post')"
              >
                <span>{{ trainingExpertData.post }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="workplace"
                :label="$t('trainingExpertManage.workplace')"
              >
                <span>{{ trainingExpertData.workplace }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                prop="profile"
                :label="$t('trainingExpertManage.profile')"
              >
                <div v-html=trainingExpertData.profile></div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import { readSchoolExpertInfo } from "@/api/schoolBasedManage/schoolTrainingExpertManage";
export default {
  components: {
    Sticky,
  },
  data() {
    return {
      editId: 0,
      loading: false,
      trainingExpertData: {},
    };
  },
  created() {
    this.editId = this.$route.query.id;
    this.init();
  },
  methods: {
    init() {
      readSchoolExpertInfo(this.editId).then((res) => {
        this.trainingExpertData = res.data;
      });
    },
    handleReturn() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang='scss' scoped>
.wordBreak {
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: "Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif";
}
</style>
