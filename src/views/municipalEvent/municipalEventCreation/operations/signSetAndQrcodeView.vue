<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="$t('trainEventInfo.signSetAndQRCodeView')"
      @close="handleReturn"
      width="800px"
    >
      <el-divider />

      <div v-loading="loading">
        <el-main>
          <el-button
            type="primary"
            size="medium"
            style="margin-bottom: 20px"
            @click="handleAdd"
          >{{ $t("button.add") }}</el-button>
          <el-table
            ref="groupData"
            v-loading="loading"
            :data="list"
            border
            fit
            highlight-current-row
            stripe
          >
            <el-table-column
              prop="start_date"
              :label="$t('trainEventInfo.signUpStartDate')"
            />
            <el-table-column
              prop="end_date"
              :label="$t('trainEventInfo.signUpEndDate')"
            />
            <el-table-column fixed="right" :label="$t('common.operations')" width="260px">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handelQrcodeClick(scope.row)">{{
                  $t("trainEventInfo.QRCode")
                }}</el-button>
                <el-button type="text" size="small" @click="handelEditClick(scope.row)">{{
                  $t("route.edit")
                }}</el-button>
                <el-button type="text" size="small" style="color: red" @click="handelDelClick(scope.row)">{{
                  $t("route.delete")
                }}</el-button>
                <el-button type="text" size="small" @click="handelRecordMaintainClick(scope.row)">{{
                  $t("trainEventInfo.signUpRecordMaintain")
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-sizes="listParameters.pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listParameters.total"
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-main>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleReturn">{{
          this.$t("button.cancel")
        }}</el-button>
        <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="primary"
          @click="handleSubmitForm"
        >{{ this.$t("button.confirm") }}</el-button>
      </div>
    </el-dialog>
    <set-signup-date :visible.sync="setSignupDateDialogVisible" :editId="editId" :editDetailId="editDetailId" @setChange="setSignupChange"/>
    <singup-qrcode :visible.sync="qrcodeDialogVisible" :editDetailId="editDetailId"/>
    <record-maintain :visible.sync="recordMaintainDialogVisible" :editId="editId" :signInId="signInId" :signInstartDate="signInstartDate"/>
  </div>
</template>

<script>
import { getTrainEventSigninInfo, delTrainEventSigninInfo } from "@/api/municipalEvent/municipalEventCreation"
import SetSignupDate from './setSignupDate'
import SingupQrcode from './singupQrcode'
import RecordMaintain from './recordMaintain'

export default {
  name: 'SignSetAndQrcodeView',
  components: { SetSignupDate, SingupQrcode, RecordMaintain },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      list: null,
      formData: {},
      apiQueryData: {},
      setSignupDateDialogVisible: false,
      qrcodeDialogVisible: false,
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      editDetailId: -1,
      signInId: -1,
      recordMaintainDialogVisible: false,
      signInstartDate: ""
    };
  },
  watch: {
    visible(newValue) {
      this.apiQueryData.train_event__id = this.editId
      this.init(newValue)
    }
  },
  methods: {
    // 获取编辑信息
    init() {
      getTrainEventSigninInfo(this.apiQueryData).then((res) => {
        this.list = res.data
        this.listParameters.total = res.count
      })
    },
    getList() {
      this.listLoading = true
      getTrainEventSigninInfo(this.apiQueryData)
        .then((res) => {
          this.list = res.data
          this.listParameters.total = res.count
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleSubmitForm() {
      this.$emit('update:visible', false)
      // this.$emit("chooseTeacherList", {groupSelection: this.groupSelection, teacherleSelection: this.teacherleSelection});
    },
    handleReturn() {
      this.$emit('update:visible', false)
    },
    handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getList()
    },
    handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset =
      this.listParameters.limit * (this.listParameters.page - 1);
      this.getList();
    },
    handleAdd(){
      this.editDetailId = -1
      this.setSignupDateDialogVisible = true
    },
    handelEditClick(row){
      this.editDetailId = row.id;
      this.setSignupDateDialogVisible = true
    },
    handelQrcodeClick(row){
      this.editDetailId = row.id;
      this.qrcodeDialogVisible = true
    },
    handelRecordMaintainClick(row){
      this.signInstartDate = row.start_date;
      this.signInId = row.id;
      this.recordMaintainDialogVisible = true
    },
    handelDelClick(row){
      this.$confirm(this.$t("confirm.delete"), this.$t("confirm.warning"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        type: "warning",
      })
        .then(async () => {
          delTrainEventSigninInfo(row.id).then((response) => {
            this.$message.success(this.$t("message.deleteSuccess"));
            this.getList();
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    setSignupChange() {
      this.setSignupDateDialogVisible = false
      this.getList()
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
