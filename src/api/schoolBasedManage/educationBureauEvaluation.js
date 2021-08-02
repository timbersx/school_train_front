import request from '@/utils/request'

export function annualTrainplanInfo(params) {
    return request({
        url: '/traineventmanage/annualtrainplaninfo/',
        method: 'get',
        params
    })
  }

  export function readAnnualTrainplanInfo(id, params) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/${id}/`,
        method: 'get',
        params
    })
  }

  export function getPlanScorePoints(id) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/${id}/get_plan_score_points_education/`,
        method: 'get',
    })
  }

  export function expertScoreReason(id, data) {
    return request({
        url: `/traineventmanage/annualtrainplanscorepointinfo/${id}/expert_score_reason/`,
        method: 'post',
        data
    })
  }

  export function educationSubmitCheck(data) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/education_submit_check/`,
        method: 'post',
        data
    })
  }

  export function expertSubmitCheck(id, data = {}) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/${id}/expert_submit_check/`,
        method: 'post',
        data
    })
  }

  export function expertCheck(data) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/expert_check/`,
        method: 'post',
        data
    })
  }
  
  export function categoryExport(params) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/category_export/`,
        responseType: 'arraybuffer',
        method: 'get',
        params
    })
  }

  export function batchEducationSubmitCheck(data) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/batch_education_submit_check/`,
        method: 'post',
        data
    })
  }