import request from '@/utils/request'


export function getTeacherInfoList(params) {
  return request({
      url: '/traineventmanage/teacherinfo/',
      method: 'get',
      params: params
  })
}
export function readTeacherInfo(id) {
  return request({
      url: `/traineventmanage/teacherinfo/${id}/`,
      method: 'get'
  })
}
export function createTeacherInfo(data) {
  return request({
      url: '/traineventmanage/teacherinfo/',
      method: 'post',
      data
  })
}
export function updateTeacherInfo(id, data) {
  return request({
      url: `/traineventmanage/teacherinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteTeacherInfo(id) {
  return request({
      url: `/traineventmanage/teacherinfo/${id}/`,
      method: 'delete'
  })
}
export function exportTeacherInfo(data = null) {
  return request({
      url: '/traineventmanage/teacherinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
