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
    method: 'patch',
    data
  })
}
export function deletePaper(id) {
  return request({
    url: `/areatraining/paper/${id}/`,
    method: 'delete'
  })
}

export function getAvailableQuestion(id, data) {
  return request({
    url: `/areatraining/paper/${id}/get_available_question/`,
    method: 'post',
    data
  })
}

export function choiceQuestionRandom(id, data) {
  return request({
    url: `/areatraining/paper/${id}/choice_question_random/`,
    method: 'post',
    data
  })
}

export function paperQuestionUpdate(id, data) {
  return request({
    url: `/areatraining/paper/${id}/paper_question_update/`,
    method: 'post',
    data
  })
}

export function paperPublishUpdate(id, data) {
  return request({
    url: `/areatraining/paper/${id}/paper_publish_update/`,
    method: 'post',
    data
  })
}

export function getQuestionnaireQRcode(id) {
  return request({
    responseType: 'blob',
    url: `/areatraining/paper/${id}/get_qrcode/`,
    method: 'get'
  })
}

export function paperNameBatchUpdate(id, data) {
  return request({
    url: `/areatraining/paper/${id}/paper_name_batch_update/`,
    method: 'post',
    data
  })
}

export function closePaper(id, data) {
  return request({
    url: `/areatraining/paper/${id}/paper_close_update/`,
    method: 'post',
    data
  })
}

