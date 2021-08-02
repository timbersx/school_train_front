<template>
  <div class="app-container">
    <sticky :z-index="10" class-name="sub-navbar" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleReturn">{{
        $t("button.return")
      }}</el-button>
    </sticky>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础信息" name="first">
        <div class="detail-container">
          <et-plan-detail :plan-id="tId" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="审核记录" name="second">
        <CheckTable :plan-id="tId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import CheckTable from '@/components/EtPlanCityDetail/components/CheckTable'
import EtPlanDetail from '@/components/EtPlanCityDetail'

export default {
  components: {
    Sticky,
    CheckTable,
    EtPlanDetail
  },
  data() {
    return {
      tId: '',
      activeName: 'first'
    }
  },
  created() {
    this.tId = this.$route.query.tId
  },
  methods: {
    handleReturn() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  margin: -20px;
}
</style>
