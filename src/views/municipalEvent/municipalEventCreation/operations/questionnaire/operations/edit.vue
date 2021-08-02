<!--/*
 * @Name: questionnaire edit
 * @Module:  src/views/municipalEvent/operations/edit
 * @Desc: questionnaire edit
 * @Author:  shenyj
 * @Date:  2021-06-21 14:37:00
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->


<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :title="$t('table.edit')"
      @close="handleClose"
      :before-close="handleClose"
    >
      <el-divider></el-divider>
      <div class="form-search" v-loading="loading">
        <el-form
          ref="dialogDataForm"
          label-width="150px"
          :model="dialogData"
          label-suffix=":"
          :rules="dialogDataRules"
          v-if="JSON.stringify(dialogData) !== '{}'"
          class="dialog-form-space"
        >
          <el-col :span="24">
            <el-form-item :label="$t('questionnaire.name')" prop="name">
              <el-input v-model="dialogData.name" type="text" maxlength="50" class="items"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('questionnaire.project')" prop="project">
              <el-select
                v-model="project"
                class="items"
                :placeholder="$t('common.select')"
                filterable
                value-key="code"
                style="width: 100%;"
                disabled
              >
                <el-option
                  v-for="item in projectInfoList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmitForm">{{ $t('button.save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import { getTrainEventInfoList } from '@/api/municipalEvent/municipalEventCreation';
import { paperNameBatchUpdate } from "@/api/municipalEvent/questionnaire";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: true,
      project: "",
      projectInfoList: "",
      dialogData: {name: ''},
      dialogDataRules: {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
      }
    };
  },
  watch: {
    visible(newValue) {
      Promise.all([
        getTrainEventInfoList({ limit: 100000000, offset: 0 })
      ]).then(response => {
        this.projectInfoList = response[0].data;
      });
      this.project = this.detailData.project.id;
      this.dialogData.name = this.detailData.name;
      this.loading = false;
    }
  },
  methods: {
    handleSubmitForm() {
      this.$refs["dialogDataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          paperNameBatchUpdate(this.detailData.id, this.dialogData)
            .then(response => {
              this.$message.success(this.$t("message.saveSuccess"));
              this.loading = false;
              this.$emit("updateSave");
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang='scss' scoped>
.el-select {
  width: 100%;
}
</style>
