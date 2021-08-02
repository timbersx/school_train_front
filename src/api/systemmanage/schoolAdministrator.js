import request from '@/utils/request'

// 获取所有学段-学校树
export function getSchoolTreeList(params) {
  return request({
    url: '/system/organizationinfo/get_organization_type_organizations_school_admin/',
    method: 'get',
    params: params
  })
}

// 获取所有学段-学校树
export function getSchoolEvaluateUserList(params) {
  return request({
    url: '/system/schoolevaluateuserinfo/',
    method: 'get',
    params: params
  })
}

// 学校评审人员-获取某个学校未选择和已选择的用户
export function getSchoolCategoryUserList(params) {
  return request({
    url: '/system/schoolevaluateuserinfo/get_category_user/',
    method: 'get',
    params: params
  })
}

// 学校评审人员-获取某个学校未选择和已选择的用户
export function updateSchoolCategoryUserList(data) {
  return request({
    url: '/system/schoolevaluateuserinfo/set_organization_user/',
    method: 'post',
    data
  })
}

export async function getSchoolPositionAdminInfo(params) {
  return request({
    url: '/system/schooltrainadmininfo/',
    method: 'get',
    params
  })
}

export async function updateSchoolPositionUserInfo(data) {
  return request({
    url: '/system/schooltrainadmininfo/set_organization_user/',
    method: 'post',
    data
  })
}

export async function getSchoolPositionUserInfo(params) {
  return request({
    url: '/system/schooltrainadmininfo/get_category_user/',
    method: 'get',
    params
  })
}
