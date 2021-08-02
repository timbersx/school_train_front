<!--/*
 * @Name:
 * @Module:
 * @Desc:
 * @Author: shenyj
 * @Date: 2020-08-05
 * @Param:  [Method] [change]  - 选项改变事件
 * @example:
 <et-school-auth-select @change='handleGetStudent'></et-school-auth-select>
*/-->
<template>
  <div>
    <el-select
      v-model="value"
      :placeholder="$t('common.select')"
      class="items"
      filterable
      remote
      value-key="id"
      :remote-method="remoteStudent"
      :loading="loading"
      popper-class="select-pagination"
      @change="handleChange"
    >
      <el-option
        v-for="item in auth_Operations"
        :key="item.id"
        :label="item.nick_name"
        :value="item.id"
      >
        <span>{{ item.nick_name }}</span>
        <span class="select-table-right">{{ item.mobile }}</span>
        <!-- <span class="select-table-right">{{ item.mobile_phone }}</span> -->
      </el-option>
      <!-- <div style="position: sticky;background: #fff;height:30px;top:0;z-index:1">  -->
      <div>
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="dataTotal"
          :page-size="limit"
          class="pagination-container"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-select>
  </div>
</template>
<script>
import { getAuthList, readAuth, getEvaluateObjectTeacherUsers } from '@/api/systemmanage/auth'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    evaluateId: {
      type: Number,
      default: () => {
        return 0
      }
    },
    userId: {
      type: [String, Number],
      default: () => {
        return 0
      }
    }
  },
  data() {
    return {
      value: '',
      auth_Operations: [],
      searchKey: '',
      limit: 10,
      loading: true, // 是否显示loading
      dataTotal: 0,
      listColumns: ['code', 'name', 'id_no', 'mobile_phone'] // 表中显示的列
    }
  },
  watch: {
    userId: {
      handler(newValue, olderValue) {
        if (newValue > 0) {
          Promise.all([readAuth(newValue)]).then(response => {
            // this.dataTotal = 1
            // this.auth_Operations.push(response[0].data)
            this.value = newValue
            this.loading = false
          })
        } else {
          this.value = newValue
          this.loading = false
        }
      },
      deep: true
    },
    evaluateId(id) {
      if (id) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.isEdit) {
        Promise.all([getEvaluateObjectTeacherUsers({ limit: this.limit, offset: 0 })])
          .then(response => {
            this.auth_Operations = response[0].data
            this.dataTotal = response[0].count
            this.loading = false
          })
      } else {
        Promise.all([getAuthList({ limit: this.limit, user_role__code: 'Teacher', offset: 0 })])
          .then(response => {
            this.auth_Operations = response[0].data
            this.dataTotal = response[0].count
            this.loading = false
          })
      }
    },
    remoteStudent(query) {
      if (query !== '') {
        this.searchKey = query
        this.loading = true
      } else {
        this.searchKey = ''
      }
      if (this.isEdit) {
        Promise.all([getEvaluateObjectTeacherUsers({ limit: this.limit, offset: 0, search: this.searchKey })])
          .then(response => {
            this.auth_Operations = response[0].data
            this.dataTotal = response[0].count
            this.loading = false
          })
      } else {
        Promise.all([getAuthList({ limit: this.limit, user_role__code: 'Teacher', offset: 0, search: this.searchKey })])
          .then(response => {
            this.auth_Operations = response[0].data
            this.dataTotal = response[0].count
            if (response[0].data.length === 0) {
              this.init()
              this.searchKey = ''
            }
            this.loading = false
          })
      }
    },
    /* =======翻页事件 begin=======*/
    handleCurrentChange(val) {
      console.log(this.isEdit)
      console.log(val)
      this.loading = true
      if (this.isEdit) {
        Promise.all([getEvaluateObjectTeacherUsers({ limit: this.limit, offset: this.limit * (val - 1) })])
          .then(response => {
            this.auth_Operations = response[0].data
            this.dataTotal = response[0].count
            this.loading = false
          })
      } else {
        Promise.all([getAuthList({ limit: this.limit, user_role__code: 'Teacher', offset: this.limit * (val - 1), search: this.searchKey })])
          .then(response => {
            this.auth_Operations = response[0].data
            this.dataTotal = response[0].count

            this.loading = false
          })
      }
    },
    /* =======翻页事件 end=======*/
    handleChange() {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang='scss'>
.select-pagination {
  .el-scrollbar {
    height: 450px !important;
    .el-scrollbar__wrap {
      overflow: visible !important;
      height: 450px !important;
    }
    .el-scrollbar__bar.is-vertical {
      width: 0px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.select-table-right {
  float: right;
  color: #8492a6;
  font-size: 13px;
  padding-right: 10px;
}
</style>

