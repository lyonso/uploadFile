/**
 * 画线工具类class
 */

/* eslint-disable */
class TooLineClass {
  constructor(viewer) {
    this.viewer = viewer
    this.positions = []
    this.lineEntity = new Cesium.Entity()
    this.lineObj = null
    this.handlerLine = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  }

  drawLine() {
    $('.cesium-widget').css('cursor', 'crosshair')
    this.drawLayer = new Cesium.CustomDataSource('lineLayer')
    this.viewer.dataSources.add(this.drawLayer)
    const self = this
    this.handlerLine.setInputAction(function(res) {
      const cartesian = self.getCatesian3FromPX(res.position)
      if (cartesian && cartesian.x) {
        if (self.positions.length === 0) {
          self.positions.push(cartesian.clone())
        }
        self._addInfoPoint(cartesian)
        self.positions.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handlerLine.setInputAction(function(res) {
      // 获取鼠标最后一次移动结束点位
      const cartesian = self.getCatesian3FromPX(res.endPosition)
      if (self.positions.length >= 2) {
        if (cartesian && cartesian.x) {
          self.positions.pop()
          self.positions.push(cartesian)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handlerLine.setInputAction(function(res) {
      let wgs84position =[];
      for(let i=0;i<self.positions.length;i++){
        wgs84position.push(self.transformCartesianToWGS84(self.positions[i]));
      }
      const cartesian = self.getCatesian3FromPX(res.position)
      self._addInfoPoint(cartesian)
      $('.cesium-widget').css('cursor', 'pointer')
      self.handlerLine.destroy()
      self.handlerLine = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    this.lineEntity.polyline = {
      width: 3,
      material: Cesium.Color.RED.withAlpha(0.8),
      clampToGround: true
    }
    this.lineEntity.polyline.positions = new Cesium.CallbackProperty(function() {
      return self.positions
    }, false)

    this.drawLayer.entities.add(this.lineEntity)
  }

  delete() {
    let dataources = this.viewer.dataSources._dataSources
    if (dataources.length > 0) {
      for (let i = 0; i < dataources.length; i++) {
        if (dataources[i]._name === 'lineLayer') {
          this.viewer.dataSources.remove(dataources[i], true)
        }
      }
    }
  }


  _addInfoPoint(position) {
    var dis= this.getPositionDistance(this.transformCartesianArrayToWGS84Array(this.positions))
    const _labelEntity = new Cesium.Entity()
    _labelEntity.position = position
    _labelEntity.point = {
      pixelSize: 1,
      outlineColor: Cesium.Color.YELLOW,
      outlineWidth: 3
    }
    if(parseFloat(dis)!==parseFloat(0)){
      _labelEntity.label = {
        text: '距离:' + (dis / 1000).toFixed(2) + 'km',
        show: true,
        showBackground: true,
        font: '18px monospace',
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(-20, -30) // left top
      }
    }
    this.drawLayer.entities.add(_labelEntity)
  }

  getPositionDistance(positions) {
    let distance = 0
    for (let i = 0; i < positions.length - 1; i++) {
      const point1cartographic = this.transformWGS84ToCartographic(positions[i])
      const point2cartographic = this.transformWGS84ToCartographic(positions[i + 1])
      const geodesic = new Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(point1cartographic, point2cartographic)
      let s = geodesic.surfaceDistance
      s = Math.sqrt(
        Math.pow(s, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2)
      )
      distance = distance + s
    }
    return distance.toFixed(3)
  }

  transformWGS84ToCartographic(position) {
    return position ? Cesium.Cartographic.fromDegrees(position.lng || position.lon, position.lat, position.alt) : Cesium.Cartographic.ZERO
  }

  transformCartesianArrayToWGS84Array(cartesianArr) {
    const self = this
    if (this.viewer) {
      return cartesianArr ? cartesianArr.map(function(item) {
        return self.transformCartesianToWGS84(item)
      }) : []
    }
  }

  transformCartesianToWGS84(cartesian) {
    if (this.viewer && cartesian) {
      const ellipsoid = Cesium.Ellipsoid.WGS84
      const cartographic = ellipsoid.cartesianToCartographic(cartesian)
      return {
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        alt: cartographic.height
      }
    }
  }

  getCatesian3FromPX(px) {
    if (this.viewer && px) {
      const picks = this.viewer.scene.drillPick(px)
      let cartesian = null
      let isOn3dtiles = false
      let isOnTerrain = false
      // drillPick
      for (const i in picks) {
        const pick = picks[i]
        if (pick &&
          pick.primitive instanceof Cesium.Cesium3DTileFeature ||
          pick && pick.primitive instanceof Cesium.Cesium3DTileset ||
          pick && pick.primitive instanceof Cesium.Model) { // 模型上拾取
          isOn3dtiles = true
        }
        // 3dtilset
        if (isOn3dtiles) {
          this.viewer.scene.pick(px) // pick
          cartesian = this.viewer.scene.pickPosition(px)
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
            if (cartographic.height < 0) cartographic.height = 0
            const lon = Cesium.Math.toDegrees(cartographic.longitude)
            const lat = Cesium.Math.toDegrees(cartographic.latitude)
            const height = cartographic.height
            cartesian = this.transformWGS84ToCartesian({ lng: lon, lat: lat, alt: height })
          }
        }
      }
      // 地形
      const boolTerrain = this.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider
      if (!isOn3dtiles && !boolTerrain) {
        var ray = this.viewer.scene.camera.getPickRay(px)
        if (!ray) return null
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene)
        isOnTerrain = true
      }
      // 地球
      if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
        cartesian = this.viewer.scene.camera.pickEllipsoid(px, this.viewer.scene.globe.ellipsoid)
      }
      if (cartesian) {
        const position = this.transformCartesianToWGS84(cartesian)
        if (position.alt < 0) {
          cartesian = this.transformWGS84ToCartesian(position, 0.1)
        }
        return cartesian
      }
      return false
    }
  }

  transformWGS84ToCartesian(position, alt) {
    if (this.viewer) {
      return position ? Cesium.Cartesian3.fromDegrees(
        position.lng || position.lon,
        position.lat,
        position.alt = alt || position.alt,
        Cesium.Ellipsoid.WGS84
      ) : Cesium.Cartesian3.ZERO
    }
  }
}

export default {
  TooLineClass
}
