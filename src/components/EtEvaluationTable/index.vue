<template>
  <el-table
    :data="list"
    :span-method="spanMethod"
    tooltip-effect="dark"
    style="marginbottom: 20px"
    border
    stripe
    show-summary
    :summary-method="getSummaries"
  >
    <el-table-column
      v-for="(item, index) in listColumns"
      :key="index"
      :prop="item"
      :label="$t(`expertEvaluation.${item}`)"
    >
      <template slot-scope="scope">
        <span>{{ scope.row[item] }}</span>
      </template>
    </el-table-column>
    <slot name="scoreColumn" />
    <slot name="expertColumn" />
  </el-table>
</template>
<script>
export default {
  name: "EtEvaluationTable",
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    listColumns: {
      type: Array,
      default() {
        return [];
      },
    },
    isSpanMethod: {
      type: Boolean,
      default: false,
    },
    spanColumnsKey: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      spanArr: [],
      pos: 0,
    };
  },
  watch: {
    list(list) {
      if (list.length > 0) {
        this.getSpanData(list);
      }
    },
  },
  created() {
    this.getSpanData(this.list);
  },
  methods: {
    getSpanData(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          if (
            data[i][this.spanColumnsKey] === data[i - 1][this.spanColumnsKey]
          ) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.isSpanMethod) {
        if (columnIndex === 0) {
          const row = this.spanArr[rowIndex];
          const col = row > 0 ? 1 : 0;
          return {
            rowspan: row,
            colspan: col,
          };
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 3) {
          const values = data.map((item) => Number(item[column.property]));
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index];
          } else {
            sums[index] = 0;
          }
        }
        if(index === 4){
          const values = data.map((item) => {
            if(item.evaluate_score){
              return item.evaluate_score
            }else{
              return 0
            }
          });
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return Number(prev) + Number(curr);
              } else {
                return prev;
              }
            }, 0);
            sums[index] = parseInt(sums[index] * 100) / 100
          } else {
            sums[index] = 0;
          }
        }
      });

      return sums;
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
