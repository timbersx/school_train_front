import request from '@/utils/request'

export function getScorePointInfo(params) {
  return request({
    url: '/areatraining/scorepointinfo/',
    method: 'get',
    params
  })
}

export function readScorePointInfo(id) {
  return request({
    url: `/areatraining/scorepointinfo/${id}/`,
    method: 'get'
  })
}

export function addScorePointInfo(data) {
  return request({
    url: '/areatraining/scorepointinfo/',
    method: 'post',
    data
  })
}

export function updateScorePointInfo(id, data) {
  return request({
    url: `/areatraining/scorepointinfo/${id}/`,
    method: 'patch',
    data
  })
}

export function delScorePointInfo(id) {
  return request({
    url: `/areatraining/scorepointinfo/${id}/`,
    method: 'delete'
  })
}
