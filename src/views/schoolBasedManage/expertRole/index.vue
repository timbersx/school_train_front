<template>
  <div class="export-container">
    <el-container v-loading="loading">
      <el-aside width="20%" height="100%">
        <el-card class="box-card-with-search" :body-style="{padding: '20px'}">
          <div slot="header" class="clearfix">
            <span class="card-head-title wider">{{ $t('exportRole.expertUser') }}</span>
          </div>
          <el-input
            v-model="filterExpertText"
            style="marginBottom: 12px"
            :placeholder="$t('exportRole.searchFlow')"
          />
          <el-tree
            ref="dataExpertTree"
            :data="expertTree"
            :props="expertProps"
            default-expand-all
            highlight-current
            node-key="id1"
            :filter-node-method="handleFilterExpertNode"
            :expand-on-click-node="false"
            @node-click="handleProfessionalsNodeClick"
          />
        </el-card>
      </el-aside>

      <el-main height="100%" style="width: 70%; position: relative">
        <el-row :gutter="20" class="col2" style="height: 100%">
          <el-col :span="8">
            <el-card class="box-card-with-search cardposition" :body-style="{padding: '20px'}">
              <div slot="header" class="clearfix">
                <span class="card-head-title wider">{{ $t('exportRole.setEvaluateSchool') }}</span>
              </div>
              <el-input
                v-model="filterSchoolText"
                style="marginBottom: 12px"
                :placeholder="$t('exportRole.searchEvaluateSchool')"
              />
              <el-tree
                ref="dataSchoolTree"
                :data="schoolTree"
                :props="schoolProps"
                highlight-current
                node-key="id"
                default-expand-all
                :filter-node-method="handleFilterSchoolNode"
                :expand-on-click-node="false"
                :show-checkbox="true"
              />
            </el-card>
          </el-col>
          <el-col :span="16" class="col3">
            <el-card
              class="box-card-with-search"
              :body-style="{padding: '20px'}"
              style="width: 100%"
            >
              <div slot="header">
                <span class="wider card-head-title">{{ $t('exportRole.setScorePoint') }}</span>
                <el-button style="float:right;transform: translate(0, -25%)" type="primary" @click="submitData">{{ $t('button.save') }}</el-button>
              </div>
              <el-input
                v-model="filterScoreText"
                style="marginBottom: 12px"
                :placeholder="$t('exportRole.searchIndicator')"
              />
              <el-tree
                ref="dataScoreTree"
                :data="scoreTree"
                :props="scoreProps"
                highlight-current
                default-expand-all
                node-key="id"
                :filter-node-method="handleScoreFilterNode"
                expand-on-click-node
                :show-checkbox="true"
                :render-content="renderContent"
                icon-class="el-icon-arrow-right"
              />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getExpertGroupList, setExpertPermission, getExpertPermission, getOrganizationTypeOrganizations, getIndicatorScoreTreeData } from '@/api/schoolBasedManage/expertRole'

export default {
  data() {
    return {
      expertProps: {
        label: data => (data.nick_name || data.name), children: 'children'
      },
      schoolProps: { label: 'name', children: 'children' },
      scoreProps: {
        label: data => (data.desc || data.title), children: 'children'
      },
      filterExpertText: '',
      filterSchoolText: '',
      filterScoreText: '',
      expertTree: [],
      schoolTree: [],
      scoreTree: [],
      loading: false,
      selectedUserID: ''
    }
  },
  watch: {
    filterExpertText(val) {
      this.$refs.dataExpertTree.filter(val)
    },
    filterSchoolText(val) {
      this.$refs.dataSchoolTree.filter(val)
    },
    filterScoreText(val) {
      this.$refs.dataScoreTree.filter(val)
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      // 获取专家角色
      Promise.all([
        getExpertGroupList(),
        getOrganizationTypeOrganizations(),
        getIndicatorScoreTreeData()
      ]).then(response => {
        response[0].data.map((item) => {
          item.name = item.name.name
        })
        response[1].data.forEach((item) => {
          item.id = item.id + '-'
        })
        this.expertTree = response[0].data
        this.schoolTree = response[1].data
        this.scoreTree = response[2].data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleFilterExpertNode(e, data) {
      if (!e) return true
      return data.name.indexOf(e) !== -1
    },
    handleFilterSchoolNode(e, data) {
      if (!e) return true
      return data.name.indexOf(e) !== -1
    },
    handleScoreFilterNode(e, data) {
      if (!e) return true
      return data.desc ? data.desc.indexOf(e) !== -1 : false
    },
    // 专家树节点点击
    handleProfessionalsNodeClick(data, node) {
      if (data.children) {
        return false
      }
      this.selectedUserID = data.id
      this.loading = true
      this.$refs.dataSchoolTree.setCheckedKeys([])
      this.$refs.dataScoreTree.setCheckedKeys([])
      getExpertPermission({ user: data.id }).then(res => {
        if (res.data) {
          const result = res.data
          this.$nextTick(() => {
            const score_points = result.score_points.map(item => item.id)
            const organizations = result.organizations.map(item => item.id)
            if (score_points.length > 0) {
              this.$refs.dataScoreTree.setCheckedKeys(score_points)
            }
            if (organizations.length > 0) {
              this.$refs.dataSchoolTree.setCheckedKeys(organizations, true)
            }
          })
          this.loading = false
        } else {
          // this.$refs.dataSchoolTree.setCheckedKeys([])
          // this.$refs.dataScoreTree.setCheckedKeys([])
          this.loading = false
        }
      })
    },
    submitData() {
      // 从两个树获取到的选中的节点数据
      const organizations = this.$refs.dataSchoolTree.getCheckedNodes().filter(item => {
        return !item.children
      }).map(item => item.id)
      const score_points = this.$refs.dataScoreTree.getCheckedNodes().filter(item => {
        return !item.children
      }).map(item => item.id)
      this.loading = true
      setExpertPermission({ organizations, score_points, user: this.selectedUserID }).then(() => {
        this.loading = false
        this.$message.success(this.$t('message.saveSuccess'))
      }).catch(() => {
        this.loading = false
      })
    },
    renderContent(h, { node }) {
      return (
        <span class='el-tree-node__label' style='lineHeight: 21px'>
          <span title={node.label} >{node.label}</span>
        </span>)
    }
  }
}
</script>

<style lang='scss' scoped>
aside.el-aside {
  padding: 0 20px 20px 20px;
}

main.el-main {
  padding: 0 20px 20px 0;
}
.cardposition {
  position: relative;
  height: 100%;
}
.el-col-8 {
  height: 100%;
}
.el-col-16 {
  height: 100%;
}
/deep/ .el-tree-node {
  white-space: normal;
}
/deep/ .el-tree-node__content {
  height: 100%;
}
// .col3 /deep/ .el-checkbox {
//   // transform: translate(0, 50%);
//   display: inline;
// }
/deep/ .el-tree-node__content {
  align-items: baseline;
}
.box-card-with-search {
  min-height: calc(100vh - 150px);
  height: 100%
}
.export-container {
  padding: 20px 0;
}
</style>
