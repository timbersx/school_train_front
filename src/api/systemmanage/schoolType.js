import request from '@/utils/request'

export async function getSchoolTypeList(params) {
  return request({
    url: '/system/organizationtype/',
    method: 'get',
    params: params
  })
}
export function readSchoolType(id) {
  return request({
    url: `/system/organizationtype/${id}/`,
    method: 'get'
  })
}
export function createSchoolType(data) {
  return request({
    url: '/system/organizationtype/',
    method: 'post',
    data
  })
}
export function updateSchoolType(id, data) {
  return request({
    url: `/system/organizationtype/${id}/`,
    method: 'put',
    data
  })
}
export function deleteSchoolType(id) {
  return request({
    url: `/system/organizationtype/${id}/`,
    method: 'delete'
  })
}
export function exportSchoolType(data = null) {
  return request({
    url: '/system/organizationtype/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
// 学校基础信息全量同步
export function getTotalSyncSchoolInfo(data) {
  return request({
    url: '/wjsso/wjssouserinfo/total_sync_school_info/',
    method: 'post',
    data
  })
}

// 学校基础信息增量同步
export function getIncrementSyncSchoolInfo(data) {
  return request({
    url: '/wjsso/wjssouserinfo/increment_sync_school_info/',
    method: 'post',
    data
  })
}