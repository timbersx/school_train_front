<template>
  <div class="edit_score">
    <el-dialog
      :visible.sync="editDialogVisible"
      :title="$t('route.edit')"
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
        <!-- 所属评价指标项 -->
        <el-form-item :label="$t('evaluationStandardManage.indicator')">{{ form.indicator.name }}</el-form-item>
        <!-- 得分点描述 -->
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('evaluationStandardManage.desc')" prop="desc">
              <el-input v-model="form.desc" type="textarea" :rows="4" :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 最高分值 -->
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('evaluationStandardManage.max_score')" prop="max_score">
              <el-input v-model="form.max_score" :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 排序 -->
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('evaluationStandardManage.order_no')" prop="order_no">
              <el-input v-model.number="form.order_no" :placeholder="$t('table.input')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateScorePointInfo } from '@/api/schoolBasedManage/evaluationStandardManage'

export default {
  name: 'EditDialog',
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    },
    // 评分项数据
    selectedScore: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      form: { indicator: '' },
      rules: {
        max_score: [{ required: true, message: this.$t('validate.required') }],
        order_no: [{ required: true, message: this.$t('validate.required') }, { type: 'number', message: this.$t('validate.requireNumber') }],
        desc: [{ required: true, message: this.$t('validate.required') }]
      },
      Loading: false,
      defaultScoreType: ''
    }
  },
  watch: {
    selectedScore(value) {
      this.form = Object.assign({}, value)
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:editDialogVisible', false)
    },
    handleCancle() {
      this.$emit('update:editDialogVisible', false)
    },
    handleConfirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.Loading = true
          // 处理待提交的数据
          const submitId = this.form.id
          const submitData = Object.assign({}, this.form)
          submitData.indicator = this.form.indicator.id
          delete submitData.project
          delete submitData.id
          updateScorePointInfo(submitId, submitData).then(() => {
            this.Loading = false
            this.$message.success(this.$t('message.saveSuccess'))
            // 只有请求成功父组件才会触发事件
            this.$emit('submit')
          }).catch(() => {
            this.Loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
