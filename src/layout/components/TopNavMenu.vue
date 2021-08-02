<template>
  <div class="menu-warpper">
    <div class="logo">
      <!-- <img style="width:40px;margin-top:15px" src="@/assets/logo.png" />  -->
      <span>教育市级研训管理平台</span>
    </div>
    <div class="right-menu">
      

      <!-- <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      > -->
        <!-- <div class="avatar-wrapper">
          <i
            class="el-icon-user-solid "
            style="color:#ffffff;font-size:30px"
          ></i>
          <i
            class="el-icon-caret-bottom"
            style="color:#ffffff;"
          />
        </div> -->

        <div
        class="right-menu-item "
        style="float:right;line-height:60px;"
      >
      <!-- <lang-select
        class="right-menu-item hover-effect"
        style="line-height:20px"
      /> -->
        <svg-icon
          class-name="international-icon"
          icon-class="user"
          style="fill:white"
        />
        <span style="padding:0 10px 0 5px;color:white;font-size:14px">{{userInfo.nick_name}}</span>
        <svg-icon
          class-name="international-icon"
          icon-class="exit"
          style="fill:red"
        />
        <el-button
          type="text"
          style="color:white"
          @click="logout"
        >安全退出</el-button>
      </div>

        <!-- <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              <span style="display:block;">个人中心</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span
              style="display:block;"
              @click="logout"
            >安全退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
    <div>
      <el-menu
        class="el-menu-self"
        mode="horizontal"
        background-color="#304156"
        text-color="rgb(191, 203, 217)"
        active-text-color="rgb(64, 158, 255)"
        :default-active="top_nav_menus_active_index.toString()"
        @select="handleSelect "
      >
        <!-- <el-menu-item
          v-for="item in top_nav_menus"
          :key="item.id"
          :index="item.id.toString()"
        >
          <i :class="item.icon" />
          <span slot="title">{{ generateTitle(item.title) }}</span>
        </el-menu-item> -->
      </el-menu>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  setTopNavMenuIndex,
  removeTopNavMenuIndex,
  getUserInfo
} from "@/utils/auth";
import store from "@/store";
import { generateTitle } from "@/utils/i18n";
// import { debuglog } from 'util'
import LangSelect from "@/components/LangSelect";

export default {
  components: {
    LangSelect,
  },
  data() {
    return {
      activeIndex: 0,
      userInfo: {},
    };
  },
  computed: {
    ...mapGetters([
      "permission_routes",
      "top_nav_menus_active_index",
      "top_nav_menus",
    ]),
  },
  created() {
    this.init();
  },
  methods: {
    generateTitle,
    init() {
      this.userInfo = getUserInfo()
    },
    handleSelect(index) {
      setTopNavMenuIndex(index);
      store.dispatch("permission/changeSidebar", index);
      if (index !== this.top_nav_menus_active_index) {
        // 当前选中的topNavMenu与当前路由页面不同,设置左侧第一个菜单为选中
        if (this.permission_routes[0].children.length > 0) {
          const to =
            this.permission_routes[0].path +
            "/" +
            this.permission_routes[0].children[0].path;
          this.$router.push({ path: to });
          store.dispatch("permission/setTopNavMenusActiveIndex", index);
        }
      }
      // this.$emit("menu_select")
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      await this.$store.dispatch("permission/reSetAllPermission"); //清空store
      removeTopNavMenuIndex();
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-warpper {
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.logo {
  background: #304156;
  float: left;
  width: 210px;
  text-align: center;
  vertical-align: middle;
  line-height: 61px;
  color: #bfcbd9;
  font-size: 20px;
  img {
    width: 60px;
  }
}
.el-menu-self {
  border-bottom: solid 1px #304156;
  position: inherit;
}
.right-menu {
  position: absolute;
  z-index: 1000;
  right: 30px;
  margin-top: 4px;
  //line-height: 61px;

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .avatar-container {
    margin-right: 15px;

    .avatar-wrapper {
      margin-top: 10px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 18px;
        font-size: 12px;
      }
    }
  }
}

// .user-dropdown {
//    margin-top: -5px;
// }
</style>
