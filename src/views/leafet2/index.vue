<template>
  <div id="map"></div>
</template>

<script>

import mapHtp from '@/api/mapHttp'
import {EventBus} from '@/mapJs/EventBus';
import {mapGetters} from 'vuex'
export default {
  name: "index",
  data(){
    return{
      url:"http://10.8.4.128:6080/arcgis/rest/services/OneMap/TH_XZQH_2000_dark/MapServer/",
      pointLayer1:new L.featureGroup([]),
      pointLayer2:new L.featureGroup([]),
      pointLayer3:new L.featureGroup([]),
      pointLayer4:new L.featureGroup([]),
      pointLayer5:new L.featureGroup([]),
      icon1: L.icon({
        iconUrl: '../layerImage/water1.png',
        iconSize: [24, 36]
      }),
      icon2: L.icon({
        iconUrl: '../layerImage/water2.png',
        iconSize: [24, 36]
      }),
      icon3: L.icon({
        iconUrl: '../layerImage/water3.png',
        iconSize: [24, 36]
      }),
      icon4: L.icon({
        iconUrl: '../layerImage/water4.png',
        iconSize: [24, 36]
      }),
      icon5: L.icon({
        iconUrl: '../layerImage/water5.png',
        iconSize: [24, 36]
      }),
      map:null,
      mapvData:[],
      mapvData1:[],
      mapVLayer1:null,
      mapVLayer2:null,
      initPoint1:null,
      initPoint2:null,
      initPoint3:null,
      initPoint4:null,
      initPoint5:null,

      mapVOptions:{
        fillStyle: 'rgb(12,158,69)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        max: 10000,
        size: 60,
        unit: 'px', // unit可选值['px', 'm']，默认值为'px'
        label: {
          show: true,
          fillStyle: 'white'
        },
        globalAlpha: 0.5,
        gradient: { 0.25: 'rgb(9,184,27)', 0.55: 'rgb(236,200,17)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)' },
        draw: 'honeycomb'
      }


    }
  },computed: {
    ...mapGetters([
      'HomeDialogDetails'
    ])
  },
  mounted() {
    this.map = L.map('map', {
      center: [31.275942620171115,120.48164371051827],
      zoom: 11,
      preferCanvas: true
    });
    L.esri.dynamicMapLayer({
      url:this.url
    }).addTo(this.map);

    this.map.addLayer(this.pointLayer1)
    this.map.addLayer(this.pointLayer2)
    this.map.addLayer(this.pointLayer3)
    this.map.addLayer(this.pointLayer4)

    // 测试
    this.map.on("click", ({ latlng }) => {
      console.log("坐标：", Object.values(latlng));
    })

    let self = this
    EventBus.$on('layer1',function(obj) {
      self.removeAllLayer()
      switch (obj) {
        case "1":
          self.map.addLayer(self.pointLayer1)
          let dataSet = new mapv.DataSet(self.mapvData);
          self.mapVLayer1 =  L.supermap.mapVLayer(dataSet,self.mapVOptions);
          self.mapVLayer1.addTo(self.map)
          console.log(self.initPoint1)
          self.$store.dispatch('map/setBlueDialogDetails', self.initPoint1)
          break;
        case "2":
          self.map.addLayer(self.pointLayer2)
          let dataSet1 = new mapv.DataSet(self.mapvData1);
          self.mapVLayer2 =  L.supermap.mapVLayer(dataSet1,self.mapVOptions);
          self.mapVLayer2.addTo(self.map)
          self.$store.dispatch('map/setBlueDialogDetails', self.initPoint2)
          break;
        case "3":
          self.map.addLayer(self.pointLayer3)
          self.$store.dispatch('map/setBlueDialogDetails', self.initPoint3)
          break;
        case "4":
          self.map.addLayer(self.pointLayer4)
          self.$store.dispatch('map/setBlueDialogDetails', self.initPoint4)
          break;
        case "5":
          self.map.addLayer(self.pointLayer5)
          self.$store.dispatch('map/setBlueDialogDetails', self.initPoint5)
          break;
      }
    })
    EventBus.$on('location',function(obj) {
      console.log(obj)
      let position = [obj.wd,obj.jw];
      self.map.setView(position,17);
    })

    this.initData()
  },

  methods:{
    removeAllLayer(){
      this.map.removeLayer(this.pointLayer1);
      this.map.removeLayer(this.pointLayer2);
      this.map.removeLayer(this.pointLayer3);
      this.map.removeLayer(this.pointLayer4);
      this.map.removeLayer(this.pointLayer5);
      if(this.mapVLayer1!==null){
        this.mapVLayer1.remove();
      }
      if(this.mapVLayer2!==null){
        this.mapVLayer2.remove();
      }
    },
    initData(){
      this.pointLayer1.clearLayers();
      this.pointLayer2.clearLayers();
      this.pointLayer3.clearLayers();
      this.pointLayer4.clearLayers();
      this.pointLayer5.clearLayers();
      let self = this;
      mapHtp.getLanzao().then(function(res) {
        if(res.code===200 || res.code==="200") {
          if (res.data.length > 0) {
            for(let i=0;i<res.data.length;i++) {
              if (res.data[i].type === "0" || res.data[i].type === 0 && res.data[i].latitude !== null) {
                let point = new L.marker([res.data[i].latitude, res.data[i].longitude], {
                  icon: self.icon1, title: res.data[i].pointName,alt:res.data[i]
                });
                if(res.data[i].pointName ==="B23#贡湖"){
                  self.initPoint1 = JSON.stringify(res.data[i]);
                }
                point.on("click", function(res) {
                  self.$store.dispatch('map/setBlueDialogDetails', JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer1);
                let obj = {
                  geometry: {
                    type: 'Point',
                    coordinates: [
                      res.data[i].longitude,
                      res.data[i].latitude
                    ]
                  },
                  count:Number(res.data[i].cyncd)
                }
                self.mapvData.push(obj);

              } else if (res.data[i].type === "1" || res.data[i].type === 1 && res.data[i].latitude !== null) {
                let point = new L.marker([res.data[i].latitude, res.data[i].longitude], {
                  icon:
                  self.icon2, title: res.data[i].pointName,alt:res.data[i]
                });
                if(res.data[i].pointName ==="锡东水厂"){
                  self.initPoint2 = JSON.stringify(res.data[i]);
                }
                point.on("click", function(res) {
                  self.$store.dispatch('map/setBlueDialogDetails', JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer2);
                let obj = {
                  geometry: {
                    type: 'Point',
                    coordinates: [
                      res.data[i].longitude,
                      res.data[i].latitude
                    ]
                  },
                  count:Number(res.data[i].cyncd)
                }
                self.mapvData1.push(obj);


              } else if (res.data[i].type === "2" || res.data[i].type === 2 && res.data[i].latitude !== null) {
                let point = new L.marker([res.data[i].latitude, res.data[i].longitude], {
                  icon:
                  self.icon3, title: res.data[i].pointName,alt:res.data[i]
                });
                if(res.data[i].pointName ==="金墅湾水厂"){
                  self.initPoint3 = JSON.stringify(res.data[i]);
                }
                point.on("click", function(res) {
                  self.$store.dispatch('map/setBlueDialogDetails', JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer3);
              } else if (res.data[i].type === "3" || res.data[i].type === 3 && res.data[i].latitude !== null) {
                let point = new L.marker([res.data[i].latitude, res.data[i].longitude], {
                  icon:
                  self.icon4, title: res.data[i].pointName,alt:res.data[i]
                });
                if(res.data[i].pointName ==="贡湖自动站"){
                  self.initPoint4 = JSON.stringify(res.data[i]);
                }
                point.on("click", function(res) {
                  self.$store.dispatch('map/setBlueDialogDetails', JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer4);
              } else if (res.data[i].type === "4" || res.data[i].type === 4 && res.data[i].latitude !== null) {
                let point = new L.marker([res.data[i].latitude, res.data[i].longitude], {
                  icon:
                  self.icon5, title: res.data[i].pointName,alt:res.data[i]
                });
                if(res.data[i].pointName ==="三山"){
                  self.initPoint5 = JSON.stringify(res.data[i]);
                }
                point.on("click", function(res) {
                  self.$store.dispatch('map/setBlueDialogDetails', JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer5);
              }
            }
          }
        }
      })

    }
  }
}
</script>

<style scoped>

#map{
  width: 100%;
  height: 100%;
}

</style>
