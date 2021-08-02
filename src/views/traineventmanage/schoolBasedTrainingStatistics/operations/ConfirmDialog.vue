<template>
  <div>
    <el-dialog :visible.sync="visible" width="60%" :before-close="handleClose" :title="'教师信息'">
      <el-divider />
      <div class="table-style">
        <el-table
          v-loading="loading"
          stripe
          :data="list"
          border
          highlight-current-row
          fit
        >
          <el-table-column :label="'教师姓名'" prop="teacher.name" />
          <el-table-column :label="'身份证号'" prop="teacher.id_card" />
          <el-table-column :label="'电话'" prop="teacher.phone" />
          <el-table-column :label="'确认状态'" prop="confirm" :formatter="(row)=>row.confirm?'是':'否'" />
          <el-table-column :label="'所属学校'" prop="teacher.school.name" />
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
      </div>

      <template #footer>
        <el-button @click="handleClose">{{ $t('button.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getSchoolBaseTrainTeacherList } from '@/api/traineventmanage/schoolBasedTrainingStatistics'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    apiId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      apiQueryData: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.reset()
        this.apiId && this.init()
      }
    }
  },
  methods: {
    init() {
      this.getListData()
    },
    reset() {
      this.list = []
      this.listParameters = {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      }
      this.apiQueryData = {}
    },
    getListData() {
      this.loading = true
      getSchoolBaseTrainTeacherList(this.apiId, this.apiQueryData).then(response => {
        this.list = response.data
        this.listParameters.total = response.count
        this.loading = false
        // 删除后，当前页面没有数据了，则返回上一页
        if (response.data.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset = (Math.ceil(this.listParameters.total / this.listParameters.limit) - 1) * this.listParameters.limit
          this.getListData()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleClose() {
      this.$emit('update:visible')
    },
    handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getListData()
    },
    handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset = this.listParameters.limit * (this.listParameters.page - 1)
      this.getListData()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-style {
  margin: 20px;
}
/deep/ .el-dialog {
    .el-dialog__body {
      max-height: 560px !important;
      min-height: 100px;
      overflow-y: auto;
    }
  }
</style>
