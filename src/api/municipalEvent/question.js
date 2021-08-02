import request from '@/utils/request'

export function getQuestionList(params) {
    return request({
        url: '/areatraining/evaluatequestion/',
        method: 'get',
        params: params
    })
  }