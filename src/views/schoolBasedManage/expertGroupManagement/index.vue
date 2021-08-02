<!--/*
 * @Name: expert group management
 * @Module:  src/views/schoolBasedManage/expertGroupManagement/index
 * @Desc: expert group management
 * @Author: yf
 * @Date: 2021-1-27
 * @Param: [Null] [Null]  - Desc Null
 * @example:
*/-->

<template>
  <div class="app-container">
    <el-form
      :inline="true"
      label-suffix=":"
      class="demo-form-inline"
    >
      <el-form-item :label="$t('expertGroupManagement.name')">
        <el-input
          v-model="searchKey"
          :placeholder="$t('expertGroupManagement.name')"
          style="width: 300px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="filter-item"
          @click="handleFilter"
        >{{ $t("button.search") }}</el-button>
        <el-form-item>
          <et-button-list @btnListClick="handleBtnClick" />
        </el-form-item>
      </el-form-item>

    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      stripe
    >
      <el-table-column label="序号" width="50">
        <template
          slot-scope="scope"
        ><span>{{
          scope.$index +
            (listParameters.page - 1) * listParameters.limit +
            1
        }}
        </span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in listColumns"
        :key="index"
        :prop="item"
        :label="$t(`expertGroupManagement.${item}`)"
        :formatter="handelFormatter"
      />

      <el-table-column
        fixed="right"
        :label="$t('common.operations')"
        width="130"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleEditClick(scope.row)"
          >{{ $t("route.edit") }}</el-button>
          <el-button
            type="text"
            style="color: red"
            @click="handleDeleteClick(scope.row)"
          >{{ $t("route.delete") }}</el-button>
        </template>
      </el-table-column>
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
</template>

<script>
import {
  getExpertGroupInfo,
  delExpertGroupInfo
} from '@/api/schoolBasedManage/expertGroupManagement'
import EtButtonList from '@/components/EtButtonList'
import { getOperationsRoute } from '@/utils/operations'

export default {
  components: {
    EtButtonList
  },
  data() {
    return {
      showOperations: false, // 是否显示操作列
      detailRoute: {}, // 操作列详情
      editRoute: {}, // 操作列编辑
      deleteRoute: {}, // 操作列删除
      searchKey: '',
      list: null, // table数据
      listLoading: true, // 是否显示loading
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
      listColumns: ['name', 'educations', 'experts'], // 表中显示的列
      apiQueryData: {}
    }
  },
  created() {
    const obj = Array.from(this.$store.state.permission.addRoutes) // 路由转换为数组
    let currentPath = this.$route.fullPath
      .substr(this.$route.fullPath.lastIndexOf('/') + 1)
      .toLowerCase() // 当前路由的最后字符内容
    const indexOfParams = currentPath.indexOf('?')
    if (indexOfParams > 0) {
      currentPath = currentPath.substr(0, indexOfParams)
    }
    this.detailRoute = getOperationsRoute(obj, currentPath, 'detail', true)
    this.editRoute = getOperationsRoute(obj, currentPath, 'edit', true)
    this.deleteRoute = getOperationsRoute(obj, currentPath, 'delete', true)

    if (
      JSON.stringify(this.detailRoute) !== '{}' ||
      JSON.stringify(this.editRoute) !== '{}' ||
      JSON.stringify(this.deleteRoute) !== '{}'
    ) {
      this.showOperations = true
    }
    this.getListData()
  },
  methods: {
    handleEditClick(row) {
      // 如有编辑的路由则转向eidt页面
      if (this.editRoute !== {}) {
        this.$router.push({
          path: this.editRoute.path,
          query: { id: row.id }
        })
      }
    },
    handleDeleteClick(row) {
      // 如有删除的路由则弹出删除提示框并调用删除接口删除
      if (this.deleteRoute !== {}) {
        this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
          .then(async() => {
            delExpertGroupInfo(row.id).then((response) => {
              this.$message.success(this.$t('message.deleteSuccess'))
              this.getListData()
            })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    getListData() {
      this.listLoading = true
      getExpertGroupInfo(this.apiQueryData).then((response) => {
        this.list = response.data
        this.listParameters.total = response.count
        this.listLoading = false
        // 删除后，当前页面没有数据了，则返回上一页
        if (this.list.length <= 0 && this.listParameters.total > 0) {
          this.apiQueryData.offset = (Math.ceil(this.listParameters.total / this.listParameters.limit) - 1) * this.listParameters.limit
          this.getListData()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      // 过滤事件
      this.apiQueryData = {
        limit: this.listParameters.limit,
        offset: this.listParameters.limit * (this.listParameters.page - 1),
        search: this.searchKey
      }
      this.getListData()
    },
    /* =======搜索事件 end=======*/

    /* =======翻页事件 begin=======*/
    handleSizeChange(val) {
      this.listParameters.limit = val
      this.apiQueryData.limit = this.listParameters.limit
      this.getListData()
    },
    handleCurrentChange(val) {
      this.listParameters.page = val
      this.apiQueryData.offset =
        this.listParameters.limit * (this.listParameters.page - 1)
      this.getListData()
    },
    /* =======翻页事件 end=======*/
    handleBtnClick(btnItem) {
      this[`${btnItem.meta.title}BtnClick`](btnItem)
    },
    addBtnClick(item) {
      this.$router.push({ path: item.path })
    },
    handelFormatter(row, column) {
      switch (column.property) {
        case 'name':
          return row.name.name
        case 'educations': {
          const educations = []
          row.educations.map((item, index) => {
            if (index === 0) {
              educations.push(item.nick_name)
            } else {
              educations.push(',' + item.nick_name)
            }
          })
          return educations
        }
        case 'experts': {
          const experts = []
          row.experts.map((item, index) => {
            if (index === 0) {
              experts.push(item.nick_name)
            } else {
              experts.push(',' + item.nick_name)
            }
          })
          return experts
        }
        default:
          return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss">
.el-table .warning-row {
  background: #f5c0c0;
}
</style>
