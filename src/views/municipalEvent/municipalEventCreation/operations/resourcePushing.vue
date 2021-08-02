<!--/*
 * @Name: municipalEventCreation resourcePushing
 * @Module:  src/views/municipalEventCreation/resourcePushing
 * @Desc: municipalEventCreation resourcePushing
 * @Author:  shenyj
 * @Date:  2021-06-08 15:23:00
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :title="$t('trainEventInfo.resourcesPushing')"
      width="700px"
      :before-close="handleClose"
      @close="handleClose"
    >
      <el-divider />
      <div class="form-search">
        <el-form
          ref="dataForm"
          v-loading="loading"
          label-width="22px"
          :model="formData"
          label-suffix=":"
          class="clearfix"
        >
          <el-col :span="24" v-if="!isView">
            <el-form-item prop="attachments">
              <et-upload-item v-model="formData.attachments" need-preview class="items" :attachment-list="attachList" :multipleType="true"/>
              <div class="el-upload__tip">允许上传的文件类型Word、Excel、Pdf、图片、TXT、压缩文件</div>
            </el-form-item>
          </el-col>

          <el-col :span="24" style="padding: 0 20px" v-if="resources.length > 0">
              <div v-for="(item, index) in resources" :key="item.id" class="file-content">
                <p>
                <i class="el-icon-document" />
                <span class="">{{ item.local_file_name }}</span>
                <el-button
                    type="text"
                    class="btn-space"
                    :disabled="!item.preview_url"
                    @click="handleReview(item)"
                >预览</el-button>
                <el-button type="text" @click="handleDownload(item)">下载</el-button>
                <el-button type="text" style="color: red" @click="handleDelete(index)" v-if="!isView">删除</el-button>
                </p>
                
                <el-image-viewer :zIndex="99999" v-if="showViewer" :url-list="urlList" :on-close="closeViewer" />
            </div>
          </el-col>
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
import EtUploadItem from '@/components/EtUploadItem'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { downloadAttachment } from '@/api/utils'
import fileDownload from 'js-file-download'
// import { readTrainEventInfo, uploadPreviewMaterials } from "@/api/studyEventManage/studyEventCreate";

export default {
  components: {
    EtUploadItem,
    ElImageViewer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: [String, Number],
      default: ''
    },
    resources: {
      type: Array,
      default() {
        return []
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      formData: {},
      attachList: [],
      showViewer: false,
      urlList: [],
      uploadDialogVisable: false,
      filesId: [],
      // uploadedFile: [],
      uploadedIdList: []
    }
  },
  watch: {
    visible(va) {
      if (va) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      // if(this.resources.length > 0){
      //   this.attachList = this.resources
      // }
      // this.loading = true
      // readTrainEventInfo(this.editId).then(response => {
      //   this.uploadedFile = response.data.preview_materials
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    handleSubmitForm() {
      if(this.formData.attachments){
        this.$emit('attachments', this.formData.attachments.concat(this.resources.map(item => item.id)))
      }else{
        this.$emit('attachments-repeat', this.resources)
      }
        // if(this.formData.attachments){
        //     let attachments = this.formData.attachments
        //     if(this.uploadedFile.length > 0){
        //         let uploadedFile = this.uploadedFile.map(item => item.id)
        //         attachments = uploadedFile.concat(this.formData.attachments)
        //     }
        //     uploadPreviewMaterials(this.editId, {preview_materials: attachments}).then(res => {
        //         this.$emit('update:visible')
        //     })
        // }else{
        //     this.$emit('update:visible')
        // }
    },
    handleClose() {
      this.formData = {}
      this.attachList = []
      this.$emit('update:visible')
    },
    handleDownload(item) {
      downloadAttachment(item.id).then(res => {
        fileDownload(res, item.local_file_name)
      })
    },
    handleDelete(index) {
      this.uploadedFile.splice(index, 1)
    },
    handleReview(item) {
      if (item.preview_url !== null) {
        this.urlList = JSON.parse(item.preview_url).map(item => {
          return item.file_url
        })
        this.showViewer = true
      }
    },
    closeViewer() {
      this.showViewer = false
    }
  }
}
</script>

<style lang='scss' scoped>
.form-search {
  margin-top: 20px;
}
.file-content {
  font-size: 15px;
  line-height: 1;
  height: 1;
}
.file-content p {
    margin: 0;
}
.btn-space {
  margin-left: 20px;
}
</style>
