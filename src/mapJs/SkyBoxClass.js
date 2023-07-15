/**
 * 天空背景控制初始化
 * @author mly
 */
class SkyBoxClass {
  constructor(viewer) {
    this.viewer = viewer;
    this.widget = viewer.cesiumWidget;
    this.scene = viewer.scene;
    this.defaultSkyBox =null;
    this.currentSkyBox =null;
    this.skyListener =null;
    this.handlerCloud ="cloud";
    this.handlerSky = "skyBox";
    this.sunSkyBox = null;
    this.blueSkyBox =null;
    this.cloudBox =null;

  }

  createCloudBox(){
    this.cloudBox = new Cesium.CloudBox({
      url:'./image/SkyBox/clouds/clouds-supermap-sm.png'
    });

    this.sunSkyBox = new Cesium.SkyBox({
      sources:{
        positiveX:'./image/SkyBox/sunsetglow/Right.jpg',
        negativeX:'./image/SkyBox/sunsetglow/Left.jpg',
        positiveY:'./image/SkyBox/sunsetglow/Front.jpg',
        negativeY:'./image/SkyBox/sunsetglow/Back.jpg',
        positiveZ:'./image/SkyBox/sunsetglow/Up.jpg',
        negativeZ:'./image/SkyBox/sunsetglow/Down.jpg'
      }
    });


    this.blueSkyBox = new Cesium.SkyBox({
      sources:{
        positiveX:'./image/SkyBox/bluesky/Right.jpg',
        negativeX:'./image/SkyBox/bluesky/Left.jpg',
        positiveY:'./image/SkyBox/bluesky/Front.jpg',
        negativeY:'./image/SkyBox/bluesky/Back.jpg',
        positiveZ:'./image/SkyBox/bluesky/Up.jpg',
        negativeZ:'./image/SkyBox/bluesky/Down.jpg'
      }
    })
    this.defaultSkyBox = this.scene.skyBox;
    this.scene.skyBox = this.blueSkyBox;

    this.scene.postRender.addEventListener(this.initialSkyBox());

  }

  initialSkyBox(){
    if(this.scene.frameState.passes.render){
        this.sunSkyBox.update(this.scene.frameState,true);
        this.blueSkyBox.update(this.scene.frameState,true);
        this.scene.postRender.removeEventListener(this.initialSkyBox());
     }
  }

  openSkyBox(status){
    if(status){
      this.sunSkyBox.WSpeed = 0.5;
      this.sunSkyBox.show = true;
      this.currentSkyBox = this.sunSkyBox;
    }else{
      this.scene.postRender.removeEventListener(this.skyListener);
      this.scene.skyBox = this.defaultSkyBox;
      this.scene.skyAtmosphere.show = true;
    }
  }

  changeCamera(){
      this.skyListener = function() {
      let cameraHeight = this.scene.camera.positionCartographic.height;
      let skyAtmosphereH1 = 22e4; // 大气开始渐变的最大高度
      let skyBoxH1 = 15e4; // 天空开始渐变的最大高度
      let skyBoxH2 = 12e4; // 天空开始渐变的最小高度
      let bufferHeight = 1e4;
      if (cameraHeight < skyAtmosphereH1 && Cesium.defined(this.currentSkyBox)) {
          let skyAtmosphereT = (cameraHeight - skyBoxH2) / (skyAtmosphereH1 - skyBoxH2);
          if (skyAtmosphereT > 1.0) {
            skyAtmosphereT = 1.0;
          } else if (skyAtmosphereT < 0.0) {
            skyAtmosphereT = 0.0;
          }

          let skyBoxT = (cameraHeight - skyBoxH2) / (skyBoxH1 - skyBoxH2);
          if (skyBoxT > 1.0) {
            skyBoxT = 1.0;
          } else if (skyBoxT < 0.0) {
            skyBoxT = 0.0;
          }
          this.currentSkyBox.alpha = 1.0 - skyBoxT;
          if(cameraHeight>skyBoxH2){
          this.scene.skyAtmosphere.show = true;
          this.scene.skyAtmosphere.alpha = skyAtmosphereT;
          this.scene.skyBox = this.currentSkyBox;
        }else{
          this.scene.skyAtmosphere.show = false;
        }
      } else {
          this.scene.skyAtmosphere.alpha = 1.0;
          this.scene.skyBox = this.defaultSkyBox;
      }
      if (this.scene.skyBox !==this.defaultSkyBox) {
          if (cameraHeight > (skyBoxH2 - 2 * bufferHeight) && cameraHeight < skyBoxH1 + 3 * bufferHeight) {
            this.scene.screenSpaceCameraController.zoomFactor = 0.4;
          } else {
            this.scene.screenSpaceCameraController.zoomFactor = 5.0;
          }
      } else {
        this.scene.skyBox.alpha = 1.0;
        this.scene.skyAtmosphere.alpha = 1.0;
        this.scene.screenSpaceCameraController.zoomFactor = 5.0;
      }

    };

    this.scene.postRender.addEventListener(this.skyListener);
    }

}


export default {
  SkyBoxClass
}
