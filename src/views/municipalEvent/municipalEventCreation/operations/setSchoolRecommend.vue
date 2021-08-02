<!--  -->
<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="$t('municipalEventCreation.setSchoolRecommendNumber')"
      @close="handleReturn"
      width="800px"
    >
      <el-divider />

      <div v-loading="loading">
        <el-main>
          <el-table
            v-loading="loading"
            :data="list"
            border
            fit
            highlight-current-row
            stripe
          >
            <el-table-column
              prop="name"
              :label="$t('municipalEventCreation.school')"
            />
            <el-table-column
              prop="amount"
              :label="$t('municipalEventCreation.number')"
            >
            <template slot-scope="scope">
              <span v-if="isView">{{scope.row.amount}}</span>
              <el-input v-else v-model.number="scope.row.amount" :placeholder="$t('table.input')" style="width: 80px"/>
            </template>
            </el-table-column>
          </el-table>
        </el-main>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleReturn">{{
          this.$t("button.cancel")
        }}</el-button>
        <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="primary"
          @click="handleSubmitForm"
        >{{ this.$t("button.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrganizations } from "@/api/municipalEvent/municipalEventCreation"

export default {
  name: 'setSchoolRecommend',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    organizations: {
      type: Array,
      default() {
        return [];
      }
    },
    isView: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      loading: false, // 是否显示loading
      list: null,
      formData: {},
      apiQueryData: { limit: 10000, offset: 0 },
      listParameters: {
        total: 0, // 数据总数,默认为0
        pageSizes: [10, 20, 50, 100, 200], // 翻页组件中的每页显示的数量
        page: 1,
        limit: 10
      },
    };
  },
  watch: {
    visible(newValue) {
      this.apiQueryData.train_event__id = this.editId
      this.init(newValue)
    }
  },
  methods: {
    // 获取编辑信息
    init() {
      this.loading = true
      getOrganizations(this.apiQueryData).then((res) => {
        let list = []
        if(this.isView){
          this.organizations.map(org => {
            list.push({organization: org.organization.id, name: org.organization.name, amount: org.amount})
          })
        }else{
          res.data.map(item => {
            this.organizations.map(org => {
              if(typeof org.id !== 'undefined'){
                if(item.id == org.organization.id){
                  list.push({organization: org.organization.id, name: org.organization.name, amount: org.amount})
                }
              }else{
                if(item.id == org){
                  list.push({organization: item.id, name: item.name, amount: ""})
                }
              }
            })
          })
        }
        this.list = list
        
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSubmitForm() {
      this.$emit('organizations', this.list)
    },
    handleReturn() {
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang='scss' scoped>

</style>
