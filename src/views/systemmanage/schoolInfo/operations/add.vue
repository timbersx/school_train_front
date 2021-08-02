<!--/*
 * @Name: SchoolInfo add
 * @Module:  src/views/schoolInfo/operations/edit
 * @Desc: SchoolInfo add
 * @Author:  automatic code
 * @Date:  2020-06-11 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div>
    <el-dialog :visible.sync="visible" :title="$t('table.add')" width="60%" :before-close="handleClose" @close="handleClose">
      <el-divider />
      <div class="form-search">
        <el-form
          ref="dataForm"
          :loading="loading"
          label-width="150px"
          :model="formData"
          label-suffix=":"
          :rules="rules"
          class="dialog-form-space"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('schoolInfo.name')" prop="name">
                <el-input v-model="formData.name" type="text" maxlength="100" class="items" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolInfo.code')" prop="code">
                <el-input v-model="formData.code" type="text" maxlength="100" class="items" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('schoolInfo.organization_type')" prop="organization_type">
                <el-select
                  v-model="formData.organization_type"
                  class="items"
                  :placeholder="$t('common.select')"
                  filterable
                  value-key="id"
                >
                  <el-option
                    v-for="item in organization_type_Operations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
            <el-form-item :label="$t('schoolInfo.user')" prop="user">
              <et-school-auth-select @change="handleGetTeacher" />
            </el-form-item>
          </el-col> -->
            <el-col :span="24">
              <el-form-item :label="$t('schoolInfo.remark')" prop="remark">
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
  </div>
</template>

<script>
import { createSchoolInfo } from '@/api/systemmanage/schoolInfo'
import { getSchoolTypeList } from '@/api/systemmanage/schoolType'
import { getAuthList } from '@/api/systemmanage/auth'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true, // 是否显示loading
      organization_type_Operations: [],
      user_Operations: [],
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
  created() {
    this.init()
  },

  methods: {
    init() {
      Promise.all([
        getSchoolTypeList({ limit: 100000000, offset: 0 })
        // getAuthList({ limit: 100000000, offset: 0 })
      ]).then(response => {
        this.organization_type_Operations = response[0].data
        // this.user_Operations = response[1].data;
        this.loading = false
      })
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          createSchoolInfo(this.formData)
            .then(response => {
              this.$message.success(this.$t('message.saveSuccess'))
              this.loading = false
              this.formData = {}
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
      this.formData = {}
      this.$emit('update:visible', false)
    },
    handleRemoteAuth(query) {
      if (query !== '') {
        this.loading = true
        getAuthList({ limit: 100000000, offset: 0, search: query }).then(
          res => {
            this.user_Operations = res.data
          }
        )
      } else {
        this.options = []
      }
    },
    handleGetTeacher(e) {
      this.formData.user = e
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
