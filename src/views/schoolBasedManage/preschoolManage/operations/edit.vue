<!--/*
 * @Name: expert group management edit
 * @Module:  src/views/schoolBasedManage/expertGroupManagement/edit
 * @Desc: expert group management edit
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
            <el-form-item :label="$t('preschoolManage.perschoolName')" prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-form-item
              :label="$t('preschoolManage.school')"
              prop="organizations"
            >
              <el-select
                v-model="formData.organizations"
                filterable
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in educationsList"
                  :key="index"
                  :label="item.name"
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
import {
  updatePreschool,
  readPreschool
} from '@/api/schoolBasedManage/preschoolManage'
import { getOrganizationInfoList } from '@/api/systemmanage/organizationInfo'
export default {
  components: {
    Sticky
  },
  data() {
    return {
      loading: false,
      formData: {},
      nameList: [],
      educationsList: [],
      expertsList: [],
      id: '',
      rules: {
        name: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        organizations: [
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
      this.id = this.$route.query.id - 0
      this.loading = true
      Promise.all([
        getOrganizationInfoList({ offset: 0, limit: 100000 }),
        readPreschool(this.id)
      ]).then(response => {
        this.loading = false
        this.educationsList = response[0].data
        const res1 = response[1].data
        this.formData = {
          organizations: res1.organizations.map(item => item.id),
          name: res1.name
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmitForm() {
      console.log(this.formData)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          updatePreschool(this.id, this.formData)
            .then((response) => {
              this.$message.success(this.$t('message.saveSuccess'))
              this.loading = false
              this.$router.go(-1)
            })
            .catch(() => {
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
