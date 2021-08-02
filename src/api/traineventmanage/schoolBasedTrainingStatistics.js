import request from '@/utils/request'

export function getSchoolBaseTrainInfoList(params) {
  return request({
    url: '/traineventmanage/traineventinfo/school_list/',
    method: 'get',
    params: params
  })
}

export function exportSchoolBaseTrainInfo(data = null) {
  return request({
    url: '/traineventmanage/traineventinfo/train_event_export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}

export function getSchoolBaseTrainTeacherList(id, params) {
  return request({
    url: `/traineventmanage/traineventteacherinfo/?train_event__id=${id}&confirm=true`,
    method: 'get',
    params: params
  })
}
