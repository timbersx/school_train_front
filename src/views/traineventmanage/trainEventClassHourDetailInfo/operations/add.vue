<!--/*
 * @Name: TrainEventClassHourDetailInfo add
 * @Module:  src/views/trainEventClassHourDetailInfo/operations/edit
 * @Desc: TrainEventClassHourDetailInfo add
 * @Author:  automatic code
 * @Date:  2020-12-10 15:10:35
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
              <el-form-item :label="$t('trainEventClassHourDetailInfo.class_hour')" prop='class_hour'>
                  <el-select v-model='formData.class_hour' class='items' :placeholder="$t('common.select')" filterable value-key='id'>
                      <el-option v-for='item in class_hour_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventClassHourDetailInfo.attachment')" prop='attachment'>
                  <el-select v-model='formData.attachment' class='items' :placeholder="$t('common.select')" filterable value-key='id'>
                      <el-option v-for='item in attachment_Operations' :key='item.id' :label='item.name' :value='item.id'></el-option>
                  </el-select>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventClassHourDetailInfo.attachment_explain')" prop='attachment_explain'>
                  <el-input v-model='formData.attachment_explain' type='text' maxlength='256'   class='items'></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='12'>
              <el-form-item :label="$t('trainEventClassHourDetailInfo.remark')" prop='remark'>
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
import { createTrainEventClassHourDetailInfo } from '@/api/traineventmanage/trainEventClassHourDetailInfo'
import { getTrainEventClassHourInfoList } from '@/api/traineventmanage/trainEventClassHourInfo'
// import { getAttachmentInfoList } from '@/api/traineventmanage/attachmentInfo'
export default {
  components: {
      Sticky
  },
  data() {
      return {
          loading: true, //是否显示loading
          class_hour_Operations:[]
,attachment_Operations:[]
,
          formData: {},
          rules:{
              class_hour:[
  {
      required: true,
      message: this.$t('validate.required'),
      trigger: 'blur'
  }
],
attachment_explain:[
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
Promise.all([getTrainEventClassHourInfoList({limit: 100000000,offset: 0})
// ,getAttachmentInfoList({limit: 100000000,offset: 0})
])
.then(response=>{
 this.class_hour_Operations=response[0].data
// this.attachment_Operations=response[1].data

  this.loading = false })
      },
      handleSubmitForm() {
          this.$refs['dataForm'].validate(valid => {
              if (valid) {
                  this.loading = true
                  createTrainEventClassHourDetailInfo(this.formData).then(response => {
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
