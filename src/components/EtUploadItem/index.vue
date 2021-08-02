<template>
  <el-upload
    v-loading="uploadLoading"
    class="upload-demo"
    action
    :http-request="handleUpload"
    :on-remove="handleRemove"
    :accept="acceptType"
    :file-list="fileList"
    v-bind="$attrs"
    :multiple="multipleType"
  >
    <el-button width="100%">
      <i class="el-icon-upload2" />
      上传文件
    </el-button>
  </el-upload>
</template>

<script>
import { fileupload } from '@/api/utils'
export default {
  props: {
    acceptType: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    attachmentList: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否支持预览
    needPreview: {
      type: Boolean,
      default: false
    },
    multipleType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadLoading: false,
      fileList: []
    }
  },
  watch: {
    attachmentList(nv) {
      console.log(nv);
      this.fileList = nv.map(i => {
        i.name = i.name || i.local_file_name
        i.attachment_id = i.id
        return i
      })
    }
  },
  methods: {
    handleUpload(param) {
      var fileData = new FormData()
      fileData.append('file', param.file)
      this.needPreview && fileData.append('need_preview', true)
      this.uploadLoading = true
      fileupload(fileData).then(response => {
        this.$message.success(this.$t('annualTrainPlanInfo.uploadSuccess'))
        this.uploadLoading = false
        response.data.name = param.file.name
        this.fileList.push(response.data)
        this.$emit('input', this.fileList.map(i => i.attachment_id))
      }).catch(() => {
        this.uploadLoading = false
      })
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.$emit('input', this.fileList.map(i => i.attachment_id))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

