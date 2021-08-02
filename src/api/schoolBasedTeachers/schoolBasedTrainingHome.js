import request from '@/utils/request'

// 教师首页-可报名培训活动
export function getTeacherEnrollingEventInfo(params) {
  return request({
    url: '/traineventmanage/traineventinfo/teacher_enroll_event/',
    method: 'get',
    params: params
  })
}

// 教师首页-可报名培训活动-报名
export function teacherEnroll(id) {
  return request({
    url: `/traineventmanage/traineventinfo/${id}/teacher_enroll/`,
    method: 'post'
  })
}

// 教师首页-待参加培训活动
export function getTeacherConfirmingEventInfo(params) {
  return request({
    url: '/traineventmanage/traineventinfo/teacher_confirm_event/',
    method: 'get',
    params: params
  })
}

// 教师首页-待参加培训活动-确认报名
export function teacherConfirm(id) {
  return request({
    url: `/traineventmanage/traineventteacherinfo/${id}/teacher_confirm/`,
    method: 'post'
  })
}

// 教师首页-进行中的培训活动
export function getTeacherActiveEventInfo(params) {
  return request({
    url: '/traineventmanage/traineventinfo/teacher_active_event/',
    method: 'get',
    params: params
  })
}

// 教师首页-进行中的培训活动-认定学时-获取材料和说明的接口
export function getTeacherEventHoursInfo(id, params) {
  return request({
    url: `/traineventmanage/traineventinfo/${id}/teacher_get_hours/`,
    method: 'get',
    params: params
  })
}

// 教师首页-进行中的培训活动-认定学时-确定
export function teacherSetHours(id, data) {
  return request({
    url: `/traineventmanage/traineventinfo/${id}/teacher_set_hours/`,
    method: 'post',
    data
  })
}

// 教师首页-学时认定list
export function getTeacherCheckedHoursInfo(params) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/teacher_checked_hours/',
    method: 'get',
    params: params
  })
}

// 教师首页-学时认定-详情list
export function getTeacherCategoryEventsInfo(params) {
  return request({
    url: '/traineventmanage/traineventclasshourinfo/teacher_category_events/',
    method: 'get',
    params: params
  })
}

// 教师首页-要求学时和已完成学时
export function getTeacherHoursAnalysisInfo(params) {
  return request({
    url: '/traineventmanage/traineventinfo/teacher_hours_analysis/',
    method: 'get',
    params: params
  })
}

// 教师首页-已完成的培训活动
export function getTeacherCompleteEventsInfo(params) {
  return request({
    url: '/traineventmanage/traineventinfo/teacher_complete_events/',
    method: 'get',
    params: params
  })
}

// 教师首页-已完成的培训活动
export function getTeacherCompleteDetailInfo(id, params) {
  return request({
    url: `/traineventmanage/traineventclasshourinfo/${id}/teacher_complete_event_detail/`,
    method: 'get',
    params: params
  })
}
