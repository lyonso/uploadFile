/**
 * 状态管理modules => inspect
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

const state = {
  flows: [
    { index: 1, name: '任务承担' },
    { index: 2, name: '外业监测' },
    { index: 3, name: '检测分析' },
    { index: 4, name: '数据采集' }
  ],
  currentFlow: 0,
  dialogVisible: false,
  visibleTitle: '',
  TaskCommitmentDetails:{},
}

const mutations = {
  SET_CURRENT_FLOW: (state, flow) => {
    state.currentFlow = flow
  },
  SET_DIALOG_VISIBLE: (state, dialogVisible) => {
    state.dialogVisible = dialogVisible
  },
  SET_VISIBLE_TITLE: (state, visibleTitle) => {
    state.visibleTitle = visibleTitle
  },
  SET_TASK_COMMITMENT_DETAILS:(state,TaskCommitmentDetails)=>{
    state.TaskCommitmentDetails = TaskCommitmentDetails
  }

}

const actions = {
  /**
   * 改变选中流程点
   * @param commit
   * @param dispatch
   * @param rootState
   * @param index
   */
  changeFlow({ commit, dispatch, rootState }, index) {
    return new Promise(async (resolve, reject) => {
      console.log(index)
      switch (index) {
        // 任务承担
        case 1:
          break
        // 外业监测
        case 2:
          break
        // 检测分析
        case 3:
          dispatch('ma/fetchImportant', {}, { root: true })
          dispatch('ma/fetchSample', rootState.ma.time, { root: true })
          break
        // 数据采集
        case 4:
          break
        default:
          break
      }
      commit('SET_CURRENT_FLOW', index)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
