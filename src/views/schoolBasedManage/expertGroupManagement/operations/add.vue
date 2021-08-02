<!--/*
 * @Name: expert group management add
 * @Module:  src/views/schoolBasedManage/expertGroupManagement/indexadd
 * @Desc: expert group management add
 * @Author:  yf
 * @Date:  2021-1-27
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
        @click="handleSubmitForm"
      >{{ this.$t("button.save") }}</el-button>
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <el-container class="form-container">
      <el-main>
        <el-form
          ref="dataForm"
          :loading="loading"
          label-width="150px"
          :model="formData"
          label-suffix=":"
          :rules="rules"
        >
          <el-col :span="8" :offset="8">
            <el-form-item :label="$t('expertGroupManagement.name')" prop="name">
              <el-select v-model="formData.name" style="width: 100%">
                <el-option
                  v-for="(item, index) in nameList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-form-item
              :label="$t('expertGroupManagement.educations')"
              prop="educations"
            >
              <el-select
                v-model="formData.educations"
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in educationsList"
                  :key="index"
                  :label="item.nick_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-form-item :label="$t('expertGroupManagement.experts')" prop="experts">
              <el-select
                v-model="formData.experts"
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in expertsList"
                  :key="index"
                  :label="item.nick_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { postExpertGroupInfo } from '@/api/schoolBasedManage/expertGroupManagement'
import { getDataDictItemList } from '@/api/systemmanage/dataDictItem'
import { getExpertAuthList } from '@/api/systemmanage/auth'
export default {
  components: {
    Sticky
  },
  data() {
    return {
      loading: true,
      formData: {},
      nameList: [],
      educationsList: [],
      expertsList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        educations: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        experts: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = false
      getDataDictItemList({ type_code: 'ZJZ', offset: 0, limit: 100000 }).then(res => {
        this.nameList = res.data
      })
      getExpertAuthList({ offset: 0, limit: 100000 }).then(res => {
        this.educationsList = res.data
        this.expertsList = res.data
      })
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          postExpertGroupInfo(this.formData).then(response => {
            this.$message.success(this.$t('message.saveSuccess'))
            this.loading = false
            this.$router.go(-1)
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    handleReturn() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
