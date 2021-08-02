<template>
  <div class>
    <el-card class="card-top">
      <span class="text-title card-head-title">
        {{ name }}&nbsp;&nbsp;
        <span
          class="min-text"
        >{{ $t('questionnaireAnalysis.amountTo') }}&nbsp;{{ count }}&nbsp;{{ $t('questionnaireAnalysis.questions') }}</span>
      </span>
      <div class="button-return">
        <el-button @click="handleExport">{{ $t('route.export') }}</el-button>
        <el-button
          style="marginLeft: 20px"
          type="primary"
          @click="handleReturn"
        >{{ this.$t('button.return') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    // 问卷文字
    name: {
      type: String,
      default: '暂无问卷信息'
    },
    count: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  methods: {
    handleReturn() {
      this.$router.go(-1)
    },
    // 导出按钮
    handleExport() {
      this.$emit('export')
    }
  }
}
</script>

<style lang="scss" scoped>
.text-title {
  float: left;
  line-height: 36px;
  .min-text {
    font-size: 14px;
    font-weight: bold;
  }
}
.card-top {
  margin-bottom: 20px;
}
.button-return {
  float: right;
}
.card-top /deep/ .el-card__body {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }
}
</style>
