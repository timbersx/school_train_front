import request from '@/utils/request'

export function getScorePointInfo(params) {
    return request({
        url: `/traineventmanage/scorepointinfo/`,
        method: 'get',
        params
    })
  }

  export function readScorePointInfo(id) {
    return request({
        url: `/traineventmanage/scorepointinfo/${id}/`,
        method: 'get',
    })
  }

  export function addScorePointInfo(data) {
    return request({
        url: `/traineventmanage/scorepointinfo/`,
        method: 'post',
        data
    })
  }

  export function updateScorePointInfo(id, data) {
    return request({
        url: `/traineventmanage/scorepointinfo/${id}/`,
        method: 'put',
        data
    })
  }

  export function delScorePointInfo(id) {
    return request({
        url: `/traineventmanage/scorepointinfo/${id}/`,
        method: 'delete'
    })
  }