import request from '@/utils/request'

//获取非系统角色的数据
export function getAuthGroupList(params) {
  // params.type = 1
  return request({
    url: '/system/role/',
    method: 'get',
    params: params
  })
}

//获取系统角色的数据
export function getSystemAuthGroupList(params) {
  // params.type = 0
  return request({
    url: '/system/role/',
    method: 'get',
    params: params
  })
}

export function createAuthGroup(data) {
  return request({
    url: '/system/role/',
    method: 'post',
    data
  })
}


export function updateAuthGroup(id, data) {
  return request({
    url: `/system/role/${id}/`,
    method: 'put',
    data
  })
}

export function deleteAuthGroup(id) {
  return request({
    url: `/system/role/${id}/`,
    method: 'delete'
  })
}

export function readAuthGroup(id) {
  return request({
    url: `/system/role/${id}/`,
    method: 'get'
  })
}

export function authGroupUpdateResource(id, data) {
  return request({
    url: `/system/role/${id}/update_resource/`,
    method: 'post',
    data
  })
}
export function exportAuthGroup(data = null) {
  return request({
    url: '/system/role/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
