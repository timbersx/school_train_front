<!--/*
 * @Name: trainEventSignUpCheck check
 * @Module:  src/views/traineventmanage/trainEventSignUpCheck/operations/check
 * @Desc: trainEventSignUpCheck check
 * @Author: shenyj
 * @Date:  2021-02-22
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <el-dialog
    :visible="visible"
    @close="handleClose"
    :title="$t('trainEventSignUpCheck.check')"
    width="50%"
    :before-close="handleClose"
  >
    <el-divider></el-divider>
    <div class="form-search">
      <el-form
        ref="dataForm"
        :loading="loading"
        label-width="0"
        :model="formData"
        label-suffix=":"
        class="dialog-form-space"
        :rules="rules"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item prop="is_pass">
              <el-radio v-model="formData.is_pass" :label="true">审核通过</el-radio>
              <el-radio v-model="formData.is_pass" :label="false">审核不通过</el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="approve_comment">
              <el-input
                type="textarea"
                :rows="5"
                :placeholder="$t('table.input')"
                v-model="formData.approve_comment"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ this.$t("button.cancel") }}</el-button>
      <el-button type="primary" @click="hadnleConfirm">{{
        $t("button.confirm")
      }}</el-button>
    </div>
  </el-dialog>
</template>


<script>
import { enrollCheck } from '@/api/municipalEvent/municipalEventCheckRegistration'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editID: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      loading: false, //是否显示loading
      formData: {},
      rules: {
        is_pass: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    hadnleConfirm() {
      if (this.formData.is_pass !== undefined) {
        enrollCheck(this.editID, this.formData).then((res) => {
          this.$message.success("保存成功！");
          this.$emit("updateSave");
        });
      } else {
        this.$message.error("请选择是否审核通过！");
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
