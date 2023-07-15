<template>
  <div id="map2"></div>
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
    icon10: L.icon({
      iconUrl: '../layerImage/svg/1.svg',
      iconSize: [26, 26]
    }),
    icon11: L.icon({
      iconUrl: '../layerImage/svg/1-1.svg',
      iconSize: [26, 26]
    }),
    icon12: L.icon({
      iconUrl: '../layerImage/svg/1-2.svg',
      iconSize: [26, 26]
    }),
    icon13: L.icon({
      iconUrl: '../layerImage/svg/1-3.svg',
      iconSize: [26, 26]
    }),
    icon14: L.icon({
      iconUrl: '../layerImage/svg/1-4.svg',
      iconSize: [26, 26]
    }),
    icon15: L.icon({
      iconUrl: '../layerImage/svg/1-5.svg',
      iconSize: [26, 26]
    }),
    icon16: L.icon({
      iconUrl: '../layerImage/svg/1-6.svg',
      iconSize: [26, 26]
    }),
    icon20: L.icon({
      iconUrl: '../layerImage/svg/2.svg',
      iconSize: [26, 26]
    }),
    icon21: L.icon({
      iconUrl: '../layerImage/svg/2-1.svg',
      iconSize: [26, 26]
    }),
    icon22: L.icon({
      iconUrl: '../layerImage/svg/2-2.svg',
      iconSize: [26, 26]
    }),
    icon23: L.icon({
      iconUrl: '../layerImage/svg/2-3.svg',
      iconSize: [26, 26]
    }),
    icon24: L.icon({
      iconUrl: '../layerImage/svg/2-4.svg',
      iconSize: [26, 26]
    }),
    icon25: L.icon({
      iconUrl: '../layerImage/svg/2-5.svg',
      iconSize: [26, 26]
    }),
    icon26: L.icon({
      iconUrl: '../layerImage/svg/2-6.svg',
      iconSize: [26, 26]
    }),
    icon30: L.icon({
      iconUrl: '../layerImage/svg/3.svg',
      iconSize: [26, 26]
    }),
    icon31: L.icon({
      iconUrl: '../layerImage/svg/3-1.svg',
      iconSize: [26, 26]
    }),
    icon32: L.icon({
      iconUrl: '../layerImage/svg/3-2.svg',
      iconSize: [26, 26]
    }),
    icon33: L.icon({
      iconUrl: '../layerImage/svg/3-3.svg',
      iconSize: [26, 26]
    }),
    icon34: L.icon({
      iconUrl: '../layerImage/svg/3-4.svg',
      iconSize: [26, 26]
    }),
    icon35: L.icon({
      iconUrl: '../layerImage/svg/3-5.svg',
      iconSize: [26, 26]
    }),
    icon36: L.icon({
      iconUrl: '../layerImage/svg/3-6.svg',
      iconSize: [26, 26]
    }),

    map:null,

  }
},computed: {
    ...mapGetters([
      'HomeDialogDetails'
    ])
  },
  mounted() {
    this.map = L.map('map2', {
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

    // 测试
    this.map.on("click", ({ latlng }) => {
      console.log("坐标：", Object.values(latlng));
    })

    let self = this
    EventBus.$on('layer',function(obj) {
      self.removeAllLayer()
      switch (obj) {
        case "1":
          self.map.addLayer(self.pointLayer1)
          break;
        case "2":
          self.map.addLayer(self.pointLayer2)
          break;
        case "3":
          self.map.addLayer(self.pointLayer3)
          break;
      }
    })
    this.initData()
  },

  methods:{
    removeAllLayer(){
      this.map.removeLayer(this.pointLayer1);
      this.map.removeLayer(this.pointLayer2);
      this.map.removeLayer(this.pointLayer3);
    },
    initData(){
      this.pointLayer1.clearLayers();
      this.pointLayer2.clearLayers();
      this.pointLayer3.clearLayers();
      let self = this;
      let icon =null;
      mapHtp.getAll().then(function(res) {
        if(res.code===200 || res.code==="200") {
          if (res.data.length > 0) {
            for(let i=0;i<res.data.length;i++){
              icon = self.getNowCategory(res.data[i].grade,res.data[i].category);
              if(res.data[i].category==="0" || res.data[i].category===0  && res.data[i].latitude!==null){
                let point = new L.marker([res.data[i].latitude,res.data[i].longitude],{ icon:
                  icon,title: res.data[i].pointName,alt:res.data[i]});
                point.on("click",function(res){
                  self.$store.dispatch('map/setHomeDialogDetails',JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer1);
              }else if(res.data[i].category==="1" || res.data[i].category===1 && res.data[i].latitude!==null){
                let point = new L.marker([res.data[i].latitude,res.data[i].longitude],{ icon:
                  icon,title: res.data[i].pointName,alt:res.data[i]});
                point.on("click",function(res){
                  self.$store.dispatch('map/setHomeDialogDetails',JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer2);
              }else if(res.data[i].category==="2" || res.data[i].category===2 && res.data[i].latitude!==null){
                let point = new L.marker([res.data[i].latitude,res.data[i].longitude],{ icon:
                  icon,title: res.data[i].pointName,alt:res.data[i]});
                point.on("click",function(res){
                  self.$store.dispatch('map/setHomeDialogDetails',JSON.stringify(res.sourceTarget.options.alt))
                });
                point.addTo(self.pointLayer3);
              }
            }
          }
        }
      })
    },
    getNowCategory(grade,category){
      let icon ="";
      if(grade===null){
         if(category==="0" || category===0){
           icon =this.icon10;
         }else if(category==="1" || category===1){
           icon =this.icon20;
         }else if(category==="2" || category===2){
           icon =this.icon30;
         }
      }else{
        grade =grade.substr(0,grade.indexOf('类'));
        switch (grade) {
          case 'Ⅰ':
            if(category==="0" || category===0){
              icon =this.icon11;
            }else if(category==="1" || category===1){
              icon =this.icon21;
            }else if(category==="2" || category===2){
              icon =this.icon31;
            }
            break;
          case 'Ⅱ':
            if(category==="0" || category===0){
              icon =this.icon12;
            }else if(category==="1" || category===1){
              icon =this.icon22;
            }else if(category==="2" || category===2){
              icon =this.icon32;
            }
            break;
          case 'Ⅲ':
            if(category==="0" || category===0){
              icon =this.icon13;
            }else if(category==="1" || category===1){
              icon =this.icon23;
            }else if(category==="2" || category===2){
              icon =this.icon33;
            }
            break;
          case 'Ⅳ':
            if(category==="0" || category===0){
              icon =this.icon14;
            }else if(category==="1" || category===1){
              icon =this.icon24;
            }else if(category==="2" || category===2){
              icon =this.icon34;
            }
            break;
          case 'Ⅴ':
            if(category==="0" || category===0){
              icon =this.icon15;
            }else if(category==="1" || category===1){
              icon =this.icon25;
            }else if(category==="2" || category===2){
              icon =this.icon35;
            }
            break;
          default:
            if(category==="0" || category===0){
              icon =this.icon16;
            }else if(category==="1" || category===1){
              icon =this.icon26;
            }else if(category==="2" || category===2){
              icon =this.icon36;
            }
            break;
        }
      }
      return icon;


    }
  }
}
</script>

<style scoped>

 #map2{
   width: 100%;
   height: 100%;
 }

</style>
