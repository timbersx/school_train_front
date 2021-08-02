<!--  -->
<template>
  <div>
    <el-dialog :visible="visible" :title="!isEdit?$t('button.add'):$t('button.edit')" @close="handleReturn">
      <!-- 按钮-->
      <el-divider />

      <div class="form-search">
        <el-main>
          <el-form ref="dataForm" :loading="loading" label-width="150px" :model="formData" label-suffix=":" :rules="rules">

            <el-row>
              <el-col>
                <!-- 上级系统菜单 -->

                <el-form-item :label="$t('route.fatherSystemMenu')" prop="parent">
                  <span v-if="isFather">无</span>
                  <span v-if="!isFather">{{ fatherName }}</span>

                </el-form-item>
              </el-col>
            </el-row>
            <!-- 系统菜单名称 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('route.systemMenuName')" prop="name">
                  <el-input v-model="formData.name" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 代码 11-->
            <el-row>
              <el-col>
                <el-form-item :label="$t('route.code')" prop="code">
                  <el-input v-model="formData.code" type="text" maxlength="100" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 菜单路由 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('route.menuRoute')" prop="component">
                  <el-input v-model="formData.component" maxlength="200" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 菜单文件地址 -->
            <el-row>
              <el-col>
                <el-form-item :label="$t('route.menuLocation')" prop="path">
                  <el-input v-model="formData.path" maxlength="200" class="oneRowItems" />
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-main>
      </div>
      <!-- 与form-search保持同级别 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleReturn">{{ this.$t('button.cancel') }}</el-button>
        <el-button style="margin-left: 10px;" type="primary" @click="handleSubmitForm">{{ this.$t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getResourceTree, postMenuInformation, patchMenuInformation, getMenuList } from '@/api/systemmanage/resourceTree'
// import { getResourceTree, getMenuList, deleteMenuInformation } from '@/api/systemmanage/resourceTree'

export default {
  name: 'AddDialog',
  components: {

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: -1
    },
    isFather: {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    editId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      fatherName: null,
      //   isFather: false,
      treeData: [],
      loading: true,
      formData: {

      },
      rules: {
        name: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        component: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        fill_score: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        },
        { pattern: /^(0\.?\d{0,2}|[1-9]\d*\.?\d{0,2})$/,
          message: this.$t('indicatorInfo.inputRemind'),
          trigger: 'blur'
        }
        ],
        fill_score_assigned: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        fill_score_left: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        survey_score: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        },
        { pattern: /^(0\.?\d{0,2}|[1-9]\d*\.?\d{0,2})$/,
          message: this.$t('indicatorInfo.inputRemind'),
          trigger: 'blur'
        }
        ],
        survey_score_assigned: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        survey_score_left: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }],
        order_no: [{
          required: true,
          message: this.$t('validate.required'),
          trigger: 'blur'
        }]
      }
    }
  },

  computed: {

  },
  watch: {
    visible(newValue) {
      this.visibled()
    }

  },
  created() {
    this.init()
  },
  methods: {
    visibled(){
      // 编辑的菜单,获取相关的数据
      if (this.isEdit) {
        for (var index in this.treeData) {
          if (this.treeData[index].id === this.editId) {
            this.formData = this.treeData[index]
          }
          for (var j in this.treeData[index].children) {
            if (this.treeData[index].children[j].id === this.editId) {
              this.formData = this.treeData[index].children[j]
            }
          }
        }

        this.getFatherName(this.formData.parent_id)
      } else {
        // 渲染上级菜单的数据
        // for (var a in this.treeData) {
        //   if (this.treeData[a].id === this.editId) {
        //     this.formData = this.treeData[a]
        //   }
        //   for (var b in this.treeData[a].children) {
        //     if (this.treeData[a].children[b].id === this.editId) {
        //       this.formData = this.treeData[a].children[b]
        //     }
        //   }
        // }
        // this.getFatherName(this.formData.parent_id)
        this.formData = {}
        // 设置上级菜单的名称
        // this.formData
      }
    },
    // 根据上次菜单的id,获取上级菜单的名称
    getFatherName(id) {
      getMenuList({
        'id': id
      }).then(res => {
        this.fatherName = res.data[0].name
      })
    },
    init() {
      getResourceTree().then(res => {
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].name === '根目录') {
            this.treeData = res.data[index].children
            break
          }
        }
      })

      // 测试是否为一级菜单
    //   测试是否为编辑按钮,渲染数据,根据id
    },
    handleSubmitForm() {
      // 发起请求
      // 判断类型
      if (this.isEdit) {
        // 调用编辑的请求
        patchMenuInformation(this.editId, this.formData).then(() => {
          this.$emit('update')
        })
      } else {
        if (this.isFather) {
          // 新建一级菜单，非叶子菜单
          // 添加一些信息
          this.formData.type = 2
          this.formData.for_system = 0
          this.formData.parent = 1
          postMenuInformation(
            this.formData
          ).then(() => {
            this.$message.success(this.$t('confirm.deleteSucced'))

            this.$emit('update')
          }).catch(() => {
            this.$message.error('失败')
          })
        } else {
          // 新建得是二级菜单
          this.formData.type = 1
          this.formData.for_system = 0
          this.formData.parent = this.id

          postMenuInformation(
            this.formData
          ).then(res => {
            this.$emit('update')
            this.$message.success('成功')
          })
        }
      }
    },
    handleReturn() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang='scss' scoped>
.lastRow{
  margin-bottom: 0px !important;
}

</style>
