import request from '@/utils/request'

export function getResourceTree() {
  return request({
    url: '/system/resourcetree/',
    method: 'get',
    params: {
      system: 0
    }
  })
}
// 新增、修改、删除、查询

// 查
export function getMenuList(params) {
  return request({
    url: '/system/systemmenu/',
    method: 'get',
    params
  })
}
// 增
export function postMenuInformation(data) {
  return request({
    url: '/system/systemmenu/',
    method: 'post',
    data
  })
}
// 编辑
export function patchMenuInformation(id, data) {
  return request({
    url: `/system/systemmenu/${id}/`,
    method: 'put',
    data
  })
}
// 删除
// /system/systemmenu/{id}/
export function deleteMenuInformation(id) {
  return request({
    url: `/system/systemmenu/${id}/`,
    method: 'delete'
  })
}
