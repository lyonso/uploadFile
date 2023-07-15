<template>
  <div id='map'></div>
</template>

<script>
import supermapJs from '@/mapJs/supermapJs'
let viewer =null
export default {
  name: 'index',
  data(){
    return{

    }
  },
  mounted(){
    viewer = supermapJs.initMap2('map')
    // var matrixIds = [];
    // for (var i = 0; i <= 8; i++) {
    //   matrixIds[i] = i;
    // }
    // var zhongguofanwei = new Cesium.WebMapTileServiceImageryProvider({
    //   url: "http://172.16.150.115:8090/iserver/services/map-tpk-mapmercator3wuxi/wmts100",
    //   layer: "zhongguofanwei4490",
    //   style: "default",
    //   format: "image/png",
    //   tileMatrixSetID: "Custom_zhongguofanwei4490",
    //   tileMatrixLabels: matrixIds,
    //   tilingScheme: new Cesium.GeographicTilingScheme({
    //     ellipsoid: Cesium.Ellipsoid.CGCS2000,
    //     numberofLevelZeroTilesX: 2,
    //     numberofLevelZeroTilesY: 1,
    //   }),
    // });
    // var wailayer = viewer.imageryLayers.addImageryProvider(zhongguofanwei)
    let TileMatrixs=[
      'GoogleMapsCompatible:0', 'GoogleMapsCompatible:1', 'GoogleMapsCompatible:2','GoogleMapsCompatible:3',
      'GoogleMapsCompatible:4', 'GoogleMapsCompatible:5', 'GoogleMapsCompatible:6','GoogleMapsCompatible:7',
      'GoogleMapsCompatible:8', 'GoogleMapsCompatible:9', 'GoogleMapsCompatible:10','GoogleMapsCompatible:11',
      'GoogleMapsCompatible:12', 'GoogleMapsCompatible:13', 'GoogleMapsCompatible:14','GoogleMapsCompatible:15',
      'GoogleMapsCompatible:16', 'GoogleMapsCompatible:17', 'GoogleMapsCompatible:18'
    ]



  },


}
</script>

<style scoped>
#map{
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

</style>
