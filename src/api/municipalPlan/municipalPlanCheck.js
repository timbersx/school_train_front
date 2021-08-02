import request from '@/utils/request'

export function annualTrainplanInfo(params) {
  return request({
    url: '/areatraining/annualtrainplaninfo/',
    method: 'get',
    params
  })
}

export function readAnnualTrainplanInfo(id, params) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/`,
    method: 'get',
    params
  })
}

export function getPlanScorePoints(id) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/get_plan_score_points_education/`,
    method: 'get'
  })
}

export function expertScoreReason(id, data) {
  return request({
    url: `/areatraining/annualtrainplanscorepointinfo/${id}/expert_score_reason/`,
    method: 'post',
    data
  })
}

export function educationSubmitCheck(data) {
  return request({
    url: '/areatraining/annualtrainplaninfo/education_submit_check/',
    method: 'post',
    data
  })
}

export function expertSubmitCheck(id, data = {}) {
  return request({
    url: `/areatraining/annualtrainplaninfo/${id}/expert_submit_check/`,
    method: 'post',
    data
  })
}

export function expertCheck(data) {
  return request({
    url: '/areatraining/annualtrainplaninfo/expert_check/',
    method: 'post',
    data
  })
}

export function categoryExport(params) {
  return request({
    url: '/areatraining/annualtrainplaninfo/category_export/',
    responseType: 'arraybuffer',
    method: 'get',
    params
  })
}

export function batchEducationSubmitCheck(data) {
  return request({
    url: '/areatraining/annualtrainplaninfo/batch_education_submit_check/',
    method: 'post',
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
