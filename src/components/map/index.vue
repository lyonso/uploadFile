<template>
  <div class="map-container" id="map-container" />
</template>

<script>
  // import * as L from "leaflet";
  export default {
    props: {
      currentLat: {
        type: Number,
        default: 0,
      },
      currentLng: {
        type: Number,
        default: 0
      }
    },
    watch: {
      currentLat: {
        handler() {
          this.mk.setLatLng([this.currentLat, this.currentLng])
          this.map.panTo(new L.LatLng(this.currentLat, this.currentLng));
        }
      },
      currentLng: {
        handler() {
          this.mk.setLatLng([this.currentLat, this.currentLng])
          this.map.panTo(new L.LatLng(this.currentLat, this.currentLng));
        },
      }
    },
    data() {
      return {
        map: null,
        mk: null,
        markes: [this.currentLat, this.currentLng],
      };
    },
    mounted() {
      let that = this;
      this.initMap();


      //marker icon设置
      var Icon = L.icon({
        iconUrl: require("@/assets/yanlian/local.png"),
        //标记大小
        iconSize: [32, 32],
      });

      //添加点到地图中
      this.mk = L.marker(this.markes, {
          icon: Icon,
        })
        .addTo(this.map)
        .bindPopup("当前所在位置")
        .openPopup();


      //添加点击事件
      this.map.on("click", function(e) {
        console.log(e);
        let lng = e.latlng.lng.toFixed(6);
        let lat = e.latlng.lat.toFixed(6);
        that.mk.setLatLng([lat, lng]);
        that.$emit("send-longitude", lng);
        that.$emit("send-latitude", lat);
      });
    },

    methods: {
      //地图加载
      initMap() {
        this.map = L.map("map-container", {
          crs: L.CRS.EPSG4326,
          attributionControl: false,
          zoomControl: false

        }).setView([this.currentLat, this.currentLng], 15);
        L.tileLayer(
          "http://t0.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=96bd9245ae3d718e9b3d98a61034538e", {
            maxZoom: 20,
            tileSize: 256,
            zoomOffset: 1,
          }
        ).addTo(this.map);

        L.tileLayer(
          "http://t0.tianditu.gov.cn/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=96bd9245ae3d718e9b3d98a61034538e", {
            maxZoom: 20,
            tileSize: 256,
            zoomOffset: 1,
          }
        ).addTo(this.map);
      },
    },
  };
</script>

<style lang="less" scoped>
  .map-container {
    position: relative;
    width: 600px;
    height: 480px;
  }
</style>
