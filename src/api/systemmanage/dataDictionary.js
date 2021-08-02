import request from '@/utils/request'

export function getDatadictTypeList() { 
  return request({
    url: '/system/datadicttypequery/',
    method: 'get'
  })
}

export function createDatadictType(data){
  return request({
    url: '/system/datadicttype/',
    method: 'post',
    data
  })
}


export function updateDatadictType(id,data){
  return request({
    url: `/system/datadicttype/${id}/`,
    method: 'put',
    data
  })
}

export function deleteDatadictType(id){
  return request({
    url: `/system/datadicttype/${id}/`,
    method: 'delete' 
  })
}

export function getDatadictItemList(params) {
  return request({
      url: '/system/datadictitemquery/',
      method: 'get',
      params: params
  })
}

export function createDatadictItem(data){
  return request({
    url: '/system/datadictitem/',
    method: 'post',
    data
  })
}


export function updateDatadictItem(id,data){
  return request({
    url: `/system/datadictitem/${id}/`,
    method: 'put',
    data
  })
}

export function deleteDatadictItem(id){
  return request({
    url: `/system/datadictitem/${id}/`,
    method: 'delete' 
  })
}

//获取全部的Item，data传入的值为{type_code:'xxx'} 或{type_id:1}
export function getDatadictItemOperations(data) {
  data.limit=100000
  data.offset=0
  return new Promise((resolve, reject) => {
    getDatadictItemList(data)
      .then(response => {
         return resolve({...response.data})
      })
      .catch(error => {
        reject(error)
      })
  })
}