<!--/*
 * @Name: TrainPlanCheckInfo edit
 * @Module:  src/views/trainPlanCheckInfo/operations/edit
 * @Desc: TrainPlanCheckInfo edit
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class='app-container' v-loading='loading'>
      <sticky :z-index='10' class-name='sub-navbar' style='margin-bottom: 20px;'>
          <el-button
              :loading='loading'
              style='margin-left: 10px;'
              type='primary'
              @click='handleSubmitForm'
          >{{this.$t('button.save')}}</el-button>
          <el-button
              type='primary'
              @click='handleReturn'
          >{{this.$t('button.return')}}</el-button>
      </sticky>
      <el-container  class='form-container'>
      <el-main>
      <el-form
          ref='dataForm'
          :loading='loading'
          label-width='150px'
          :model='formData'
          label-suffix=':'
          :rules='rules'
      >
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.plan')" prop='plan'>
                  <el-select v-model='formData.plan' class='items' :placeholder="$t('common.select')" filterable value-key='id'>
                      <el-option v-for='item in plan_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.status')" prop='status'>
                  <el-input v-model='formData.status' type='number' class='items'></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.check_time')" prop='check_time'>
                  <el-date-picker v-model='formData.check_time' type='datetime' :placeholder="$t('common.selectDateTime')" class='items' value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.current_check_status')" prop='current_check_status'>
                  <el-switch v-model='formData.current_check_status'></el-switch>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.user')" prop='user'>
                  <el-select v-model='formData.user' class='items' :placeholder="$t('common.select')" filterable value-key='id'>
                      <el-option v-for='item in user_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.approve_comment')" prop='approve_comment'>
                  <el-input v-model='formData.approve_comment' type='text' maxlength='512' class='items'></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.remark')" prop='remark'>
                  <el-input v-model='formData.remark' type='text' maxlength='100' class='items'></el-input>
              </el-form-item>
          </el-col>
      </el-form>
      </el-main>
      </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { readTrainPlanCheckInfo, updateTrainPlanCheckInfo } from '@/api/traineventmanage/trainPlanCheckInfo'
import { getAnnualTrainPlanInfoList } from '@/api/traineventmanage/annualTrainPlanInfo'
import { getAuthList } from '@/api/systemmanage/auth'
export default {
  components: {
      Sticky
  },
  data() {
      return {
          editId: 0,
          loading: true, //是否显示loading
          plan_Operations:[]
,user_Operations:[]
,
          formData: {},
          rules:{
              plan:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],
status:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],
check_time:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],
current_check_status:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],

          }
      }
  },
  created() {
      this.editId = this.$route.query.id
      this.init()
  },
  methods: {
      init(){
         Promise.all([getAnnualTrainPlanInfoList({limit: 100000000,offset: 0}),getAuthList({limit: 100000000,offset: 0}),readTrainPlanCheckInfo(this.editId)])
         .then(response=>{
             this.plan_Operations=response[0].data
this.user_Operations=response[1].data

             this.formData = response[2].data
             this.formData.plan = this.formData.plan==null?this.formData.plan:this.formData.plan.id
this.formData.user = this.formData.user==null?this.formData.user:this.formData.user.id
             this.loading = false
         })
      },
      handleSubmitForm() {
          this.$refs['dataForm'].validate(valid => {
              if (valid) {
                  this.loading = true
                  updateTrainPlanCheckInfo(this.editId, this.formData).then(response => {
                      this.$message.success(this.$t('message.saveSuccess'))
                      this.loading = false
                      this.$router.go(-1)
                  }).catch(() => {
                      this.loading = false
                  })
              } else {
                  this.loading = false
                  return false
              }
          })
      },
      handleReturn() {
          this.$router.go(-1)
      }
  }
}
</script>

<style lang='scss' scoped>

</style>
