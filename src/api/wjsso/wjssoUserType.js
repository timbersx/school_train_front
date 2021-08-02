import request from '@/utils/request'


export function getWjssoUserTypeList(params) {
  return request({
      url: '/wjsso/wjssousertype/',
      method: 'get',
      params: params
  })
}
export function readWjssoUserType(id) {
  return request({
      url: `/wjsso/wjssousertype/${id}/`,
      method: 'get'
  })
}
export function createWjssoUserType(data) {
  return request({
      url: '/wjsso/wjssousertype/',
      method: 'post',
      data
  })
}
export function updateWjssoUserType(id, data) {
  return request({
      url: `/wjsso/wjssousertype/${id}/`,
      method: 'put',
      data
  })
}
export function deleteWjssoUserType(id) {
  return request({
      url: `/wjsso/wjssousertype/${id}/`,
      method: 'delete'
  })
}
export function exportWjssoUserType(data = null) {
  return request({
      url: '/wjsso/wjssousertype/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
