import request from '@/utils/request'

export async function getSchoolInfoList(params) {
  return request({
    url: '/system/organizationinfo/',
    method: 'get',
    params: params
  })
}
export function readSchoolInfo(id) {
  return request({
    url: `/evaluations/evaluateobjectinfo/${id}/`,
    method: 'get'
  })
}
export function createSchoolInfo(data) {
  return request({
    url: '/system/organizationinfo/',
    method: 'post',
    data
  })
}
export function updateSchoolInfo(id, data) {
  return request({
    url: `/system/organizationinfo/${id}/`,
    method: 'put',
    data
  })
}
export function deleteSchoolInfo(id) {
  return request({
    url: `/system/organizationinfo/${id}/`,
    method: 'delete'
  })
}
export function exportSchoolInfo(data = null) {
  return request({
    url: '/system/organizationinfo/export/',
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
