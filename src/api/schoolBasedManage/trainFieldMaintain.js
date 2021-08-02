import request from '@/utils/request'

export function getSchoolList(params) {
  return request({
      url: '/traineventmanage/trainpositioninfo/school_list/',
      method: 'get',
      params
  })
}

export function readchoolList(id) {
    return request({
        url: `/traineventmanage/trainpositioninfo/${id}/`,
        method: 'get'
    })
  }

export function schoolCreate(data) {
    return request({
        url: '/traineventmanage/trainpositioninfo/school_create/',
        method: 'post',
        data
    })
  }

export function schoolUpdate(id, data) {
    return request({
        url: `/traineventmanage/trainpositioninfo/${id}/school_update/`,
        method: 'post',
        data
    })
  } 

  export function delSchoolList(id) {
    return request({
        url: `traineventmanage/trainpositioninfo/${id}/school_destroy/`,
        method: 'delete'
    })
  }