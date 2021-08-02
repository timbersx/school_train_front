import request from '@/utils/request'

export function getExpertGroupList(params) {
  return request({
    url: '/traineventmanage/expertgroupinfo/list_with_combination/',
    method: 'get',
    params
  })
}

// 获取根据学段分组的学校树形结构
export function getOrganizationTypeOrganizations(params) {
  return request({
    url: '/system/organizationinfo/get_organization_type_organizations/',
    method: 'get',
    params
  })
}

// 区域管理模块-评审专家权限管理-获取指标项和评价标准的树形结构
export function getIndicatorScoreTreeData(params) {
  return request({
    url: '/traineventmanage/evaluatepermission/get_indicator_score_points/',
    method: 'get',
    params
  })
}

// 区域管理模块-专家评审权限设置-获取
export function getExpertPermission(params) {
  return request({
    url: '/traineventmanage/evaluatepermission/get_expert_permission/',
    method: 'get',
    params
  })
}

// 区域管理模块-专家评审权限设置-保存
export function setExpertPermission(data) {
  return request({
    url: '/traineventmanage/evaluatepermission/set_expert_permission/',
    method: 'post',
    data
  })
}
