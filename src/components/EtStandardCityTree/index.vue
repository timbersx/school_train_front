<!--/*
 * @Name: EtStandardEvaluateTree
 * @Module: src/components/EtStandardEvaluateTree/index.vue
 * @Desc: 指标树形组件
 * @Author: shenyj
 * @Date: 2021-01-28 13:27:39
 * @Last Modified by:   shenyj
 * @Last Modified time:
 * @example:
 * <et-standard-evaluate-tree
    :title="title"
    :treeProps="defaultProps"
    @nodeClick="handleNodeClick"
  />
*/-->

<template>
  <el-card
    style="transition: ease all 0.4s; height: 83vh; min-height: 500px"
    :class="cardOpened ? 'box-card-with-search' : 'card-close'"
    :body-style="{ padding: '20px' }"
  >
    <div slot="header" class="clearfix">
      <span v-if="title" class="card-head-title wider">
        <span v-if="cardOpened" style="margin-left: 16px">{{ title }}</span>
      </span>
      <hamburger
        v-if="isShowHamburger"
        :is-active="cardOpened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />

      <span v-if="isShowComplete && cardOpened" class="head_complete">
        {{ $t("indicatorInfo.condition") }}(
        <span
          v-if="JSON.stringify(competitionConition) !== '{}'"
          :class="
            competitionConition.complete_count ===
              competitionConition.total_count
              ? 'count-completed'
              : 'count-uncompleted'
          "
        >{{
          competitionConition.complete_count +
            "/" +
            competitionConition.total_count
        }}</span>)
      </span>
      <span v-if="isShowTips && cardOpened" class="head_tips" :title="tips">{{
        tips
      }}</span>
      <el-button
        v-if="isShowBtn && cardOpened"
        class="head_save_btn"
        type="text"
        @click="handleCheckedNodesClick"
      >{{ buttonName }}</el-button>
    </div>
    <div v-if="cardOpened">
      <el-input
        v-if="isShowSearch"
        v-model="filterText"
        style="margin-bottom: 12px"
        :placeholder="searchTitle"
      />
      <el-tree
        ref="dataTree"
        :data="treeExternalData ? treeExternalData : treeData"
        :props="treeProps"
        default-expand-all
        highlight-current
        :node-key="nodeKey"
        :show-checkbox="isShowCheckbox"
        :filter-node-method="handleFilterNode"
        :expand-on-click-node="false"
        :render-content="
          showCompetition
            ? renderContent
            : showCompetitionIcon
              ? renderIconContent
              : null
        "
        @node-click="handleNodeClick"
        @node-contextmenu="handleNodeRightClick"
      />
    </div>
  </el-card>
</template>

<script>
import { getTreeData } from '@/api/municipalPlan/annualPlanReviewIndicators'

import Hamburger from '@/components/Hamburger'

