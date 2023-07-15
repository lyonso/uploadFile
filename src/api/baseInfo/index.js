import request from '@/utils/request'
// import newrequest from '@/utils/request'
// 图片上传公用文件
export function uploadfile(data, type) {
  return request({
    url: `/file/upload`,
    method: 'post',
    ContentType: 'multipart/form-data',
    data
  })
}

// /file/upload
export function fileupload(data, type) {
  return request({
    url: `/file/upload`,
    method: 'post',
    ContentType: 'multipart/form-data',
    data
  })
}

// 船舶管理
// 添加
export function addship(data) {
  return request({
    url: '/jcsj/ship/add',
    method: 'post',
    data
  })
}

// 列表
// /jcsj/ship/list
export function shiplist(pageNum, pageSize, params) {
  return request({
    url: `/jcsj/ship/list?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}

// 删除
// /jcsj/ship/delete/{ids}
export function delship(id) {
  return request({
    url: `/jcsj/ship/delete/${id}`,
    method: 'get'
  })
}

// 编辑
export function editship(data) {
  return request({
    url: '/jcsj/ship/edit',
    method: 'post',
    data
  })
}

// 人员管理
// 添加
export function addperson(data) {
  return request({
    url: '/jcsj/jcsjPerson/add',
    method: 'post',
    data
  })
}

// 列表
export function personList(pageNum, pageSize, params) {
  return request({
    url: `/jcsj/jcsjPerson/list?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}

// 编辑
export function editperson(data) {
  return request({
    url: '/jcsj/jcsjPerson/edit',
    method: 'post',
    data
  })
}

// 删除 /jcsj/jcsjPerson/delete/{ids}
export function delperson(id) {
  return request({
    url: `/jcsj/jcsjPerson/delete/${id}`,
    method: 'get'
  })
}

// 无人机管理
// 添加
export function adduav(data) {
  return request({
    url: '/jcsj/uav/add',
    method: 'post',
    data
  })
}

// 列表
export function uavlist(pageNum, pageSize, params) {
  return request({
    url: `/jcsj/uav/list?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}

// 编辑
export function edituav(data) {
  return request({
    url: '/jcsj/uav/edit',
    method: 'post',
    data
  })
}

// 删除
export function deluav(id) {
  return request({
    url: `/jcsj/uav/delete/${id}`,
    method: 'get'
  })
}

// 详情
export function uavDetails(id) {
  return request({
    url: `/jcsj/uav/${id}`,
    method: 'get'
  })
}

// delpoint,editpoint,addpoint,pointList
// 数据采集点
export function addpoint(data) {
  return request({
    url: `/jcsj/collectionPoint/add`,
    method: 'post',
    data
  })
}

export function delpoint(id) {
  return request({
    url: `/jcsj/collectionPoint/delete/${id}`,
    method: 'get'
  })
}

export function editpoint(data) {
  return request({
    url: `/jcsj/collectionPoint/edit`,
    method: 'post',
    data
  })
}

export function pointList(pageNum, pageSize, params) {
  return request({
    url: `/jcsj/collectionPoint/list?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}

// 标签
// /jscj/collectionTag/add
// 添加
export function tagadd(data) {
  return request({
    url: `/jcsj/collectionTag/add`,
    method: 'post',
    data
  })
}

// 列表
// /jcsj/collectionTag/edit
// /yjyl/sceneMark/{id}
export function markDestail(id) {
  return request({
    url: `/yjyl/sceneMark/${id}`,
    method: 'get'
  })
}

export function taglist(pageNum, pageSize, params) {
  return request({
    url: `/jcsj/collectionTag/list?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}

// 编辑
export function tagedit(data) {
  return request({
    url: `/jcsj/collectionTag/edit`,
    method: 'post',
    data
  })
}

// 删除
export function tagdel(ids) {
  return request({
    url: `/jcsj/collectionTag/delete/${ids}`,
    method: 'get'
  })
}

// /jcsj/pointTag/add
// 添加 关联标签
export function readd(data) {
  return request({
    url: `/jcsj/pointTag/add`,
    method: 'post',
    data
  })
}

// 列表
export function relist(pageNum, pageSize, params) {
  return request({
    url: `/jcsj/pointTag/listByPointId?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}

// 标注
// /yjyl/mark/add
export function addmark(data) {
  return request({
    url: `/yjyl/mark/add`,
    method: 'post',
    data
  })
}

export function marklist(pageNum, pageSize, params) {
  return request({
    url: `/yjyl/mark/list?pageNum=${pageNum}&limit=${pageSize}`,
    method: 'get',
    params
  })
}

export function markedit(data) {
  return request({
    url: `/yjyl/mark/edit`,
    method: 'post',
    data
  })
}

export function markdel(id) {
  return request({
    url: `/yjyl/mark/delete/${id}`,
    method: 'get'
  })
}

// 静态标签
export function tagStaticlist(params) {
  return request({
    url: `/yjyl/tagStatic/list?pageNum=1&limit=100000`,
    method: 'get',
    params
  })
}

export function tagStaticAdd(data) {
  return request({
    url: `/yjyl/tagStatic/add`,
    method: 'post',
    data
  })
}

export function tagStaticedit(data) {
  return request({
    url: `/yjyl/tagStatic/edit`,
    method: 'post',
    data
  })
}

export function tagStaticdel(id) {
  return request({
    url: `/yjyl/tagStatic/delete/${id}`,
    method: 'get'
  })
}

// 动态标签
export function tagDynamiclist(params) {
  return request({
    url: `/yjyl/tagDynamic/list?pageNum=1&limit=100000`,
    method: 'get',
    params
  })
}

export function tagDynamicdel(id) {
  return request({
    url: `/yjyl/tagDynamic/delete/${id}`,
    method: 'get'
  })
}

// /yjyl/tagDynamic/add
export function tagStaticadd(data) {
  return request({
    url: `/yjyl/tagDynamic/add`,
    method: 'post',
    data
  })
}

// /jcsj/car/list
export function carlist(params) {
  return request({
    url: `/jcsj/car/list?pageNum=1&limit=100000`,
    method: 'get',
    params
  })
}

export function cameralist(params) {
  return request({
    url: `/jcsj/camera/list?pageNum=1&limit=100000`,
    method: 'get',
    params
  })
}

// 临时指挥部
export function headquartersadd(data) {
  return request({
    url: `/yjyl/headquarters/add`,
    method: 'post',
    data
  })
}


// 系统图层 /system/layer/list
export function layerlist(params) {
  return request({
    url: `/system/layer/listExt?pageNum=1&limit=100000`,
    method: 'get',
    params
  })
}

// /yjyl/anchorPoint/list
export function anchorPointByid(id) {
  return request({
    url: `/yjyl/anchorPoint/${id}`,
    method: 'get'
  })
}

// /yjyl/missionInfo/{id}
export function missionInfoByid(id) {
  return request({
    url: `/yjyl/missionInfo/${id}`,
    method: 'get'
  })
}

export function sceneCameraLsByid(id) {
  return request({
    url: `/yjyl/sceneCameraLs/${id}`,
    method: 'get'
  })
}

export function headquartersByid(id) {
  return request({
    url: `/yjyl/headquarters/${id}`,
    method: 'get'
  })
}


export function sceneSectionByid(id) {
  return request({
    url: `/yjyl/sceneSection/${id}`,
    method: 'get'
  })
}

// /yjyl/commandMission/{id}
export function commandMissionByid(id) {
  return request({
    url: `/yjyl/commandMission/${id}`,
    method: 'get'
  })
}

// /yjyl/missionMessage/add
export function missionMessageAdd(data) {
  return request({
    url: `/yjyl/missionMessage/add`,
    method: 'post',
    data
  })
}

export function missionMessageDel(id) {
  return request({
    url: `/yjyl/missionMessage/delete/${id}`,
    method: 'get'
  })
}

// /yjyl/missionMessage/delete/{ids}


export function missionMessageEdit(data) {
  return request({
    url: `/yjyl/missionMessage/edit`,
    method: 'post',
    data
  })
}

// /yjyl/missionMessage/list
export function missionMessageList(params) {
  return request({
    url: `/yjyl/missionMessage/list`,
    method: 'get',
    params
  })
}

// /yjyl/headquarters/list
export function headquarterslist(params) {
  return request({
    url: `/yjyl/headquarters/list?pageNum=1&limit=10000`,
    method: 'get',
    params
  })
}

// /jcsj/positionEquipment/list
export function positionEquipmentList(params) {
  return request({
    url: `/jcsj/positionEquipment/list?pageNum=1&limit=10000`,
    method: 'get',
    params
  })
}

// /yjyl/carPerson/add
export function carPersonAdd(data) {
  return request({
    url: `/yjyl/carPerson/add`,
    method: 'post',
    data
  })
}

// /yjyl/ShipPerson/add
export function ShipPersonAdd(data) {
  return request({
    url: `/yjyl/ShipPerson/add`,
    method: 'post',
    data
  })
}

// /system/dict/list
export function dictlist(params) {
  return request({
    url: `/system/dict/list?pageNum=1&limit=10000`,
    method: 'get',
    params
  })
}

// /yjyl/scenePcs/addCar
export function scenePcsadd(data) {
  return request({
    url: `/yjyl/scenePcs/addCar`,
    method: 'post',
    data
  })
}

export function scenePcsShipAdd(data) {
  return request({
    url: `/yjyl/scenePcs/addShip`,
    method: 'post',
    data
  })
}

// /yjyl/scenePcs/missionShip/{missionId}
export function missionShipList(params) {
  return request({
    url: `/yjyl/scenePcs/missionShip/${missionId}?pageNum=1&limit=10000`,
    method: 'get',
    params
  })
}

//回显已选车辆
// /yjyl/scenePcs/missionCar/{missionId}
export function missionCar(id) {
  return request({
    url: `/yjyl/scenePcs/missionCar/${id}`,
    method: 'get'
  })
}

// 回想已选船只
export function missionShip(id) {
  return request({
    url: `/yjyl/scenePcs/missionShip/${id}`,
    method: 'get'
  })
}

// /yjyl/commandMission/{id}
export function commandMissionById(id) {
  return request({
    url: `/yjyl/commandMission/${id}`,
    method: 'get'
  })
}

// /yjyl/headPerson/add
export function headPersonadd(data) {
  return request({
    url: `/yjyl/headPerson/add`,
    method: 'post',
    data
  })
}


// 水质
// 自动
// api/system/swszyData/query
export function swszyDataAuto(params) {
  return request({
    url: `/system/swszyData/query`,
    method: 'get',
    params
  })
}

// /system/layer/updatePoint
export function updataponit(params) {
  return request({
    url: `/system/layer/updatePoint`,
    method: 'get',
    params
  })
}

// /yjyl/commandMission/addMission
export function addRW(data) {
  return request({
    url: `/yjyl/commandMission/addMission`,
    method: 'post',
    data
  })
}

// /yjyl/commandMission/getMissionInfo/{id}
export function getMissionInfo(id) {
  return request({
    url: `/yjyl/commandMission/getMissionInfo/${id}`,
    method: 'get'
  })
}

// /yjyl/commandMission/editMisssion
export function editRW(data) {
  return request({
    url: `/yjyl/commandMission/editMisssion`,
    method: 'post',
    data
  })
}


// /jcsj/collectionPoint/{id}
export function collectionPointDes(id) {
  return request({
    url: `/jcsj/collectionPoint/${id}`,
    method: 'get'
  })
}

export function sceneSectionForId(id) {
  return request({
    url: `/yjyl/sceneSection/${id}`,
    method: 'get'
  })
}


//  水文水质单位对比 /jcsj/collectionTag/list

export function collectionTagList(id) {
  return request({
    url: `/jcsj/collectionTag/list?pageNum=0&limit=11111`,
    method: 'get'
  })
}

// /yjyl/commandMission/editMisssion
export function missionMessageSort(data) {
  return request({
    url: `/yjyl/missionMessage/sort`,
    method: 'post',
    data
  })
}

// /yjyl/commandMission/editMisssion
export function collectionTagMapKey() {
  return request({
    url: `/jcsj/collectionTag/map`,
    method: 'get'
  })
}


// /yjyl/commandMission/editMisssion
export function getzidongzhan() {
  return request({
    url: `/system/index/zidongzhan`,
    method: 'get'
  })
}

// /yjyl/commandMission/editMisssion
export function zdzselectList(params) {
  return request({
    url: `/yjyl/missionPoint/selectList`,
    method: 'get',
    params
  })
}
