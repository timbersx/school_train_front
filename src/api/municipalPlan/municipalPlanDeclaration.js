import request from '@/utils/request'

export function getAnnualTrainPlanInfoList(params) {
  return request({
    url: '/areatraining/annualtrainplaninfo/',
    method: 'get',
    params: params
  })
}
export function readAnnualTrainPlanInfo(id) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/`,
    method: 'get'
  })
}
export function createAnnualTrainPlanInfo(data) {
  return request({
    url: '/areatraining/annualtrainplaninfo/',
    method: 'post',
    data
  })
}
export function updateAnnualTrainPlanInfo(id, data) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/`,
    method: 'patch',
    data
  })
}
export function deleteAnnualTrainPlanInfo(id) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/`,
    method: 'delete'
  })
}
export function exportAnnualTrainPlanInfo(data = null) {
  return request({
    url: '/areatraining/annualtrainplaninfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getAnnualTrainPlanSchoolInfoList(params) {
  return request({
    url: '/areatraining/annualtrainplaninfo/',
    method: 'get',
    params: params
  })
}
export function getAnnualTrainPlanYearList(params) {
  return request({
    url: '/areatraining/annualtrainplanyear/',
    method: 'get',
    params: params
  })
}
export function getAnnualTrainPlanTypeInfoList(params) {
  return request({
    url: '/areatraining/annualtrainplantype/',
    method: 'get',
    params: params
  })
}
export function annualTrainPlanSubmitCheck(id) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/submit_check/`,
    method: 'post'
  })
}
export function getCheckRecordsList(id, params) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/check_records/`,
    method: 'get',
    params: params
  })
}
