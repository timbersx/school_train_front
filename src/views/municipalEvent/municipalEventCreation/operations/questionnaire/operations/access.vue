<!--/*
 * @Name: questionnaire access
 * @Module:  src/views/municipalEvent/operations/access
 * @Desc: questionnaire access
 * @Author:  shenyj
 * @Date:  2021-06-21 14:37:00
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <el-dialog
    :visible="visible"
    @close="handleClose"
    :title="$t('questionnaire.access_address')"
    width="50%"
    :before-close="handleClose"
  >
    <el-divider></el-divider>
    <el-form
      ref="dataForm"
      :loading="loading"
      label-width="150px"
      label-suffix=":"
      class="dialog-form-space"
      v-if="JSON.stringify(detailData) !== '{}'"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('questionnaire.access_address')">
            <a :href="detailData.paper_fill_url" target="_blank">{{detailData.paper_fill_url}}</a>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('questionnaire.qrcode_url')">
            <img :src="QRcodeUrl" alt style="width: 150px" />
            <el-button
              style="position: relative; top: -30px"
              @click="handleDownload"
            >{{ $t('questionnaire.downloadQRCode') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ this.$t('button.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>


<script>
import Sticky from "@/components/Sticky";
import { getQuestionnaireQRcode } from "@/api/municipalEvent/questionnaire";

export default {
  components: {
    Sticky
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false, //是否显示loading
      QRcodeUrl: ""
    };
  },
  watch: {
    visible(newValue) {
      getQuestionnaireQRcode(this.detailData.id).then(res => {
        const dataInfo = res;
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(dataInfo);
        reader.onload = e => {
          const result = e.target.result;
          const contentType = dataInfo.type;
          const blob = new Blob([result], { type: contentType });
          this.QRcodeUrl = window.URL.createObjectURL(blob);
        };
      });
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleDownload() {
      var a = document.createElement("a");
      a.download = `${this.$t('paper.qrcode_url')}`;
      a.href = this.QRcodeUrl;
      a.click();
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
