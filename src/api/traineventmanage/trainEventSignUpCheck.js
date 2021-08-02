import request from '@/utils/request'

export function getTrainEventTeacherInfo(params) {
    return request({
        url: '/traineventmanage/traineventteacherinfo/',
        method: 'get',
        params
    })
  }

  export function enrollCheck(id, data) {
    return request({
        url: `/traineventmanage/traineventteacherinfo/${id}/enroll_check/`,
        method: 'post',
        data
    })
  }