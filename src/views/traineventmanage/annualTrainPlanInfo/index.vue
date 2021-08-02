<!--/*
 * @Name: AnnualTrainPlanInfo
 * @Module:  src/views/traineventmanage/annualTrainPlanInfo/index
 * @Desc: AnnualTrainPlanInfo
 * @Author:  automatic code
 * @Date:  2021-01-22 15:10:34
 * @Last Modified by: f
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <!-- 页面跳转保留原页面需要加上👉：cancel-init -->
    <et-control-table
      ref="table"
      :api-method="getAnnualTrainPlanSchoolInfoList"
      :prop-list="propList"
      table-lang-title="annualTrainPlanInfo"
      operations-width="220px"
      :api-object="{ordering: '-id'}"
      show-add-btn
      cancel-init
      @addClick="handleAddClick"
    >
      <template #search="{ form }">
        <el-form-item :label="$t('annualTrainPlanInfo.name')">
          <el-input v-model="form.name__icontains" :placeholder="$t('annualTrainPlanInfo.name')" clearable />
        </el-form-item>
        <el-form-item :label="$t('annualTrainPlanInfo.year')">
          <el-select v-model="form.year__id" filterable clearable :placeholder="$t('annualTrainPlanInfo.year')">
            <el-option v-for="item in yearList" :key="item.id" :label="item.year" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('annualTrainPlanInfo.start_date')">
          <el-date-picker
            v-model="form.start_date__gte"
            :placeholder="$t('annualTrainPlanInfo.start_date')"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item :label="$t('annualTrainPlanInfo.end_date')">
          <el-date-picker
            v-model="form.end_date__lte"
            :placeholder="$t('annualTrainPlanInfo.end_date')"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item :label="$t('annualTrainPlanInfo.status')">
          <el-select v-model="form.status" filterable clearable :placeholder="$t('annualTrainPlanInfo.status')">
            <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
      </template>
      <template #operation="scope">
        <el-button v-if="scope.row.status === 0" type="text" @click="handleEditClick(scope.row)">{{ $t('button.edit') }}</el-button>
        <el-button type="text" @click="handleDetailClick(scope.row)">{{ $t('route.detail') }}</el-button>
        <el-button v-if="scope.row.status === 3" type="text" @click="handleRecheckClick(scope.row)">{{ $t('annualTrainPlanInfo.submitCheck') }}</el-button>
        <el-button v-if="scope.row.status === 0" type="text" @click="handleCheckClick(scope.row)">{{ $t('annualTrainPlanInfo.submitCheck') }}</el-button>
        <el-button v-if="scope.row.status === 0" type="text" style="color: red" @click="handleDeleteClick(scope.row)">{{ $t('button.delete') }}</el-button>
      </template>
    </et-control-table>
  </div>
</template>

<script>
import EtControlTable from '@/components/EtControlTable'
// import store from '@/store'

// import { getOperationsRoute } from '@/utils/operations'
import { getSysconst } from '@/api/utils'
import { getAnnualTrainPlanSchoolInfoList, deleteAnnualTrainPlanInfo, annualTrainPlanSubmitCheck, getAnnualTrainPlanYearList } from '@/api/traineventmanage/annualTrainPlanInfo'
export default {
  components: {
    EtControlTable
  },
  data() {
    return {
      list: [],
      statusList: [],
      flowList: [],
      yearList: [],
      propList: ['name', { name: 'plan_type.name', label: 'plan_type' }, { name: 'year.year', label: 'year' },
        'director', 'funds', 'start_date', 'end_date',
        { label: 'status', format: this.statusFormat }, { label: 'flow', format: this.flowFormat }
      ]
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {
    // 页面跳转保留原页面需要加上👇
    const sessionData = sessionStorage.getItem('pageData')
    if (sessionData) {
      Object.assign(this.$refs.table, JSON.parse(sessionData))
      this.$refs.table.getListData()
    } else {
      this.$refs.table.getListData()
    }
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteEnter(to, from, next) {
    if (!(~from.path.indexOf('/school/annualTrainPlanInfo'))) {
      sessionStorage.removeItem('pageData')
    }
    next()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteLeave(to, from, next) {
    if (~to.path.indexOf('/school/annualTrainPlanInfo')) {
      sessionStorage.setItem('pageData', JSON.stringify({
        apiQueryData: this.$refs.table.apiQueryData,
        listParameters: this.$refs.table.listParameters,
        formInline: this.$refs.table.formInline
      }))
    } else {
      sessionStorage.removeItem('pageData')
    }
    next()
  },
  methods: {
    getAnnualTrainPlanSchoolInfoList,
    init() {
      this.getBtnRouters()
      Promise.all([
        getSysconst('Train_Plan_Check_Status'),
        getSysconst('Train_Plan_Check_Flow'),
        getAnnualTrainPlanYearList({ offset: 0, limit: 10000 })
      ]).then(response => {
        this.statusList = response[0].data
        this.flowList = response[1].data
        this.yearList = response[2].data
      })
    },
    statusFormat(row) {
      const carry = this.statusList.find(i => i.code === row.status)
      if (carry !== undefined) {
        return carry.name
      } else {
        return ''
      }
    },
    flowFormat(row) {
      const carry = this.flowList.find(i => i.code === row.flow)
      if (carry !== undefined) {
        return carry.name
      } else {
        return ''
      }
    },
    yearFormat(row) {
      const carry = this.yearList.find(i => i.id === row.flow)
      if (carry !== undefined) {
        return carry.name
      } else {
        return ''
      }
    },
    getBtnRouters() {
      // const obj = Array.from(this.$store.state.permission.addRoutes) // 路由转换为数组
      // let currentPath = this.$route.fullPath
      //   .substr(this.$route.fullPath.lastIndexOf('/') + 1)
      //   .toLowerCase()
      // const indexOfParams = currentPath.indexOf('?')
      // console.log(this.$route, obj, currentPath, indexOfParams)

      // const currentPath = this.$route.meta.title

      // if (indexOfParams > 0) {
      //   currentPath = currentPath.substr(0, indexOfParams)
      // }
      // this.detailRoute = getOperationsRoute(obj, currentPath, 'detail', true)
      // this.editRoute = getOperationsRoute(obj, currentPath, 'edit', true)
      // this.deleteRoute = getOperationsRoute(obj, currentPath, 'delete', true)
      // if (
      //   JSON.stringify(this.detailRoute) !== '{}' ||
      // JSON.stringify(this.editRoute) !== '{}' ||
      // JSON.stringify(this.deleteRoute) !== '{}'
      // ) {
      //   this.showOperations = true
      // }
    },
    handleAddClick() {
      this.$router.push('/school/annualTrainPlanInfo/add')
    },
    handleEditClick(row) {
      this.$router.push({
        path: '/school/annualTrainPlanInfo/edit',
        query: { tId: row.id }
      })
    },
    handleDetailClick(row) {
      this.$router.push({
        path: '/school/annualTrainPlanInfo/detail',
        query: { tId: row.id }
      })
    },
    handleRecheckClick(row) {
      this.$router.push({
        path: '/school/annualTrainPlanInfo/recheck',
        query: { tId: row.id }
      })
    },
    handleDeleteClick(row) {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        deleteAnnualTrainPlanInfo(row.id).then(() => {
          this.$message.success(this.$t('message.deleteSuccess'))
          this.$refs.table.getListData()
        }).catch(() => {
        })
      })
    },
    handleCheckClick(row) {
      annualTrainPlanSubmitCheck(row.id).then(response => {
        this.$message.success(this.$t('annualTrainPlanInfo.submitSuccess'))
        this.$refs.table.getListData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
