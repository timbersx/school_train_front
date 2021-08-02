import request from '@/utils/request'

// 区域管理-区域教师学时统计-list (BEFORE)
export function getTeacherHourAnalysisInfo(id, params) {
  return request({
    url: `/traineventmanage/annualtrainplaninfo/${id}/teacher_hour_analysis/`,
    method: 'get',
    params
  })
}

// 区域管理-区域教师学时统计-list
export function getTeacherHourStatisticsInfo(params) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/teacher_hour_statistics/',
    method: 'get',
    params
  })
}

// 区域管理-区域教师学时统计-list-详情
export function getTeachersHourAnalysisDetail(data) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/teacher_hour_statistics_detail/',
    method: 'post',
    data
  })
}

// 区域管理-区域教师学时统计-list-详情
export function getTeacherHourAnalysisDetail(id, params) {
  return request({
    url: `/traineventmanage/annualtrainplaninfo/${id}/teacher_hour_analysis_detail/`,
    method: 'get',
    params
  })
}

// 区域管理-区域教师学时统计-导出
export function exportTeacherHourAnalysis(data = null) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/teacher_hour_statistics_export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
