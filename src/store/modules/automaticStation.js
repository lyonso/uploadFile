/**
 * 状态管理modules => user
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

const state = {
  BIMDetailsStatus:1,
  equipmentImgChose:0,
  modelId:'22'
}

const mutations = {
  SET_BIMDETAILSSTATUS: (state, BIMDetailsStatus) => {
    state.BIMDetailsStatus = BIMDetailsStatus
  },
  SET_EQUIPMENTIMGCHOSE: (state, equipmentImgChose) => {
    state.equipmentImgChose = equipmentImgChose
  },
  SET_modelId: (state, modelId) => {
    state.modelId = modelId
  },

}

const actions = {
  setBIMDetailsStatus({ commit },BIMDetailsStatus) {
    commit('SET_BIMDETAILSSTATUS',BIMDetailsStatus)
  },
  setEquipmentImgChose({ commit },equipmentImgChose) {
    commit('SET_EQUIPMENTIMGCHOSE',equipmentImgChose)
  },
  setModelId({ commit },modelId) {
    commit('SET_modelId',modelId)
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
