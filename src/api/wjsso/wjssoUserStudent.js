import request from '@/utils/request'


export function getWjssoUserStudentList(params) {
  return request({
      url: '/wjsso/wjssouserstudent/',
      method: 'get',
      params: params
  })
}
export function readWjssoUserStudent(id) {
  return request({
      url: `/wjsso/wjssouserstudent/${id}/`,
      method: 'get'
  })
}
export function createWjssoUserStudent(data) {
  return request({
      url: '/wjsso/wjssouserstudent/',
      method: 'post',
      data
  })
}
export function updateWjssoUserStudent(id, data) {
  return request({
      url: `/wjsso/wjssouserstudent/${id}/`,
      method: 'put',
      data
  })
}
export function deleteWjssoUserStudent(id) {
  return request({
      url: `/wjsso/wjssouserstudent/${id}/`,
      method: 'delete'
  })
}
export function exportWjssoUserStudent(data = null) {
  return request({
      url: '/wjsso/wjssouserstudent/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
