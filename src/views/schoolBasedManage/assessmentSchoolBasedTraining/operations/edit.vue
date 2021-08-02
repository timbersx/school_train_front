<!--/*
 * @Name: TrainEventCheckInfo edit
 * @Module:  src/views/trainEventCheckInfo/operations/edit
 * @Desc: TrainEventCheckInfo edit
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
              <el-form-item :label="$t('trainEventCheckInfo.train_project')" prop='train_project'>
                  <el-input v-model='formData.train_project' type='text' maxlength='128' class='items'></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.result')" prop='result'>
                  <el-input v-model='formData.result' type='number' class='items'></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.check_user')" prop='check_user'>
                  <el-select v-model='formData.check_user' class='items' :placeholder="$t('common.select')" filterable value-key='id'>
                      <el-option v-for='item in check_user_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.check_time')" prop='check_time'>
                  <el-date-picker v-model='formData.check_time' type='datetime' :placeholder="$t('common.selectDateTime')" class='items' value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventCheckInfo.remark')" prop='remark'>
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
import { readTrainEventCheckInfo, updateTrainEventCheckInfo } from '@/api/traineventmanage/trainEventCheckInfo'
import { getAuthList } from '@/api/systemmanage/auth'
export default {
  components: {
      Sticky
  },
  data() {
      return {
          editId: 0,
          loading: true, //是否显示loading
          check_user_Operations:[]
,
          formData: {},
          rules:{
              train_project:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],
result:[
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

          }
      }
  },
  created() {
      this.editId = this.$route.query.id
      this.init()
  },
  methods: {
      init(){
         Promise.all([getAuthList({limit: 100000000,offset: 0}),readTrainEventCheckInfo(this.editId)])
         .then(response=>{
             this.check_user_Operations=response[0].data

             this.formData = response[1].data
             this.formData.check_user = this.formData.check_user==null?this.formData.check_user:this.formData.check_user.id
             this.loading = false
         })
      },
      handleSubmitForm() {
          this.$refs['dataForm'].validate(valid => {
              if (valid) {
                  this.loading = true
                  updateTrainEventCheckInfo(this.editId, this.formData).then(response => {
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
