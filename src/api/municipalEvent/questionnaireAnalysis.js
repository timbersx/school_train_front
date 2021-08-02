import request from '@/utils/request'

export function getPaperAnalysis(id, params) {
  return request({
      url: `/areatraining/paper/${id}/get_paper_analysis/`,
      method: 'get',
      params: params
  })
}

export function getPaperEvaluateObjectAnalysis(id, params) {
  return request({
    url: `/areatraining/paper/${id}/get_paper_evaluate_object_analysis/`,
    method: 'get',
    params: params
  })
}

export function exportQuestionnaireAnalysisAllInfo(id) {
  return request({
      url: `/areatraining/paper/${id}/get_paper_analysis_export/`,    
      responseType: 'arraybuffer',
      method: 'get'
  })
}
export function exportQuestionnaireAnalysisInfo(id, params) {
  return request({
      url: `/areatraining/paper/${id}/get_paper_evaluate_object_analysis_export/`,
      method: 'get',
      responseType: 'arraybuffer',
      params: params
  })
}

// 汇总
export function getSumaryAnalysis(id) {
  return request({
      url: `/areatraining/paper/${id}/obj_paper_summary_general/`,
      method: 'get'
  })
}

