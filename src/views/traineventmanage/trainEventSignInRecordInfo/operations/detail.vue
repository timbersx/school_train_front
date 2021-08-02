<!--/*
 * @Name: TrainEventSignInRecordInfo detail
 * @Module:  src/views/trainEventSignInRecordInfo/operations/detail
 * @Desc: TrainEventSignInRecordInfo detail
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
      >
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventSignInRecordInfo.train_event')">{{formData.train_event}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventSignInRecordInfo.teacher')">{{formData.teacher}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventSignInRecordInfo.sign_in_time')">{{formData.sign_in_time}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventSignInRecordInfo.remark')">{{formData.remark}}</el-form-item>
          </el-col>
      </el-form>
      </el-main>
      </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { readTrainEventSignInRecordInfo } from '@/api/traineventmanage/trainEventSignInRecordInfo'
export default {
  components: {
      Sticky
  },
  data() {
      return {
          editId: 0,
          loading: true, //是否显示loading
          formData: {}
      }
  },
  created() {
      this.editId = this.$route.query.id
      this.init()
  },
  methods: {
      init(){
         Promise.all([readTrainEventSignInRecordInfo(this.editId)])
         .then(response=>{
             
             this.formData = response[0].data
             this.formData.train_event = this.formData.train_event==null?this.formData.train_event:this.formData.train_event.name
this.formData.teacher = this.formData.teacher==null?this.formData.teacher:this.formData.teacher.name
             this.loading = false
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
