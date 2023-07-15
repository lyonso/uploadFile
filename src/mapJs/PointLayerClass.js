/**
 * 创建点图层class
 * @author mly
 * @description 可用于所有几何图形
 */
/* eslint-disable */

export class PointLayerClass {
  constructor(LayerName) {
    this.geometryLayer = new Cesium.CustomDataSource(LayerName);
    this.viewer = null;
  }

  addPoint(viewer,data){
    this.viewer = viewer;
    this.viewer.dataSources.add(this.geometryLayer);
    for(let i=0;i<data.length;i++){
      this.geometryLayer.entities.add({
        id: data[i].id,
        position: Cesium.Cartesian3.fromDegrees(parseFloat(data[i].longitude), parseFloat(data[i].latitude),parseFloat(data[i].height)),
        billboard: {
          image: data[i].src,
          width: 41,
          height: 53,
          pixelOffset: new Cesium.Cartesian2(0, 0),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      })
    }
  }

}
