<!--/*
 * @Name: TrainEventFundsRecordInfo
 * @Module:  src/views/traineventmanage/trainEventFundsRecordInfo/index
 * @Desc: TrainEventFundsRecordInfo
 * @Author:  automatic code
 * @Date:  2021-02-19 15:10:34
 * @Last Modified by:
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc
 * @Example:
*/-->

<template>
  <div class="app-container">
    <!-- 页面跳转保留原页面需要加上👉：cancel-init -->
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleReturn">{{
        this.$t("button.return")
      }}</el-button>
    </sticky>
    <et-control-table
      ref="table"
      :api-method="getSchoolTrainEventFundsRecordInfoList"
      :api-object="apiObject"
      :prop-list="propList"
      :table-lang-title="pageTitle"
      operations-width="180px"
      cancel-init
      disable-search
      show-index
    >
      <!-- <template #search="{ form }">
        <el-form-item :label="$t('trainEventImplementationRecordInfo.name')">
          <el-input v-model="form.train_event__name__icontains" :placeholder="$t('trainEventImplementationRecordInfo.name')" clearable />
        </el-form-item>
        <el-form-item :label="$t('trainEventImplementationRecordInfo.plan')">
          <el-select v-model="form.train_event__plan__id" filterable clearable :placeholder="$t('trainEventImplementationRecordInfo.plan')">
            <el-option v-for="item in planList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('trainEventImplementationRecordInfo.start_date')">
          <el-date-picker
            v-model="form.train_event__start_date__gte"
            type="datetime"
            :placeholder="$t('trainEventImplementationRecordInfo.start_date')"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item :label="$t('trainEventImplementationRecordInfo.end_date')">
          <el-date-picker
            v-model="form.train_event__end_date__lte"
            type="datetime"
            :placeholder="$t('trainEventImplementationRecordInfo.end_date')"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </template> -->
      <template #attachments="scope">
        <p v-for="item in scope.row.attachments" :key="item.id" type="text"><span class="attach-text" @click="handleAttachClick(item)">{{ item.local_file_name }}</span></p>
      </template>
      <template #operation="scope">
        <el-button type="text" @click="handleEditClick(scope.row)">{{ $t('button.edit') }}</el-button>
        <el-button type="text" @click="handleDetailClick(scope.row)">{{ $t('route.detail') }}</el-button>
        <el-button type="text" style="color: red" @click="handleDeleteClick(scope.row)">{{ $t('button.delete') }}</el-button>
      </template>
    </et-control-table>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import EtControlTable from '@/components/EtControlTable'
import fileDownload from 'js-file-download'
import { downloadAttachment } from '@/api/utils'
// import { getAnnualTrainPlanSchoolInfoList } from '@/api/traineventmanage/annualTrainPlanInfo'
import { getSchoolTrainEventFundsRecordInfoList, deleteSchoolTrainEventFundsRecordInfo } from '@/api/traineventmanage/trainEventFundsRecordInfo'
const pageTitle = 'trainEventFundsRecordInfo'
export default {
  components: {
    Sticky,
    EtControlTable
  },
  data() {
    return {
      pageTitle,
      list: [],
      planList: [],
      propList: [
        { name: 'train_event.name', label: 'train_event' },
        'funds_time', 'funds_location', { name: 'witness', width: '100px' },
        { name: 'attachments', slot: true, width: '290px' }, 'funds_explain'
      ],
      detailRoute: {},
      editRoute: {},
      deleteRoute: {},
      addRoute: {},
      showOperations: false,
      apiObject: {
        ordering: '-id',
        train_event__id: this.$route.query.pId
      }
    }
  },
  created() {
    this.init()
  },
  // 页面跳转保留原页面需要加上👇
  mounted() {
    const sessionData = sessionStorage.getItem('sonPageData')
    if (sessionData) {
      Object.assign(this.$refs.table, JSON.parse(sessionData))
      this.$refs.table.getListData()
    } else {
      this.$refs.table.getListData()
    }
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteEnter(to, from, next) {
    if (!(~from.path.indexOf('checkFundsRecord'))) {
      sessionStorage.removeItem('sonPageData')
    }
    next()
  },
  // 页面跳转保留原页面需要加上👇
  beforeRouteLeave(to, from, next) {
    if (~to.path.indexOf('checkFundsRecord')) {
      sessionStorage.setItem('sonPageData', JSON.stringify({
        apiQueryData: this.$refs.table.apiQueryData,
        listParameters: this.$refs.table.listParameters,
        formInline: this.$refs.table.formInline
      }))
    } else {
      sessionStorage.removeItem('sonPageData')
    }
    next()
  },
  methods: {
    getSchoolTrainEventFundsRecordInfoList,
    init() {
      // Promise.all([
      //   getAnnualTrainPlanSchoolInfoList()
      // ]).then(response => {
      //   this.planList = response[0].data
      // })
      // this.getRoutes()
    },
    handleAddClick() {
      this.$router.push(this.addRoute.path)
    },
    handleEditClick(row) {
      this.$router.push({
        path: '/school/trainEventFundsRecordInfo/edit',
        query: { tId: row.id, pId: row.train_event.id }
      })
    },
    handleDetailClick(row) {
      this.$router.push({
        path: '/school/trainEventFundsRecordInfo/detail',
        query: { tId: row.id, pId: row.train_event.id }
      })
    },
    handleDeleteClick(row) {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        deleteSchoolTrainEventFundsRecordInfo(row.id).then(() => {
          this.$message.success(this.$t('message.deleteSuccess'))
          this.$refs.table.getListData()
        }).catch(() => {
        })
      })
    },
    handleAttachClick(item) {
      downloadAttachment(item.id).then(res => {
        fileDownload(res, item.local_file_name)
      })
    },
    handleReturn() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.attach-text {
  color: #409EFF;
  cursor: pointer;
}
</style>
