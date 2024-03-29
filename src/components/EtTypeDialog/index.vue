<!--/*
 * @Name:
 * @Module:
 * @Desc:
 * @Author: fan
 * @Date: 2020-11-11 10:09:22
 * @Last Modified by: fan
 * @Last Modified time: 2020-11-11 10:09:22
 *
 * @example:
     typeList: [
        { name: 'name', type: 'input', rule: 'required' },
        { name: 'code', type: 'input', rule: 'required' },
        { name: 'hours', type: 'input', rule: 'required' },
        {
          name: 'status', type: 'radio', rule: 'required',
          listApi: (defaultquery={offset: 0, limit: 1000}) => getAuthList(defaultquery),
          listProp: { name: 'label', id: 'id' }
        }
      ]
*/-->
<template>
  <el-dialog
    :visible.sync="visible"
    :title="formTitle"
    :before-close="handleClose"
  >
    <el-divider />
    <el-form
      ref="form"
      v-loading="Loading"
      :model="form"
      :label-width="labelWidth"
      label-suffix=":"
      :rules="rules"
      class="dialog-form-space"
    >
      <el-row>
        <el-col v-for="(item, index) in typeList" :key="index" :span="tableSpan">
          <el-form-item v-if="status==='detail'" :label="labelList[index]">
            {{ detailValue(item, form) }}
          </el-form-item>
          <el-form-item v-else-if="item.type==='input'" :label="labelList[index]" :prop="item.name">
            <el-input v-model="form[item.name]" :placeholder="$t('table.input')" />
          </el-form-item>
          <el-form-item v-else-if="item.type==='numberinput'" :label="labelList[index]" :prop="item.name">
            <el-input v-model.number="form[item.name]" :placeholder="$t('table.input')" />
          </el-form-item>
          <el-form-item v-else-if="item.type==='radio'" :label="labelList[index]" :prop="item.name">
            <el-radio v-for="radio in item.list" :key="radio.id" v-model="form[item.name]" :label="item.listprop ? radio[item.listprop.id] : radio.id">{{ item.listprop ? radio[item.listprop.name] : radio.name }}</el-radio>
          </el-form-item>
          <el-form-item v-else-if="item.type==='select'" :label="labelList[index]" :prop="item.name">
            <el-select v-model="form[item.name]" style="width: 100%" clearable filterable>
              <el-option v-for="selection in item.list" :key="selection.id" :value="item.listprop ? selection[item.listprop.id] : selection.id" :label="item.listprop ? selection[item.listprop.name] : selection.name" />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="item.type==='upload'" :label="labelList[index]" :prop="item.name" class="attachment">
            <et-upload-item v-model="form[item.name]" :attachment-list="formData[item.name] || []" style="width: 80%" />
          </el-form-item>
          <el-form-item v-else-if="item.type==='richtext'" :label="labelList[index]" :prop="item.name" class="attachment">
            <tinymce v-model="content" :height="300" width="95%" />
          </el-form-item>
          <el-form-item v-else-if="item.type==='selfdefine'" :label="labelList[index]" :prop="item.name">
            <v-slot name="selfdefine" :form="form" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">{{ status!=='detail' ? $t('button.cancel') : '关闭' }}</el-button>
      <el-button v-if="status!=='detail'" type="primary" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
      <slot name="footer" />
    </div>
  </el-dialog>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import EtUploadItem from '@/components/EtUploadItem'

