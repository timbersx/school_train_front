import request from '@/utils/request'


export function getWjssoSchoolTypeList(params) {
  return request({
      url: '/wjsso/wjssoschooltype/',
      method: 'get',
      params: params
  })
}
export function readWjssoSchoolType(id) {
  return request({
      url: `/wjsso/wjssoschooltype/${id}/`,
      method: 'get'
  })
}
export function createWjssoSchoolType(data) {
  return request({
      url: '/wjsso/wjssoschooltype/',
      method: 'post',
      data
  })
}
export function updateWjssoSchoolType(id, data) {
  return request({
      url: `/wjsso/wjssoschooltype/${id}/`,
      method: 'put',
      data
  })
}
export function deleteWjssoSchoolType(id) {
  return request({
      url: `/wjsso/wjssoschooltype/${id}/`,
      method: 'delete'
  })
}
export function exportWjssoSchoolType(data = null) {
  return request({
      url: '/wjsso/wjssoschooltype/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
