import request from '@/utils/request'


export function getWjssoTeacherInfoList(params) {
  return request({
      url: '/traineventmanage/teacherinfo/',
      method: 'get',
      params: params
  })
}
export function readWjssoTeacherInfo(id) {
  return request({
      url: `/wjsso/wjssoteacherinfo/${id}/`,
      method: 'get'
  })
}
export function createWjssoTeacherInfo(data) {
  return request({
      url: '/wjsso/wjssoteacherinfo/',
      method: 'post',
      data
  })
}
export function updateWjssoTeacherInfo(id, data) {
  return request({
      url: `/wjsso/wjssoteacherinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteWjssoTeacherInfo(id) {
  return request({
      url: `/wjsso/wjssoteacherinfo/${id}/`,
      method: 'delete'
  })
}
export function exportWjssoTeacherInfo(data = null) {
  return request({
      url: '/wjsso/wjssoteacherinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
