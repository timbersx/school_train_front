import {
  login,
  logout
} from '@/api/systemmanage/user'
import {
  getToken,
  setToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  setSessionUserType,
  removeSessionUserType
} from '@/utils/auth'
import {
  Message
} from 'element-ui'

import {
  getSysconst
} from '@/api/utils'

import {
  allow_login_user_role_code
} from '@/utils/userType'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  userRouters: [],
  userInfo: getUserInfo()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_ROUTER: (state, userRouters) => {
    state.userRouters = userRouters
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        //const { data } = response
        const data = response.data
        const token = 'JWT ' + data.token
        const dataUsers = data.user
//-------------无用户类型时------------
        commit('SET_TOKEN', token)
          commit('SET_USER_INFO', dataUsers) //用户信息
          //commit('SET_NAME', data.nick_name)//这里不对，需要重新写
          setToken(token)
          setUserInfo(JSON.stringify(dataUsers))

          getSysconst('User_Type').then(response => {
            console.log(response.data)
            setSessionUserType(JSON.stringify(response.data))
          })
//-------------无用户类型时------------

        //----------------- 有用户类型时 ----------------
        // let allowerLogin = []
        // dataUsers.user_role.forEach(element => {
        //   if (allow_login_user_role_code.findIndex(item => {
        //       return item == element.code
        //     }) > -1) {

        //     allowerLogin.push(element.id)
        //   }
        // })

        // if (allowerLogin.length > 0) { //if (dataUsers.user_type.includes('A') || dataUsers.user_type.includes('T')) {
        //   commit('SET_TOKEN', token)
        //   commit('SET_USER_INFO', dataUsers) //用户信息
        //   //commit('SET_NAME', data.nick_name)//这里不对，需要重新写
        //   setToken(token)
        //   setUserInfo(JSON.stringify(dataUsers))

        //   getSysconst('User_Type').then(response => {
        //     console.log(response.data)
        //     setSessionUserType(JSON.stringify(response.data))
        //   })

        // } else {
        //   Message({
        //     dangerouslyUseHTMLString: true,
        //     message: '您无权限进入系统，请与系统管理员联系', //'Permission Denied',
        //     type: 'error',
        //     duration: 5 * 1000
        //   })
        // }
        //----------------- 有用户类型时 ----------------
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  ssoLogin({
    commit
  }, ssoLoginData) {
    return new Promise((resolve, reject) => {
      
        const data = ssoLoginData
        const token = 'JWT ' + data.token
        const dataUsers = data.user
        commit('SET_TOKEN', token)
          commit('SET_USER_INFO', dataUsers) 
          setToken(token)
          setUserInfo(JSON.stringify(dataUsers))

          getSysconst('User_Type').then(response => {
            setSessionUserType(JSON.stringify(response.data))
          })
        resolve()

    })
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         reject('Verification failed, please Login again.')
  //       }

  //       const { roles, name, avatar } = data

  //       // roles must be a non-empty array
  //       if (!roles || roles.length <= 0) {
  //         reject('getInfo: roles must be a non-null array!')
  //       }

  //       //commit('SET_ROLES', roles)
  //       //commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },


  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeUserInfo()
        removeSessionUserType()
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
