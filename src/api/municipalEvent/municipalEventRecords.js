import request from '@/utils/request'

export function getTrainEventImplementationRecordInfoList(params) {
  return request({
    url: '/areatraining/traineventimplementationrecordinfo/',
    method: 'get',
    params: params
  })
}
export function readTrainEventImplementationRecordInfo(id) {
  return request({
    url: `/areatraining/traineventimplementationrecordinfo/${id}/`,
    method: 'get'
  })
}
export function createTrainEventImplementationRecordInfo(data) {
  return request({
    url: '/areatraining/traineventimplementationrecordinfo/',
    method: 'post',
    data
  })
}
export function updateTrainEventImplementationRecordInfo(id, data) {
  return request({
    url: `/areatraining/traineventimplementationrecordinfo/${id}/`,
    method: 'patch',
    data
  })
}
export function deleteTrainEventImplementationRecordInfo(id) {
  return request({
    url: `/areatraining/traineventimplementationrecordinfo/${id}/`,
    method: 'delete'
  })
}
export function exportTrainEventImplementationRecordInfo(data = null) {
  return request({
    url: '/areatraining/traineventimplementationrecordinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getSchoolTrainEventImplementationRecordInfoList(params) {
  return request({
    url: '/areatraining/traineventimplementationrecordinfo/school_list/',
    method: 'get',
    params: params
  })
}
export function createSchoolTrainEventImplementationRecordInfo(data) {
  return request({
    url: '/areatraining/traineventimplementationrecordinfo/school_create/',
    method: 'post',
    data
  })
}
export function updateSchoolTrainEventImplementationRecordInfo(id, data) {
  return request({
    url: `/areatraining/traineventimplementationrecordinfo/${id}/school_update/`,
    method: 'post',
    data
  })
}
export function deleteSchoolTrainEventImplementationRecordInfo(id) {
  return request({
    url: `/areatraining/traineventimplementationrecordinfo/${id}/school_destroy/`,
    method: 'delete'
  })
}
