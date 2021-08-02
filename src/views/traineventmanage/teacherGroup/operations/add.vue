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
      :title="$t('table.add')"
      width="800px"
      :before-close="handleClose"
      @close="handleClose"
    >
      <el-divider />
      <div class="form-search">
        <el-form
          ref="dataForm"
          :loading="loading"
          label-width="130px"
          :model="formData"
          label-suffix=":"
          :rules="rules"
        >
          <transition name="el-fade-in-linear">
            <el-row v-if="visible">
              <el-col :span="24">
                <el-form-item :label="$t('teacherGroup.name')" prop="name">
                  <el-input
                    v-model="formData.name"
                    type="text"
                    maxlength="100"
                    style="width: 586px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('teacherGroup.teachers')" prop="teachers">
                  <et-muti-transfer
                    v-model="formData.teachers"
                    :get-search-data="getSearchData"
                    :get-page-data="getPageData"
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
          $t("button.save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EtMutiTransfer from '@/components/EtMutiTransfer'
import { createSchoolTeacherGroupInfo, getUnSelectedSchoolTeacherList } from '@/api/traineventmanage/teacherGroup'
export default {
  components: {
    EtMutiTransfer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
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
      teacherList: []
    }
  },
  methods: {
    handleSubmitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          createSchoolTeacherGroupInfo(this.formData)
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
      this.$emit('update:visible')
    },
    getPageData(pageIndex) {
      return getUnSelectedSchoolTeacherList({ limit: 10, offset: (pageIndex - 1) * 10 }).then(response => {
        const res = response.data
        return res.map(i => {
          i.label = i.name
          return i
        })
      })
    },
    getSearchData(keyword) {
      return getUnSelectedSchoolTeacherList({ limit: 10, offset: 0, search: keyword }).then(response => {
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
