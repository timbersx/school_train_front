import request from '@/utils/request'

export function getTrainEventImplementationRecordInfoList(params) {
  return request({
    url: '/traineventmanage/traineventimplementationrecordinfo/',
    method: 'get',
    params: params
  })
}
export function readTrainEventImplementationRecordInfo(id) {
  return request({
    url: `/traineventmanage/traineventimplementationrecordinfo/${id}/`,
    method: 'get'
  })
}
export function createTrainEventImplementationRecordInfo(data) {
  return request({
    url: '/traineventmanage/traineventimplementationrecordinfo/',
    method: 'post',
    data
  })
}
export function updateTrainEventImplementationRecordInfo(id, data) {
  return request({
    url: `/traineventmanage/traineventimplementationrecordinfo/${id}/`,
    method: 'put',
    data
  })
}
export function deleteTrainEventImplementationRecordInfo(id) {
  return request({
    url: `/traineventmanage/traineventimplementationrecordinfo/${id}/`,
    method: 'delete'
  })
}
export function exportTrainEventImplementationRecordInfo(data = null) {
  return request({
    url: '/traineventmanage/traineventimplementationrecordinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getSchoolTrainEventImplementationRecordInfoList(params) {
  return request({
    url: '/traineventmanage/traineventimplementationrecordinfo/school_list/',
    method: 'get',
    params: params
  })
}
export function createSchoolTrainEventImplementationRecordInfo(data) {
  return request({
    url: '/traineventmanage/traineventimplementationrecordinfo/school_create/',
    method: 'post',
    data
  })
}
export function updateSchoolTrainEventImplementationRecordInfo(id, data) {
  return request({
    url: `/traineventmanage/traineventimplementationrecordinfo/${id}/school_update/`,
    method: 'post',
    data
  })
}
export function deleteSchoolTrainEventImplementationRecordInfo(id) {
  return request({
    url: `/traineventmanage/traineventimplementationrecordinfo/${id}/school_destroy/`,
    method: 'delete'
  })
}
