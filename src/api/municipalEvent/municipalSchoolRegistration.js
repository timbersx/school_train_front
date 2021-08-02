import request from '@/utils/request'

export function getTrainEventSchoolAdminInfo(params) {
  return request({
    url: '/areatraining/traineventorganizationinfo/school_admin_list/',
    method: 'get',
    params
  })
}

export function schoolEnroll(id, data) {
  return request({
    url: `/areatraining/traineventorganizationinfo/${id}/school_enroll/`,
    method: 'post',
    data
  })
}

export function getCourseCategoryList(params) {
  return request({
    url: '/areatraining/coursetypeinfo/',
    method: 'get',
    params: params
  })
}

export function readTrainEventInfo(id) {
  return request({
    url: `/areatraining/traineventinfo/${id}/`,
    method: 'get'
  })
}

export function getOrganizationsTeachers(id, params) {
  return request({
    url: `/areatraining/traineventorganizationinfo/${id}/get_school_teachers/`,
    method: 'get',
    params
  })
}

export function getTeacherGroupInfo(id, params) {
  return request({
    url: `/areatraining/traineventorganizationinfo/${id}/get_school_teacher_groups/`,
    method: 'get',
    params
  })
}

export function registrationTeachers(id, data) {
  return request({
    url: `/areatraining/traineventorganizationinfo/${id}/school_enroll/`,
    method: 'post',
    data
  })
}

export function getSelectedTeacherInfo(id, params) {
  return request({
    url: `/areatraining/traineventorganizationinfo/${id}/get_selected_school_teachers/`,
    method: 'get',
    params
  })
}

export function getSelectedTeacherGroupInfo(id, params) {
  return request({
    url: `/areatraining/traineventorganizationinfo/${id}/get_selected_school_teacher_groups/`,
    method: 'get',
    params
  })
}
export function getPassedTeacherInfo(id, params) {
  return request({
    url: `/areatraining/traineventorganizationinfo/${id}/get_check_teachers/`,
    method: 'get',
    params
  })
}
