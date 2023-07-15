import http from '@/api/http'


// 首页点位接口
function getAll(){
  return http({ url: '/system/index/pointCategory', method: 'get',json:false})
}

// 蓝藻点位接口
function getLanzao(){
  return http({ url: '/system/lanzao/point', method: 'get',json:false})
}

function getCameraCode(id,type,floor) {
  return http({ url: '/system/modelDevice/'+id+"/"+type+"/"+floor, method: 'get',json:false})
}


function getAllAutoStation() {
  return http({ url: '/system/index/zidongzhan', method: 'get',json:false})
}

function getNowClickInfo(id) {
  return http({ url: '/system/introduction/'+id, method: 'get',json:false})
}


export default {
  getAll,
  getLanzao,
  getCameraCode,
  getAllAutoStation,
  getNowClickInfo
}
