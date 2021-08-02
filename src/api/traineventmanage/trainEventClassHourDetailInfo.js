import request from '@/utils/request'


export function getTrainEventClassHourDetailInfoList(params) {
  return request({
      url: '/traineventmanage/traineventclasshourdetailinfo/',
      method: 'get',
      params: params
  })
}
export function readTrainEventClassHourDetailInfo(id) {
  return request({
      url: `/traineventmanage/traineventclasshourdetailinfo/${id}/`,
      method: 'get'
  })
}
export function createTrainEventClassHourDetailInfo(data) {
  return request({
      url: '/traineventmanage/traineventclasshourdetailinfo/',
      method: 'post',
      data
  })
}
export function updateTrainEventClassHourDetailInfo(id, data) {
  return request({
      url: `/traineventmanage/traineventclasshourdetailinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteTrainEventClassHourDetailInfo(id) {
  return request({
      url: `/traineventmanage/traineventclasshourdetailinfo/${id}/`,
      method: 'delete'
  })
}
export function exportTrainEventClassHourDetailInfo(data = null) {
  return request({
      url: '/traineventmanage/traineventclasshourdetailinfo/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
