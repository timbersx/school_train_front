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
      listTeacher: [],
      listColumnsTeacher: ['id_card', 'phone'],
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
  // computed: {
  //   showTeachersListNoRepeat() {
  //     const teachers = [...this.teacherleCheckSelection]
  //     this.groupCheckSelection.forEach(item => {
  //       teachers.unshift(...item.teachers.filter(i => teachers.every(j => i.id !== j.id)))
  //     })
  //     return teachers
  //   }
  // },
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
      Promise.all([
        getPassedTeacherInfo(this.editId, { is_pass: true })
      ]).then((res) => {
        this.listTeacher = res[0].data
        this.listParametersTeacher.total = res[0].count
      })
    },
    getList(activeStatus) {
      this.listLoading = true
      this.apiQueryTeacherData.is_pass = true
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
    getRowKeys(row) {
      return row.id
    },
    clearData() {
      this.listTeacher = []
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
