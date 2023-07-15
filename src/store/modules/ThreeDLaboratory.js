/**
 * 状态管理modules => user
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

const state = {
  //环境监测三个告警 温湿度  空气质量  AI识别
  wsdList: [],
  kqzlList: [],
  AIList: [],
  duplicateList:[]
}

const mutations = {
  SET_wsdList: (state, wsdList) => {
    state.wsdList = wsdList
  },
  SET_kqzlList: (state, kqzlList) => {
    state.kqzlList = kqzlList
  },
  SET_AIList: (state, AIList) => {
    state.AIList = AIList
  },
  SET_DuplicateList: (state, duplicateList) => {
    state.duplicateList = duplicateList
  }
}

const actions = {
  setwsdList({ commit }, wsdList) {
    commit('SET_wsdList', wsdList)
  },
  setkqzlList({ commit }, kqzlList) {
    commit('SET_kqzlList', kqzlList)
  },
  setAIList({ commit }, AIList) {
    commit('SET_AIList', AIList)
  },
  setDuplicateList({ commit }, duplicateList) {
    commit('SET_DuplicateList', duplicateList)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
