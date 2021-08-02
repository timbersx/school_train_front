import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/',
    method: 'post',
    data
  })
}

export function getUser(params) {
  return request({
    url: '/system/user',
    method: 'get',
    params: params
  })
}

export function logout() {
  return request({
    url: '/logout/',
    method: 'post'
  })
}

export function getUserRouter(token) {
  return request({
    url: '/system/userleftmenu/',
    method: 'get',
    params: {
      token,
      system: 0
    }
  })
}

export function getTopNavMenu(token) {
  return request({
    url: '/system/usertopmenu/',
    method: 'get',
    params: {
      token,
      system: 0
    }
  })
}

//更改用户密码
export function resetPassword(id, data) {
  return request({
    url: `/system/user/${id}/reset_password/`,
    method: 'post',
    data
  })
}
