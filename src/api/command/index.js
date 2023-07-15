import request from '@/utils/request'
// 应急指挥
// /yjyl/commandMission/add
export function addcommand(data) {
    return request({
        url: '/yjyl/commandMission/add',
        method: 'post',
        data
    })
}
// 列表
export function commandlist(pageNum,pageSize,params) {
    return request({
        url: `/yjyl/commandMission/list?pageNum=${pageNum}&limit=${pageSize}`,
        method: 'get',
        params
    })
}
// 编辑
export function editcommand(data) {
    return request({
        url: '/yjyl/commandMission/edit',
        method: 'post',
        data
    })
}
// 删除 delcommand
export function delcommand(id){
    return request({
        url:`/yjyl/commandMission/delete/${id}`,
        method:'get'
    })
}
// Label
export function layerlist(pageNum,pageSize,params) {
    return request({
        url: `/system/layer/listExt?pageNum=${pageNum}&limit=${pageSize}`,
        method: 'get',
        params
    })
}


export function layeredit(data) {
    return request({
        url: `/system/layer/edit`,
        method: 'post',
        data
    })
}
// 点位
export function anchorPointList(pageNum,pageSize,params) {
    return request({
        url: `/yjyl/anchorPoint/list?pageNum=${pageNum}&limit=${pageSize}`,
        method: 'get',
        params
    })
}

