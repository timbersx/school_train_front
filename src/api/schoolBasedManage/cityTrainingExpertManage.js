import request from '@/utils/request'

export function cityExpertInfo(params) {
    return request({
        url: '/traineventmanage/cityexpertinfo/',
        method: 'get',
        params
    })
}

export function readCityExpertInfo(id) {
    return request({
        url: `/traineventmanage/cityexpertinfo/${id}/`,
        method: 'get'
    })
}


export function addCityExpertInfo(data) {
    return request({
        url: '/traineventmanage/cityexpertinfo/',
        method: 'post',
        data
    })
}

export function updateCityExpertInfo(id, data) {
    return request({
        url: `/traineventmanage/cityexpertinfo/${id}/`,
        method: 'put',
        data
    })
}

export function delCityExpertInfo(id) {
    return request({
        url: `/traineventmanage/cityexpertinfo/${id}/`,
        method: 'delete'
    })
}