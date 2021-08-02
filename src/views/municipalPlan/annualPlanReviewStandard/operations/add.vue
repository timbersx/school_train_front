<template>
  <div class="add_score">
    <el-dialog
      :title="$t('route.add')"
      :visible.sync="addDialogVisible"
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
        :rules="rules"
        class="dialog-form-space"
      >
        <!-- 所属指标项 -->
        <el-form-item :label="$t('evaluationStandardManage.indicator')">{{ selectedIndicator }}</el-form-item>
        <!-- 得分点描述 -->
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('evaluationStandardManage.desc')" prop="desc">
              <el-input v-model="form.desc" type="textarea" :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 最高分值 -->
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('evaluationStandardManage.max_score')" prop="max_score">
              <el-input v-model="form.max_score" type="number" :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 排序 -->
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('evaluationStandardManage.order_no')" prop="order_no">
              <el-input v-model.number="form.order_no" type="number" :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div class="blackline"></div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">{{ $t('button.cancel') }}</el-button>
        <!-- <el-button @click="handleConfirmAndSave">{{ $t('button.saveAndAdd') }}</el-button> -->
        <el-button type="primary" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addScorePointInfo } from '@/api/municipalPlan/annualPlanReviewStandard'

export default {
  name: 'AddDialog',
  props: {
    addDialogVisible: {
      type: Boolean,
      default: false
    },
    selectedIndicator: {
      type: String,
      default: ''
    },
    selectedIndicatorId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      form: {},
      Loading: false,
      rules: {
        max_score: [{ required: true, message: this.$t('validate.required') }],
        score_type: [{ required: true, message: this.$t('validate.required') }],
        order_no: [{ required: true, message: this.$t('validate.required') }, { type: 'number', message: this.$t('validate.requireNumber') }],
        desc: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  watch: {
    addDialogVisible(val) {
      if (val) {
        this.$refs['form'] && this.$refs['form'].resetFields()
        this.form = {}
      }
    }
  },
  methods: {
    handleCancle() {
      this.$emit('update:addDialogVisible', false)
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.form = {}
    },
    // 确认
    handleConfirm() {
      // 提交新增得分点接口
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.Loading = true
          this.form.indicator = this.selectedIndicatorId
          this.form.name = 'Null'
          addScorePointInfo(this.form).then(() => {
            this.$emit('addScore')
            this.Loading = false
            this.$message.success(this.$t('message.saveSuccess'))
            this.$refs['form'].resetFields()
            this.form = {}
          }).catch(() => {
            this.Loading = false
          })
        } else {
          this.Loading = false
          return false
        }
      })
    },
    handleConfirmAndSave() {
      // 提交新增得分点接口
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.Loading = true
          this.form.indicator = this.selectedIndicatorId
          this.form.name = 'Null'
          addScorePointInfo(this.form).then(response => {
            this.Loading = false
            this.$message.success(this.$t('message.saveSuccess'))
            this.$emit('addScoreAndSave', response.data)
            this.$refs['form'].resetFields()
            this.form = {}
          }).catch(() => {
            this.Loading = false
          })
        } else {
          this.Loading = false
          return false
        }
      })
    },
    handleClose() {
      this.$emit('update:addDialogVisible', false)
      // this.form = {}
      // this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.fill {
  font-size: 18px;
  font-weight: bold;
}

// .add_score /deep/ .el-dialog__body {
//   padding: 30px 0;
// }
// .inner_dialog /deep/ .el-dialog__body {
//   padding: 30px 0;
// }
.blackline {
  height: 10px;
  border-top: solid #e9e9e9 1px;
}
label.el-radio {
  margin: 0 50px 0 0;
}
.fill_type {
  margin-top: 20px;
}
.red_button {
  color: red;
}
</style>
