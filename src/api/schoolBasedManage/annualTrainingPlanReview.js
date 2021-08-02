import request from '@/utils/request'

export function getTrainPlanCheckInfo(params) {
    return request({
        url: '/traineventmanage/trainplancheckinfo/',
        method: 'get',
        params: params
    })
  }

  export function readTrainPlanCheckInfo(id) {
    return request({
        url: `/traineventmanage/trainplancheckinfo/${id}/`,
        method: 'get'
    })
  }
  export function createTrainPlanCheckInfo(data) {
    return request({
        url: '/traineventmanage/trainplancheckinfo/',
        method: 'post',
        data
    })
  }
  export function updateTrainPlanCheckInfo(id, data) {
    return request({
        url: `/traineventmanage/trainplancheckinfo/${id}/`,
        method: 'put',
        data
    })
  }

  export function deleteTrainPlanCheckInfo(id) {
    return request({
        url: `/traineventmanage/trainplancheckinfo/${id}/`,
        method: 'delete'
    })
  }

  export function exportTrainPlanCheckInfo(data = null) {
    return request({
        url: '/traineventmanage/trainplancheckinfo/export/',
        method: 'get',
        responseType: 'arraybuffer',
        params: data
    })
  }
  