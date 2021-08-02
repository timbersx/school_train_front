<template>
  <div class="paper-view">
    <div class="flexbiv" />
    <ve-bar :data="chartData" width="800px" :settings="chartSettings" />
    <div class="flexbiv" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [ // 后续需删除
        ]
      }
    }
  },
  data() {
    return {
      // 条形图设置
      chartSettings: {
        dimension: ['evaluate_object'],
        metrics: ['paper_avg_score'],
        labelMap: {
          'paper_avg_score': '问卷平均分'
        },
        itemStyle: {
          color: 'rgba(59,161,255,1)'
        },
        barWidth: 60
      },
      // 条形图数据
      chartData: {
        columns: ['evaluate_object', 'paper_avg_score'],
        rows: this.data
      }
    }
  },
  watch: {
    data(value) {
      this.chartData.rows = value
    }
  }
}
</script>

<style lang="scss" scoped>
.paper-view {
  text-align: center;
  display: flex;
  .flexbiv {
    flex: 1;
  }
}
</style>
