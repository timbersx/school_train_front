<template>
  <div class="add_score">
    <el-dialog
      title="填写审核意见"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-divider />
      <el-form
        ref="form"
        v-loading="Loading"
        :model="form"
        label-width="160px"
        label-suffix=":"
        :rules="rules"
        class="dialog-form-space"
      >
            <el-row>
              <el-col :span="24">
                <el-form-item
                  prop="approve_comment"
                  :label="
                    $t(
                      'educationBureauEvaluation.funds_education_approve_comment'
                    )
                  "
                >
                  <el-input
                    type="textarea"
                    v-model="form.approve_comment"
                    rows="10"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">{{ $t("button.cancel") }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{
          $t("button.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "checkNoPass",
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      form: {},
      Loading: false,
      rules: {
        approve_comment: [{ required: true, message: this.$t("validate.required") }],
      }
    };
  },
  methods: {
    handleCancle() {
      this.$emit("update:visible", false);
      this.$refs["form"].resetFields();
      this.form = {};
    },
    handleConfirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$emit("approve", this.form);
        } else {
          this.Loading = false;
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
