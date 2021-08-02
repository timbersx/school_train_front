import request from '@/utils/request'

export async function getOrganizationTypeOrganizations() {
  return request({
    url: `/system/organizationinfo/get_organization_type_organizations/`,
    method: 'get',
  })
}

export async function getSchoolPositionAdminInfo(params) {
  return request({
    url: `/system/schooltrainadmininfo/`,
    method: 'get',
    params
  })
}

export async function getSchoolPositionUserInfo(params) {
  return request({
    url: `/system/schooltrainadmininfo/get_category_user/`,
    method: 'get',
    params
  })
}

export async function updateSchoolPositionUserInfo(data) {
  return request({
    url: `/system/schooltrainadmininfo/set_organization_user/`,
    method: 'post',
    data
  })
}

