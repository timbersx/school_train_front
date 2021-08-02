import request from '@/utils/request'

export function getSyncUpdateLogList(params) {
  return request({
    url: '/wjsso/syncupdatelog/',
    method: 'get',
    params: params
  })
}

export function createSyncTeacherInfo(data) {
  return request({
    url: '/wjsso/wjssouserinfo/sync_info_general/',
    method: 'post',
    data
  })
}
