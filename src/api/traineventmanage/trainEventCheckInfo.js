import request from '@/utils/request'


export function getTrainEventCheckInfoList(params) {
  return request({
      url: '/traineventmanage/traineventcheckinfo/',
      method: 'get',
      params: params
  })
}
export function readTrainEventCheckInfo(id) {
  return request({
      url: `/traineventmanage/traineventcheckinfo/${id}/`,
      method: 'get'
  })
}
export function createTrainEventCheckInfo(data) {
  return request({
      url: '/traineventmanage/traineventcheckinfo/',
      method: 'post',
      data
  })
}
export function updateTrainEventCheckInfo(id, data) {
  return request({
      url: `/traineventmanage/traineventcheckinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteTrainEventCheckInfo(id) {
  return request({
      url: `/traineventmanage/traineventcheckinfo/${id}/`,
      method: 'delete'
  })
}
export function exportTrainEventCheckInfo(data = null) {
  return request({
      url: '/traineventmanage/traineventcheckinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}

// 培训活动
export function getTrainEventInfoList(params) {
  return request({
      url: '/traineventmanage/traineventinfo/',
      method: 'get',
      params: params
  })
}

// 活动实施记录
export function getTrainEventImplementationRecordInfoList(params) {
  return request({
      url: '/traineventmanage/traineventimplementationrecordinfo/',
      method: 'get',
      params: params
  })
}

// 经费使用情况
export function getTrainEventFundsRecordInfoList(params) {
  return request({
      url: '/traineventmanage/traineventfundsrecordinfo/',
      method: 'get',
      params: params
  })
}

// 活动签到记录
export function getTrainEventSigninRecordInfoList(params) {
  return request({
      url: '/traineventmanage/traineventsigninrecordinfo/',
      method: 'get',
      params: params
  })
}

// 活动签到记录
export function getTrainEventClassHourInfoList(params) {
  return request({
      url: '/traineventmanage/traineventclasshourinfo/',
      method: 'get',
      params: params
  })
}

export function getTrainEventTeacherInfo(params) {
  return request({
      url: '/traineventmanage/traineventteacherinfo/',
      method: 'get',
      params: params
  })
}