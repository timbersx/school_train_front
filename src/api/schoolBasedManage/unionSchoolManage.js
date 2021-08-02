import request from '@/utils/request'

// 联盟校管理接口
export function getUnionschoolInfo(params) {
  return request({
    url: '/traineventmanage/unionschoolinfo/',
    method: 'get',
    params
  })
}

// 根据id获取数据
export function readUnionschool(id) {
  return request({
    url: `/traineventmanage/unionschoolinfo/${id}/`,
    method: 'get'
  })
}

// 创建数据
export function createUnionschool(data) {
  return request({
    url: '/traineventmanage/unionschoolinfo/',
    method: 'post',
    data
  })
}

// 根据id更新数据
export function updateUnionschool(id, data) {
  return request({
    url: `/traineventmanage/unionschoolinfo/${id}/`,
    method: 'put',
    data
  })
}
// 删除数据
export function deleteUnionschool(id) {
  return request({
    url: `/traineventmanage/unionschoolinfo/${id}/`,
    method: 'delete'
  })
}
