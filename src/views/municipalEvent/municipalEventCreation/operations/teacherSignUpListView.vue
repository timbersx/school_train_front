<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="$t('trainEventInfo.enrollList')"
      @close="handleReturn"
    >
      <el-divider />

      <div v-loading="loading">
        <el-main>
          <div class="filter-container" style="float: left">
            <el-input
              v-model="search.teacher__name__contains"
              :placeholder="$t('trainEventInfo.teacherName')"
              clearable
              style="width: 300px; margin-left: 0"
              class="filter-item"
            />

            <el-input
              v-model="search.teacher__id_card__contains"
              :placeholder="$t('trainEventInfo.id_card')"
              clearable
              style="width: 300px; margin-left: 0"
              class="filter-item"
            />

            <el-select
              v-model="search.teacher__school__id"
              class="filter-item"
              clearable
              :placeholder="$t('trainEventInfo.teacherSchool')"
              filterable
            >
              <el-option
                v-for="item in organizations_Operations"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-button
              type="primary"
              icon="el-icon-search"
              class="filter-item"
              style="margin-left: 0"
              @click="handleFilter"
              >{{ $t("button.search") }}</el-button
            >
          </div>

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
              :label="$t(`trainEventInfo.teacherName`)"
            />
            <el-table-column
              prop="teacher.id_card"
              :label="$t(`trainEventInfo.id_card`)"
            />
            <el-table-column
              prop="teacher.phone"
              :label="$t(`trainEventInfo.phone`)"
            />
            <el-table-column
              prop="confirm"
              :label="$t(`trainEventInfo.confirm`)"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.confirm ? "已确认" : "未确认" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="teacher.school.name"
              :label="$t(`trainEventInfo.teacherSchool`)"
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
          ></el-pagination>
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
          >{{ this.$t("button.confirm") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  readTrainEventTeacherInfo,
  getOrganizations,
} from "@/api/municipalEvent/municipalEventCreation"

export default {
  name: "teacherSignUpListView",
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
  },
  data() {
    return {
      loading: false, // 是否显示loading
      list: null,
      formData: {},
      apiQueryData: {},
      listColumns: [],
      setSignupDateDialogVisible: false,
      qrcodeDialogVisible: false,
      listParameters: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10,
      },
      editDetailId: -1,
      organizations_Operations: [],
      search: {}
    };
  },
  watch: {
    visible(newValue) {
      this.apiQueryData.train_event__id = this.editId;
      this.init(newValue);
    },
  },
  methods: {
    // 获取编辑信息
    init() {
      getOrganizations({ limit: 10000, offset: 0 }).then((res) => {
        this.organizations_Operations = res.data;
      });
      readTrainEventTeacherInfo(this.apiQueryData).then((res) => {
        this.list = res.data;
        this.listParameters.total = res.count;
      });
    },
    getList() {
      this.listLoading = true;
      readTrainEventTeacherInfo(this.apiQueryData)
        .then((res) => {
          this.list = res.data;
          this.listParameters.total = res.count;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    handleSizeChange(val) {
      this.listParameters.limit = val;
      this.apiQueryData.limit = this.listParameters.limit;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listParameters.page = val;
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1);
      this.getList();
    },
    handleSubmitForm() {
      this.$emit("update:visible", false);
    },
    handleReturn() {
      this.$emit("update:visible", false);
    },
    handleFilter() {
      //搜索事件，需要根据具体页面查询条件编写
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        ...this.search,
        train_event__id: this.editId
      };
      this.getList();
    },
  },
};
</script>
<style lang='scss' scoped>
/deep/ .el-dialog {
  width: 900px;
}
</style>
