<!--/*
 * @Name: teacherGroup detail
 * @Module:  src/views/teacherGroup/operations/detail
 * @Desc: teacherGroup detail
 * @Author:  automatic code
 * @Date:  2021-02-03 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->
<template>
  <el-dialog
    :visible.sync="visible"
    :title="$t('route.detail')"
    width="700px"
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
        class="dialog-form-space"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('teacherGroup.name')">{{ formData.name }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('teacherGroup.teachers')">{{ formData.teachers && formData.teachers.join('、') }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ this.$t('button.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { readTeacherGroupInfo } from '@/api/traineventmanage/teacherGroup'
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
      formData: {}
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
        this.formData = {
          name: res0.name,
          teachers: res0.teachers.map(i => i.name)
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    handleClose() {
      this.$emit('update:visible')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
