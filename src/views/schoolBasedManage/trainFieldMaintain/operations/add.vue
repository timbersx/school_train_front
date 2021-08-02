<!--/*
 * @Name: trainFieldMaintain add
 * @Module:  src/views/trainFieldMaintain/operations/add
 * @Desc: trainFieldMaintain add
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
          label-width="200px"
          :model="formData"
          label-suffix=":"
          :rules="rules"
        >
          <el-col :span="12">
            <el-form-item :label="$t('trainFieldMaintain.code')" prop="code">
              <el-input v-model="formData.code" class="items" clearable :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainFieldMaintain.name')" prop="name">
              <el-input v-model="formData.name" class="items" clearable :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('trainFieldMaintain.explain')" prop="explain">
              <el-input v-model="formData.explain" class="items" clearable :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'

import { schoolCreate } from '@/api/schoolBasedManage/trainFieldMaintain'
export default {
  components: {
    Sticky
  },
  data() {
    return {
      loading: false, // 是否显示loading
      formData: {},
      rules: {
        code: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
        explain: [
          {
            required: true,
            message: this.$t('validate.required')
          }
        ],
      },
    }
  },
  methods: {
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.Loading = true
          schoolCreate(this.formData).then(response => {
            this.Loading = false
            this.$message.success(this.$t('message.saveSuccess'))
            this.$router.go(-1)
            this.formData = {}
          }).catch(() => {
            this.Loading = false
            // this.$router.go(-1)
          })
        } else {
          return false
        }
      })
    },
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
