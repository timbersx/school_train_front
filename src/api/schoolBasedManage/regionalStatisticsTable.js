import request from '@/utils/request'

// 区域管理模块-校本培训区域统计-list
export function getCourseCategoryEventsInfo(params) {
  return request({
    url: '/traineventmanage/traineventinfo/course_category_events/',
    method: 'get',
    params
  })
}

// 区域管理模块-校本培训区域统计-合计数据
export function getCourseCategoryEventsTotalInfo(params) {
  return request({
    url: '/traineventmanage/traineventinfo/course_category_events_total/',
    method: 'get',
    params
  })
}

// 区域管理模块-校本培训区域统计-详情
export function getCourseEvents(data, params) {
  return request({
    url: '/traineventmanage/traineventinfo/course_events/',
    method: 'post',
    data,
    params
  })
}

// 区域管理模块-校本培训区域统计-导出
export function exportCourseCategoryEvents(data = null) {
  return request({
    url: '/traineventmanage/traineventinfo/course_category_events_export/',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
