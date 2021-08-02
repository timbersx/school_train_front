<!--/*
 * @Name: TrainPlanCheckInfo detail
 * @Module:  src/views/trainPlanCheckInfo/operations/detail
 * @Desc: TrainPlanCheckInfo detail
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
              <el-form-item :label="$t('trainPlanCheckInfo.plan')">{{formData.plan}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.status')">{{formData.status}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.check_time')">{{formData.check_time}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.current_check_status')">{{formData.current_check_status}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.user')">{{formData.user}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.approve_comment')">{{formData.approve_comment}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainPlanCheckInfo.remark')">{{formData.remark}}</el-form-item>
          </el-col>
      </el-form>
      </el-main>
      </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { readTrainPlanCheckInfo } from '@/api/traineventmanage/trainPlanCheckInfo'
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
         Promise.all([readTrainPlanCheckInfo(this.editId)])
         .then(response=>{
             
             this.formData = response[0].data
             this.formData.plan = this.formData.plan==null?this.formData.plan:this.formData.plan.name
this.formData.user = this.formData.user==null?this.formData.user:this.formData.user.name
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
