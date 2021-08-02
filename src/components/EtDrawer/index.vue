<!--/*
 * @Name: EtDrawer
 * @Module: src/components/EtDrawer/index.vue
 * @Desc: 自定义抽屉组件
 * @Author: Elliot.Wang
 * @Date: 2019-08-07 13:10:43
 * @Last Modified by:   Elliot.Wang
 * @Last Modified time: 2019-08-07 13:10:43
 * @Param: [Method] [btnListClick]  - 按钮点击方法
 * @example:
 * <et-drawer
        :drawerVisible.sync='drawerVisible'
        direction='top'
        :confirmBtnName="$t('button.search')"
        :scroll="true"
        @close='handleExactSearchCancle'
        @cancle='handleExactSearchCancle'
        @confirm='handleExactSearchConfirm'
        height='55%'
      >
      ///放入任何组件，如el-form
       <el-form>
       </el-form>
      </et-drawer>
*/-->
<template>
  <div>
    <div>
      <transition name="mask">
        <div
          v-if="drawerVisible"
          :class="mask?'mask':''"
          @click="close"
        ></div>
      </transition>
      <transition :name="direction">
        <div
          v-if="drawerVisible"
          @click.stop="closeBtn?'':close"
          class="drawer"
        >
          <div
            @click.stop="close_"
            class="drawer_body"
            :style="{ 
            'border-top': '1px solid #ddd',
            'width':width,
            'height':height,
            'background': background,
            'overflow-y':scroll?'scroll':'hidden'}"
          >
            <slot name="header">
              <div
                v-if="title||closeBtn"
                :style="{'justify-content':title?'space-between':'flex-end'}"
                class="title"
              >
                <div v-if="title">{{title}}</div>
                <el-button
                  v-if="closeBtn"
                  circle
                  size="mini"
                  class="close_btn"
                  icon="el-icon-close"
                  @click.stop="close"
                ></el-button>
              </div>
            </slot>
            <div class="divbody">
              <slot></slot>
            </div>
            <slot name="footer">
              <div class="footer">
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleConfirm"
                >{{confirmBtnName}}</el-button>
                <el-button
                  size="mini"
                  @click.stop="handlCancle"
                >{{cancleBtnName}}</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click.stop="handleReset"
                >{{$t('button.reset')}}</el-button>
              </div>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    // 是否显示drawer
    drawerVisible: Boolean,
    // drawer方向
    direction: {
      type: String,
      validator(val) {
        return ["right", "left","top","bottom"].indexOf(val) !== -1;
      },
      default:"top"
    },
    // drawer宽度
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "50%"
    },
    // drawer背景色
    background: {
      type: String,
      default: "#ffffff"
    },
    // 是否显示遮罩层
    mask: {
      type: Boolean,
      default: true
    },
    // drawer标题
    title: String,
    // 是否显示关闭按钮
    closeBtn: {
      type: Boolean,
      default: false
    },
    // 是否开启滚动
    scroll: {
      type: Boolean,
      default: false
    },
    confirmBtnName:{
      type: String,
      default: "确认"
    },
    cancleBtnName:{
      type: String,
      default: "取消"
    },
    // 是否显示重置按钮
    showReset: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    drawerVisible(n, o) {
      if (n == true) {
        document.documentElement.style.overflowY = "hidden";
        document.documentElement.style.overflowX = "hidden";
      }
    }
  },
  methods: {
    close() {
      this.$emit("update:drawerVisible", false);
      this.$emit("close");
      document.documentElement.style.overflowY = "scroll";
    },
    close_() {},
     handlCancle() {
      this.$emit("update:drawerVisible", false);
      this.$emit('cancle')
      document.documentElement.style.overflowY = "scroll";
    },
    handleConfirm(){
      this.$emit("update:drawerVisible", false);
      this.$emit('confirm')
      document.documentElement.style.overflowY = "scroll";
    },
    handleReset(){
      this.$emit('reset')
    }
  }
};
</script>

<style scoped>
.divbody {
  padding: 10px;
  float: left;
  width: 100%;
}
.drawer {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1000000 !important;
  pointer-events: none;
}
.drawer .drawer_body {
  position: absolute;
  z-index: 1000001;
  background-color: #fff;
  pointer-events: auto;
  padding: 10px;
}
.mask {
  height: 100%;
  width: 100vw;
  position: absolute;
  z-index: 1000000;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
}
.title {
  border-bottom: 0.1px #ddd solid;
  padding: 10px;
  color: #000;
  display: flex;
  justify-content: space-between;
}
.close_btn {
  color: #000;
  border: none;
  background: none;
}
.footer {
  border-top: 0.1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.right-enter-active,
.right-leave-active,
.left-enter-active,
.left-leave-active {
  will-change: transform;
  transition: transform 300ms;
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.right-enter,
.right-leave-active {
  transform: translate(-100%, 0);
}
.left-leave-active,
.left-enter {
  transform: translate(100%, 0);
}

.top-enter-active,
.top-leave-active {
  will-change: transform;
  transition: all 0.6ms cubic-bezier(0.25, 0.25, 0.75, 0.75);
  position: absolute;
  width: 100vw;
  height: 100%;
  overflow: hidden;
}

.mask-enter-active,
.mask-leave-active {
  transition: opacity 0.5s;
}
.mask-enter, .mask-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>