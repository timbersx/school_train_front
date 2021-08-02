import {
  stat
} from "fs";

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  //roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  permission_addRoutes: state => state.permission.addRoutes,
  top_nav_menus: state => state.permission.topNavMenus,
  top_nav_menus_active_index: state => state.permission.topNavMenuActiveIndex
}
export default getters
