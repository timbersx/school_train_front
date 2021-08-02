<!--/*
 * @Name: SchoolInfo edit
 * @Module:  src/views/schoolInfo/operations/edit
 * @Desc: SchoolInfo edit
 * @Author:  automatic code
 * @Date:  2020-06-11 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div>
    <el-dialog :visible.sync="visible" :title="$t('table.edit')" width="60%" :before-close="handleClose" @close="handleClose">
      <el-divider />
      <div v-loading="loading" class="form-search" style="float: left">
        <el-form
          ref="dataForm"
          label-width="150px"
          :model="formData"
          label-suffix=":"
          :rules="rules"
          class="dialog-form-space"
        >
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
              <et-school-auth-select :is-edit="true" :evaluate-id="id" :user-id="formData.user" @change="handleGetTeacher" />
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
import { getSchoolTypeList } from '@/api/systemmanage/schoolType'
import { readOrganizationInfo, updateOrganizationInfo } from '@/api/systemmanage/organizationInfo'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
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
  //   created() {
  //     //   this.editId = this.$route.query.id
  //       this.init()
  //   },
  watch: {
    visible(newValue) {
      newValue && this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        getSchoolTypeList({ limit: 100000000, offset: 0 }),
        // getAuthList({ limit: 10, offset: 0 }),
        readOrganizationInfo(this.id)
      ]).then(response => {
        this.organization_type_Operations = response[0].data
        // this.user_Operations = response[1].data;
        this.formData = response[1].data
        this.formData.organization_type =
          this.formData.organization_type == null
            ? this.formData.organization_type
            : this.formData.organization_type.id
        if (this.formData.user) {
          this.formData.user = this.formData.user.id
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          delete this.formData['organization']
          updateOrganizationInfo(this.id, this.formData)
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
      this.$emit('update:visible', false)
    },
    handleGetTeacher(e) {
      this.formData.user = e
    }
  }
}
</script>

<style lang='scss' scoped>
.el-select{
  width: 100%;
}
</style>
