import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/table/auth',
//     method: 'get',
//     params
//   })
// }

// 获取列表
export function getAuthList(params) {
  return request({
    url: '/system/user/',
    method: 'get',
    params: params
  })
}
// 根据id获取数据
export function readAuth(id) {
  return request({
    url: `/system/user/${id}/`,
    method: 'get'
  })
}
// 创建数据
export function createAuth(data) {
  return request({
    url: '/system/user/',
    method: 'post',
    data
  })
}

// 根据id更新数据
export function updateAuth(id, data) {
  return request({
    url: `/system/user/${id}/`,
    method: 'put',
    data
  })
}
// 删除数据
export function deleteAuth(id) {
  return request({
    url: `/system/user/${id}/`,
    method: 'delete'
  })
}

// 更新用户权限
export function authUpdateResource(id, data) {
  return request({
    url: `/system/user/${id}/update_resource/`,
    method: 'post',
    data
  })
}
export function exportAuth(data = null) {
  return request({
    url: '/system/user/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
// 获取列表
export function getExpertAuthList(params) {
  return request({
    url: '/traineventmanage/expertgroupinfo/get_professional_user/',
    method: 'get',
    params: params
  })
}
export function getEvaluateObjectTeacherUsers(params) {
  return request({
    url: '/system/user/get_evaluate_object_teacher_users/',
    method: 'get',
    params
  })
}
