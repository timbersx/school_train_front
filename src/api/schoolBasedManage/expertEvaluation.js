import request from '@/utils/request'

export function annualTrainplanInfo(params) {
    return request({
        url: '/traineventmanage/annualtrainplaninfo/expert_list/',
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
        url: `/traineventmanage/annualtrainplaninfo/${id}/get_plan_score_points/`,
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

  export function expertCheck(data) {
    return request({
        url: `/traineventmanage/annualtrainplaninfo/expert_check/`,
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

  export function getUserExpertIdentity() {
    return request({
        url: `/traineventmanage/expertgroupinfo/get_user_expert_identity/`,
        method: 'get',
    })
  }

