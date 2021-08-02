<!--/*
 * @Name: schoolBasedTrainingHome applyhours
 * @Module:  src/views/schoolBasedTeachers/schoolBasedTrainingHome/applyhours
 * @Desc: schoolBasedTrainingHome applyhours
 * @Author:  automatic code
 * @Date:  2021-02-22 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :title="'审核详情'"
      width="700px"
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
          class="clearfix"
        >
          <el-col :span="24">
            <el-form-item label="审核时间">
              {{ formData.check_time }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核意见">
              {{ formData.approve_comment }}
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("button.close") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checkData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      formData: {}
    }
  },
  watch: {
    visible(va) {
      if (va) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.formData = this.checkData
    },
    handleClose() {
      this.formData = {}
      this.$emit('update:visible')
    }
  }
}
</script>

<style lang='scss' scoped>
.form-search {
  margin-top: 20px;
}
</style>
