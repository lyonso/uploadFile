import http from '@/api/http'
import fetch from '@/utils/fetch'
// 环境监测

export default {
  // 环境监控-告警数量统计
  environmentEventNum(data) {
    return http({ url: '/shiyanshi/hjjk/eventNum', method: 'get', data, json: true })
  },
  // 环境监控-温湿度范围
  environmentTempAndHumiRange(data) {
    return http({ url: '/shiyanshi/hjjk/tempAndHumiRange', method: 'get', data, json: true })
  },
  // 环境监控-UPS室
  environmentSingleRoom(data) {
    return http({ url: '/shiyanshi/hjjk/singleRoom', method: 'get', data, json: true })
  },
  // 环境监控-7天
  environmentDataFor7days(data) {
    return http({ url: '/shiyanshi/hjjk/dataFor7days', method: 'get', data, json: true })
  },
  // 环境监控-实时告警详情
  environmentEventInfo(data) {
    return http({ url: '/shiyanshi/hjjk/eventInfo', method: 'get', data, json: true })
  },
  // 环境监控-监测数据
  environmentInfoByParam(data) {
    return http({ url: '/shiyanshi/hjjk/infoByParam', method: 'get', data, json: true })
  },
  // 环境监控-详情
  environmentDetail(data) {
    return http({ url: '/shiyanshi/hjjk/eventInfoByIds', method: 'get', data, json: true })
  },
  // 环境监控-已读
  environmentMarkRead(data) {
    return http({ url: '/shiyanshi/hjjk/read', method: 'get', data, json: true })
  },
  // 环境监控-预警详情
  environmentWarnDetail(data) {
    return fetch('/shiyanshi/aqjk/eventByToday', data, 'POST')
  }
}
