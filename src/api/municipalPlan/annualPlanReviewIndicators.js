import request from '@/utils/request'

export function getIndicatorinfo(params) {
  return request({
    url: '/areatraining/indicatorinfo/',
    method: 'get',
    params
  })
}

export function readIndicatorinfo(id) {
  return request({
    url: `/areatraining/indicatorinfo/${id}/`,
    method: 'get'
  })
}

export function delIndicatorinfo(id) {
  return request({
    url: `/areatraining/indicatorinfo/${id}/`,
    method: 'delete'
  })
}

export function addIndicatorinfo(data) {
  return request({
    url: '/areatraining/indicatorinfo/',
    method: 'post',
    data
  })
}

export function updateIndicatorinfo(id, data) {
  return request({
    url: `/areatraining/indicatorinfo/${id}/`,
    method: 'patch',
    data
  })
}

export function getTreeData() {
  // debugger
  return request({
    url: '/areatraining/indicatorinfo/get_indicator_tree_data/',
    method: 'get'
  })
}

export function getIndicatorInfoListContainScore(id) {
  return request({
    url: `/evaluations/evaluateprojectinfo/${id}/get_project_indicator_with_fill_complete/`,
    method: 'get'
  })
}

export function getIndicatorInfoList(params) {
  return request({
    url: '/evaluations/indicatorinfo/',
    method: 'get',
    params: params
  })
}
