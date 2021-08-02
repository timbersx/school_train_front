import request from '@/utils/request'

// 幼教中心管理接口
export function getPreschoolInfo(params) {
  return request({
    url: '/traineventmanage/preschooleducationinfo/',
    method: 'get',
    params
  })
}

// 根据id获取数据
export function readPreschool(id) {
  return request({
    url: `/traineventmanage/preschooleducationinfo/${id}/`,
    method: 'get'
  })
}

// 创建数据
export function createPreschool(data) {
  return request({
    url: '/traineventmanage/preschooleducationinfo/',
    method: 'post',
    data
  })
}

// 根据id更新数据
export function updatePreschool(id, data) {
  return request({
    url: `/traineventmanage/preschooleducationinfo/${id}/`,
    method: 'put',
    data
  })
}
// 删除数据
export function deletePreschool(id) {
  return request({
    url: `/traineventmanage/preschooleducationinfo/${id}/`,
    method: 'delete'
  })
}
