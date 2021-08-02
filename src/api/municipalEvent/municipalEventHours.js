import request from '@/utils/request'

export function getTrainEventClassHourInfoList(params) {
  return request({
    url: '/areatraining/traineventclasshourinfo/',
    method: 'get',
    params: params
  })
}
export function readTrainEventClassHourInfo(id) {
  return request({
    url: `/areatraining/traineventclasshourinfo/${id}/`,
    method: 'get'
  })
}
export function createTrainEventClassHourInfo(data) {
  return request({
    url: '/areatraining/traineventclasshourinfo/',
    method: 'post',
    data
  })
}
export function updateTrainEventClassHourInfo(id, data) {
  return request({
    url: `/areatraining/traineventclasshourinfo/${id}/`,
    method: 'patch',
    data
  })
}
export function deleteTrainEventClassHourInfo(id) {
  return request({
    url: `/areatraining/traineventclasshourinfo/${id}/`,
    method: 'delete'
  })
}
export function exportTrainEventClassHourInfo(data = null) {
  return request({
    url: '/areatraining/traineventclasshourinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getSchoolTrainEventClassHourInfoList(params) {
  return request({
    url: '/areatraining/traineventclasshourinfo/',
    method: 'get',
    params: params
  })
}
// 教师端-培训活动学时认定-教师填写相关材料
export function createSchoolTrainEventClassHourInfo(data) {
  return request({
    url: '/areatraining/traineventclasshourinfo/teacher_create/',
    method: 'post',
    data
  })
}
// 学校管理模块-培训活动学时认定-认定学时
export function recognizeTrainEventClassHourInfo(id, data) {
  return request({
    url: `/areatraining/traineventclasshourinfo/${id}/hour_check/`,
    method: 'post',
    data
  })
}
// 签到记录
export function getSiginInRecordsInfo(id, params) {
  return request({
    url: `/areatraining/traineventinfo/${id}/teacher_sign_in_records/`,
    method: 'get',
    params: params
  })
}
// 学校管理模块-培训活动学时认定-批量认定学时
export function batchRecognizeTrainEventClassHourInfo(data) {
  return request({
    url: '/areatraining/traineventclasshourinfo/batch_hour_check/',
    method: 'post',
    data
  })
}
// 签到记录
export function exportClassHourInfo(data = null) {
  return request({
    url: '/areatraining/traineventclasshourinfo/school_list_export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getTrainEventInfoList(params) {
  return request({
    url: '/areatraining/traineventinfo/admin_list/',
    method: 'get',
    params
  })
}
