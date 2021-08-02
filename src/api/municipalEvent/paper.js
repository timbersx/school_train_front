import request from '@/utils/request'


export function getPaperList(params) {
  return request({
      url: '/areatraining/paper/',
      method: 'get',
      params: params
  })
}
export function readPaper(id) {
  return request({
      url: `/areatraining/paper/${id}/`,
      method: 'get'
  })
}
export function createPaper(data) {
  return request({
      url: '/areatraining/paper/',
      method: 'post',
      data
  })
}
export function updatePaper(id, data) {
  return request({
      url: `/areatraining/paper/${id}/`,
      method: 'put',
      data
  })
}
export function deletePaper(id) {
  return request({
      url: `/areatraining/paper/${id}/`,
      method: 'delete'
  })
}
export function exportPaper(data = null) {
  return request({
      url: '/areatraining/paper/export/',
      method: 'get',
      responseType: 'arraybuffer',
      params: data
  })
}
export function readUserPaperList(id) {
  return request({
      url: `/areatraining/paper/${id}/`,
      method: 'get'
  })
}

export function submitUserPaper(data) {
  return request({
      url: '/areatraining/objectspaperinfo/questionnaire_fill/',
      method: 'post',
      data
  })
}