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
          <el-tabs v-model="activeStatus" @tab-click="handleStatusClick">
            <el-tab-pane label="教师组" name="group">
              <el-table
                ref="groupData"
                :data="list"
                border
                fit
                highlight-current-row
                stripe
                :row-key="getRowKeys"
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
  getTeacherGroupInfo
} from '@/api/traineventmanage/trainEventInfo'

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
      teacherleCheckSelection: []
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.init()
      }
    }
  },
  methods: {
    // 获取编辑信息
    init() {
      this.activeStatus = 'group'
      Promise.all([
        getOrganizationsTeachers({ organizations: this.organizations.map(item => item.id) }),
        getTeacherGroupInfo()
      ]).then((res) => {
        this.list = res[1].data
        this.listTeacher = res[0].data
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
        getTeacherGroupInfo(this.apiQueryData)
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
          { organizations: this.organizations },
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
      this.$emit('chooseTeacherList', {
        groupSelection: this.groupCheckSelection,
        teacherleSelection: this.teacherleCheckSelection
      })
    },
    handleReturn() {
      this.$emit('update:visible', false)
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
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-dialog {
  width: 900px;
}
</style>
