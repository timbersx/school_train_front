<!--/*
 * @Name: trainFieldMaintain edit
 * @Module:  src/views/trainFieldMaintain/operations/edit
 * @Desc: trainFieldMaintain edit
 * @Author:  shenyj 
 * @Date:  2021-04-19 16:30:34
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
          label-width="200px"
          :model="formData"
          label-suffix=":"
        >
          <el-col :span="12">
            <el-form-item :label="$t('trainFieldMaintain.code')" prop="code">
              {{formData.code}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainFieldMaintain.name')" prop="name">
              {{formData.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainFieldMaintain.explain')" prop="explain">
              {{formData.explain}}
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'

import { readchoolList } from '@/api/schoolBasedManage/trainFieldMaintain'
export default {
  components: {
    Sticky
  },
  data() {
    return {
      loading: false, // 是否显示loading
      formData: {},
    }
  },
  created(){
      this.id = this.$route.query.id - 0
      this.loading = true
      readchoolList(this.id).then(res => {
          this.formData = res.data
          this.loading = false
      })
  },
  methods: {
    handleReturn() {
      this.$router.go(-1)
    },
  }
}
</script>

<style lang='scss' scoped>
.col-items {
  width: calc(90% + 20px);
}
</style>
