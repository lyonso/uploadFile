import http from '@/api/linuxHttp'
import httpOne from '@/api/http'

export default {
  // 仪器检定提醒
  equiptTestPlanOverdue(data) {
    return http({ url: '/EquiptTestPlanOverdue', method: 'get', data })
  },
  // 仪器校准提醒
  equiptCalibrationtPlanOverdue(data) {
    return http({ url: '/EquiptCalibrationtPlanOverdue', method: 'get', data })
  },
  // 上岗证到期
  certOverdue(data) {
    return http({ url: '/CertOverdue', method: 'get', data })
  },
  // 仓库库存低限报警
  stockLowLine(data) {
    return http({ url: '/StockLowLine', method: 'get', data })
  },
  // 物质有效期超期
  expirationDateOverdue(data) {
    return http({ url: '/ExpirationDateOverdue', method: 'get', data })
  },
  // 检测项目超期
  testsOverdue(data) {
    return http({ url: '/TestsOverdue', method: 'get', data })
  },
  // 当月任务完成情况
  taskCompletion(data) {
    return http({ url: '/TaskCompletion', method: 'get', data })
  },
  // 实验室在检样品
  SampleFlow(data) {
    return http({ url: '/SampleFlow', method: 'get', data })
  },
  // 实验室重要仪器
  EquiptInformation(data) {
    return http({ url: '/EquiptInformation', method: 'get', data })
  },
  // 样品详细
  OrderTaskResluts(data) {
    return http({ url: '/OrderTaskResluts', method: 'get', data })
  },
  // 任务列表
  getContractReview(data) {
    return http({ url: '/getContractReview', method: 'get', data })
  },
  // 任务组
  SamplingSchedule(data) {
    return http({ url: '/SamplingSchedule', method: 'get', data })
  },
  // 现场监测数据
  SamplingResluts(data) {
    return http({ url: '/SamplingResluts', method: 'get', data })
  },
  // 数据在线采集情况表
  EquiptDCU(data) {
    return http({ url: '/EquiptDCU', method: 'get', data })
  },

  // 数据样品
  aqjkOrderTaskResluts(data) {
    return httpOne({ url: '/shiyanshi/aqjk/OrderTaskResluts', method: 'get', data })
  },
  // 数据采集-报告预编制
  report(data) {
    return httpOne({ url: '/shiyanshi/aqjk/report', method: 'get', data })
  },

  // 任务承担-评审流程记录
  getContractAuditRecord(data) {
    return httpOne({ url: '/shiyanshi/aqjk/getContractAuditRecord', method: 'get', data })
  },




}
