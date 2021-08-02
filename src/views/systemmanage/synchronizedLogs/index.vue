<template>
  <div class="app-container">
    <el-card class="box-card">
      <div v-loading="loadingSync">
        <span class="big-font">{{ $t('synchronizedLogs.chooseType') }}</span>
        <el-select
          v-model="selectCategory"
          style="width: 25%"
          clearable
          filterable
        >
          <el-option
            v-for="item in syncUserTypeList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          />
        </el-select>
        <el-button
          v-for="(item, index) in syncTypeList"
          :key="item.code"
          type="primary"
          :disabled="disableBtn"
          :class="{ 'sync-btn-left': index === 0 }"
          @click="handleSyncClick(item)"
        >{{ item.name + $t('synchronizedLogs.syncBase') }}</el-button>
      </div>

      <el-divider class="line-cut" />
      <et-table-generate
        ref="table"
        :api-method="getSyncUpdateLogList"
        :api-object="{ ordering: '-start_time' }"
        :label-list="labelList"
        show-operations
        :prop-list="propList"
        operations-width="80"
      >
        <template #search="scope">
          <el-form-item :label="$t('synchronizedLogs.type')">
            <el-select v-model="scope.form.type" clearable filterable>
              <el-option
                v-for="item in syncUserTypeList"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('synchronizedLogs.sync_type')">
            <el-select v-model="scope.form.sync_type" clearable filterable>
              <el-option
                v-for="item in syncTypeList"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </template>
        <template #operation="scope">
          <el-button
            type="text"
            :disabled="scope.row.status"
            @click="handleDetailClick(scope.row)"
          >{{ $t('route.detail') }}</el-button>
        </template>
      </et-table-generate>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="$t('route.detail')">
      <el-divider />
      <div class="dialog-container">
        <el-form :model="formData" label-suffix=":">
          <el-col :span="12">
            <el-form-item
              v-if="formData && formData.hasOwnProperty('total_create_count')"
              :label="$t('synchronizedLogs.createNumber')"
            >{{ formData.total_create_count }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="formData && formData.hasOwnProperty('total_update_count')"
              :label="$t('synchronizedLogs.updateNumber')"
            >{{ formData.total_update_count }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="formData && formData.hasOwnProperty('error_message')"
              :label="$t('synchronizedLogs.errMessage')"
            >{{ formData.error_message }}</el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t('button.close')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EtTableGenerate from '@/components/EtTableGenerate'
import { getSysconst } from '@/api/utils'
import { getSyncUpdateLogList, createSyncTeacherInfo } from '@/api/systemmanage/synchronizedLogs'
export default {
  components: {
    EtTableGenerate
  },
  data() {
    const typeFormat = (row) => {
      const list = this.syncUserTypeList.filter(item => item.code === row.type)
      if (list.length === 0) {
        return ''
      } else {
        return list[0].name
      }
    }
    const syncTypeFormat = (row) => {
      const list = this.syncTypeList.filter(item => item.code === row.sync_type)
      if (list.length === 0) {
        return ''
      } else {
        return list[0].name
      }
    }
    const resultFormat = (row) => {
      if (row.status) {
        return ''
      }
      return row.result ? '成功' : '失败'
    }

    return {
      selectCategory: '',
      syncUserTypeList: [],
      syncTypeList: [],
      labelList: [
        this.$t('synchronizedLogs.type'), this.$t('synchronizedLogs.status'),
        this.$t('synchronizedLogs.result'), this.$t('synchronizedLogs.sync_type'),
        this.$t('synchronizedLogs.start_time'), this.$t('synchronizedLogs.end_time')
      ],
      propList: [
        { name: 'type', format: typeFormat },
        { name: 'status', format: (row) => row.status ? '是' : '否', width: '150px' },
        { name: 'result', format: resultFormat, width: '150px' },
        { name: 'sync_type', format: syncTypeFormat, width: '150px' }, 'start_time', 'end_time'
      ],
      loadingSync: false,
      dialogVisible: false,
      formData: {}
    }
  },
  computed: {
    disableBtn() {
      return this.selectCategory === ''
    }
  },
  created() {
    Promise.all([getSysconst('Sync_User_Type'), getSysconst('Sync_Type')]).then(response => {
      this.syncUserTypeList = response[0].data
      this.syncTypeList = response[1].data
    })
  },
  methods: {
    getSyncUpdateLogList,
    handleSyncClick(item) {
      this.loadingSync = true
      createSyncTeacherInfo({ sync_type: item.code, type: this.selectCategory }).then(response => {
        this.loadingSync = false
        this.$message.success(response.data)
        setTimeout(() => {
          this.$refs.table.getListData()
        }, 1000)
      }).catch(() => {
        this.loadingSync = false
      })
    },
    handleDetailClick(row) {
      this.dialogVisible = true
      this.formData = row.sync_info
    }
  }
}
</script>

<style lang="scss" scoped>
.big-font {
  font-size: 1.2em;
  font-weight: 600;
}
.sync-btn-left {
  margin-left: 20px;
}
.line-cut {
  margin: 20px 0;
}
.dialog-container {
  padding: 20px 20px 20px 40px;
}
</style>
