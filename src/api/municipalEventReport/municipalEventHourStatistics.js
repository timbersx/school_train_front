import request from '@/utils/request'

// 区域管理-区域教师学时统计-list
export function getTeacherHourStatisticsInfo(params) {
  return request({
    url: '/areatraining/traineventclasshourinfo/teacher_hour_statistics/',
    method: 'get',
    params
  })
}

// 区域管理-区域教师学时统计-list-详情
export function getTeachersHourAnalysisDetail(data) {
  return request({
    url: '/areatraining/traineventclasshourinfo/teacher_hour_statistics_detail/',
    method: 'post',
    data
  })
}

// 区域管理-区域教师学时统计-导出
export function exportTeacherHourAnalysis(data = null) {
  return request({
    url: '/areatraining/traineventclasshourinfo/teacher_hour_statistics_export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
