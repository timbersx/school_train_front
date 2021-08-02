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
      <el-button type="primary" @click="handleSave">{{
        this.$t("button.save")
      }}</el-button>
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
          :rules="rules"
          :model="trainingExpertData"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                prop="name"
                :label="$t('trainingExpertManage.name')"
              >
                <el-input
                  :placeholder="$t('table.input')"
                  v-model="trainingExpertData.name"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="phone"
                :label="$t('trainingExpertManage.phone')"
              >
                <el-input
                  :placeholder="$t('table.input')"
                  v-model="trainingExpertData.phone"
                  type="tel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="id_card"
                :label="$t('trainingExpertManage.id_card')"
              >
                <el-input
                  :placeholder="$t('table.input')"
                  v-model="trainingExpertData.id_card"
                  type="tel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :placeholder="$t('table.input')"
                prop="bank_card"
                :label="$t('trainingExpertManage.bank_card')"
              >
                <el-input
                  v-model="trainingExpertData.bank_card"
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="bank"
                :label="$t('trainingExpertManage.bank')"
              >
                <el-input
                  :placeholder="$t('table.input')"
                  v-model="trainingExpertData.bank"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="title"
                :label="$t('trainingExpertManage.title')"
              >
                <el-input
                  :placeholder="$t('table.input')"
                  v-model="trainingExpertData.title"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                prop="post"
                :label="$t('trainingExpertManage.post')"
              >
                <el-input
                  :placeholder="$t('table.input')"
                  v-model="trainingExpertData.post"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item
                prop="workplace"
                :label="$t('trainingExpertManage.workplace')"
              >
                <el-input
                  :placeholder="$t('table.input')"
                  v-model="trainingExpertData.workplace"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                prop="profile"
                :label="$t('trainingExpertManage.profile')"
              >
                <tinymce :height="300" v-model="trainingExpertData.profile" id='profile'></tinymce>
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
import Tinymce from "@/components/Tinymce";
import { readSchoolExpertInfo, updateSchoolExpertInfo } from "@/api/traineventmanage/trainingExpertManage";
export default {
  components: {
    Sticky,
    Tinymce
  },
  data() {
    return {
      editId: 0,
      loading: false,
      trainingExpertData: {},
      rules: {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        id_card: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        profile: [
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
      this.editId = this.$route.query.id
      this.init()
  },
  methods: {
    init(){
        readSchoolExpertInfo(this.editId).then(res => {
            this.trainingExpertData = res.data
        })
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleSave() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          updateSchoolExpertInfo(this.editId, this.trainingExpertData).then((res) => {
            this.$router.go(-1);
          });
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
