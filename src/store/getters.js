/**
 * vuex getters
 * author: Wang <wangh@ciqtek.com>
 * company: ubiot.cn
 * date: 2019-10-21
 */

const getters = {
  userInfo: state => state.auth.userInfo,
  Mask: state => state.map.Mask,
  BlueDialogDetails: state => state.map.BlueDialogDetails,
  HomeDialogDetails: state => state.map.HomeDialogDetails,
  bluePanel:state => state.map.bluePanel,
  mapState:state => state.map.mapState,
  openDialog:state => state.map.openDialog,
  mjID:state => state.map.mjID,
  videoCode:state => state.map.videoCode,
  fileTheme:state => state.map.fileTheme,
  buildingControl:state => state.map.buildingControl,
  showModel:state => state.map.showModel,
  equipmentId:state => state.map.equipmentId,
  BIMDetailsStatus:state => state.automaticStation.BIMDetailsStatus,
  equipmentImgChose:state => state.automaticStation.equipmentImgChose,
  wsdList:state => state.ThreeDLaboratory.wsdList,
  kqzlList:state => state.ThreeDLaboratory.kqzlList,
  AIList:state => state.ThreeDLaboratory.AIList,
  duplicateList:state => state.ThreeDLaboratory.duplicateList,
  modelId:state => state.automaticStation.modelId,
}

export default getters
