<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="'教师信息'"
      @close="handleReturn"
    >
      <el-divider />
      <div v-loading="loading">
        <el-main class="main-position">
          <el-table
            ref="teacherData"
            v-loading="listLoading"
            :data="listTeacher"
            border
            fit
            highlight-current-row
            stripe
            :row-key="getRowKeys"
          >
            <!-- <el-table-column type="selection" width="55" :reserve-selection="true" /> -->
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
          <!-- <p style="lineHeight: 30px">
            当前已推荐教师:
            <span v-for="(teacher, index) in showTeachersListNoRepeat" :key="index" style="margin-left: 5px">
              {{ teacher.name }}
            </span>
          </p> -->
        </el-main>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleReturn">{{
          this.$t("button.cancel")
        }}</el-button>
        <!-- <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="primary"
          @click="handleSubmitForm"
        >{{ this.$t("button.confirm") }}</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPassedTeacherInfo
} from '@/api/municipalEvent/municipalSchoolRegistration'

export default {
  name: 'TeacherListDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    groupSelection: {
      type: Array,
      default: () => {
        return []
      }
    },
    teacherSelection: {
      type: Array,
      default: () => {
        return []
      }
    },
    editId: {
      type: [String, Number],
      default: ''
    },
    showSelect: {
      type: Boolean,
      default: true
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
      this.teacherleCheckSelection = this.teacherSelection
      this.groupCheckSelection = this.groupSelection
      Promise.all([
        getPassedTeacherInfo(this.editId)
      ]).then((res) => {
        this.listTeacher = res[0].data
        this.listParametersTeacher.total = res[0].count
      })
    },
    getList(activeStatus) {
      this.listLoading = true
      getPassedTeacherInfo(
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
    },
    handleReturn() {
      this.$emit('update:visible', false)
      this.clearData()
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
    min-height: 350px;
}
</style>
