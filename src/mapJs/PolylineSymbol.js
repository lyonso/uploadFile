const PolylineTrailLinkMaterialProperty = (function() {
  function PolylineTrailLinkMaterialProperty(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._image = undefined;
    this._duration = (new Date()).getTime();
    this._colorSubscription = undefined;

    this.image = options.imgurl;
    this.color = options.color;
    this.duration = options.duration || 3000;

    this.isTranslucent = function () {
      return true;
    }
  }
  //1.69版本使用这个
  Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    //Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    isConstant: {
      get: function () {
        return false;
      }
    },
    definitionChanged: {
      get: function () {
        return this._definitionChanged;
      }
    },
    color: Cesium.createPropertyDescriptor('color'),
    image: Cesium.createPropertyDescriptor("image"),
    duration: Cesium.createPropertyDescriptor("duration")
  });
  PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
    return 'PolylineTrailLink';
  }
  PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Property.getValueOrUndefined(this._image, time);
    result.time = (((new Date()).getTime() - this._duration) % this.duration) / this.duration;
    return result;
  }
  PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
    return this === other ||
      (other instanceof PolylineTrailLinkMaterialProperty &&
        Cesium.Property.equals(this._color, other._color)&&
        Cesium.Property.equals(this._duration, other._duration)&&
        Cesium.Property.equals(this._image, other._image))
  }
  Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;

  Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
  Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
    fabric: {
      type: Cesium.Material.PolylineTrailLinkType,
      uniforms: {
        color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
        image: Cesium.Material.DefaultImageId,
        time: 20
      },
      source:"czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                    {\n\
                        czm_material material = czm_getDefaultMaterial(materialInput);\n\
                        vec2 st = materialInput.st;\n\
                        vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                        material.alpha = colorImage.a * color.a;\n\
                        material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                        return material;\n\
                    }"
    },
    translucent: function (material) {
      return true;
    }
  });
})();


function addPolylineTrail() {
  viewer.entities.add({
    name: 'PolylineTrai1l',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        lon+1, lat+1, 2500,
        lon + 11, lat+1, 2500,
        lon + 11, lat + 11, 2500
      ]),
      width: 15,
      material: new Cesium.PolylineTrailLinkMaterialProperty({
        color:Cesium.Color.ORANGE,
        duration:1000,
        imgurl:"./colors2.png"
      })
    }
  });
}

export default {
  PolylineTrailLinkMaterialProperty
}
