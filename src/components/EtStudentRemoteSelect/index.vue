<!--/*
 * @Name:
 * @Module:
 * @Desc:
 * @Author: Elliot.Wang
 * @Date: 2019-07-18 10:09:22
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-07-18 10:09:22
 * @Param:  [Method] [change]  - 选项改变事件
 * @example:
 <et-student-remote-select  @change='handleGetStudent'></et-student-remote-select>
*/-->
<template>
  <div>
    <el-select
      v-model='value'
      :placeholder="$t('common.select')"
      class="items"
      filterable
      remote
      value-key='id'
      :remote-method="remoteStudent"
      :loading="loading"
      popper-class="select-pagination"
      @change='handleChange'
    >
      <el-option
        v-for='item in student_Operations'
        :key='item.id'
        :label='item.name'
        :value='item.id'
      >
        <span>{{ item.name }}</span>
        <span class='select-table-right'>{{ item.id_no }}</span>
        <span class='select-table-right'>{{ item.mobile_phone }}</span>
      </el-option>
      <!-- <div style="position: sticky;background: #fff;height:30px;top:0;z-index:1">  -->
      <div>
        <el-pagination
          background
          @current-change='handleCurrentChange'
          layout='total, prev, pager, next, jumper'
          :total='dataTotal'
          :page-size='limit'
          class='pagination-container'
        ></el-pagination>
      </div>
    </el-select>
  </div>
</template>
<script>
import { getBaseInfoList, readBaseInfo } from '@/api/studentinfo/baseInfo'
export default {
  props:{
    studentId: {
          type: Number,
          default: () => {
            return 0
          }
        },
    isEdit:{
      type:Boolean,
      default:()=>{
        return false
      }
    }
  },
  watch:{
    //深度监听studentId的值
    studentId:{
      handler(newValue,olderValue){
        if(newValue>0){
          Promise.all([readBaseInfo(newValue)]).then(response=>{
            this.dataTotal=1 
            this.student_Operations.push(response[0].data)
            this.value=this.student_Operations[0].id
            this.loading=false
          })
        }
      },
      deep: true
    }
  },
  data(){
    return{
      value:'',
      student_Operations:[],
      searchKey: '',
      limit: 10,
      loading: true, //是否显示loading
      dataTotal:0,
      listColumns:['code','name','id_no','mobile_phone'], //表中显示的列 
    }
  },
  mounted() {   
    if(!this.isEdit)
    {
      this.init()
    } 
  },
   methods: {
      init(){
          Promise.all([getBaseInfoList({limit: this.limit,offset: 0})])
          .then(response=>{
          this.student_Operations=response[0].data
              this.dataTotal = response[0].count
            this.loading = false 
            })
      },
      remoteStudent(query){
        if(query!='')
        {
          this.searchKey=query
          this.loading=true
           Promise.all([getBaseInfoList({limit: this.limit,offset: 0,search:this.searchKey})])
          .then(response=>{
          this.student_Operations=response[0].data
              this.dataTotal = response[0].count

            this.loading = false 
            })
        } 
      },
        /* =======翻页事件 begin=======*/
      handleCurrentChange(val) {
        this.loading = true 
         Promise.all([getBaseInfoList({limit: this.limit,offset: this.limit*(val-1),search:this.searchKey})])
          .then(response=>{
          this.student_Operations=response[0].data
              this.dataTotal = response[0].count

            this.loading = false 
            })
      },
      /* =======翻页事件 end=======*/
      handleChange(){
        this.$emit('change',this.value)
      }
   }
}
</script>

<style lang='scss'>
.select-pagination {
  .el-scrollbar {
    height: 450px !important;
    .el-scrollbar__wrap {
      overflow: visible !important;
      height: 450px !important;
    }
    .el-scrollbar__bar.is-vertical {
      width: 0px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.select-table-right {
  float: right;
  color: #8492a6;
  font-size: 13px;
  padding-right: 10px;
}
</style>

