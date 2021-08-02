import request from '@/utils/request'

// 培训活动接口
export function getTrainEventInfoList(params) {
  return request({
    url: '/traineventmanage/traineventinfo/',
    method: 'get',
    params: params
  })
}

// 个人年度校本培训记录
export function getTrainEventSigninInfoList(params) {
  return request({
    url: '/traineventmanage/traineventsigninrecordinfo/',
    method: 'get',
    params: params
  })
}

// 个人年度校本培训记录
export function getTrainEventClassHourInfoList(params) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/',
    method: 'get',
    params: params
  })
}