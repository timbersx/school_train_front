<template>
  <div class="school-info">
    <el-card>
      <div>
        <!-- <span class="text-title card-head-title">
          <span
            class="min-text"
          >{{ $t('questionnaireAnalysis.all') }}&nbsp;{{ data.length }}&nbsp;{{ $t('questionnaireAnalysis.questions') }}</span>
        </span>
        <el-divider /> -->
        <div v-for="(topic, i) in data" :key="i" class="topicspace">
          <span class="topicfont">{{ i+1 }}. {{ topic.question_stem }}</span>
          <!-- 选择项 -->
          <el-table :data="topic.choices">
            <el-table-column :label="$t('questionnaireAnalysis.choices')">
              <template slot-scope="scope">{{ scope.row.index }}. {{ scope.row.value }}</template>
            </el-table-column>
            <el-table-column prop="choice_count" :label="$t('questionnaireAnalysis.count')" />
            <el-table-column :label="$t('questionnaireAnalysis.percentage')" width="450px">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="19">
                    <div class="percentagestyle">
                      <el-progress
                        :percentage="scope.row.choice_ratio | scopePercent"
                        :show-text="false"
                      />
                    </div>
                  </el-col>
                  <el-col :span="4" :offset="1">
                    <span>{{ (scope.row.choice_ratio*100).toFixed(2) }} %</span>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  filters: {
    scopePercent(val) {
      val = val - 0
      return (val * 100).toFixed(2) - 0
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return [
        ]
      }
    }
  },
  computed: {
    percentage() {
      return function(val) {
        var mul = function(number, arg) {
          var m = 0; var s1 = number.toString(); var s2 = arg.toString()
          try { m += s1.split('.')[1].length } catch (e) {}
          try { m += s2.split('.')[1].length } catch (e) {}
          return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
        }
        return mul(val, 10000).toFixed(2) + '%'
      }
    }
  },
  methods: {
    // 浮点数计算(乘法)
    mul(number, arg) {
      var m = 0; var s1 = number.toString(); var s2 = arg.toString()
      try { m += s1.split('.')[1].length } catch (e) {}
      try { m += s2.split('.')[1].length } catch (e) {}
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-title {
  line-height: 36px;
  font-size: 15px;
  .min-text {
    font-size: 14px;
    font-weight: bold;
  }
}
.topicspace {
  padding: 20px 0 20px 0;
}
.indicatortop {
  margin-top: 20px;
}
.topicfont {
  font-size: 0.85rem;
  font-weight: 550;
}
.percentagestyle {
  transform: translate(0, 150%);
}
</style>
