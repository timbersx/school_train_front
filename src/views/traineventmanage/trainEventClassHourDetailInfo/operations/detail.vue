<!--/*
 * @Name: TrainEventClassHourDetailInfo detail
 * @Module:  src/views/trainEventClassHourDetailInfo/operations/detail
 * @Desc: TrainEventClassHourDetailInfo detail
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:35
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
              <el-form-item :label="$t('trainEventClassHourDetailInfo.class_hour')">{{formData.class_hour}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventClassHourDetailInfo.attachment')">{{formData.attachment}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventClassHourDetailInfo.attachment_explain')">{{formData.attachment_explain}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventClassHourDetailInfo.remark')">{{formData.remark}}</el-form-item>
          </el-col>
      </el-form>
      </el-main>
      </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { readTrainEventClassHourDetailInfo } from '@/api/traineventmanage/trainEventClassHourDetailInfo'
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
         Promise.all([readTrainEventClassHourDetailInfo(this.editId)])
         .then(response=>{
             
             this.formData = response[0].data
             this.formData.class_hour = this.formData.class_hour==null?this.formData.class_hour:this.formData.class_hour.name
this.formData.attachment = this.formData.attachment==null?this.formData.attachment:this.formData.attachment.name
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
