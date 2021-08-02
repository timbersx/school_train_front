import request from '@/utils/request'

export function getTrainEventTeacherInfo(params) {
    return request({
        url: '/areatraining/traineventteacherinfo/',
        method: 'get',
        params
    })
  }

  export function enrollCheck(id, data) {
    return request({
        url: `/areatraining/traineventteacherinfo/${id}/enroll_check/`,
        method: 'post',
        data
    })
  }

  export function getTrainEventInfoList(params) {
    return request({
        url: '/areatraining/traineventinfo/admin_list/',
        method: 'get',
        params
    })
  }
  