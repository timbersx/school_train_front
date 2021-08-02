<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{generateTitle(item.meta.title) }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from "path-to-regexp";
import { generateTitle } from "@/utils/i18n";

export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      const first = matched[0];
      let lastIndex = matched.length - 1;

      const last = matched[lastIndex];
      if (
        last.meta.is_bottom_page_children != null &&
        last.meta.is_bottom_page_children
      ) {
        const parentFullPath = last.path.substr(0, last.path.lastIndexOf("/"));
        matched.splice(lastIndex, 0, {
          path: parentFullPath,
          meta: { title: last.meta.parent_title }
        });
      }

      if (!this.isDashboard(first)) {
        matched = [{ path: "/dashboard", meta: { title: "dashboard" } }].concat(
          matched
        );
      }

      //matched=[{path:'/example/table',meta:{title:'Table'}}].concat(matched)

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
      );
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      let ispush=false
      if(item.components!=null&&item.components.default.name.toLowerCase() != "layout")
      {
        ispush=true
      }
      else if(item.components==null){ 
        ispush=true
      }
       if (ispush) {
        //components 不为Layout的才跳转页面
        const { redirect, path } = item;
        if (redirect) {
          this.$router.push(redirect);
          return;
        }
        this.$router.push(this.pathCompile(path));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
