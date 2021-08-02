import request from '@/utils/request'

export function getOrganizationTypeList(params) {
  return request({
    url: '/system/organizationtype/',
    method: 'get',
    params: params
  })
}
export function readOrganizationType(id) {
  return request({
    url: `/system/organizationtype/${id}/`,
    method: 'get'
  })
}
export function createOrganizationType(data) {
  return request({
    url: '/system/organizationtype/',
    method: 'post',
    data
  })
}
export function updateOrganizationType(id, data) {
  return request({
    url: `/system/organizationtype/${id}/`,
    method: 'put',
    data
  })
}
export function deleteOrganizationType(id) {
  return request({
    url: `/system/organizationtype/${id}/`,
    method: 'delete'
  })
}
export function exportOrganizationType(data = null) {
  return request({
    url: '/system/organizationtype/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

