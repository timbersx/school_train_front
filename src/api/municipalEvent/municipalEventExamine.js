import request from '@/utils/request'

export function getTrainEventCheckInfoList(params) {
  return request({
    url: '/areatraining/traineventcheckinfo/',
    method: 'get',
    params: params
  })
}
export function readTrainEventCheckInfo(id) {
  return request({
    url: `/areatraining/traineventcheckinfo/${id}/`,
    method: 'get'
  })
}
export function createTrainEventCheckInfo(data) {
  return request({
    url: '/areatraining/traineventcheckinfo/',
    method: 'post',
    data
  })
}
export function updateTrainEventCheckInfo(id, data) {
  return request({
    url: `/areatraining/traineventcheckinfo/${id}/`,
    method: 'patch',
    data
  })
}
export function deleteTrainEventCheckInfo(id) {
  return request({
    url: `/areatraining/traineventcheckinfo/${id}/`,
    method: 'delete'
  })
}
export function exportTrainEventCheckInfo(data = null) {
  return request({
    url: '/areatraining/traineventcheckinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

// 培训活动
export function getTrainEventInfoList(params) {
  return request({
    url: '/areatraining/traineventinfo/',
    method: 'get',
    params: params
  })
}

// 活动实施记录
export function getTrainEventImplementationRecordInfoList(params) {
  return request({
    url: '/areatraining/traineventimplementationrecordinfo/',
    method: 'get',
    params: params
  })
}

// 经费使用情况
export function getTrainEventFundsRecordInfoList(params) {
  return request({
    url: '/areatraining/traineventfundsrecordinfo/',
    method: 'get',
    params: params
  })
}

// 活动签到记录
export function getTrainEventSigninRecordInfoList(params) {
  return request({
    url: '/areatraining/traineventsigninrecordinfo/',
    method: 'get',
    params: params
  })
}

// 活动签到记录
export function getTrainEventClassHourInfoList(params) {
  return request({
    url: '/areatraining/traineventclasshourinfo/',
    method: 'get',
    params: params
  })
}

export function getTrainEventTeacherInfo(params) {
  return request({
    url: '/areatraining/traineventteacherinfo/',
    method: 'get',
    params: params
  })
}
