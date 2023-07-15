/**
 * 状态管理modules => user
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

const state = {
    Mask: false,
    BlueDialogDetails:'',
    HomeDialogDetails:'',
    bluePanel:'',
    mapState:-1,
    openDialog:-1,
    videoCode:'d94e67f43ce140efaa6315a7c489e1f5',
    mjID:'',

    fileTheme:'卫星遥感影像',
    buildingControl:'-1',
    equipmentId:'',
    showModel:false
}

const mutations = {
    SET_MARK: (state, mask) => {
        state.Mask = mask
    },
    SET_BLUEDIALOGDETAILS: (state, BlueDialogDetails) => {
        state.BlueDialogDetails = BlueDialogDetails
    },
    SET_HOMEDIALOGDETAILS: (state, HomeDialogDetails) => {
        state.HomeDialogDetails = HomeDialogDetails
    },
    SET_BLUEPANEL: (state, bluePanel) => {
        state.bluePanel = bluePanel
    },
    SET_MAPState: (state, mapState) => {
        state.mapState = mapState
    },
    SET_OpenDialog: (state, openDialog) => {
        state.openDialog = openDialog
    },
    SET_MJID: (state, mjID) => {
        state.mjID = mjID
    },

    SET_videoCode: (state, videoCode) => {
        state.videoCode = videoCode
    },
    SET_FileTheme: (state, fileTheme) => {
        state.fileTheme = fileTheme
    },
    SET_buildingControl: (state, buildingControl) => {
        state.buildingControl = buildingControl
    },
    SET_showModel: (state, showModel) => {
        state.showModel = showModel
    },
    SET_equipmentId: (state, equipmentId) => {
        state.equipmentId = equipmentId
    },

}

const actions = {
    setMask({ commit },mask) {
        commit('SET_MARK',mask)
    },
    setBlueDialogDetails({ commit },BlueDialogDetails) {
        commit('SET_BLUEDIALOGDETAILS',BlueDialogDetails)
    },
    setHomeDialogDetails({ commit },HomeDialogDetails) {
        commit('SET_HOMEDIALOGDETAILS',HomeDialogDetails)
    },
    setBluePanel({ commit },bluePanel) {
        commit('SET_BLUEPANEL',bluePanel)
    },
    setMapState({ commit },mapState) {
        commit('SET_MAPState',mapState)
    },
    setOpenDialog({ commit },openDialog) {
        commit('SET_OpenDialog',openDialog)
    },
    setmjID({ commit },mjID) {
        commit('SET_MJID',mjID)
    },
    setvideoCode({ commit },videoCode) {
        commit('SET_videoCode',videoCode)
    },
    setFileTheme({ commit },fileTheme) {
        commit('SET_FileTheme',fileTheme)
    },
    setBuildingControl({ commit },buildingControl) {
        commit('SET_buildingControl',buildingControl)
    },
    setShowModel({ commit },showModel) {
        commit('SET_showModel',showModel)
    },
    setEquipmentId({ commit },equipmentId) {
        commit('SET_equipmentId',equipmentId)
    },

}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
