<template>
  <div class="app-container flex">
    <el-card class="left-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span class="wider card-head-title">{{ $t('evaluateProjectInfo.organization') }}</span>
      </div>
      <el-input
        v-model="filterSchoolText"
        style="marginBottom: 15px"
        :placeholder="'搜索学校'"
        clearable
      />
      <el-tree
        ref="schoolTree"
        :data="treeData"
        :props="defaultProps"
        highlight-current
        :filter-node-method="handleFilterNode"
        @node-click="handleNodeClick"
      />

    </el-card>

    <el-card class="right-card">
      <template #header>
        <div class="header-style">
          <span class="wider card-head-title">{{ schoolName || '' }}{{ $t('schoolAdministratorMaintenance.evaluateAdmin') }}</span>
        </div>
      </template>

      <el-form
        :inline="true"
        label-suffix=":"
        :model="formInline"
        class="demo-form-inline"
      >
        <!-- 页眉的搜索部分 -->
        <el-form-item>
          <el-input
            v-model="formInline.search"
            :placeholder="$t('common.searchKey')"
            clearable
          />
        </el-form-item>
        <el-form-item class="searchBtn">
          <el-button
            type="primary"
            @click="handleFilter"
          >{{ $t('button.search') }}</el-button>
        </el-form-item>
        <el-form-item class="searchBtn">
          <el-button
            type="primary"
            @click="addBtnClick"
          >{{ $t('button.edit') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        class="table"
        highlight-current-row
        stripe
      >
        <el-table-column
          :label="$t('login.username')"
          prop="user.username"
        />
        <el-table-column
          :label="$t('common.user')"
          prop="user.nick_name"
        />
      </el-table>
      <el-pagination
        background
        :page-sizes="listParameters.pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listParameters.total"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog
      :visible.sync="editDialogVisible"
      :title="$t('button.edit')"
      width="845px"
    >
      <el-divider />
      <div
        v-loading="transferLoading"
        class="edit-space"
      >
        <el-transfer
          :key="menuKey"
          v-model="transferData"
          :data="valueLeft"
          :titles="['待选', '已选']"
          :props="transferProp"
          filterable
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">{{ $t('button.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="handleSubmitForm"
        >{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getSchoolPositionAdminInfo, getSchoolPositionUserInfo, updateSchoolPositionUserInfo, getSchoolTreeList } from '@/api/systemmanage/schoolAdministrator'
export default {
  data() {
    return {
      // 左侧树
      treeData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      selectedOrg: '',
      // 右侧搜索
      formInline: {},
      schoolName: '',
      // 右侧表格
      list: [],
      apiQueryData: {},
      listLoading: false,
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      // 编辑框(穿梭框)
      editDialogVisible: false,
      transferLoading: false,
      transferProp: { label: 'nick_name', key: 'id' },
      transferData: [],
      valueLeft: [],
      menuKey: 1,
      filterSchoolText: ''
    }
  },
  watch: {
    filterSchoolText(val) {
      this.$refs.schoolTree.filter(val)
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([getSchoolTreeList()]).then(response => {
        this.treeData = response[0].data
      })
    },
    handleNodeClick(data) {
      if (data.children) {
        return false
      }
      this.selectedOrg = data.id
      this.schoolName = data.name
      this.getListData()
    },
    handleFilter() {
      if (!this.selectedOrg) {
        return false
      }
      // 过滤事件
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        search: this.formInline.search
      }
      this.getListData()
    },
    getListData() {
      this.listLoading = true
      const submitData = Object.assign({}, this.apiQueryData)
      submitData.organization__id = this.selectedOrg
      getSchoolPositionAdminInfo(submitData).then(response => {
        this.list = response.data
        this.listParameters.total = response.count
        this.listLoading = false
        // 删除后，当前页面没有数据了，则返回上一页
        if (this.list.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset =
            this.apiQueryData.offset - this.listParameters.limit
          this.getListData()
        }
      })
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
    },
    addBtnClick() {
      if (!this.selectedOrg) {
        return false
      }
      this.editDialogVisible = true
      this.transferLoading = true
      getSchoolPositionUserInfo({ organization: this.selectedOrg }).then(response => {
        console.log(response.data)
        this.valueLeft = response.data.unused.concat(response.data.used)
        this.transferData = response.data.used.map(i => i.id)
        this.transferLoading = false
      }).catch(() => {
        this.transferLoading = false
      })
    },
    handleClose() {
      this.editDialogVisible = false
      this.valueLeft = []
      this.transferData = []
      this.menuKey++
    },
    handleSubmitForm() {
      this.transferLoading = true
      updateSchoolPositionUserInfo({ organization: this.selectedOrg, user_list: this.transferData }).then(() => {
        this.$message.success('保存成功！')
        this.transferLoading = false
        this.handleClose()
        this.handleFilter()
      }).catch(() => {
        this.transferLoading = false
      })
    },
    handleFilterNode(e, data) {
      if (!e) return true
      return data.name.indexOf(e) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.left-card {
  width: 28%;
  margin-right: 20px;
  min-height: calc(100vh - 150px);
}
.right-card {
  width: 72%;
}
.table {
  margin-bottom: 20px;
}
.header-style {
  height: 20px;
}
.red_button {
  color: red;
}
.edit-space {
  padding: 20px;
  display: flex;
  justify-content: center;
}
/deep/ .el-transfer-panel {
  width: 310px;
  height: 400px;
}
/deep/ .el-transfer-panel__list.is-filterable{
  height: 296px;
}
.edit-space /deep/ .el-icon-circle-close {
  transform: translate(950%, 0);
}
</style>
