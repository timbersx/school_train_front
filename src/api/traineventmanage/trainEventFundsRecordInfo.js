import request from '@/utils/request'

export function getTrainEventFundsRecordInfoList(params) {
  return request({
    url: '/traineventmanage/traineventfundsrecordinfo/',
    method: 'get',
    params: params
  })
}
export function readTrainEventFundsRecordInfo(id) {
  return request({
    url: `/traineventmanage/traineventfundsrecordinfo/${id}/`,
    method: 'get'
  })
}
export function createTrainEventFundsRecordInfo(data) {
  return request({
    url: '/traineventmanage/traineventfundsrecordinfo/',
    method: 'post',
    data
  })
}
export function updateTrainEventFundsRecordInfo(id, data) {
  return request({
    url: `/traineventmanage/traineventfundsrecordinfo/${id}/`,
    method: 'put',
    data
  })
}
export function deleteTrainEventFundsRecordInfo(id) {
  return request({
    url: `/traineventmanage/traineventfundsrecordinfo/${id}/`,
    method: 'delete'
  })
}
export function exportTrainEventFundsRecordInfo(data = null) {
  return request({
    url: '/traineventmanage/traineventfundsrecordinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getSchoolTrainEventFundsRecordInfoList(params) {
  return request({
    url: '/traineventmanage/traineventfundsrecordinfo/school_list/',
    method: 'get',
    params: params
  })
}
export function updateSchoolTrainEventFundsRecordInfo(id, data) {
  return request({
    url: `/traineventmanage/traineventfundsrecordinfo/${id}/school_update/`,
    method: 'post',
    data
  })
}
export function deleteSchoolTrainEventFundsRecordInfo(id) {
  return request({
    url: `/traineventmanage/traineventfundsrecordinfo/${id}/school_destroy/`,
    method: 'delete'
  })
}
export function createSchoolTrainEventFundsRecordInfo(data) {
  return request({
    url: '/traineventmanage/traineventfundsrecordinfo/school_create/',
    method: 'post',
    data
  })
}
