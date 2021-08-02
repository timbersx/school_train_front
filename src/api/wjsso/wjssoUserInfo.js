import request from '@/utils/request'


export function getWjssoUserInfoList(params) {
  return request({
      url: '/wjsso/wjssouserinfo/',
      method: 'get',
      params: params
  })
}
export function readWjssoUserInfo(id) {
  return request({
      url: `/wjsso/wjssouserinfo/${id}/`,
      method: 'get'
  })
}
export function createWjssoUserInfo(data) {
  return request({
      url: '/wjsso/wjssouserinfo/',
      method: 'post',
      data
  })
}
export function updateWjssoUserInfo(id, data) {
  return request({
      url: `/wjsso/wjssouserinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteWjssoUserInfo(id) {
  return request({
      url: `/wjsso/wjssouserinfo/${id}/`,
      method: 'delete'
  })
}
export function exportWjssoUserInfo(data = null) {
  return request({
      url: '/wjsso/wjssouserinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
