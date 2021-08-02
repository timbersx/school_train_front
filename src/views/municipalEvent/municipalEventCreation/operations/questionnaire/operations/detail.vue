<!--/*
 * @Name: questionnaire detail
 * @Module:  src/views/municipalEvent/operations/detail
 * @Desc: questionnaire detail
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
    :title="$t('route.detail')"
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
        <el-col :span="12">
          <el-form-item :label="$t('questionnaire.name')">{{detailData.name}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('questionnaire.project')">{{detailData.project.name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('questionnaire.start_date')">{{detailData.start_date}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('questionnaire.end_date')">{{detailData.end_date}}</el-form-item>
        </el-col>
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
            >{{ $t('questionnaire.downloadQRCode') }}</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('questionnaire.participatingTeacher')">
            <el-table
              :data="detailData.questionnaire_objects"
              border
              fit
              highlight-current-row
              stripe
            >
              <el-table-column prop="name" :label="$t(`questionnaire.teachgerName`)" />
              <el-table-column prop="school.name" :label="$t(`questionnaire.participatingSchool`)" />
            </el-table>
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
import { getSchoolTypeList } from '@/api/systemmanage/schoolType'

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
    async visible(newValue) {
      // let schoolTypeList = await getSchoolTypeList({ limit: 100000000, offset: 0 })
      // this.detailData.questionnaire_objects = this.detailData.questionnaire_objects.map(item =>
      //   {
      //     item['organization_name'] = schoolTypeList.data.filter(schoolItem => schoolItem.id === item.organization_type)[0].name;
      //     return item
      //   }
      // )

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
