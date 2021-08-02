<!--/*
 * @Name: EtButtonList
 * @Module: src/components/EtButtonList/index.vue
 * @Desc: 按钮列表，所展示的按钮从接口获取
 * @Author: Elliot.Wang
 * @Date: 2019-06-10 13:10:43
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-06-10 13:10:43
 * @Param: [Method] [btnListClick]  - 按钮点击方法
 * @example:
 * <et-button-list @btnListClick="handleBtnClick"></et-button-list>
*/-->
<template>
  <div class="buttonList">
    <el-button
      v-for="(item, index) in buttonList"
      :key="index"
      type="primary"
      :icon="item.meta.icon"
      @click="handleBtnClick(item)"
    >{{ generateTitle(item.meta.title) }}</el-button>
  </div>
</template>
<script>
import { generateTitle } from '@/utils/i18n'
import { mapGetters } from 'vuex'
export default {
  name: 'EtButtonList',
  data() {
    return {
      buttonList: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes'
    ])
  },
  watch: {
    $route() {
      this.getButtonList()
    }
  },
  created() {
    this.getButtonList(this.permission_routes)
  },
  methods: {
    generateTitle,
    getButtonList(routesList) {
      routesList.forEach(route => {
        if (('children' in route) && route.children.length > 0) {
          this.getButtonList(route.children)
        }
        if (('parent_title') in route.meta && route.meta.parent_title.toLowerCase() == this.$route.meta.title.toLowerCase() && route.meta.type == 0) {
          this.buttonList.push(route)
        }
      })
    },
    handleBtnClick(btnItem) {
      this.$emit('btnListClick', btnItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.buttonList{
  //  float: left;
   margin-bottom: 10px
}
</style>
