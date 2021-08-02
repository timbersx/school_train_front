import request from '@/utils/request'

export function getExpertGroupInfo(params) {
  return request({
    url: '/areatraining/expertgroupinfo/',
    method: 'get',
    params
  })
}

export function delExpertGroupInfo(id) {
  return request({
    url: `/areatraining/expertgroupinfo/${id}/`,
    method: 'delete'
  })
}

export function patchExpertGroupInfo(id, data) {
  return request({
    url: `/areatraining/expertgroupinfo/${id}/`,
    method: 'patch',
    data
  })
}

export function postExpertGroupInfo(data) {
  return request({
    url: '/areatraining/expertgroupinfo/',
    method: 'post',
    data
  })
}

export function readExpertGroupInfo(id) {
  return request({
    url: `/areatraining/expertgroupinfo/${id}/`,
    method: 'get'
  })
}
// 获取列表
export function getExpertAuthList(params) {
  return request({
    url: '/areatraining/expertgroupinfo/get_professional_user/',
    method: 'get',
    params: params
  })
}
