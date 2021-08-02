import request from '@/utils/request'

export function getTrainEventInfoList(params) {
  return request({
      url: '/traineventmanage/traineventinfo/school_list/',
      method: 'get',
      params
  })
}
export function readTrainEventInfo(id) {
  return request({
    url: `/traineventmanage/traineventinfo/${id}/`,
    method: 'get'
  })
}

export function upSignTrainEventInfo(id, data = null) {
  return request({
    url: `/traineventmanage/traineventinfo/${id}/end_train_event/`,
    method: 'post',
    data
  })
}

export function createTrainEventInfo(data) {
  return request({
      url: '/traineventmanage/traineventinfo/school_create/',
      method: 'post',
      data
  })
}
export function updateTrainEventInfo(id, data) {
  return request({
      url: `/traineventmanage/traineventinfo/${id}/school_update/`,
      method: 'post',
      data
  })
}
export function deleteTrainEventInfo(id) {
  return request({
      url: `/traineventmanage/traineventinfo/${id}/school_destroy/`,
      method: 'delete'
  })
}
export function exportTrainEventInfo(data = null) {
  return request({
    url: '/traineventmanage/traineventinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getSchoolTrainEventInfoList(params) {
  return request({
    url: '/traineventmanage/traineventinfo/school_list/',
    method: 'get',
    params: params
  })
}

export function getOrganizations(params) {
  return request({
      url: '/traineventmanage/traineventinfo/get_organizations/',
      method: 'get',
      params
  })
}

export function getOrganizationsTeachers(data,params) {
  return request({
      url: '/traineventmanage/teacherinfo/get_organizations_teachers/',
      method: 'post',
      data,
      params
  })
}

export function getSchoolTeachers(params) {
  return request({
      url: '/traineventmanage/teacherinfo/get_school_teachers/',
      method: 'get',
      params
  })
}

export function getTeacherGroupInfo(params) {
  return request({
      url: '/traineventmanage/teachergroupinfo/',
      method: 'get',
      params
  })
}

export function getTrainEventSigninInfo(params) {
  return request({
      url: '/traineventmanage/traineventsignininfo/',
      method: 'get',
      params
  })
}

export function createTrainEventSigninInfo(data) {
  return request({
      url: '/traineventmanage/traineventsignininfo/',
      method: 'post',
      data
  })
}

export function readTrainEventSigninInfo(id) {
  return request({
      url: `/traineventmanage/traineventsignininfo/${id}/`,
      method: 'get',
  })
}

export function updateTrainEventSigninInfo(data, id) {
  return request({
      url: `/traineventmanage/traineventsignininfo/${id}/`,
      method: 'put',
      data
  })
}

export function delTrainEventSigninInfo(id) {
  return request({
      url: `/traineventmanage/traineventsignininfo/${id}/`,
      method: 'delete'
  })
}

export function getQrcode(id) {
  return request({
      url: `/traineventmanage/traineventsignininfo/${id}/get_qrcode/`,
      method: 'get',
      responseType: 'arraybuffer'
  })
}

export function readTrainEventTeacherInfo(params) {
  return request({
      url: `/traineventmanage/traineventteacherinfo/`,
      method: 'get',
      params
  })
}

export function getCourseTypeInfo() {
  return request({
      url: `/traineventmanage/coursetypeinfo/?status=true`,
      method: 'get',
  })
}

export function getOrganizationTypesSubjects(data) {
  return request({
      url: `/traineventmanage/traineventinfo/get_organization_types_subjects/`,
      method: 'post',
      data
  })
}

export function getSpeakers(data) {
  return request({
      url: '/traineventmanage/traineventinfo/get_speakers/',
      method: 'post',
      data
  })
}

export function schoolCreate(data) {
  return request({
      url: '/traineventmanage/traineventsigninrecordinfo/school_create/',
      method: 'post',
      data
  })
}

export function trainEventSigninRecordInfo(params) {
  return request({
      url: `/traineventmanage/traineventsigninrecordinfo/`,
      method: 'get',
      params
  })
}

export function getSignInTeachers(id, params) {
  return request({
      url: `/traineventmanage/traineventsignininfo/${id}/get_sign_in_teachers/`,
      method: 'get',
      params
  })
}

export function endTrainEvent(id, params) {
  return request({
      url: `/traineventmanage/traineventsignininfo/${id}/get_sign_in_teachers/`,
      method: 'get',
      params
  })
}



