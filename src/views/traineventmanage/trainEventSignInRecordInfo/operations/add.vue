<!--/*
 * @Name: TrainEventSignInRecordInfo add
 * @Module:  src/views/trainEventSignInRecordInfo/operations/edit
 * @Desc: TrainEventSignInRecordInfo add
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:34
 * @Last Modified by:   
 * @Last Modified time:  
 * @Param: [Type] [Name]  - Desc
 * @Example:  
*/-->

<template>
  <div class='app-container'  v-loading='loading'>
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
              <el-form-item :label="$t('trainEventSignInRecordInfo.train_event')" prop='train_event'>
                  <el-select v-model='formData.train_event' class='items' :placeholder="$t('common.select')" filterable value-key='id'>
                      <el-option v-for='item in train_event_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventSignInRecordInfo.teacher')" prop='teacher'>
                  <el-select v-model='formData.teacher' class='items' :placeholder="$t('common.select')" filterable value-key='id'>
                      <el-option v-for='item in teacher_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventSignInRecordInfo.sign_in_time')" prop='sign_in_time'>
                  <el-date-picker v-model='formData.sign_in_time' type='datetime' :placeholder="$t('common.selectDateTime')" class='items' value-format='yyyy-MM-dd HH:mm:ss' ></el-date-picker>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventSignInRecordInfo.remark')" prop='remark'>
                  <el-input v-model='formData.remark' type='text' maxlength='100'   class='items'></el-input>
              </el-form-item>
          </el-col>
      </el-form>
      </el-main>
      </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { createTrainEventSignInRecordInfo } from '@/api/traineventmanage/trainEventSignInRecordInfo'
import { getTrainEventInfoList } from '@/api/traineventmanage/trainEventInfo'
import { getWjssoTeacherInfoList } from '@/api/wjsso/wjssoTeacherInfo'
export default {
  components: {
      Sticky
  },
  data() {
      return {
          loading: true, //是否显示loading
          train_event_Operations:[]
,teacher_Operations:[]
,
          formData: {},
          rules:{
              train_event:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],
teacher:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],
sign_in_time:[
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
       this.init()
  },
  methods: {
      init(){
Promise.all([getTrainEventInfoList({limit: 100000000,offset: 0}),getWjssoTeacherInfoList({limit: 100000000,offset: 0})])
.then(response=>{
 this.train_event_Operations=response[0].data
this.teacher_Operations=response[1].data

  this.loading = false })
      },
      handleSubmitForm() {
          this.$refs['dataForm'].validate(valid => {
              if (valid) {
                  this.loading = true
                  createTrainEventSignInRecordInfo(this.formData).then(response => {
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
