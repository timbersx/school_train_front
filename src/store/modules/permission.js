import { getUserRouter, getTopNavMenu } from '@/api/systemmanage/user'
import { formatMenu } from '@/utils/lib'
import { getTopNavMenuIndex } from '@/utils/auth'
import { constantRoutes, lastRoutes } from '@/router/index'




/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  topNavMenuActiveIndex: 0,
  topNavMenus: [],
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_TOP_NAV_MENUS_ACTIVE_INDEX: (state, index) => {
    state.topNavMenuActiveIndex = index
  },
  SET_TOP_NAV_MENUS: (state, topNavMenus) => {
    state.topNavMenus = topNavMenus
  },
  SET_ALL_ROUTES: (state, allRouters) => {
    state.addRoutes = allRouters//所有路由
    //state.routes = allRouters 
  },
  SET_MENU_ROUTES: (state, menuRouters) => {
    state.routes = menuRouters //constantRoutes.concat(routes)
  }
}

const actions = {
  getTopNavMenu({ commit, dispatch }, token) {
    return new Promise((resolve, reject) => {
      getTopNavMenu(token).then(response => {
        const { data } = response
        commit('SET_TOP_NAV_MENUS', data)
        let sessionActiveIndex = getTopNavMenuIndex()
        if (sessionActiveIndex != null) {
          //commit('SET_TOP_NAV_MENUS_ACTIVE_INDEX', sessionActiveIndex)

          dispatch('setTopNavMenusActiveIndex', sessionActiveIndex)
        }
        else {

          if (data.length > 0)
            dispatch('setTopNavMenusActiveIndex', data[0].id)
          //commit('SET_TOP_NAV_MENUS_ACTIVE_INDEX', data[0].id)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  generateRoutes({ commit, dispatch }, token) {
    return new Promise((resolve, reject) => {
      getUserRouter(token).then(response => {
        const { data } = response
        const allRouters = constantRoutes.concat(formatMenu(data).concat(lastRoutes))
        commit('SET_ALL_ROUTES', allRouters) //从后台获取到的所有路由信息添加到路由中

        //根据选中的topNavmenu加载左侧的菜单 添加到左侧要显示到路由 
        dispatch('changeSidebar', state.topNavMenuActiveIndex)

        resolve(allRouters)
      }).catch(error => {
        reject(error)
      })
    })
  },
  changeSidebar({ commit }, top_menu_index) {
    return new Promise((resolve, reject) => {
      //根据选中的topNavmenu加载左侧的菜单
      let menu_routes = []
      state.addRoutes.forEach(item => {
        if (item.parent_id == top_menu_index) {
          menu_routes.push(item)
        }
      })
      commit('SET_MENU_ROUTES', menu_routes)//添加到左侧要显示到路由  
      //commit('SET_MENU_ROUTES', setSideBar(top_menu_indx))//添加到左侧要显示到路由
      resolve()
    }).catch(error => {
      reject(error)
    })
  },
  setTopNavMenusActiveIndex({ commit }, index) {
    return new Promise((resolve, reject) => {
      commit('SET_TOP_NAV_MENUS_ACTIVE_INDEX', index)
      resolve()
    }).catch(error => {
      reject(error)
    })
  },
  reSetAllPermission({ commit }) {
    //重置Permission中的所有state，重置为空
    commit('SET_TOP_NAV_MENUS_ACTIVE_INDEX', -999)
    commit('SET_TOP_NAV_MENUS', [])
    commit('SET_ALL_ROUTES', [])
    commit('SET_MENU_ROUTES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
