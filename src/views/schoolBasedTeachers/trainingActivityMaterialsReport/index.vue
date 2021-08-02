<template>
  <div class="app-container">
    <et-drawer
        :drawerVisible.sync='drawerVisible'
        direction='top'
        :confirmBtnName="$t('button.search')"
        :scroll="true"
        height='50%'
      >
        <el-form
          ref='exactSearchForm'
          label-width='100px'
          :model='exactSearchData'
          label-suffix=':'
        >           <el-col :span='8'>
               <el-form-item
                   :label="'年度'"
                   prop='train_project'
               >
                   <el-select
                       v-model='exactSearchData.train_project.type'
                       :placeholder="$t('common.select')"
                       class='exactSearchSelect'
                       popper-class='exactSearchSelectZIndex'
                   >
                    <el-option
                        v-for="item in charFilter"
                        :key="item.value"
                        :label="item.label"
                        :value="'train_project'+item.value"
                    >
                    </el-option>
                   </el-select>
                   <el-input
                      v-show="exactSearchData.train_project.type !='train_project__isnull' && exactSearchData.train_project.type !='train_project__notnull'"
                      v-model='exactSearchData.train_project.value'
                      class='exactSearchInput'
                      type='text'
                   ></el-input>
               </el-form-item>
           </el-col>
           <el-col :span='8'>
               <el-form-item
                   :label="'培训活动'"
                   prop='result'
               >
                   <el-select
                       v-model='exactSearchData.result.type'
                       :placeholder="$t('common.select')"
                       class='exactSearchSelect'
                       popper-class='exactSearchSelectZIndex'
                   >
                    <el-option
                        v-for="item in charFilter"
                        :key="item.value"
                        :label="item.label"
                        :value="'result'+item.value"
                    >
                    </el-option>
                   </el-select>
                   <el-input
                      v-show="exactSearchData.result.type !='result__isnull' && exactSearchData.result.type !='result__notnull'"
                      v-model='exactSearchData.result.value'
                      class='exactSearchInput'
                      type='text'
                   ></el-input>
               </el-form-item>
           </el-col>
           <el-col :span='8'>
               <el-form-item
                   :label="'学时'"
                   prop='check_user'
               >
                   <el-select
                       v-model='exactSearchData.check_user__name.type'
                       :placeholder="$t('common.select')"
                       class='exactSearchSelect'
                       popper-class='exactSearchSelectZIndex'
                   >
                    <el-option
                        v-for="item in charFilter"
                        :key="item.value"
                        :label="item.label"
                        :value="'check_user__name'+item.value"
                    >
                    </el-option>
                   </el-select>
                   <el-input
                      v-show="exactSearchData.check_user__name.type !='check_user__name__isnull' && exactSearchData.check_user__name.type !='check_user__name__notnull'"
                      v-model='exactSearchData.check_user__name.value'
                      class='exactSearchInput'
                      type='text'
                   ></el-input>
               </el-form-item>
           </el-col>
        </el-form>
      </et-drawer>
      <div class='filter-container' style='float: left;'>
          <el-input
          v-model='searchKey'
          :placeholder="$t('common.searchKey')"
          style='width: 300px;'
          class='filter-item'
          @keyup.enter.native='handleFilter'
          />
          <el-button type='primary' icon='el-icon-search' class='filter-item'  @click='drawerVisible = false'>{{ $t('button.search') }}</el-button>
          <el-button type='primary' icon='el-icon-zoom-in' class='filter-item'  @click="drawerVisible = true">{{ $t('button.exactSearch') }}</el-button>
      </div>
    <el-table :data="list" stripe border fit highlight-current-row>
      <el-table-column prop="year" label="年度"></el-table-column>
      <el-table-column prop="huodong" label="培训活动"></el-table-column>
      <el-table-column prop="hours" label="学时"></el-table-column>
    </el-table>
    <el-pagination
          background
          :page-sizes='listParameters.pageSizes'
          layout='total, sizes, prev, pager, next, jumper'
          :total='listParameters.total'
          class='pagination-container'
       ></el-pagination>
  </div>
</template>

<script>
import EtDrawer from '@/components/EtDrawer'
import {charFilter, intFilter, dateFilter} from '@/api/filterType'

export default {
  components: {
    EtDrawer
  },
  data() {
    return {
      list: [
        { year: '2020', huodong: '2020上半年校本培训活动', hours: 5},
        { year: '2020', huodong: '2020下半年校本培训活动', hours: 3}
      ],
      drawerVisible: false,
      exactSearchData:{ //精确查找的model
              train_project:{value:'',type:'',value_range:''},
              result:{value:'',type:'',value_range:''},
              check_user__name:{value:'',type:'',value_range:''},
              check_time:{value:'',type:'',value_range:''},
              remark:{value:'',type:'',value_range:''},
      },
      searchKey: '',
      charFilter,
      intFilter,
      dateFilter,
      listParameters: {
              total: 2, //数据总数,默认为0
              pageSizes: [10, 20, 50, 100, 200], //翻页组件中的每页显示的数量
              page: 1,
              limit: 10,
          },
    }
  },
  methods: {
    handlePost() {
      this.$message.success('上报成功！')
    },
    handleFilter() {

    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
</style>