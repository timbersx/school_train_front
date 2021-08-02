<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="$t('trainEventInfo.signUpRecordMaintain')"
      @close="handleReturn"
      width="800px"
    >
      <el-divider />
      <el-main class="form-container">
        <el-form
      :inline="true"
      label-suffix=":"
      class="demo-form-inline"
    >
      <el-form-item :label="$t('trainEventSignUpCheck.name')">
        <el-select
          v-model="recordData.teacher"
          :placeholder="$t('common.select')"
          filterable
          value-key="id"
          clearable
        >
          <el-option
            v-for="item in teacher_options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>


      <el-form-item :label="$t('trainEventSignInRecordInfo.sign_in_time')">
        <el-date-picker
          v-model="recordData.sign_in_time"
          type="datetime"
          :placeholder="$t('common.select')"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="primary"
          @click="handleAdd"
          >{{ this.$t("button.add") }}</el-button
        >
        </el-form>
        <el-table
            ref="groupData"
            :data="list"
            border
            fit
            highlight-current-row
            stripe
            v-loading="loading"
          >
            <el-table-column
              prop="teacher.name"
              :label="$t('trainEventSignUpCheck.name')"
            />
            <el-table-column
              prop="sign_in_time"
              :label="$t('trainEventSignInRecordInfo.sign_in_time')"
            />
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="listParameters.pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParameters.total"
            class="pagination-container"
            style="padding-bottom: 0"
          ></el-pagination>
      </el-main>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px">
        <el-button @click="handleReturn">{{
          this.$t("button.cancel")
        }}</el-button>
        <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="primary"
          @click="handleSubmitForm"
          >{{ this.$t("button.confirm") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  schoolCreate,
  trainEventSigninRecordInfo,
  getSignInTeachers
} from "@/api/municipalEvent/municipalEventCreation"
// import { getDataDictItemList } from '@/api/systemmanage/dataDictItem'

export default {
  name: "recordMaintain",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editId: {
      type: Number,
      default: -1,
    },
    signInId: {
      type: Number,
      default: -1,
    },
    signInstartDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false, // 是否显示loading
      list: null,
      listParameters: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10,
      },
      recordData: {},
      teacher_options: []
    };
  },
  watch: {
    visible(newValue) {
      this.init(newValue);
    },
  },
  methods: {
    init() {
      this.$set(this.recordData, 'sign_in_time', this.signInstartDate)
      getSignInTeachers(this.signInId).then(res => {
        this.teacher_options = res.data
      })
      this.getRecordList();
    },
    getRecordList(){
      this.loading = true;
      trainEventSigninRecordInfo({sign_in__id: this.signInId}).then(res => {
        this.list = res.data
        this.listParameters.total = res.count;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    handleSizeChange(val) {
      this.listParameters.limit = val;
      this.apiQueryData.limit = this.listParameters.limit;
      this.getRecordList();
    },
    handleCurrentChange(val) {
      this.listParameters.page = val;
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1);
      this.getRecordList();
    },
    handleReturn() {
      this.recordData = {};
      this.$emit("update:visible", false);
    },
    handleSubmitForm() {
      this.recordData = {};
      this.$emit("update:visible", false);
    },
    handleAdd(){
      schoolCreate({ ...this.recordData,sign_in: this.signInId, train_event: this.editId }).then(res => {
        this.recordData = {};
        this.getRecordList();
      })
    }
  },
};
</script>
<style lang='scss' scoped>
</style>
