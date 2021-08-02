<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="$t('trainEventInfo.select_teacher_group')"
      @close="handleReturn"
    >
      <el-divider />

      <div v-loading="loading">
        <el-main>
          <el-tabs v-model="activeStatus" @tab-click="handleStatusClick" ref="teacherTab">
            <el-tab-pane label="教师组" name="group">
              <el-table
                ref="groupData"
                :data="list"
                border
                fit
                highlight-current-row
                @selection-change="handleGroupSelectionChange"
                stripe
                :row-key="getRowKeys"
              >
                <el-table-column type="selection" width="55" :reserve-selection="true" v-if="groupSelection.length == 0"> </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$t('trainEventInfo.teacher_groups')"
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
            </el-tab-pane>
            <el-tab-pane label="教师" name="teacher">
              <el-table
                ref="teacherData"
                :data="listTeacher"
                border
                fit
                highlight-current-row
                @selection-change="handleTeacherSelectionChange"
                stripe
                :row-key="getRowKeys"
              >
                <el-table-column type="selection" width="55" :reserve-selection="true" v-if="teacherleSelection.length == 0"> </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$t(`trainEventInfo.teacherName`)"
                />
                <el-table-column
                  v-for="(item, index) in listColumnsTeacher"
                  :key="index"
                  :prop="item"
                  :label="$t(`trainEventInfo.${item}`)"
                />
                <el-table-column
                  prop="school.name"
                  :label="$t(`trainEventInfo.teacherSchool`)"
                />
              </el-table>
              <el-pagination
                background
                @size-change="handleSizeTeacherChange"
                @current-change="handleCurrentTeacherChange"
                :page-sizes="listParametersTeacher.pageSizes"
                layout="total, sizes, prev, pager, next, jumper"
                :total="listParametersTeacher.total"
                class="pagination-container"
              ></el-pagination>
            </el-tab-pane>
          </el-tabs>
          <p>
            当前选择教师:
            <span v-for="(teacher, index) in showTeachersListNoRepeat" :key="index" style="margin-left: 5px">
              {{teacher.name}}
            </span>
            <!-- <span v-for="(teacher, index) in showTeachersList" :key="index" style="margin-left: 5px">
              {{teacher.name}}
            </span> -->
          </p>
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
  getOrganizationsTeachers,
  getTeacherGroupInfo,
} from "@/api/traineventmanage/trainEventInfo";

