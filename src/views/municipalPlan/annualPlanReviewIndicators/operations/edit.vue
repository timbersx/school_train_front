<!--  -->
<template>
  <div>
    <el-dialog :visible="visible" :title="$t('button.edit')" @close="handleReturn">
      <el-divider />

      <div v-loading="loading">
        <div class="form-search">
          <el-main>
            <el-form
              ref="dataForm"
              :loading="loading"
              label-width="150px"
              :model="formData"
              label-suffix=":"
              :rules="rules"
            >
              <!-- 上级指标名:只需要展示 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('indicatorManage.parent')" prop="parent">
                    <span>{{ parentData.name }}</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 指标名称 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('indicatorManage.name')" prop="name">
                    <el-input v-model="formData.name" type="text" maxlength="100" class="oneRowItems" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 监测分值 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('indicatorManage.score')" prop="score">
                    <el-input
                      v-model="formData.score"
                      type="number"
                      class="oneRowItems"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 排序 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('indicatorManage.order_no')" prop="order_no">
                    <el-input v-model="formData.order_no" type="number" class="oneRowItems" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 指标说明 -->
              <el-row>
                <el-col>
                  <el-form-item :label="$t('indicatorManage.desc')" class="lastRow">
                    <el-input v-model="formData.desc" type="textarea" maxlength="100" class="oneRowItems" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-main>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleReturn">{{ this.$t('button.cancel') }}</el-button>
        <el-button
          :loading="loading"
          style="margin-left: 10px;"
          type="primary"
          @click="handleSubmitForm"
        >{{ this.$t('button.save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  readIndicatorinfo,
  updateIndicatorinfo
} from '@/api/municipalPlan/annualPlanReviewIndicators'

export default {
  name: 'EditDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    nodeId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      parentData: {},
      loading: false, // 是否显示loading
      formData: {},
      rules: {
        project: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        desc: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        score: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        fill_score: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        order_no: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    visible(newValue) {
      this.getEditInfo(newValue)
    }
  },
  methods: {
    // 获取编辑信息
    getEditInfo() {
      // 查询该指标对应的数据
      if (this.nodeId > -1) {
        readIndicatorinfo(this.nodeId).then(res => {
          this.formData = res.data
          if (this.formData.parent == null) {
            // 上级指标处显示无
            this.parentData = { name: this.$t('indicatorManage.fatherNone') }
          } else {
            this.parentData = this.formData.parent
            // 设置父信息
            this.formData.parent = this.formData.parent.id
          }
        })
      }
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          // 设置指标的上级id
          updateIndicatorinfo(this.nodeId, this.formData)
            .then(() => {
              this.$message.success(this.$t('message.saveSuccess'))
              this.loading = false
              this.$emit('update')
            })
            .catch(() => {
              this.loading = false
              this.$message.error('出错了')
            })
        } else {
          this.loading = false
          return false
        }
      })
    },
    handleReturn() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang='scss' scoped>
.lastRow{
  margin-bottom: 0px !important;
}
</style>
