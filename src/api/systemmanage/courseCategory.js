import request from '@/utils/request'

export function getCourseCategoryList(params) {
  return request({
    url: '/traineventmanage/coursetypeinfo/',
    method: 'get',
    params: params
  })
}

export function createCourseCategory(data) {
  return request({
    url: '/traineventmanage/coursetypeinfo/',
    method: 'post',
    data
  })
}

export function updateCourseCategory(id, data) {
  return request({
    url: `/traineventmanage/coursetypeinfo/${id}/`,
    method: 'put',
    data
  })
}

export function deleteCourseCategory(id) {
  return request({
    url: `/traineventmanage/coursetypeinfo/${id}/`,
    method: 'delete'
  })
}

export function readCourseCategory(id) {
  return request({
    url: `/traineventmanage/coursetypeinfo/${id}/`,
    method: 'get'
  })
}

