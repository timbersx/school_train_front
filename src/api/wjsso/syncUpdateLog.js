import request from '@/utils/request'


export function getSyncUpdateLogList(params) {
  return request({
      url: '/wjsso/syncupdatelog/',
      method: 'get',
      params: params
  })
}
export function readSyncUpdateLog(id) {
  return request({
      url: `/wjsso/syncupdatelog/${id}/`,
      method: 'get'
  })
}
export function createSyncUpdateLog(data) {
  return request({
      url: '/wjsso/syncupdatelog/',
      method: 'post',
      data
  })
}
export function updateSyncUpdateLog(id, data) {
  return request({
      url: `/wjsso/syncupdatelog/${id}/`,
      method: 'put',
      data
  })
}
export function deleteSyncUpdateLog(id) {
  return request({
      url: `/wjsso/syncupdatelog/${id}/`,
      method: 'delete'
  })
}
export function exportSyncUpdateLog(data = null) {
  return request({
      url: '/wjsso/syncupdatelog/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
