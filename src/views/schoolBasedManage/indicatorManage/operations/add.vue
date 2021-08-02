<!--  -->
<template>
  <div>
    <el-dialog :visible="visible" :title="$t('button.add')" @close="handleReturn">
      <!-- 按钮-->
      <el-divider />
      <div class="form-search">
        <el-main>
          <el-form ref="dataForm" :loading="loading" label-width="150px" :model="formData" label-suffix=":" :rules="rules">
            <!-- 上级指标 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('indicatorManage.parent')" prop="parent">
                  <span v-if="!showFatherName">无</span>
                  <span v-if="showFatherName">{{ fatherName }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 指标项名称 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('indicatorManage.name')" prop="name">
                  <el-input v-model="formData.name" type="text" maxlength="100" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 监测分值 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('indicatorManage.monitorScore')" prop="score">
                  <el-input v-model="formData.score" type="number" maxlength="200" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 排序 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('indicatorManage.order_no')" prop="order_no">
                  <el-input v-model="formData.order_no" type="number" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 指标说明 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('indicatorManage.desc')">
                  <el-input v-model="formData.desc" type="textarea" maxlength="100" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </div>
      <!-- 与form-search保持同级别 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleReturn">{{ this.$t('button.cancel') }}</el-button>
        <el-button :loading="loading" style="margin-left: 10px;" type="primary" @click="handleSubmitForm">{{ this.$t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  readIndicatorinfo,
  addIndicatorinfo
} from '@/api/schoolBasedManage/indicatorManage'
export default {
  name: 'AddDialog',
  components: {

  },
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
      fatherName: '',
      showFatherName: false,
      showScore: false,
      loading: true,
      formData: {
        score: null
      },
      rules: {

        name: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],

        score: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        score: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        },
        { pattern: /^(0\.?\d{0,2}|[1-9]\d*\.?\d{0,2})$/,
          message: this.$t('indicatorManage.inputRemind'),
          trigger: 'blur'
        }
        ],
        order_no: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    visible(newValue) {
      this.formData = {}
      this.showScore = false
      if (this.nodeId !== -1 & newValue === true) {
        readIndicatorinfo(this.nodeId).then(res => {
          this.fatherName = res.data.name
          this.showFatherName = true
        })
      } else {
        this.showFatherName = false
      }
    }
  },
  created() {
    this.loading = false
  },
  methods: {
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.nodeId !== -1 ? this.formData.parent = this.nodeId : this.formData.parent = ''
          addIndicatorinfo(this.formData)
            .then(() => {
              this.$message.success(this.$t('message.saveSuccess'))
              this.loading = false
              this.$emit('update')
            }).catch(() => {
              this.loading = false
            })
        }
      })
    },
    handleReturn() {
      this.$emit('cancel')
      this.$refs.dataForm.resetFields();
    }
  }
}
</script>

<style lang='scss' scoped>
.lastRow{
  margin-bottom: 0px !important;
}
</style>
