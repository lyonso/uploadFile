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
      icon1: L.icon({
        iconUrl: '../layerImage/water4.png',
        iconSize: [24, 36]
      }),
      map:null,
      initPoint5:null,
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

    // // 测试
    // this.map.on("click", ({ latlng }) => {
    //   console.log("坐标：", Object.values(latlng));
    // })

    let self = this

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
    },
    initData(){
      this.pointLayer1.clearLayers();
      let self = this;
      mapHtp.getAllAutoStation().then(function(res) {
        if(res.code===200 || res.code==="200") {
          if (res.data.length > 0) {
            for(let i=0;i<res.data.length;i++) {
              if (typeof(res.data[i].LTTD)!=="undefined") {
                let point = new L.marker([res.data[i].LTTD, res.data[i].LGTD], {
                  icon: self.icon1, title: res.data[i].STNM,alt:res.data[i]
                });
                point.on("click", function(res) {
                  self.$router.push({
                    path: '/automaticStation/stationDetails',
                    query:{id:res.sourceTarget.options.alt.STCD,name:res.sourceTarget.options.alt.STNM}
                  })
                });
                point.addTo(self.pointLayer1);
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
