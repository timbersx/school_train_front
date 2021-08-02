<!--/*
 * @Name: schoolBasedTrainingHome applyhours
 * @Module:  src/views/schoolBasedTeachers/schoolBasedTrainingHome/applyhours
 * @Desc: schoolBasedTrainingHome applyhours
 * @Author:  automatic code
 * @Date:  2021-02-22 16:19:56
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      title="问卷列表"
      width="700px"
      :before-close="handleClose"
      @close="handleClose"
    >
      <el-divider />
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          stripe
        >
          <el-table-column
            v-for="(item, index) in listColumns"
            :key="index"
            :prop="item"
            :label="$t(`questionnaire.${item}`)"
            :formatter="handleFormatter"
          />
          <el-table-column
            fixed="right"
            :label="$t('common.operations')"
            width="350"
          >
            <template slot-scope="scope">
              <el-button :disabled="scope.row.is_filled" @click="handleFillClick(scope.row)" type="text">{{
                scope.row.is_filled ? "已填写" : "填写问卷"
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
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
import { getPaperList } from "@/api/municipalEvent/questionnaire";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    eventId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      listLoading: false, // 是否显示loading
      list: null,
      listColumns: ["name", "project"],
    };
  },
  watch: {
    visible(va) {
      if (va) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      this.listLoading = true;
      getPaperList({ project__id: this.eventId })
        .then((res) => {
          this.listLoading = false;
          this.list = res.data;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleSubmitForm() {
      this.$emit("update:visible");
    },
    handleClose() {
      this.$emit("update:visible");
    },
    handleFormatter(row, column) {
      switch (column.property) {
        case "project":
          return row.project.name;
        case "publish_status":
          return this.publishStatusList.filter(
            item => item.code === row.publish_status
          )[0].name;

        default:
          return row[column.property];
      }
    },
    handleFillClick(row) {
      sessionStorage.setItem('thePaperId', row.id)
      window.open('/paper', '填写问卷', '_blank')
    },
  },
};
</script>

<style lang='scss' scoped>
.form-search {
  margin-top: 20px;
}
</style>
