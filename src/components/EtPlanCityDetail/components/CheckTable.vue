<template>
  <div v-loading="loading">
    <div v-for="(item, index) in list" :key="index">
      <dl v-if="item.submit" class="form-container">
        <p>{{ item.submit.submit_time }}</p>
        <dt>提交审核</dt>
      </dl>
      <dl v-if="item.expert" class="form-container clearfix">
        <p>{{ item.expert.check_date }}</p>
        <dt>审核环节: </dt>
        <dd>专家审核</dd>
        <dt>审定项目经费:</dt>
        <dd v-if="item.expert.funds !== null">{{ item.expert.funds }} 万元</dd>
        <label class="check-label">审核意见:</label>
        <div class="check-info">{{ item.expert.approve_comment || '暂无' }}</div>
      </dl>
      <dl v-if="item.education" class="form-container clearfix">
        <p>{{ item.education.check_date }}</p>
        <dt>审核环节:</dt>
        <dd>教育局审核</dd>
        <dt v-if="item.education.funds !== null">审定项目经费:</dt>
        <dd v-if="item.education.funds !== null">{{ item.education.funds }} 万元</dd>
        <dt>审核结果:</dt>
        <dd>
          <span
            v-if="item.education.status === 2"
          >通过 <i class="el-icon-success green-icon" /></span><span
            v-else
          >不通过 <i class="el-icon-error red-icon" /></span>
        </dd>
        <label class="check-label">审核意见:</label>
        <div class="check-info">{{ item.education.approve_comment || '暂无' }}</div>
      </dl>
    </div>
    <div v-if="list.length===0" class="el-tree__empty-block">
      <span class="el-tree__empty-text">暂无数据</span>
    </div>
  </div>
</template>

<script>
import { getCheckRecordsList } from '@/api/municipalPlan/municipalPlanDeclaration'
export default {
  props: {
    planId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      list: [],
      test: ''
    }
  },
  computed: {
  },
  watch: {
    planId: {
      handler(val) {
        if (val > 0) {
          this.init(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        getCheckRecordsList(this.planId)
      ]).then(response => {
        this.list = response[0].data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 20px;
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 30px;
}
.green-icon {
  color: #85ce61;
}
.red-icon {
  color: #f78989;
}
dd {
  margin: 0;
}
dt {
  font-weight: 700;
}
dd, dt {
  display: inline;
}
dd + dt::before {
 content: '\A';
 white-space: pre;
}
.check-info {
  white-space: pre-wrap;
  margin-left: 70px;
  margin-top: -30px;
  float: left;
}
.check-label {
  display: block;
  font-weight: 700;
}
</style>
