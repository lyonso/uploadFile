import request from '@/utils/request'


//文件上传
export function uploadfile(data, type) {
    return request({
        url: '/upload/uploadFile',
        method: 'post',
        ContentType: 'multipart/form-data',
        data
    })
}

//视频点信息管理

//列表
export function videoList(pageNum, pageSize, params) {
    return request({
        url: `/jcsj/camera/list?pageNum=${pageNum}&limit=${pageSize}`,
        method: 'get',
        params
    })
}

//删除
export function delVideo(id) {
    return request({
        url: `/jcsj/camera/delete/${id}`,
        method: 'get'
    })
}

//添加
export function addVideoPoint(data) {
    return request({
        url: '/jcsj/camera/add',
        method: 'post',
        data
    })

}

//编辑
export function editVideoPoint(data) {
    return request({
        url: '/jcsj/camera/edit',
        method: 'post',
        data
    })

}


//车辆管理

//增加
export function addVehicle(data) {
    return request({
        url: '/jcsj/car/add',
        method: 'post',
        data
    })
}

//列表
export function vehicleList(pageNum, pageSize, params) {
    return request({
        url: `/jcsj/car/list?pageNum=${pageNum}&limit=${pageSize}`,
        method: 'get',
        params
    })
}

//删除
export function delVehicle(id) {
    return request({
        url: `/jcsj/car/delete/${id}`,
        method: 'get'
    })
}

//编辑

export function editVehicle(data) {
    return request({
        url: '/jcsj/car/edit',
        method: 'post',
        data
    })
}


//获取数据字典
export function systemDict(params) {
    return request({
        url: `/system/dict/list?pageNum=${params.pageNum}&limit=${params.limit}&dictName=${params.dictName}`,
        method: 'get',
    })
}
