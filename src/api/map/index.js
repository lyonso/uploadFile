import http from '@/api/http'

export default {
  // 太湖水位过程线
  waterL() {
    return http({ url: '/system/index/z', method: 'get', json: false })
  },
  // 太湖出入湖水量
  crsl() {
    return http({ url: '/system/index/crsl', method: 'get', json: false })
  },
  // 水质等级占比-省际河流-主要入户河流
  waterQualityGrade(data) {
    return http({ url: '/system/index/waterQualityGrade', method: 'get', data, json: true })
  },
  // 水质等级占比-省际湖泊
  waterQualityGrade1() {
    return http({ url: '/system/index/waterQualityGrade1', method: 'get' })
  },
  // 水质等级占比-省际湖泊
  waterQualityCategory(data) {
    return http({ url: '/system/index/waterQualityCategory', method: 'get', data, json: true })
  },
  // 水系点位数量统计
  pointCategoryNum() {
    return http({ url: '/system/index/pointCategoryNum', method: 'get' })
  },
  // 站点指标数据
  dataByPoint(data) {
    return http({ url: '/system/index/dataByPoint', method: 'get', data, json: true })
  },
  // 站点指标数据
  dataByzdPoint(data) {
    return http({ url: '/system/lanzao/dataByPoint', method: 'get', data, json: true })
  },
  /**
   *  蓝藻
   */
  //湖区藻类月度统计
  getLakePhyMonth() {
    return http({ url: '/system/lanzao/getLakePhyMonth', method: 'get' })
  },
  //湖区水质月度统计
  getSjLakeMonth() {
    return http({ url: '/system/lanzao/getSjLakeMonth', method: 'get' })
  },
  // 蓝藻图片列表
  lzImgList(data) {
    return http({ url: '/system/data/list', method: 'get', data, json: true })
  },
  // 人工巡测站点
  handSample(data) {
    return http({ url: '/system/lanzao/handSample', method: 'get', data, json: true })
  },
  // 年度藻类数量-生物量走势
  getAllItemDataOfYear(data) {
    return http({ url: '/system/lanzao/getAllItemDataOfYear', method: 'get', data, json: true })
  },
  // 近七天水质常规参数监测
  waterQualityParameter(data) {
    return http({ url: '/system/lanzao/waterQualityParameter', method: 'get', data, json: true })
  },
  // 监测站点监测数据列表
  lanzaoDataList(data) {
    return http({ url: '/system/lanzao/dataList', method: 'get', data, json: true })
  },
  // 自动站下拉
  zdPoint() {
    return http({ url: '/system/lanzao/zdPoint', method: 'get' })
  },
  // 人工采样数据列表
  handSampleDataList(data) {
    return http({ url: '/system/lanzao/handSampleDataList', method: 'get', data, json: true })
  },
  // 人工采样站下拉
  rgPoint() {
    return http({ url: '/system/lanzao/rgPoint', method: 'get' })
  },
  // 蓝藻点位数量统计
  pointNum() {
    return http({ url: '/system/lanzao/pointNum', method: 'get' })
  },
  // 蓝藻数据图片 列表
  imglist(data) {
    return http({ url: '/system/img/list', method: 'get', data, json: true })
  },
  // 视频监控站下拉
  spjkPoint() {
    return http({ url: '/system/lanzao/spjkPoint', method: 'get' })
  },
  // 蓝藻点位模糊搜索
  selectPoint(data) {
    return http({ url: '/system/lanzao/selectPoint', method: 'get', data, json: true })
  },
  // 图片下载
  downloadImg(data) {
    return http({ url: '/system/index/download', method: 'get', data, json: true, responseType: 'blob' })
  },
  // 蓝藻调查点-数据展示
  getLrData(data) {
    return http({ url: '/system/lanzao/getLrData', method: 'get', data, json: true })
  },
  // 图片站点下拉
  picturePoint(data) {
    return http({ url: '/system/lanzao/picturePoint', method: 'get', data, json: true })
  },
  // 蓝藻调查点-列表
  getLrDataList(data) {
    return http({ url: '/system/lanzao/getLrDataList', method: 'get', data, json: true })
  },
  /**
   * 数字实验室
   */
  // 视频监控站下拉
  CONUTFOLDERS() {
    return http({ url: '/system/shiyanshi/CONUTFOLDERS', method: 'get' })
  },
  getEnvironmentInfoByFloor(data) {
    return http({ url: '/system/shiyanshi/getEnvironmentInfoByFloor', method: 'get', data, json: true })
  },
  getEnvironmentInfo(data) {
    return http({ url: '/system/shiyanshi/getEnvironmentInfo', method: 'get', data, json: true })
  },
  introductionId(id) {
    return http({ url: '/system/introduction/' + id, method: 'get' })
  },
  FRESULTS(data) {
    return http({ url: '/system/shiyanshi/FRESULTS', data, method: 'get', json: true })
  },
  getDoorEvents(data) {
    return http({ url: '/system/shiyanshi/getDoorEvents', data, method: 'get', json: true })
  },
  // 门禁点反控
  doControl(data) {
    return http({ url: '/system/shiyanshi/doControl', data, method: 'post' })
  },
  // 门禁进出记录
  getDoorList(data) {
    return http({ url: '/system/shiyanshi/getDoorList', data, method: 'post' })
  },
  // 自动站-监控事件展示
  getAIEvent(data) {
    return http({ url: '/system/index/getAIEvent', data, method: 'get', json: true })
  },
  // 门禁下拉
  acsDoorList() {
    return http({ url: '/system/shiyanshi/acsDoorList', method: 'get' })
  },
  // 环境监测指标数据-实时告警
  getEnvironmentWarning() {
    return http({ url: '/system/shiyanshi/getEnvironmentWarning', method: 'get' })
  },
  // 环境监测指标数据-告警记录
  getEnvironmentWarningList(data) {
    return http({ url: '/system/shiyanshi/getEnvironmentWarningList', data, method: 'get', json: true })
  },

  /**
   * 模糊搜索自动站
   */
  //模糊搜索自动站
  zidongzhanByName(data) {
    return http({ url: '/system/index/zidongzhanByName', method: 'get', data, json: true })
  },
  //自动站-最新监测数据
  getNewestData(data) {
    return http({ url: '/system/index/getNewestData', method: 'get', data, json: true })
  },
  getStcdIntroduction(id) {
    return http({ url: '/system/introduction/getStcdIntroduction/' + id, method: 'get' })
  },
  getCameraCode(id) {
    return http({ url: '/jcsj/camera/' + id, method: 'get', json: true })
  },
  // 蓝藻-监控图像分布强度日均指数
  getImageCyblSiDay(data) {
    return http({ url: '/system/lanzao/getImageCyblSiDay', method: 'get', data, json: true })
  },
  // 蓝藻-监控图像分布强度日均指数30天
  getStatisticsData(data) {
    return http({ url: '/system/lanzao/getStatisticsData', method: 'get', data, json: true })
  },

}




