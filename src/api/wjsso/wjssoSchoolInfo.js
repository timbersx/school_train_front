import request from '@/utils/request'


export function getWjssoSchoolInfoList(params) {
  return request({
      url: '/wjsso/wjssoschoolinfo/',
      method: 'get',
      params: params
  })
}
export function readWjssoSchoolInfo(id) {
  return request({
      url: `/wjsso/wjssoschoolinfo/${id}/`,
      method: 'get'
  })
}
export function createWjssoSchoolInfo(data) {
  return request({
      url: '/wjsso/wjssoschoolinfo/',
      method: 'post',
      data
  })
}
export function updateWjssoSchoolInfo(id, data) {
  return request({
      url: `/wjsso/wjssoschoolinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteWjssoSchoolInfo(id) {
  return request({
      url: `/wjsso/wjssoschoolinfo/${id}/`,
      method: 'delete'
  })
}
export function exportWjssoSchoolInfo(data = null) {
  return request({
      url: '/wjsso/wjssoschoolinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
