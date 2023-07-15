import request from '@/utils/request'

// /yjyl/missionDoc/add
// 任务管理
// 添加
export function addmissionDoc(data) {
  return request({
    url: '/yjyl/missionInfo/add',
    method: 'post',
    data
  })
}
//
// /yjyl/scene/list
export function exerciseList(pageNum,pageSize,params) {
  return request({
    url: `/yjyl/scene/list?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}
// 新增 /yjyl/scene/add
export function exerciseAdd(data) {
  return request({
    url: `/yjyl/scene/add`,
    method: 'post',
    data
  })
}
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
// 人船 车
// /yjyl/scenePcs/add
export function addscenePcs(data) {
  return request({
    url: '/yjyl/scenePcs/add',
    method: 'post',
    data
  })
}
// 固定视频
export function addsceneCameraGd(data) {
  return request({
    url: '/yjyl/sceneCameraGd/add',
    method: 'post',
    data
  })
}

export function swszyDataAuto(params){
  return request({
    url:`api/system/swszyData/query`,
    method:'get',
    params
  })
}
