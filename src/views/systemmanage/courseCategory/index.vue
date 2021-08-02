<!--/*
 * @Name: courseCategory
 * @Module:  src/views/systemmanage/courseCategory/index
 * @Desc: courseCategory
 * @Author:  automatic code
 * @Date:  2021-01-22 15:10:34
 * @Last Modified by: f
 * @Last Modified time:
 * @Param: [Type] [Name]  - Desc dancing with me
 * @Example:
*/-->

<template>
  <div class="app-container">
    <et-control-table
      ref="table"
      :api-method="getCourseCategoryList"
      :prop-list="propList"
      :table-lang-title="pageTitle"
      operations-width="190px"
      show-add-btn
      @addClick="handleAddClick"
    >
      <template #search="{ form }">
        <el-form-item :label="$t('courseCategory.name')">
          <el-input v-model="form.name__icontains" :placeholder="$t('courseCategory.name')" clearable />
        </el-form-item>
        <el-form-item :label="$t('courseCategory.code')">
          <el-input v-model="form.code__icontains" :placeholder="$t('courseCategory.code')" clearable />
        </el-form-item>
        <el-form-item :label="$t('courseCategory.status')">
          <el-select v-model="form.status" :placeholder="$t('courseCategory.status')" clearable filterable>
            <el-option label="是" value="true" />
            <el-option label="否" value="false" />
          </el-select>
        </el-form-item>
      </template>
      <template #attachments="scope">
        <p v-for="item in scope.row.attachments" :key="item.id" type="text"><span class="attach-text" @click="handleAttachClick(item)">{{ item.local_file_name }}</span></p>
      </template>
      <template #operation="scope">
        <el-button type="text" @click="handleEditClick(scope.row)">{{ $t('button.edit') }}</el-button>
        <el-button type="text" @click="handleDetailClick(scope.row)">{{ $t('route.detail') }}</el-button>
        <el-button v-if="scope.row.status === false" type="text" @click="handleEnableClick(scope.row)">{{ '启用' }}</el-button>
        <el-button v-if="scope.row.status === true" type="text" @click="handleDisableClick(scope.row)">{{ '禁用' }}</el-button>
        <el-button type="text" style="color: red" @click="handleDeleteClick(scope.row)">{{ $t('button.delete') }}</el-button>
      </template>
    </et-control-table>
    <et-type-dialog
      :visible.sync="dialogVisible"
      :status="dialogStatus"
      :form-data="dialogData"
      :label-list="labelList"
      :type-list="typeList"
      :api-method="apiMethod"
      @save="handleSave"
    />
  </div>
</template>

<script>
import EtTypeDialog from '@/components/EtTypeDialog'
import EtControlTable from '@/components/EtControlTable'
import { getCourseCategoryList, createCourseCategory, updateCourseCategory, deleteCourseCategory } from '@/api/systemmanage/courseCategory'

const pageTitle = 'courseCategory'
export default {
  components: {
    EtControlTable,
    EtTypeDialog
  },
  data() {
    return {
      pageTitle,
      list: [],
      planList: [],
      propList: [
        'name', 'code', 'hours', { name: 'status', format: (row) => row.status ? '是' : '否' }
      ],
      labelList: ['名称', '代码', '最低学时', '是否启用'],
      dialogVisible: false,
      dialogStatus: 'add',
      dialogData: {},
      typeList: [
        { name: 'name', type: 'input', rule: 'required' },
        { name: 'code', type: 'input', rule: 'required' },
        { name: 'hours', type: 'input', rule: 'required' },
        { name: 'status', type: 'radio', rule: 'required', list: [{ name: '是', id: true }, { name: '否', id: false }] }
      ],
      apiMethod: null
    }
  },
  // created() {
  //   this.init()
  // },
  methods: {
    getCourseCategoryList,
    // init() {

    // },
    handleAddClick() {
      this.dialogData = {}
      this.dialogStatus = 'add'
      this.dialogVisible = true
      this.apiMethod = createCourseCategory
    },
    handleEditClick(row) {
      this.dialogData = JSON.parse(JSON.stringify(row))
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      this.apiMethod = updateCourseCategory
    },
    handleDetailClick(row) {
      this.dialogStatus = 'detail'
      this.dialogData = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDeleteClick(row) {
      this.$confirm(this.$t('confirm.delete'), this.$t('confirm.warning'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      })
        .then(async() => {
          deleteCourseCategory(row.id).then((response) => {
            this.$message.success(this.$t('message.deleteSuccess'))
            this.$refs['table'].getListData()
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleEnableClick(row) {
      updateCourseCategory(row.id, { status: true }).then(() => {
        this.$message.success('启用成功!')
        this.$refs['table'].getListData()
      })
    },
    handleDisableClick(row) {
      updateCourseCategory(row.id, { status: false }).then(() => {
        this.$message.success('禁用成功!')
        this.$refs['table'].getListData()
      })
    },
    handleSave() {
      this.$refs['table'].getListData()
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
