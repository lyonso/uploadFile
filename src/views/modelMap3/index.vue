<template>
<div style="margin: 0;padding: 0;width: 100%;height: 100%;">
 <div id="map"></div>
</div>
</template>

<script>
import supermapJs from '@/mapJs/supermapJs'

export default {
  name: "index",
  data(){
    return{
      viewer:null,
      serverUrl:process.env.VUE_APP_GIS+"/iserver/services/3D-taipuzha/rest/realspace",
      serverUrlConfig:process.env.VUE_APP_GIS+"/iserver/services/3D-taipuzha/rest/realspace/datas/Combine/config",
      imageryProvider:new Cesium.SuperMapImageryProvider({
        url:process.env.VUE_APP_GIS+"/iserver/services/map-tianditu/rest/maps/影像底图_经纬度",
        maximumLevel:17
      }),
    }
  },
  mounted() {
    this.viewer = supermapJs.initMap("map");
    this.viewer.imageryLayers.addImageryProvider(this.imageryProvider);
    let self = this
    self.viewer.scene.addS3MTilesLayerByScp(self.serverUrlConfig);
    let waterPromise = self.viewer.scene.open('http://10.8.46.81:8090/iserver/services/3D-ShuiYu-tapuzhawater/rest/realspace');
    Cesium.when(waterPromise, function() {
      let layer = self.viewer.scene.layers.find("水域@tapuzhawater");
      layer.style3D.bottomAltitude = 0.6;
    });
    setTimeout(function() {
      self.viewer.scene.camera.flyTo({
        destination: { x: -2774555.47439397, y: 4710921.407343524, z: 3285493.9351095315 },
        orientation: {
          heading: 0.029479976927228257,
          pitch: -0.523552849117709,
          roll: 6.283185307134687
        }
      })
    }, 1400)
  }
}
</script>

<style scoped>
#map{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

</style>
