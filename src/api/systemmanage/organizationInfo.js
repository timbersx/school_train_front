import request from '@/utils/request'

export function getOrganizationInfoList(params) {
  return request({
    url: '/system/organizationinfo/',
    method: 'get',
    params: params
  })
}
export function readOrganizationInfo(id) {
  return request({
    url: `/system/organizationinfo/${id}/`,
    method: 'get'
  })
}
export function createOrganizationInfo(data) {
  return request({
    url: '/system/organizationinfo/',
    method: 'post',
    data
  })
}
export function updateOrganizationInfo(id, data) {
  return request({
    url: `/system/organizationinfo/${id}/`,
    method: 'put',
    data
  })
}
export function deleteOrganizationInfo(id) {
  return request({
    url: `/system/organizationinfo/${id}/`,
    method: 'delete'
  })
}
export function exportOrganizationInfo(data = null) {
  return request({
    url: '/system/organizationinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getTypesOrganizationList(id, data) {
  return request({
    url: `/evaluations/evaluateprojectinfo/${id}/get_types_organizations/`,
    method: 'post',
    data
  })
}
