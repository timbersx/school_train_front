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
        <el-main class="main-position">
          <el-tabs v-model="activeStatus" @tab-click="handleStatusClick">
            <el-tab-pane label="教师组" name="group">
              <el-table
                ref="groupData"
                v-loading="listLoading"
                :data="list"
                border
                fit
                highlight-current-row
                stripe
                :row-key="getRowKeys"
                @selection-change="handleGroupSelectionChange"
              >
                <el-table-column type="selection" width="55" :reserve-selection="true" />
                <el-table-column
                  prop="name"
                  :label="$t('trainEventInfo.teacher_groups')"
                />
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
            </el-tab-pane>
            <el-tab-pane label="教师" name="teacher">
              <el-table
                ref="teacherData"
                v-loading="listLoading"
                :data="listTeacher"
                border
                fit
                highlight-current-row
                stripe
                :row-key="getRowKeys"
                @selection-change="handleTeacherSelectionChange"
              >
                <el-table-column type="selection" width="55" :reserve-selection="true" />
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
                :page-sizes="listParametersTeacher.pageSizes"
                layout="total, sizes, prev, pager, next, jumper"
                :total="listParametersTeacher.total"
                class="pagination-container"
                @size-change="handleSizeTeacherChange"
                @current-change="handleCurrentTeacherChange"
              />
            </el-tab-pane>
          </el-tabs>
          <p style="lineHeight: 30px">
            当前选择教师:
            <span v-for="(teacher, index) in showTeachersListNoRepeat" :key="index" style="margin-left: 5px">
              {{ teacher.name }}
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
        >{{ this.$t("button.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrganizationsTeachers,
  getTeacherGroupInfo,
  registrationTeachers
} from '@/api/municipalEvent/municipalSchoolRegistration'

export default {
  name: 'TeacherListDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    organizations: {
      type: Array,
      default: () => {
        return []
      }
    },
    groupSelection: {
      type: Array,
      default: () => {
        return []
      }
    },
    teacherleSelection: {
      type: Array,
      default: () => {
        return []
      }
    },
    editId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      activeStatus: 'group',
      list: [],
      listTeacher: [],
      listColumnsTeacher: ['id_card', 'phone'],
      formData: {},
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listParametersTeacher: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      groupCheckSelection: [],
      teacherleCheckSelection: [],
      apiQueryTeacherData: {},
      apiQueryData: {},
      listLoading: false
    }
  },
  computed: {
    showTeachersListNoRepeat() {
      const teachers = [...this.teacherleCheckSelection]
      this.groupCheckSelection.forEach(item => {
        teachers.unshift(...item.teachers.filter(i => teachers.every(j => i.id !== j.id)))
      })
      return teachers
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          this.clearData()
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取编辑信息
    init() {
      this.activeStatus = 'group'
      Promise.all([
        getOrganizationsTeachers(this.editId, { organizations: this.organizations.map(item => item.id) }),
        getTeacherGroupInfo(this.editId)
      ]).then((res) => {
        this.list = res[1].data
        this.listParameters.total = res[1].count
        this.listTeacher = res[0].data
        this.listParametersTeacher.total = res[0].count

        if (this.groupSelection.length > 0) {
          this.$nextTick(() => {
            this.groupSelection.forEach((row) => {
              this.$refs.groupData.toggleRowSelection(row, true)
            })
          })
        }
        if (this.teacherleSelection.length > 0) {
          this.$nextTick(() => {
            this.teacherleSelection.forEach((row) => {
              this.$refs.teacherData.toggleRowSelection(row, true)
            })
          })
        }
      })
    },
    getList(activeStatus) {
      this.listLoading = true
      if (activeStatus === 'group') {
        getTeacherGroupInfo(this.editId, this.apiQueryData)
          .then((res) => {
            this.list = res.data
            this.listParameters.total = res.count
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      } else {
        getOrganizationsTeachers(
          this.editId,
          this.apiQueryTeacherData
        )
          .then((res) => {
            this.listTeacher = res.data
            this.listParametersTeacher.total = res.count
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      }
    },
    handleSubmitForm() {
      this.listLoading = true
      registrationTeachers(this.editId, {
        teacher_groups: this.groupCheckSelection.map(i => i.id),
        teachers: this.teacherleCheckSelection.map(i => i.id)
      }).then(() => {
        this.listLoading = false
        this.$message.success('保存成功！')
        this.$emit('update:visible', false)
        this.$emit('save')
        // this.clearData()
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleReturn() {
      this.$emit('update:visible', false)
      // this.clearData()
    },
    handleSelectionChange(val) {
      this.listSelection = val
    },
    handleStatusClick(tab, event) {
      //   this.getList(this.activeStatus);
    },
    handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getList(this.activeStatus)
    },
    handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1)
      this.getList(this.activeStatus)
    },
    handleSizeTeacherChange(val) {
      this.listParametersTeacher.limit = val
      this.apiQueryTeacherData.limit = this.listParametersTeacher.limit
      this.getList(this.activeStatus)
    },
    handleCurrentTeacherChange(val) {
      this.listParametersTeacher.page = val
      this.apiQueryTeacherData.offset =
        this.listParametersTeacher.limit *
        (this.listParametersTeacher.page - 1)
      this.getList(this.activeStatus)
    },
    handleGroupSelectionChange(val) {
      this.groupCheckSelection = val
    },
    handleTeacherSelectionChange(val) {
      this.teacherleCheckSelection = val
    },
    getRowKeys(row) {
      return row.id
    },
    clearData() {
      this.list = []
      this.listTeacher = []
      this.formData = {}
      this.listParameters = {
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        page: 1,
        limit: 10
      }
      this.listParametersTeacher = {
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        page: 1,
        limit: 10
      }
      this.groupCheckSelection = []
      this.teacherleCheckSelection = []
      this.apiQueryTeacherData = {}
      this.apiQueryData = {}
      this.$refs.groupData && this.$refs.groupData.clearSelection()
      this.$refs.teacherData && this.$refs.teacherData.clearSelection()
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-dialog {
  width: 900px;
  position:absolute;
  display: flex;
  flex-direction: column;
  margin:0 !important;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
}
.main-position {
    overflow: auto;
    min-height: 550px;
}
</style>
