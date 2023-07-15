/**
 * 画面工具类
 */
/* eslint-disable */
class ToolPolygonClass {
  constructor(viewer) {
    this.viewer = viewer
    this.positions = []
    this.polygonEntity = new Cesium.Entity()
    this.polygon = new Cesium.PolygonHierarchy()
    this.handlerPolygon = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  }

  drawPolygon() {
    $('.cesium-widget').css('cursor', 'crosshair')
    this.drawLayer = new Cesium.CustomDataSource('polygonLayer')
    this.viewer.dataSources.add(this.drawLayer);
    const self = this
    this.handlerPolygon.setInputAction(function(res) {
      const cartesian = self.getCatesian3FromPX(res.position)
      console.log(cartesian)
      if (cartesian && cartesian.x) {
        if (self.positions.length === 0) {
          self.polygon.positions.push(cartesian.clone())
          self.positions.push(cartesian.clone())
        }
        self.positions.push(cartesian.clone())
        self.polygon.positions.push(cartesian.clone())
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handlerPolygon.setInputAction(function(res) {
      // 获取鼠标最后一次移动结束点位
      const cartesian = self.getCatesian3FromPX(res.endPosition)
      if (self.positions.length >= 2) {
        if (cartesian && cartesian.x) {
          self.positions.pop()
          self.positions.push(cartesian)
          self.polygon.positions.pop()
          self.polygon.positions.push(cartesian)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handlerPolygon.setInputAction(function(res) {
      self.positions.push(self.positions[0])
      self._addInfoPoint(self.positions[0])
      $('.cesium-widget').css('cursor', 'pointer')
      self.handlerPolygon.destroy()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    self.create()
  }

  create() {
    const self = this
    this.polygonEntity.polyline = {
      width: 4, material: Cesium.Color.RED, clampToGround: true
    }
    this.polygonEntity.polyline.positions = new Cesium.CallbackProperty(function() {
      return self.positions
    }, false)

    this.polygonEntity.polygon = {
      hierarchy: new Cesium.CallbackProperty(function() {
        return self.polygon
      }, false),

      material: Cesium.Color.YELLOW.withAlpha(0.5),
      clampToGround: false
    }

    this.polygonObj = this.drawLayer.entities.add(this.polygonEntity)
  }

  delete() {
    const dataSources = this.viewer.dataSources._dataSources
    if (dataSources.length > 0) {
      for (let i = 0; i < dataSources.length; i++) {
        if (dataSources[i]._name === 'polygonLayer') {
          this.viewer.dataSources.remove(dataSources[i], true)
        }
      }
    }
  }

  _addInfoPoint(position) {
    const _labelEntity = new Cesium.Entity()
    _labelEntity.position = position
    console.log(position)
    //var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm'
    var are=this.getPositionsArea(this.transformCartesianArrayToWGS84Array(this.positions))
    var area = are > 10000.0 ? (are / 1000000.0).toFixed(2) + 'k㎡' : are + '㎡'
    _labelEntity.point = {
      pixelSize: 2,
      outlineColor: Cesium.Color.YELLOW,
      outlineWidth: 3
    }
    _labelEntity.label = {
      text: '面积:' + area,
      show: true,
      showBackground: true,
      font: '20px monospace',
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(-20, -30) // left top
    }
    this.drawLayer.entities.add(_labelEntity)
  }

  getPositionsArea(positions) {
    let result = 0
    if (positions) {
      let h = 0
      const ellipsoid = Cesium.Ellipsoid.WGS84
      positions.push(positions[0])
      for (let i = 1; i < positions.length; i++) {
        const oel = ellipsoid.cartographicToCartesian(
          this.transformWGS84ToCartographic(positions[i - 1])
        )
        const el = ellipsoid.cartographicToCartesian(
          this.transformWGS84ToCartographic(positions[i])
        )
        h += oel.x * el.y - el.x * oel.y
      }
      result = Math.abs(h).toFixed(2)
    }
    return result
  }

  transformWGS84ToCartographic(position) {
    return position ? Cesium.Cartographic.fromDegrees(position.lng || position.lon, position.lat, position.alt) : Cesium.Cartographic.ZERO
  }

  transformCartesianArrayToWGS84Array(cartesianArr) {
    const self = this
    if (this.viewer) return cartesianArr ? cartesianArr.map(function(item) { return self.transformCartesianToWGS84(item) }) : []
  }

  transformCartesianToWGS84(cartesian) {
    if (this.viewer && cartesian) {
      const ellipsoid = Cesium.Ellipsoid.WGS84
      const cartographic = ellipsoid.cartesianToCartographic(cartesian)
      return {
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        alt: 20
      }
    }
  }

  getCatesian3FromPX(px) {
    if (this.viewer && px) {
      const picks = this.viewer.scene.drillPick(px)
      let cartesian = null; let isOn3dtiles = false; let isOnTerrain = false
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
            const lon = Cesium.Math.toDegrees(cartographic.longitude); const lat = Cesium.Math.toDegrees(cartographic.latitude); const height = cartographic.height
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
        // position.alt = alt || position.alt,
        position.alt = 20,
        Cesium.Ellipsoid.WGS84
      ) : Cesium.Cartesian3.ZERO
    }
  }
}


export  default {
  ToolPolygonClass
}
