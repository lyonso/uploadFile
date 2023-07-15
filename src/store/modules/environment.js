/**
 * 状态管理modules => 环境监测
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */
import { environment } from '@/api'
import { EventBus } from '@/mapJs/EventBus'

const paramFmt = {
  2: 'TEMP',
  3: 'HUMI',
  4: 'CH2O',
  5: 'VOC'
}

const state = {
  isOpen: true,
  check: 1,
  currentWarn: {
    num: 0
  },
  todayWarn: {
    num: 0
  },
  CH2O: {
    currentWarn: {
      num: 0
    },
    todayWarn: {
      num: 0
    }
  },
  VOC: {
    currentWarn: {
      num: 0
    },
    todayWarn: {
      num: 0
    }
  },
  range: {
    ch2o: '',
    humi: '',
    temp: '',
    voc: ''
  },
  room: [
    {
      humi: 0,
      newCount: 0,
      oldCount: 0,
      temp: 0
    },
    {
      humi: 0,
      newCount: 0,
      oldCount: 0,
      temp: 0
    }
  ],
  standard: {
    VOC: 0,
    CH2O: 0
  },
  events: [],
  infos: [],
  visible: false,
  eId: null,
  warnParam: {},
  vb: false,
  detail: [],
  dateValue: [],
  pageNum: 1,
  total: 0
}

const mutations = {
  SET_OPEN: (state, isOpen) => {
    state.isOpen = isOpen
  },
  SET_CHECK: (state, check) => {
    state.check = check
  },
  SET_INFO: (state, data) => {
    state[data.key] = data.value
  },
  SET_VISIBLE: (state, visible) => {
    state.visible = visible
  },
  SET_EID: (state, eId) => {
    state.eId = eId
  },
  SET_WARN_PARAM: (state, param) => {
    state.warnParam = param
  },
  SET_VB: (state, vb) => {
    state.vb = vb
  },
  SET_DETAIL: (state, detail) => {
    state.detail = detail
  },
  SET_DATEVALUE: (state, dateValue) => {
    state.dateValue = dateValue
  },
  SET_PAGENum: (state, pageNum) => {
    state.pageNum = pageNum
  },
  SET_TOTAL: (state, total) => {
    state.total = total
  }
}

const actions = {
  /**
   * 查看预警详情
   * @param commit
   * @param param
   */
  showDetailModal({ dispatch, commit }, param) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = {
          ...param,
          beginTime: state.dateValue[0],
          endTime: state.dateValue[1],
          pageNum: state.pageNum,
          limit: 10
        }
        const { data } = await environment.environmentWarnDetail(obj)
        const list = state.detail.concat(data.rows)
        commit('SET_DETAIL', list)
        commit('SET_TOTAL', data.total)
        commit('SET_WARN_PARAM', param)
        commit('SET_VB', true)
        resolve()
      } catch (e) {
        reject()
      }
    })
  },
  setDateValue({ commit }, param) {
    commit('SET_DATEVALUE', param)
  },
  upDateDetail({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = {
          ...state.warnParam,
          beginTime: state.dateValue[0],
          endTime: state.dateValue[1]
        }
        const { data } = await environment.environmentWarnDetail(obj)
        commit('SET_DETAIL', data)
      } catch (e) {
        reject()
      }
    })
  },
  /**
   * 获取当天日期
   * @param commit
   * @param param
   */
  getCurrentTime({ commit }) {
    const Data = new Date()
    const year = Data.getFullYear().toString()
    let month = (Data.getMonth() + 1).toString()
    let data = Data.getDate().toString()
    if (month.length < 2) month = '0' + month
    if (data.length < 2) data = '0' + data
    commit('SET_DATEVALUE', [year + '-' + month + '-' + data + ' 00:00:00', year + '-' + month + '-' + data + ' 23:59:59'])
  },
  /**
   * 改变选中态
   * @param commit
   * @param dispatch
   * @param index
   */
  changeCheck({ commit, dispatch }, index) {
    return new Promise((resolve, reject) => {
      commit('SET_CHECK', index)
      if (index > 1) {
        dispatch('infoByParam')
      } else {
        dispatch('eventInfo')
      }
    })
  },

  /**
   * 告警数量统计
   * @param commit
   * @param dispatch
   * @param state
   * @returns {Promise}
   */
  eventNum({ commit, dispatch, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const res1 = await environment.environmentEventNum({ eventType: null, flag: 0 })
        const res2 = await environment.environmentEventNum({ eventType: null, flag: 1 })
        const res3 = await environment.environmentEventNum({ eventType: 'CH2O', flag: 0 })
        const res4 = await environment.environmentEventNum({ eventType: 'CH2O', flag: 1 })
        const res5 = await environment.environmentEventNum({ eventType: 'VOC', flag: 0 })
        const res6 = await environment.environmentEventNum({ eventType: 'VOC', flag: 1 })
        commit('SET_INFO', { key: 'currentWarn', value: res1.data })
        commit('SET_INFO', { key: 'todayWarn', value: res2.data })
        commit('SET_INFO', { key: 'CH2O', value: { currentWarn: res3.data, todayWarn: res4.data } })
        commit('SET_INFO', { key: 'VOC', value: { currentWarn: res5.data, todayWarn: res6.data } })
        if (state.check > 1) {
          dispatch('infoByParam')
        } else {
          dispatch('eventInfo')
        }
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   * 温湿度范围
   * @param commit
   * @returns {Promise}
   */
  tempAndHumiRange({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await environment.environmentTempAndHumiRange({})
        commit('SET_INFO', { key: 'range', value: data })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   * UPS室
   * @param commit
   * @returns {Promise}
   */
  singleRoom({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await environment.environmentSingleRoom({})
        data[0]['name'] = '有机二室'
        data[1]['name'] = 'UPS室'
        commit('SET_INFO', { key: 'room', value: data })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   * 七天
   * @param commit
   * @returns {Promise}
   */
  fetchDaysData({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await environment.environmentDataFor7days({})
        const { x, ch2oY, vocY, VOC, CH2O } = data
        commit('SET_INFO', { key: 'standard', value: { VOC, CH2O } })
        resolve({ x, ch2oY, vocY })
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   * 实时告警详情
   * @param commit
   * @param state
   * @returns {Promise}
   */
  eventInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await environment.environmentEventInfo({ eventIds: state.currentWarn.eventIds })
        commit('SET_INFO', { key: 'events', value: data })
        EventBus.$emit('dataType', { type: 1, data })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   * 监测数据
   * @param commit
   * @param state
   * @returns {Promise}
   */
  infoByParam({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await environment.environmentInfoByParam({ param: paramFmt[state.check] })
        commit('SET_INFO', { key: 'infos', value: data })
        EventBus.$emit('dataType', { type: state.check, data })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   * 打开弹窗
   * @param commit
   * @param dispatch
   * @param id
   * @returns {Promise}
   */
  showModal({ commit, dispatch }, id) {
    return new Promise(resolve => {
      commit('SET_EID', id)
      commit('SET_VISIBLE', true)
      dispatch('markRead', id)
      resolve()
    })
  },

  /**
   * 关闭弹窗
   * @param commit
   * @param dispatch
   * @returns {Promise}
   */
  closeModal({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_EID', null)
      commit('SET_VISIBLE', false)
      dispatch('eventNum')
      resolve()
    })
  },

  /**
   * 标记已读
   * @param dispatch
   * @param id
   */
  markRead({ dispatch }, id) {
    return new Promise(async (resolve, reject) => {
      try {
        await environment.environmentMarkRead({ eventId: id })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
