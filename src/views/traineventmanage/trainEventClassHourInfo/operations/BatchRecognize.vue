<!--/*
 * @Name: teacherGroup add
 * @Module:  src/views/teacherGroup/operations/edit
 * @Desc: teacherGroup add
 * @Author:  automatic code
 * @Date:  2021-02-03 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :title="'批量认定学时'"
      width="800px"
      :before-close="handleClose"
      @close="handleClose"
    >
      <el-divider />
      <div class="form-search">
        <el-form
          ref="dataForm"
          v-loading="loading"
          label-width="130px"
          :model="formData"
          label-suffix=":"
          :rules="rules"
        >
          <transition name="el-fade-in-linear">
            <el-row v-if="visible">
              <el-col :span="24">
                <el-form-item :label="'已选教师'">
                  {{ itemList.map(i=>i.teacher.name).join('、') }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'培训学时'">
                  {{ currentHour }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('trainEventClassHourInfo.hours')" prop="hours">
                  <el-input
                    v-model="formData.hours"
                    type="text"
                    style="width: 80%"
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </transition>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("button.cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmitForm">{{
          '认定学时'
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { batchRecognizeTrainEventClassHourInfo } from '@/api/traineventmanage/trainEventClassHourInfo'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    itemList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      formData: {},
      rules: {
        hours: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      },
      teacherList: [],
      currentHour: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        const currentHour = this.itemList[0].train_event.train_hour
        this.currentHour = currentHour
        this.$set(this.formData, 'hours', currentHour)
      }
    }
  },
  methods: {
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          batchRecognizeTrainEventClassHourInfo({
            hours: this.formData.hours,
            class_hours: this.itemList.map(i => i.id),
            status: true
          })
            .then(response => {
              this.$message.success(this.$t('message.saveSuccess'))
              this.loading = false
              this.formData = {}
              this.$emit('save')
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.loading = false
          return false
        }
      })
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
