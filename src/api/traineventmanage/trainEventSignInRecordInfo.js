import request from '@/utils/request'


export function getTrainEventSignInRecordInfoList(params) {
  return request({
      url: '/traineventmanage/traineventsigninrecordinfo/',
      method: 'get',
      params: params
  })
}
export function readTrainEventSignInRecordInfo(id) {
  return request({
      url: `/traineventmanage/traineventsigninrecordinfo/${id}/`,
      method: 'get'
  })
}
export function createTrainEventSignInRecordInfo(data) {
  return request({
      url: '/traineventmanage/traineventsigninrecordinfo/',
      method: 'post',
      data
  })
}
export function updateTrainEventSignInRecordInfo(id, data) {
  return request({
      url: `/traineventmanage/traineventsigninrecordinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteTrainEventSignInRecordInfo(id) {
  return request({
      url: `/traineventmanage/traineventsigninrecordinfo/${id}/`,
      method: 'delete'
  })
}
export function exportTrainEventSignInRecordInfo(data = null) {
  return request({
      url: '/traineventmanage/traineventsigninrecordinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
