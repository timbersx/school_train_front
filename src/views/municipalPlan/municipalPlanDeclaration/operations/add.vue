<template>
  <div class="app-container">
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleSave">{{
        $t("button.save")
      }}</el-button>
      <el-button type="primary" @click="handleCheck">{{
        $t('annualTrainPlanInfo.submitCheck')
      }}</el-button>
      <el-button type="primary" @click="handleReturn">{{
        $t("button.return")
      }}</el-button>
    </sticky>
    <el-form
      ref="form"
      v-loading="Loading"
      :model="form"
      label-width="185px"
      label-suffix=":"
      :rules="rules"
      class="dialog-form-space"
    >
      <el-row :gutter="15">
        <el-col :span="11">
          <el-form-item :label="$t('annualTrainPlanInfo.plan_type')" prop="plan_type">
            <el-select
              v-model="form.plan_type"
              style="width: 100%"
              clearable
              filterable
            >
              <el-option
                v-for="selection in planTypeList"
                :key="selection.id"
                :value="selection.id"
                :label="selection.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('annualTrainPlanInfo.name')" prop="name">
            <el-input v-model="form.name" :placeholder="$t('table.input')" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('annualTrainPlanInfo.year')" prop="year">
            <el-select
              v-model="form.year"
              style="width: 100%"
              clearable
              filterable
            >
              <el-option
                v-for="selection in yearList"
                :key="selection.id"
                :value="selection.id"
                :label="selection.year"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('annualTrainPlanInfo.director')" prop="director">
            <el-input
              v-model="form.director"
              :placeholder="$t('table.input')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('annualTrainPlanInfo.start_date')" prop="start_date">
            <el-date-picker
              v-model="form.start_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('annualTrainPlanInfo.end_date')" prop="end_date">
            <el-date-picker
              v-model="form.end_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <div v-if="isTSPX">
          <el-col v-for="(item, index) in propList" :key="index" :span="index>3 ? 22 : 11">
            <el-form-item :label="$t('annualTrainPlanInfo.'+item)" :prop="item">
              <el-select
                v-if="item == 'plan_category'"
                v-model="form[item]"
                :placeholder="$t('common.select')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in PXLX_Operations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-else
                v-model="form[item]"
                :placeholder="index>3 ? '请输入内容，最多可以输入2048个字' : $t('table.input')"
                :type="index>3 ? 'textarea' : ''"
                :rows="5"
              />
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>
    <el-row v-if="!isTSPX && isTSPX !== ''">
      <div class="upload-position">
        <el-upload
          v-loading="uploadLoading"
          class="upload-demo upload-box"
          drag
          action
          :http-request="handleUpload"
          :accept="acceptType"
          :file-list="fileList"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">{{ $t('annualTrainPlanInfo.clickUpload') }}<em>{{ $t('annualTrainPlanInfo.pdfAndWord') }}</em></div>
        </el-upload>
      </div>
    </el-row>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { getAnnualTrainPlanTypeInfoList, createAnnualTrainPlanInfo, annualTrainPlanSubmitCheck, getAnnualTrainPlanYearList } from '@/api/municipalPlan/municipalPlanDeclaration'
import { fileupload } from '@/api/utils'
import { getDataDictItemList } from '@/api/systemmanage/dataDictItem'

export default {
  components: {
    Sticky
  },
  data() {
    return {
      Loading: false,
      form: {},
      planTypeList: [],
      propList: ['funds', 'organization', 'cooperation_organization', 'plan_category',
        'implementation_background', 'target', 'stage_task', 'organize_type',
        'participants', 'expected_results', 'funds_purpose', 'budget_estimate'
      ],
      uploadLoading: false,
      acceptType: '.pdf, .doc, .docx',
      fileList: [],
      yearList: [],
      isCheck: false
    }
  },
  computed: {
    rules() {
      const rules = this.propList.concat(['plan_type', 'name', 'year', 'director', 'start_date', 'end_date'])
      const valids = {}
      rules.forEach(item => {
        if (typeof item === 'string') {
          valids[item] = [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
        }
      })
      return valids
    },
    isTSPX() {
      if (this.planTypeList.length === 0 || !this.form.plan_type) {
        return ''
      }
      return this.planTypeList.find(i => i.id === this.form.plan_type).type
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleReturn() {
      this.$router.go(-1)
    },
    init() {
      const promisetList = [
        getAnnualTrainPlanTypeInfoList({ limit: 1000, offset: 0 }),
        getAnnualTrainPlanYearList({ limit: 1000, offset: 0 }),
        getDataDictItemList({ type_code: 'XMLB', limit: 1000 })
      ]
      // const indexList = []
      this.Loading = true
      Promise.all(promisetList).then(response => {
        this.planTypeList = response[0].data
        this.yearList = response[1].data
        this.PXLX_Operations = response[2].data
        this.Loading = false
      }).catch(() => { this.Loading = false })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.Loading = true
          const formData = Object.assign({}, this.form)
          let submitData = []
          if (!this.isTSPX) {
            submitData = [{
              plan_type: formData.plan_type,
              name: formData.name,
              year: formData.year,
              director: formData.director,
              attachments: this.fileList.map(i => i.attachment_id),
              start_date: formData.start_date,
              end_date: formData.end_date
            }]
          }
          if (this.isTSPX) {
            submitData = [formData]
          }
          createAnnualTrainPlanInfo(...submitData).then(response => {
            if (this.isCheck) {
              annualTrainPlanSubmitCheck(response.data.id).then(res => {
                this.Loading = false
                this.$message.success(this.$t('message.saveSuccess'))
                this.$router.go(-1)
                this.isCheck = false
              }).catch(() => {
                this.isCheck = false
              })
            } else {
              this.Loading = false
              this.$message.success(this.$t('message.saveSuccess'))
              this.$router.go(-1)
            }
          }).catch(() => {
            this.Loading = false
          })
        } else {
          return false
        }
      })
    },
    handleUpload(param) {
      console.log(param)
      var fileData = new FormData()
      fileData.append('file', param.file)
      fileData.append('need_preview', true)
      this.uploadLoading = true
      fileupload(fileData).then(response => {
        this.$message.success(this.$t('annualTrainPlanInfo.uploadSuccess'))
        this.uploadLoading = false
        response.data.name = param.file.name
        this.fileList.push(response.data)
      })
    },
    handleCheck() {
      this.isCheck = true
      this.handleSave()
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-position {
  width: 450px;
  margin: auto;
}
.upload-position /deep/ .el-upload-dragger {
  width: 450px;
}
</style>
