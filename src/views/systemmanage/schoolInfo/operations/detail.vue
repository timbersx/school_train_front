<!--/*
 * @Name: SchoolInfo detail
 * @Module:  src/views/schoolInfo/operations/detail
 * @Desc: SchoolInfo detail
 * @Author:  automatic code
 * @Date:  2020-06-11 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <el-dialog :visible="visible" :title="$t('route.detail')" width="50%" :before-close="handleClose" @close="handleClose">
    <el-divider />
    <el-form
      ref="dataForm"
      v-loading="loading"
      label-width="150px"
      :model="formData"
      label-suffix=":"
      class="dialog-form-space"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('schoolInfo.name')">{{ formData.name }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolInfo.code')">{{ formData.code }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolInfo.organization_type')">{{ formData.organization_type }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolInfo.remark')">{{ formData.remark }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ this.$t('button.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { readOrganizationInfo } from '@/api/systemmanage/organizationInfo'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: true, // 是否显示loading
      formData: {}
    }
  },
  watch: {
    visible(newValue) {
      newValue && this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([readOrganizationInfo(this.id)]).then(response => {
        this.formData = response[0].data
        this.formData.organization_type =
          this.formData.organization_type == null
            ? this.formData.organization_type
            : this.formData.organization_type.name
        this.formData.user =
          this.formData.user == null
            ? this.formData.user
            : this.formData.user.nick_name
        this.loading = false
      })
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
