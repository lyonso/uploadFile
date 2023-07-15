<template>
  <div id="CesiumHeatMapDiv" v-if="cesiumHeatMapIsShow">
    <table style="text-align: right;">
      <tr>
        <td colspan="2" style="text-align: left">
          <span style="font-size: 18px; font-weight: 600;">模拟热力图</span>
          <div class="closeCesiumHeatMap" @click="handCloserCesiumHeatMap"></div>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div
            style="height: 4px;background-color: rgba(29,164,220,0.6);margin: 4px;"
          ></div>
        </td>
      </tr>
      <tr>
        <td>坐标数量：</td>
        <td>
          <el-input-number
            class="inputNumWidth"
            v-model="xyList"
            :max="99999"
            :min="5000"
            :step="5000"
            @change="handlxlChange"
          ></el-input-number>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <el-button size="mini" :disabled="isDrawCesiumHeatMap" @click="loadCesiumHeatMap">加载热力图</el-button>
          <el-button size="mini" @click="clearCesiumHeatMap">清除</el-button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import * as turf from '@turf/turf'
import CesiumHeatmap from "../../../../../static/cesium-heatmap/CesiumHeatmap";

let cesiumHeatViewer = undefined
let heatMap1 = undefined
let timeInterval = undefined

export default {
  name: "cesiumHeatMap",
  data() {
    return {
      cesiumHeatMapIsShow: false,
      isDrawCesiumHeatMap: false,
      xyList: 5000,
    };
  },
  methods: {
    handlxlChange(){
      this.loadCesiumHeatMap()
    },

    /**
     * @description: 组件调用入口方法
     */
    openCesiumHeatMap(viewer) {
      cesiumHeatViewer = viewer
      this.cesiumHeatMapIsShow = true;
    },

    handCloserCesiumHeatMap() {
      this.cesiumHeatMapIsShow = false;
      cesiumHeatViewer = undefined
      this.clearCesiumHeatMap()
    },

    loadCesiumHeatMap(){
      this.clearCesiumHeatMap()
      this.isDrawCesiumHeatMap = true

      this.loadCesiumHeatMapFun()

      timeInterval = setInterval(() => {
        this.loadCesiumHeatMapFun()
      }, 5000);
    },

    // 模拟代码
    loadCesiumHeatMapFun(){
      let tmpXYList = [
        new Cesium.Cartographic(111.2300232,39.5279085, 0),
        new Cesium.Cartographic(111.2300178,39.5256063, 0),
        new Cesium.Cartographic(111.198801,39.5256635, 0),
        new Cesium.Cartographic(111.1988154,39.527964, 0),
      ]

      //生成矩形
      var bound = new Cesium.Rectangle.fromCartographicArray(tmpXYList)
      // 随机生成矩形范围内的点坐标
      let tPoints = turf.randomPoint(Number(this.xyList), {bbox: [bound.west, bound.south, bound.east, bound.north]})
      var searchWithin = turf.polygon([[
        [111.2300232,39.5279085],
        [111.2300178,39.5256063],
        [111.198801,39.5256635],
        [111.1988154,39.527964],
        [111.2300232,39.5279085]
      ]]);
      // 返回多边形内的所有点
      var ptsWithin = turf.pointsWithinPolygon(tPoints, searchWithin);

      let tmpMarksList = []
      let heatMax = 0
      let heatPoints = []
      tmpXYList.forEach( xy => {
        this.sampleHeightsCoordinate([xy.longitude,xy.latitude],3,(posi) => {
          tmpMarksList.push(posi)
        })
      })

      // 对随机生成的点添加value值
      ptsWithin.features.forEach(dl => {
        var val = Math.floor(Math.random() * 100);
        heatMax = Math.max(heatMax, val);
        let coord = dl.geometry.coordinates
        var point = {
          x: coord[0],
          y: coord[1],
          value: val
        };
        heatPoints.push(point);
      })

      let temTime = setInterval(() => {
        if(ptsWithin.features.length === heatPoints.length && tmpXYList.length === tmpMarksList.length){
          heatMap1 ? '' : heatMap1 = window.CesiumHeatmap.create(cesiumHeatViewer,bound,tmpMarksList,{ // heatmap相应参数
            radius: 20,
            maxOpacity: .6,
            minOpacity: 0,
            blur: .75,
            gradient: {
              '0.95':'red',
              '0.85':'orange',
              '0.75':'yellow',
              '0.55':'blue',
              '0.3':'green',
            },
          })
          let valueMin = 0;
          heatMap1.setWGS84Data(valueMin, heatMax, heatPoints);

          clearInterval(temTime)
        }
      }, 120);
    },

    clearCesiumHeatMap(){
      this.isDrawCesiumHeatMap = false
      if(heatMap1) {
        heatMap1._layer ? heatMap1._cesium.entities.remove(heatMap1._layer) : ''
        heatMap1._layer = undefined
      }
      clearInterval(timeInterval)
    },

    sampleHeightsCoordinate(coordinate, height,callback) {
      const positions = [
        Cesium.Cartographic.fromDegrees(coordinate[0], coordinate[1]),
      ]
      cesiumHeatViewer.scene.sampleHeightMostDetailed(positions).then(function (clampedCartesians) {
        const posi = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1], clampedCartesians[0].height + height)
        callback(posi)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.closeCesiumHeatMap {
  text-decoration: none;
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 20;
}
.closeCesiumHeatMap:after {
  // content: "✖";
  content: "\e60b";
  font-family: "iconfont";
  font-size: 22px;
  color: rgba($color: gray, $alpha: 0.8);
}

#CesiumHeatMapDiv {
  color: rgba(29, 164, 220, 0.9);
  background: rgba(34, 69, 91, 0.7);
  border-radius: 6px;
  padding: 10px;

  .closeCesiumHeatMap {
    top: 1vh;
    right: 0.6vw;
    cursor: pointer;
  }

  /deep/ .inputNumWidth {
    width: 140px;
    .el-input__inner {
      height: 28px;
      line-height: 28px;
      padding: 0px 6px;
      background: #104c66bd;
      color: #cef2ff;
      font-size: 12px;
      border: 0px;
    }
    .el-input-number__decrease,
    .el-input-number__increase {
      background: #104c66;
      color: rgba(255, 255, 255, 0.8);
      border-right: 0px;
      border-left: 0px;
      font-size: 14px;
      top: 4px;
    }
  }

  /deep/ .el-button {
    background: rgba(18, 167, 204, 0.52);
    color: #cef2ff;
    border: 0px;
  }
}

#CesiumHeatMapDiv td {
  padding: 4px 2px;
}
</style>
