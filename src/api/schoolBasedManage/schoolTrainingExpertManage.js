import request from '@/utils/request'

export function schoolExpertInfo(params) {
  return request({
      url: '/traineventmanage/schoolexpertinfo/',
      method: 'get',
      params
  })
}

export function readSchoolExpertInfo(id) {
  return request({
      url: `/traineventmanage/schoolexpertinfo/${id}/`,
      method: 'get'
  })
}

export function delSchoolExpertInfo(id) {
    return request({
        url: `/traineventmanage/trainexpertinfo/${id}/school_destroy/`,
        method: 'delete',
    })
  }

