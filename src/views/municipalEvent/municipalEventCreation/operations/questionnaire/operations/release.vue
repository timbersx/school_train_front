<!--/*
 * @Name: questionnaire release
 * @Module:  src/views/municipalEvent/operations/release
 * @Desc: questionnaire release
 * @Author:  automatic code
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
    :title="$t('table.publish')"
    width="50%"
    :before-close="handleClose"
  >
    <el-divider></el-divider>
    <el-form
      ref="dataForm"
      :loading="loading"
      label-width="150px"
      :model="detailData"
      label-suffix=":"
      class="dialog-form-space"
      v-if="JSON.stringify(detailData) !== '{}'"
      :rules="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('questionnaire.name')">{{detailData.name}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('questionnaire.project')">{{detailData.project.name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('questionnaire.start_date')" prop="start_date">
            <el-date-picker
              v-model=" detailData.start_date "
              :placeholder="$t('common.selectDate')"
              class="itemitem"
              value-format="yyyy-MM-dd"
              @change="dataChanged"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('questionnaire.end_date')" prop="end_date">
            <el-date-picker
              v-model=" detailData.end_date "
              :placeholder="$t('common.selectDate')"
              class="itemitem"
              value-format="yyyy-MM-dd"
              @change="dataChanged"
            />
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

        <!-- <el-col :span="24">
          <el-form-item
            :label="$t('questionnaire.participatingSchool')"
            style="width: 90%"
          >
            <tree-transfer
              :title="[$t('questionnaire.unselect'), $t('questionnaire.selected')]"
              :from_data="usedData"
              :to_data="selectedData"
              :default-props="{label:'name', children: 'eva_objects'}"
              mode="transfer"
              filter
              open-all
              node_key="indexid"
              @addBtn="handleAdd"
              @removeBtn="handleRemove"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ this.$t('button.cancel') }}</el-button>
      <el-button type="primary" @click="hadnleConfirm">{{ $t('button.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>


<script>
import Sticky from "@/components/Sticky";
import { getSysconst } from "@/api/utils";
// import treeTransfer from "el-tree-transfer";
import { getOrganizationInfoList } from '@/api/systemmanage/organizationInfo'
import { paperPublishUpdate } from "@/api/municipalEvent/questionnaire";
export default {
  components: {
    Sticky,
    // treeTransfer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false, //是否显示loading
      formData: {},
      questionnaireTypeList: "",
      usedData: [],
      selectedData: [],
      toData: [],
      rules: {
        start_date: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        end_date: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ]
      },
    };
  },
  watch: {
    visible(newValue) {
      console.log(this.detailData.project.id);
      // this.detailData.questionnaire_objects = [];

      // getOrganizationInfoList(this.detailData.project.id).then((response) => {
      //   const usedDataTemp = response.data.used;
      //   usedDataTemp.map((item, index) => {
      //     item["indexid"] = index + 1
      //     item["pid"] = index;
      //     if (item.eva_objects.length > 0) {
      //       const chItem = item.eva_objects;
      //       chItem.map((chitem, chindex) => {
      //         chitem["pid"] = (index + 1).toString()
      //         chitem["indexid"] = `${index + 1}-${chitem.id}`
      //       });
      //     }
      //   });
      //   const usedDataFilter = usedDataTemp.filter(
      //     (item) => item.eva_objects.length > 0
      //   );
      //   this.usedData = usedDataFilter;
      // });
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    hadnleConfirm() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if(this.detailData.questionnaire_objects.length > 0){
            this.detailData.questionnaire_objects = this.detailData.questionnaire_objects.map(item => item.id)
            paperPublishUpdate(this.detailData.id, this.detailData).then(
            (res) => {
              if (res.message === "success") {
                this.$message.success(this.$t("message.releaseSuccess"));
              }
              this.$emit("updateSave");
            }
          );
          }else{
            this.$message.error(this.$t("message.releaseFiled"));
          }
          
        }
      });
    },
    dataChanged() {
      if (this.detailData.end_date <= this.detailData.start_date) {
        this.$message.error(this.$t("questionnaire.dataNews"));
      }
    },
    handleAdd(fromData, toData, obj) {
      this.detailData.questionnaire_objects = [].concat(
        ...toData.map((item) => {
          return item.eva_objects.map((infoitem) => {
            return infoitem.id;
          });
        })
      );
    },
    handleRemove(fromData, toData, obj) {
      this.detailData.questionnaire_objects = [].concat(
        ...toData.map((item) => {
          return item.eva_objects.map((infoitem) => {
            return infoitem.id;
          });
        })
      );
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
