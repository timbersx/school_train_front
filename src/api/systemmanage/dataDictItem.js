import request from '@/utils/request'

export function getDataDictItemList(params) {
  return request({
    url: '/system/datadictitemquery/',
    method: 'get',
    params: params
  })
}
export function readDataDictItem(id) {
  return request({
    url: `/system/datadictitem/${id}/`,
    method: 'get'
  })
}
export function createDataDictItem(data) {
  return request({
    url: '/system/datadictitem/',
    method: 'post',
    data
  })
}
export function updateDataDictItem(id, data) {
  return request({
    url: `/system/datadictitem/${id}/`,
    method: 'put',
    data
  })
}
export function deleteDataDictItem(id) {
  return request({
    url: `/system/datadictitem/${id}/`,
    method: 'delete'
  })
}
