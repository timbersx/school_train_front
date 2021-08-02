<!--/*
 * @Name: TrainEventCheckInfo detail
 * @Module:  src/views/trainEventCheckInfo/operations/detail
 * @Desc: TrainEventCheckInfo detail
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
              <el-form-item :label="$t('trainEventCheckInfo.train_project')">{{formData.train_project}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.result')">{{formData.result}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.check_user')">{{formData.check_user}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.check_time')">{{formData.check_time}}</el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.remark')">{{formData.remark}}</el-form-item>
          </el-col>
      </el-form>
      </el-main>
      </el-container>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { readTrainEventCheckInfo } from '@/api/traineventmanage/trainEventCheckInfo'
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
         Promise.all([readTrainEventCheckInfo(this.editId)])
         .then(response=>{
             
             this.formData = response[0].data
             this.formData.check_user = this.formData.check_user==null?this.formData.check_user:this.formData.check_user.name
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