export default {
  name: 'EtEvaluateTree',
  components: {
    Hamburger
  },
  props: {
    title: {
      type: String,
      default() {
        return this.$t('scorePointInfo.pointerItem')
      }
    },
    searchTitle: {
      type: String,
      default: ''
    },
    isShowHamburger: {
      type: Boolean,
      default: false
    },
    isShowComplete: {
      type: Boolean,
      default: false
    },
    isShowCheckbox: {
      type: Boolean,
      default: false
    },
    isShowBtn: {
      type: Boolean,
      default: false
    },
    nodeKey: {
      type: String,
      default: 'key'
    },
    tips: {
      type: String,
      default: ''
    },
    isShowTips: {
      type: Boolean,
      default: false
    },
    isShowSearch: {
      type: Boolean,
      default: false
    },
    treeProps: {
      type: Object,
      default: null
    },
    treeExternalData: {
      type: Array,
      default: null
    },
    buttonName: {
      type: String,
      default: ''
    },
    defaultChecked: {
      type: Object,
      default: function() {
        return {}
      }
    },
    competitionConition: {
      type: Object,
      default: function() {
        return {}
      }
    },
    showCompetition: {
      type: Boolean,
      default: false
    },
    showCompetitionIcon: {
      type: Boolean,
      default: false
    },
    isUser: {
      type: Boolean,
      default: false
    },
    isInit: {
      type: Boolean,
      default: true
    },
    jumpCachePointID: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultCheckedKeys: 0,
      defaultChangeValues: {},
      cardOpened: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.dataTree.filter(val)
    },
    cardOpened(status) {},
    treeExternalData(treeData) {
      // if (this.$refs.dataTree.getCurrentKey() === null) {
      if (this.jumpCachePointID) {
        if (treeData) {
          if (treeData.length > 0) {
            this.$nextTick(function() {
              this.$refs.dataTree.setCurrentKey(this.jumpCachePointID)
              this.$emit('nodeClick', { key: this.jumpCachePointID })
            })
          }
        }
      } else if (this.isInit) {
        if (treeData) {
          if (treeData.length > 0) {
            if (treeData[0][this.treeProps.children].length > 0) {
              this.$nextTick(function() {
                this.$refs.dataTree.setCurrentKey(
                  treeData[0][this.treeProps.children][0][this.nodeKey]
                )
                this.$emit(
                  'nodeClick',
                  treeData[0][this.treeProps.children][0]
                )
              })
            } else {
              this.$nextTick(function() {
                this.$refs.dataTree.setCurrentKey(treeData[0][this.nodeKey])
                this.$emit('nodeClick', treeData[0])
              })
            }
          }
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getTreeInit()
  },
  methods: {
    handleNodeClick(e) {
      // 点击节点事件
      this.$emit('nodeClick', e)
    },
    handleCheckedNodesClick() {
      // 获取选择框选中节点事件
      this.$emit('checkedNodesClick', this.$refs.dataTree.getCheckedNodes())
    },
    handleNodeRightClick(e, data) {
      // 右击节点事件
      this.$emit('nodeRightClick', e, data)
    },
    handleFilterNode(e, data) {
      if (!e) return true
      return (
        data[this.treeProps ? this.treeProps.label : 'title'].indexOf(e) !== -1
      )
    },
    getTreeInit() {
      getTreeData().then((response) => {
        this.treeData = response.data
        if (response.data.length > 0) {
          if (response.data[0][this.treeProps.children].length > 0) {
            // const responseLast =
            //   response.data[0][this.treeProps.children][response.data[0][this.treeProps.children].length - 1]
            const responseFirst = response.data[0][this.treeProps.children][0]
            this.defaultCheckedKeys = responseFirst[this.nodeKey]
            this.defaultChangeValues = responseFirst
          } else {
            this.defaultCheckedKeys = response.data[0][this.nodeKey]
            this.defaultChangeValues = response.data[0]
          }
          this.$nextTick(function() {
            this.$refs.dataTree.setCurrentKey(this.defaultCheckedKeys)
            this.$emit('nodeClick', this.defaultChangeValues)
          })
        } else {
          this.$emit('nodeClick', { children: [], title: '', key: '' })
        }
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <p class='el-tree-node__label' style='line-height: 13px'>
          <span
            title={
              node.label +
              ' (' +
              data.complete_count +
              '/' +
              data.total_count +
              ')'
            }
          >
            {node.label}
          </span>
          &nbsp;&nbsp;{' '}
          <span
            style={{
              display: data.complete_count || data.total_count ? '' : 'none'
            }}
            class={
              data.complete_count === data.total_count
                ? 'count-completed'
                : 'count-uncompleted'
            }
          >
            ({data.complete_count}/{data.total_count})
          </span>
        </p>
      )
    },
    renderIconContent(h, { node, data, store }) {
      return (
        <p class='el-tree-node__label' style='line-height: 13px'>
          <span
            title={
              node.label +
              ' (' +
              data.complete_count +
              '/' +
              data.total_count +
              ')'
            }
          >
            {node.label}
          </span>
          &nbsp;&nbsp;
          <i
            style={{
              color: '#70B603',
              display:
                data.complete_count === data.total_count && node.level > 1
                  ? ''
                  : 'none',
              fontWeight: 'bold'
            }}
            class='el-icon-circle-check'
          />
        </p>
      )
    },
    toggleSideBar() {
      this.cardOpened = !this.cardOpened
    }
  }
}
</script>

<style lang='scss' scoped>
.head_complete {
  float: right;
  color: #696969;
  font-size: 14px;
  position: relative;
  top: 2px;
}
.head_save_btn {
  float: right;
  padding: 0;
}
.head_tips {
  font-weight: bold;
  font-size: 12px;
  float: right;
  position: relative;
  top: 6px;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wider {
  font-weight: bold;
}

/deep/ .el-tree-node__label {
  white-space: normal;
}
.hamburger-container {
  line-height: 16px;
  height: 100%;
  float: right;
  cursor: pointer;
  transition: ease all 0.3s;
  -webkit-tap-highlight-color: transparent;
  padding: 0 !important;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.box-card-with-search {
  width: 300px;
}
.card-close {
  width: 30px !important;
  height: 100%;
}
/deep/ .el-card__header {
  padding: 18px 4px;
}
</style>
