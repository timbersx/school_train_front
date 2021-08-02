import request from '@/utils/request'


export function getWjssoStudentInfoList(params) {
  return request({
      url: '/wjsso/wjssostudentinfo/',
      method: 'get',
      params: params
  })
}
export function readWjssoStudentInfo(id) {
  return request({
      url: `/wjsso/wjssostudentinfo/${id}/`,
      method: 'get'
  })
}
export function createWjssoStudentInfo(data) {
  return request({
      url: '/wjsso/wjssostudentinfo/',
      method: 'post',
      data
  })
}
export function updateWjssoStudentInfo(id, data) {
  return request({
      url: `/wjsso/wjssostudentinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteWjssoStudentInfo(id) {
  return request({
      url: `/wjsso/wjssostudentinfo/${id}/`,
      method: 'delete'
  })
}
export function exportWjssoStudentInfo(data = null) {
  return request({
      url: '/wjsso/wjssostudentinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
