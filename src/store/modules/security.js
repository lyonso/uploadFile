/**
 * 状态管理modules => user
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

const state = {
  isOpen: true,
  isOpenTwo: true,
  BIMIndexStatus: 1,
  floorChose: 0,
  videoID: {},
  openDialog: 0,
  dialogCode: '',
  closeDialog: false,
  taskTime: ''
}

const mutations = {
  SET_ISOPEN: (state, isOpen) => {
    state.isOpen = isOpen
  },
  SET_ISOPENTWO: (state, isOpenTwo) => {
    state.isOpenTwo = isOpenTwo
  },
  SET_FLOORCHOSE: (state, floorChose) => {
    state.floorChose = floorChose
  },
  SET_VIDEOID: (state, videoID) => {
    state.videoID = videoID
  },
  SET_OPENDIALOG: (state, openDialog) => {
    state.openDialog = openDialog
  },
  SET_BIMDETAILSSTATUS: (state, BIMIndexStatus) => {
    state.BIMIndexStatus = BIMIndexStatus
  },
  SET_DIALOGCODE: (state, dialogCode) => {
    state.dialogCode = dialogCode
  },
  SET_CLOSEDIALOG: (state, closeDialog) => {
    state.closeDialog = closeDialog
  },
  SET_TASK_TIME: (state, taskTime) => {
    state.taskTime = taskTime
  }
}

const actions = {
  setvideoID({ commit }, videoID) {
    commit('SET_VIDEOID', videoID)
  },
  setDialogCode({ commit }, dialogCode) {
    commit('SET_DIALOGCODE', dialogCode)
  },
  setCloseDialog({ commit }, dialogCode) {
    commit('SET_CLOSEDIALOG', dialogCode)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
