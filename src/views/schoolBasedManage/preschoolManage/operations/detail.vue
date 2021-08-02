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
              {{ formData.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-form-item
              :label="$t('preschoolManage.school')"
              prop="organizations"
            >
              {{ formData.organizations && formData.organizations.join('、') }}
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
  readPreschool
} from '@/api/schoolBasedManage/preschoolManage'
export default {
  components: {
    Sticky
  },
  data() {
    return {
      loading: false,
      formData: {},
      nameList: [],
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
        readPreschool(this.id)
      ]).then(response => {
        this.loading = false
        const res1 = response[0].data
        this.formData = {
          organizations: res1.organizations.map(item => item.name),
          name: res1.name
        }
      }).catch(() => {
        this.loading = false
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
