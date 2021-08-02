import request from '@/utils/request'

export function getTrainEventInfoList(params) {
  return request({
      url: '/areatraining/traineventinfo/',
      method: 'get',
      params
  })
}
export function readTrainEventInfo(id) {
  return request({
    url: `/areatraining/traineventinfo/${id}/`,
    method: 'get'
  })
}

export function upSignTrainEventInfo(id, data = null) {
  return request({
    url: `/areatraining/traineventinfo/${id}/end_train_event/`,
    method: 'post',
    data
  })
}

export function createTrainEventInfo(data) {
  return request({
      url: '/areatraining/traineventinfo/',
      method: 'post',
      data
  })
}
export function updateTrainEventInfo(id, data) {
  return request({
      url: `/areatraining/traineventinfo/${id}/`,
      method: 'put',
      data
  })
}
export function deleteTrainEventInfo(id) {
  return request({
      url: `/areatraining/traineventinfo/${id}/`,
      method: 'delete'
  })
}
export function exportTrainEventInfo(data = null) {
  return request({
    url: '/areatraining/traineventinfo/export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function getSchoolTrainEventInfoList(params) {
  return request({
    url: '/areatraining/traineventinfo/school_list/',
    method: 'get',
    params: params
  })
}

export function getOrganizations(params) {
  return request({
      url: '/system/organizationinfo/',
      method: 'get',
      params
  })
}

export function getOrganizationsTeachers(data,params) {
  return request({
      url: '/areatraining/teacherinfo/get_organizations_teachers/',
      method: 'post',
      data,
      params
  })
}

// export function getSchoolTeachers(params) {
//   return request({
//       url: '/areatraining/teacherinfo/get_school_teachers/',
//       method: 'get',
//       params
//   })
// }

export function getSchoolTeachers(params) {
  return request({
      url: '/areatraining/teacherinfo/',
      method: 'get',
      params
  })
}

export function getTeacherGroupInfo(params) {
  return request({
      url: '/areatraining/teachergroupinfo/',
      method: 'get',
      params
  })
}

export function getTrainEventSigninInfo(params) {
  return request({
      url: '/areatraining/traineventsignininfo/',
      method: 'get',
      params
  })
}

export function createTrainEventSigninInfo(data) {
  return request({
      url: '/areatraining/traineventsignininfo/',
      method: 'post',
      data
  })
}

export function readTrainEventSigninInfo(id) {
  return request({
      url: `/areatraining/traineventsignininfo/${id}/`,
      method: 'get',
  })
}

export function updateTrainEventSigninInfo(data, id) {
  return request({
      url: `/areatraining/traineventsignininfo/${id}/`,
      method: 'put',
      data
  })
}

export function delTrainEventSigninInfo(id) {
  return request({
      url: `/areatraining/traineventsignininfo/${id}/`,
      method: 'delete'
  })
}

export function getQrcode(id) {
  return request({
      url: `/areatraining/traineventsignininfo/${id}/get_qrcode/`,
      method: 'get',
      responseType: 'arraybuffer'
  })
}

export function readTrainEventTeacherInfo(params) {
  return request({
      url: `/areatraining/traineventteacherinfo/`,
      method: 'get',
      params
  })
}

export function getCourseTypeInfo() {
  return request({
      url: `/areatraining/coursetypeinfo/?status=true`,
      method: 'get',
  })
}

export function getOrganizationTypesSubjects(data) {
  return request({
      url: `/areatraining/traineventinfo/get_organization_types_subjects/`,
      method: 'post',
      data
  })
}

export function getSpeakers(data, params) {
  return request({
      url: '/areatraining/traineventinfo/get_speakers/',
      method: 'post',
      data,
      params
  })
}

export function schoolCreate(data) {
  return request({
      url: '/areatraining/traineventsigninrecordinfo/school_create/',
      method: 'post',
      data
  })
}

export function trainEventSigninRecordInfo(params) {
  return request({
      url: `/areatraining/traineventsigninrecordinfo/`,
      method: 'get',
      params
  })
}

export function getSignInTeachers(id, params) {
  return request({
      url: `/areatraining/traineventsignininfo/${id}/get_sign_in_teachers/`,
      method: 'get',
      params
  })
}

export function endTrainEvent(id, params) {
  return request({
      url: `/areatraining/traineventsignininfo/${id}/get_sign_in_teachers/`,
      method: 'get',
      params
  })
}


export function getSchoolList(params) {
  return request({
      url: `/areatraining/trainpositioninfo/`,
      method: 'get',
      params
  })
}

export function exportSignInList(params) {
  return request({
      url: `/areatraining/traineventsigninrecordinfo/export/`,
      method: 'get',
      responseType: 'arraybuffer',
      params
  })
}

