<!--/*
 * @Name: SchoolType edit
 * @Module:  src/views/schoolType/operations/edit
 * @Desc: SchoolType edit
 * @Author:  automatic code
 * @Date:  2020-06-11 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <el-dialog
    :visible.sync="visible"
    :title="$t('table.edit')"
    width="60%"
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
        :rules="rules"
        class="dialog-form-space"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('schoolType.name')" prop="name">
              <el-input v-model="formData.name" type="text" maxlength="100" class="items" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('schoolType.code')" prop="code">
              <el-input v-model="formData.code" type="text" maxlength="100" class="items" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('schoolType.remark')" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                class="areaItems"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmitForm">{{ $t('button.save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  readSchoolType,
  updateSchoolType
} from '@/api/systemmanage/schoolType'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      loading: true, // 是否显示loading
      formData: {},
      rules: {
        name: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ],
        code: [
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
      this.init()
    }
  },
  methods: {
    init() {
      Promise.all([readSchoolType(this.id)]).then(response => {
        this.formData = response[0].data
        this.loading = false
      })
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          updateSchoolType(this.id, this.formData)
            .then(response => {
              this.$message.success(this.$t('message.saveSuccess'))
              this.loading = false
              this.$emit('update-save')
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
      this.$emit('update:visible')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
