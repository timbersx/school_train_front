import request from '@/utils/request'

// 学校管理模块-教师组-lsit
export function getSchoolTeacherGroupInfoList(params) {
  return request({
    url: '/traineventmanage/teachergroupinfo/school_list/',
    method: 'get',
    params: params
  })
}

export function createSchoolTeacherGroupInfo(data) {
  return request({
    url: '/traineventmanage/teachergroupinfo/school_create/',
    method: 'post',
    data
  })
}

export function updateSchoolTeacherGroupInfo(id, data) {
  return request({
    url: `/traineventmanage/teachergroupinfo/${id}/school_update/`,
    method: 'post',
    data
  })
}

export function readTeacherGroupInfo(id) {
  return request({
    url: `/traineventmanage/teachergroupinfo/${id}/`,
    method: 'get'
  })
}

export function deleteSchoolTeacherGroupInfo(id) {
  return request({
    url: `/traineventmanage/teachergroupinfo/${id}/school_destroy/`,
    method: 'delete'
  })
}

export function getUnSelectedSchoolTeacherList(params) {
  return request({
    url: '/traineventmanage/teacherinfo/get_school_filter_teachers/',
    method: 'get',
    params
  })
}
