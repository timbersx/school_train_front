import request from '@/utils/request'

export function getExpertGroupInfo(params) {
  return request({
    url: '/traineventmanage/expertgroupinfo/',
    method: 'get',
    params
  })
}

export function delExpertGroupInfo(id) {
  return request({
    url: `/traineventmanage/expertgroupinfo/${id}/`,
    method: 'delete'
  })
}

export function patchExpertGroupInfo(id, data) {
  return request({
    url: `/traineventmanage/expertgroupinfo/${id}/`,
    method: 'put',
    data
  })
}

export function postExpertGroupInfo(data) {
  return request({
    url: '/traineventmanage/expertgroupinfo/',
    method: 'post',
    data
  })
}

export function readExpertGroupInfo(id) {
  return request({
    url: `/traineventmanage/expertgroupinfo/${id}/`,
    method: 'get'
  })
}
