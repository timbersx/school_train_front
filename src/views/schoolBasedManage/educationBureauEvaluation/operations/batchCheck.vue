<template>
  <div class="add_score">
    <el-dialog
      :title="$t('button.batchCheck')"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-divider />
      <!-- 表单 -->
      <el-form
        ref="form"
        v-loading="Loading"
        :model="form"
        label-width="160px"
        label-suffix=":"
        :rules="activeStatus == 'uniqueWaitCheck' ? rules : rulesCommon"
        class="dialog-form-space"
      >
            <el-row v-if="activeStatus == 'uniqueWaitCheck'">
              <el-col :span="24">
                <el-form-item
                  prop="funds"
                  :label="$t('educationBureauEvaluation.education_funds')"
                >
                  <el-input
                    v-model="form.funds"
                    size="small"
                    type="number"
                    style="width: 80px; margin: 0 10px"
                  />(万元)
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  prop="status"
                  :label="
                    $t('educationBureauEvaluation.funds_education_result')
                  "
                >
                  <el-radio-group v-model="form.status">
                    <el-radio :label="2">审核通过</el-radio>
                    <el-radio :label="3">审核不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
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
import { batchEducationSubmitCheck } from "@/api/schoolBasedManage/educationBureauEvaluation";

export default {
  name: "batchCheckDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    plans: {
       type: Array,
       default: function() {
        return []
      }
    },
    activeStatus: {
        type: String,
        default: ''
    }
  },
  data() {
    return {
      form: {},
      Loading: false,
      rules: {
        funds: [{ required: true, message: this.$t("validate.required") }],
        status: [{ required: true, message: this.$t("validate.required") }],
        approve_comment: [{ required: true, message: this.$t("validate.required") }],
      },
      rulesCommon: {
        status: [{ required: true, message: this.$t("validate.required") }],
        approve_comment: [{ required: true, message: this.$t("validate.required") }],
      },
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
          this.Loading = true;
          batchEducationSubmitCheck({plans: this.plans.map(item => item.id), ...this.form})
            .then(() => {
              this.$emit("checked");
              this.Loading = false;
              this.$message.success(this.$t("message.saveSuccess"));
              this.$refs["form"].resetFields();
              this.form = {};
            })
            .catch(() => {
              this.Loading = false;
            });
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