export default {
  name: "teacherListDialog",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    organizations: {
      type: Array,
      default: () => {
        return [];
      },
    },
    groupSelection: {
      type: Array,
      default: () => {
        return [];
      },
    },
    teacherleSelection: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isChooseTeacherGroups: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      loading: false, // 是否显示loading
      activeStatus: "group",
      list: [],
      listTeacher: [],
      listColumnsTeacher: ["id_card", "phone"],
      formData: {},
      listParameters: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10,
      },
      listParametersTeacher: {
        total: 0, //数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
        page: 1,
        limit: 10,
      },
      apiQueryData: {
          limit: 0,
          offset: 0,
      },
      apiQueryTeacherData: {
          limit: 0,
          offset: 0,
      },
      groupCheckSelection: [],
      teacherleCheckSelection: [],
      showGroupsTeachersList: [],
      showTeachersList: []
    };
  },
  watch: {
    visible(newValue) {
      this.init(newValue);
      // this.$nextTick(() => {
      //   if(this.isChooseTeacherGroups == 2){
      //     this.activeStatus = 'teacher';
      //     this.$refs.teacherTab.$children[0].$refs.tabs[0].style.display = 'none'
      //   }else{
      //     this.activeStatus = 'group';
      //     this.$refs.teacherTab.$children[0].$refs.tabs[0].style.display = 'inline-block'
      //   }
      // })
    },
  },
  computed: {
    showTeachersListNoRepeat() {
      let showTeachersListNoRepeat = this.showGroupsTeachersList.concat(this.showTeachersList)
      var hash = {};
      let showGroupsTeachersListNoRepeat = showTeachersListNoRepeat.reduce(function (item, next) {
        hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
        return item;
      }, []);
      return showGroupsTeachersListNoRepeat
    }
  },
  methods: {
    // 获取编辑信息
    init() {
      this.activeStatus = "group";
      Promise.all([
        getOrganizationsTeachers({ organizations: this.organizations }),
        getTeacherGroupInfo(),
      ]).then((res) => {
        // this.list = res[1].data;
        this.listParameters.total = res[1].count;
        // this.listTeacher = res[0].data;
        this.listParametersTeacher.total = res[0].count;
        if (this.groupSelection.length > 0) {
          this.$nextTick(() => {
            let showGroupsTeachersList = []
            this.groupSelection.map(item => {
              showGroupsTeachersList.push(item.teachers)
            })
            this.showGroupsTeachersList = [].concat(showGroupsTeachersList.flat(2))
            this.groupSelection.forEach((row) => {
              this.$refs.groupData.toggleRowSelection(row, true);
            });
            this.list = this.groupSelection;
          });
        }else{
          this.list = res[1].data;
        }
        if (this.teacherleSelection.length > 0) {
          this.listTeacher = this.teacherleSelection
          this.$nextTick(() => {
            this.teacherleSelection.forEach((row) => {
              this.$refs.teacherData.toggleRowSelection(row, true);
            });
            this.showTeachersList = this.teacherleSelection
          });
        }else{
          this.listTeacher = res[0].data;
        }
      });
    },
    getList(activeStatus) {
      this.listLoading = true;
      if (activeStatus === "group") {
        getTeacherGroupInfo(this.apiQueryData)
          .then((res) => {
            this.list = res.data;
            this.listParameters.total = res.count;
            this.listLoading = false;
          })
          .catch((err) => {
            this.listLoading = false;
          });
      } else {
        getOrganizationsTeachers(
          { organizations: this.organizations },
          this.apiQueryTeacherData
        )
          .then((res) => {
            this.listTeacher = res.data;
            this.listParametersTeacher.total = res.count;
            this.listLoading = false;
          })
          .catch((err) => {
            this.listLoading = false;
          });
      }
    },
    handleSubmitForm() {
      this.$emit("chooseTeacherList", {
        groupSelection: this.groupCheckSelection,
        teacherleSelection: this.teacherleCheckSelection,
      });
    },
    handleReturn() {
      this.$emit("update:visible", false);
    },
    handleSelectionChange(val) {
      this.listSelection = val;
    },
    handleStatusClick(tab, event) {
      //   this.getList(this.activeStatus);
    },
    handleSizeChange(val) {
      this.listParameters.limit = val;
      this.apiQueryData.limit = this.listParameters.limit;
      this.getList(this.activeStatus);
    },
    handleCurrentChange(val) {
      this.listParameters.page = val;
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1);
      this.getList(this.activeStatus);
    },
    handleSizeTeacherChange(val) {
      this.listParametersTeacher.limit = val;
      this.apiQueryTeacherData.limit = this.listParametersTeacher.limit;
      this.getList(this.activeStatus);
    },
    handleCurrentTeacherChange(val) {
      this.listParametersTeacher.page = val;
      this.apiQueryTeacherData.offset =
        this.listParametersTeacher.limit *
        (this.listParametersTeacher.page - 1);
      this.getList(this.activeStatus);
    },
    handleGroupSelectionChange(val) {
      this.groupCheckSelection = val;
      let showGroupsTeachersList = []
      val.map(item => {
        showGroupsTeachersList.push(item.teachers)
      })
      showGroupsTeachersList = [].concat(showGroupsTeachersList.flat(2))
      this.showGroupsTeachersList = showGroupsTeachersList
      // let showGroupsTeachersListConact = showGroupsTeachersList.concat(this.showTeachersList)

      // var hash = {};
      // let showGroupsTeachersListNoRepeat = showGroupsTeachersListConact.reduce(function (item, next) {
      //   hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
      //   console.log(item);
      //   return item;
      // }, []);
      // this.showGroupsTeachersList = showGroupsTeachersListNoRepeat;
      // this.showTeachersList = [];
    },
    handleTeacherSelectionChange(val) {
      let showTeachersList = []
      this.teacherleCheckSelection = val;
      this.showTeachersList = val;

      // showTeachersList = val.concat(this.showGroupsTeachersList) 
      // var hash = {};
      // console.log(showTeachersList);
      // let showTeachersListNoRepeat = showTeachersList.reduce(function (item, next) {
      //   hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
      //   return item;
      // }, []);
      // this.showTeachersList = showTeachersListNoRepeat
      // this.showGroupsTeachersList = []
    },
    getRowKeys(row) {
      return row.id
    },
  },
};
</script>
<style lang='scss' scoped>
/deep/ .el-dialog {
  width: 900px;
}
</style>