export default {
  components: {
    Tinymce,
    EtUploadItem
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'add'
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    labelList: {
      type: Array,
      default() {
        return []
      }
    },
    // {name, type, rule, list, listApi}
    typeList: {
      type: Array,
      default() {
        return []
      }
    },
    apiMethod: {
      type: Function,
      default: null
    },
    labelWidth: {
      type: String,
      default: '120px'
    }
  },
  data() {
    return {
      Loading: false,
      form: {},
      rules: {},
      submitId: '',
      hasList: false
    }
  },
  computed: {
    formTitle() {
      switch (this.status) {
        case 'add':
          return '新增'
        case 'edit':
          return '编辑'
        case 'detail':
          return '详情'
        default:
          return '新增'
      }
    },
    tableSpan() {
      if (this.status === 'detail') {
        return 11
      } else {
        return 22
      }
    },
    detailValue() {
      return function(item, form) {
        if (item.list && item.list.length > 0 && item.listprop) {
          return form[item.name] === undefined ? '' : item.list.find(i => i[item.listprop.id] === form[item.name])[item.listprop.name]
        }
        if (item.list && item.list.length > 0 && !item.listprop) {
          return form[item.name] === undefined ? '' : item.list.find(i => i.id === form[item.name]).name
        }
        return form[item.name]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          if (this.status === 'edit' || this.status === 'detail') {
            this.$refs['form'] && this.$refs['form'].clearValidate()
            this.handleFormatForm()
          }
          this.handleFormatApi()
        })
      }
    }
  },
  created() {
    this.handleFormatRule()
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      if (this.status === 'edit') {
        this.form = {}
        this.$refs['form'].resetFields()
      }
      if (this.status === 'detail') {
        this.form = {}
      }
    },
    handleCancle() {
      this.$emit('update:visible', false)
      if (this.status === 'detail') {
        this.form = {}
        return false
      }
      this.$refs['form'].resetFields()
      this.form = {}
    },
    handleConfirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.Loading = true
          let submitData = []
          if (this.status === 'edit') {
            submitData = [this.submitId, this.form]
          } else {
            submitData = [this.form]
          }
          this.apiMethod(...submitData).then(response => {
            this.$emit('update:visible', false)
            this.$emit('save', response)
            this.Loading = false
            this.$message.success(this.$t('message.saveSuccess'))
            this.$refs['form'].resetFields()
            this.form = {}
          }).catch(() => {
            this.Loading = false
            this.$emit('update:visible', false)
            this.Loading = false
            this.$refs['form'].resetFields()
            this.form = {}
          })
        } else {
          return false
        }
      })
    },
    handleFormatForm() {
      if (this.status === 'detail' || this.status === 'edit') {
        const formObj = {}
        this.submitId = this.formData.id
        this.typeList.forEach(item => {
          if (Object.prototype.toString.call(this.formData[item.name]) === '[object Object]' && !item.listprop) {
            formObj[item.name] = this.formData[item.name].id
          } else if (Object.prototype.toString.call(this.formData[item.name]) === '[object Object]' && item.listprop) {
            formObj[item.name] = this.formData[item.name][item.listprop.id]
          } else {
            formObj[item.name] = this.formData[item.name]
          }
        })
        this.form = formObj
      }
    },
    handleFormatRule() {
      const rules = this.typeList.filter(item => (item.rule))
      const valids = {}
      rules.forEach(item => {
        if (typeof item.rule === 'string') {
          switch (item.rule) {
            case 'required':
              valids[item.name] = [{ required: true, message: this.$t('validate.required') }]
              break
            case 'number':
              valids[item.name] = [{ type: 'number', message: this.$t('validate.requireNumber') }]
              break
            default:
              break
          }
        }
        if (Array.isArray(item.rule)) {
          valids[item.name] = []
          item.rule.forEach(value => {
            switch (value) {
              case 'required':
                valids[item.name].push({ required: true, message: this.$t('validate.required') })
                break
              case 'number':
                valids[item.name].push({ type: 'number', message: this.$t('validate.requireNumber') })
                break
              default:
                break
            }
          })
        }
      })
      this.rules = valids
    },
    handleFormatApi() {
      if (this.hasList) {
        return false
      } else {
        const promisetList = []
        const indexList = []
        this.typeList.forEach((item, index) => {
          if (item.listapi) {
            promisetList.push(item.listapi())
            indexList.push(index)
          }
        })
        this.Loading = true
        // 如果Promise.all中的数组是空，也会直接进入完成状态
        Promise.all(promisetList).then(response => {
          response.forEach((item, index) => {
            this.$set(this.typeList[indexList[index]], 'list', response[index].data)
          })
          this.Loading = false
        }).catch(() => { this.Loading = false })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fill {
  font-size: 18px;
  font-weight: bold;
}

// .add_score /deep/ .el-dialog__body {
//   padding: 30px 0;
// }
// .inner_dialog /deep/ .el-dialog__body {
//   padding: 30px 0;
// }
.blackline {
  height: 10px;
  border-top: solid #e9e9e9 1px;
}
label.el-radio {
  margin: 0 50px 0 0;
}
.fill_type {
  margin-top: 20px;
}
.red_button {
  color: red;
}
</style>
