import request from '@/utils/request'
import http from '@/api/http'
import fetch from '@/utils/fetch'
// 应急指挥

export default {
  // 安全监控-视频监控-门禁展示
  securityGJ(data) {
    return http({ url: '/shiyanshi/aqjk/device', method: 'get', data, json: true })
  },
  // 安全监控-告警数量统计
  eventNum(data) {
    return http({ url: '/shiyanshi/aqjk/eventNum', method: 'get', data, json: true })
  },
  // 门禁时段分析
  doorTimeAnalysis() {
    return http({ url: '/shiyanshi/aqjk/doorTimeAnalysis', method: 'get', json: true })
  },
  // 当天监测区人员按小时统计
  timeCount(data) {
    return http({ url: '/shiyanshi/aqjk/timeCount', method: 'get', data, json: true })
  },
  // 实现检测区进入记录
  experAreaIntoRecord(data) {
    return http({ url: '/shiyanshi/aqjk/experAreaIntoRecord', method: 'get', data, json: true })
  },
  // 当天摄像头人员计数情况
  pCount() {
    return http({ url: '/shiyanshi/aqjk/pCount', method: 'get', json: true })
  },
  // 门禁进出记录
  getDoorList(data) {
    return http({ url: '/system/shiyanshi/getDoorList', method: 'post', data })
  },
  // 门禁告警记录
  doorEventRecord(data) {
    return fetch('/shiyanshi/aqjk/doorEventRecord', data, 'POST')
  },
  // 门禁告警记录
  aqjkCount(data) {
    return http({ url: '/shiyanshi/aqjk/count', method: 'get', data, json: true })
  },
  // 门禁告警记录
  read(data) {
    return http({ url: '/shiyanshi/aqjk/read', method: 'get', data, json: true })
  },
  // 环境监控-今日告警弹窗
  environmentWarnDetail(data) {
    return fetch('/shiyanshi/aqjk/eventByToday', data, 'POST')
  },
  // 一键开启门禁
  doControlAll() {
    return http({ url: '/system/shiyanshi/doControlAll', method: 'get' })
  },
  // 门禁告警记录
  doorPerson(data) {
    return http({ url: '/shiyanshi/aqjk/door/person', method: 'get', data, json: true })
  },
  // AI识别
  cameraAI(data) {
    return http({ url: '/shiyanshi/aqjk/cameraAI', method: 'get', data, json: true })
  },
  // AI识别已读
  readByCamera(data) {
    return http({ url: '/shiyanshi/aqjk/readByCamera', method: 'get', data, json: true })
  },
  // 按区域人员数量统计
  countByArea(data) {
    return http({ url: '/shiyanshi/aqjk/countByArea', method: 'get', data, json: true })
  },
  // 智能识别
  getDoorFaceList(data) {
    return http({ url: '/system/shiyanshi/getDoorFaceList', method: 'post', data })
  },
  // 删除记录
  deleteEvent(data) {
    return http({ url: '/shiyanshi/aqjk/deleteEvent', method: 'get', data, json: true })
  },
}
