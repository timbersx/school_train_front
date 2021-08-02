import request from '@/utils/request'

export function getTrainEventClassHourInfoList(params) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/',
    method: 'get',
    params: params
  })
}
export function readTrainEventClassHourInfo(id) {
  return request({
    url: `/traineventmanage/traineventclasshourinfo/${id}/`,
    method: 'get'
  })
}
export function createTrainEventClassHourInfo(data) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/',
    method: 'post',
    data
  })
}
export function updateTrainEventClassHourInfo(id, data) {
  return request({
    url: `/traineventmanage/traineventclasshourinfo/${id}/`,
    method: 'put',
    data
  })
}
export function deleteTrainEventClassHourInfo(id) {
  return request({
    url: `/traineventmanage/traineventclasshourinfo/${id}/`,
    method: 'delete'
  })
}
export function exportTrainEventClassHourInfo(data = null) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getSchoolTrainEventClassHourInfoList(params) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/school_list/',
    method: 'get',
    params: params
  })
}
// 教师端-培训活动学时认定-教师填写相关材料
export function createSchoolTrainEventClassHourInfo(data) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/teacher_create/',
    method: 'post',
    data
  })
}
// 学校管理模块-培训活动学时认定-认定学时
export function recognizeTrainEventClassHourInfo(id, data) {
  return request({
    url: `/traineventmanage/traineventclasshourinfo/${id}/hour_check/`,
    method: 'post',
    data
  })
}
// 签到记录
export function getSiginInRecordsInfo(id, params) {
  return request({
    url: `/traineventmanage/traineventinfo/${id}/teacher_sign_in_records/`,
    method: 'get',
    params: params
  })
}
// 学校管理模块-培训活动学时认定-批量认定学时
export function batchRecognizeTrainEventClassHourInfo(data) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/batch_hour_check/',
    method: 'post',
    data
  })
}
// 签到记录
export function exportClassHourInfo(data = null) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/school_list_export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
