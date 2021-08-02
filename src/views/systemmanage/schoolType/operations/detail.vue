<!--/*
 * @Name: SchoolType detail
 * @Module:  src/views/schoolType/operations/detail
 * @Desc: SchoolType detail
 * @Author:  automatic code
 * @Date:  2020-06-11 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->
<template>
  <el-dialog
    :visible="visible"
    :title="$t('route.detail')"
    width="50%"
    :before-close="handleClose"
    @close="handleClose"
  >
    <el-divider />
    <div class="form-search">
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
            <el-form-item :label="$t('schoolType.name')">{{ formData.name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('schoolType.code')">{{ formData.code }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('schoolType.remark')">{{ formData.remark }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ this.$t('button.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { readSchoolType } from '@/api/systemmanage/schoolType'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [Number, String],
      default: ''
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
      Promise.all([readSchoolType(this.id)]).then(response => {
        this.formData = response[0].data
        this.loading = false
      })
    },
    handleClose() {
      this.$emit('update:visible')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
