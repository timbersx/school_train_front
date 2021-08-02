<!--/*
 * @Name: teacherGroup edit
 * @Module:  src/views/teacherGroup/operations/edit
 * @Desc: teacherGroup edit
 * @Author:  f
 * @Date:  2021-02-03 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example: can't keep my hands to myself
*/-->

<template>
  <el-dialog
    :visible.sync="visible"
    :title="$t('table.edit')"
    width="800px"
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
      >
        <transition name="el-fade-in-linear">
          <el-row v-if="visible">
            <el-col :span="24">
              <el-form-item :label="$t('teacherGroup.name')" prop="name">
                <el-input v-model="formData.name" type="text" maxlength="100" style="width: 586px" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('teacherGroup.teachers')" prop="teachers">
                <et-muti-transfer
                  v-model="formData.teachers"
                  :get-search-data="getSearchData"
                  :get-page-data="getPageData"
                  :default-selected-data="defaultTeachers"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </transition>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleBtnClose">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmitForm">{{ $t('button.save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import EtMutiTransfer from '@/components/EtMutiTransfer'
import {
  readTeacherGroupInfo,
  updateSchoolTeacherGroupInfo,
  getUnSelectedSchoolTeacherList
} from '@/api/traineventmanage/teacherGroup'
export default {
  components: {
    EtMutiTransfer
  },
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
        teachers: [
          {
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }
        ]
      },
      teacherList: [],
      defaultTeachers: []
    }
  },

  watch: {
    visible(newValue) {
      newValue && this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([readTeacherGroupInfo(this.id)]).then(response => {
        const res0 = response[0].data
        this.defaultTeachers = res0.teachers.map(i => {
          i.label = i.name
          return i
        })
        this.formData = {
          name: res0.name,
          teachers: res0.teachers.map(i => i.id)
        }
        this.loading = false
      })
    },
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          updateSchoolTeacherGroupInfo(this.id, this.formData)
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
      this.formData = {}
      this.$emit('update:visible')
    },
    handleBtnClose() {
      this.formData = {}
      this.$emit('update:visible')
      this.$refs.dataForm.resetFields()
    },
    getPageData(pageIndex) {
      return getUnSelectedSchoolTeacherList({ limit: 10, offset: (pageIndex - 1) * 10, teacher_group: this.id }).then(response => {
        const res = response.data
        return res.map(i => {
          i.label = i.name
          return i
        })
      })
    },
    getSearchData(keyword) {
      return getUnSelectedSchoolTeacherList({ limit: 10, offset: 0, search: keyword, teacher_group: this.id }).then(response => {
        const res = response.data
        return res.map(i => {
          i.label = i.name
          return i
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.form-search {
  margin-top: 20px;
}
</style>
