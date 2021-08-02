import request from '@/utils/request'

export function schoolExpertInfo(params) {
  return request({
      url: '/traineventmanage/schoolexpertinfo/school_list/',
      method: 'get',
      params
  })
}

export function readSchoolExpertInfo(id) {
    return request({
        url: `/traineventmanage/schoolexpertinfo/${id}/`,
        method: 'get',
    })
  }

export function addSchoolExpertInfo(data) {
    return request({
        url: '/traineventmanage/schoolexpertinfo/school_create/',
        method: 'post',
        data
    })
  }

  export function updateSchoolExpertInfo(id, data) {
    return request({
        url: `/traineventmanage/schoolexpertinfo/${id}/school_update/`,
        method: 'post',
        data
    })
  }

  export function delSchoolExpertInfo(id) {
    return request({
        url: `/traineventmanage/schoolexpertinfo/${id}/school_destroy/`,
        method: 'delete'
    })
  }
