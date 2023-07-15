<template>
  <div id="map3d"></div>
</template>

<script>
import {EventBus} from '@/mapJs/EventBus'

import supermapJs from "@/mapJs/supermapJs"

let viewer=null;
let serverHttp=process.env.VUE_APP_GIS
let serverFloor1 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS1F@SYS003/config";
let serverFloor2 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS2F@SYS003/config";
let serverFloor3 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS3F@SYS003/config";
let imageryProvider=new Cesium.SuperMapImageryProvider({
  url:serverHttp+"/iserver/services/map-tianditu/rest/maps/影像底图_经纬度",
  maximumLevel:17
});
let floorPolygon1 =new Cesium.CustomDataSource('floorPolygon1')
// 告警类型图层
let waringDoorLayer = new Cesium.CustomDataSource("waringDoorLayer")
let waringCameraLayer = new Cesium.CustomDataSource("waringCameraLayer")
let waringEnvironmentLayer = new Cesium.CustomDataSource("waringEnvironmentLayer")
let personCameraLayer = new Cesium.CustomDataSource("personCameraLayer")

// 人员报警信息
let personInfoLayer = new Cesium.CustomDataSource("personInfoLayer");
let floor1Data=[
  {
    color:'#0070d9',
    datas: [
      120.337703652555,31.4592909725971,7.075,
      120.337659248523,31.4592556353986,7.075,
      120.337892556194,31.4590389232085,7.073,
      120.337904176093,31.4590476621589,7.073,
      120.337906477098,31.4590451948639,7.073,
      120.337939596355,31.4590714841173,7.073,
    ],
  },
  {
    color:'#0b5e5d',
    datas:[
     120.337659054297, 31.4592547521108,7.075,
     120.337892201423, 31.4590379853926,7.073,
     120.337903840444, 31.4590474825869,7.073,
     120.337906809272, 31.459045145625,7.073,
     120.33793999761 ,31.459072282472,7.073,
     120.337993319327, 31.4590231310111,7.073,
     120.33788851925 ,31.4589414609946,7.073,
     120.337835364387, 31.458989190297,7.074,
     120.337875227003, 31.4590215487572,7.073,
     120.33763869986 ,31.4592418829678,7.075]

  },
  {
    color:'#ff0000',
    datas: [
      120.33763846189,31.4592410905756,7.076,
      120.337686400109,31.4591972825164,7.076,
      120.337646504187,31.4591664309156,7.076,
      120.337599893851,31.4592105650058,7.075,
    ],
  },

  {
    color:'#0070d9',
    datas: [
        120.33768683572 ,31.4591972676655 ,7.075,
        120.337876407842, 31.459022109444 ,7.073,
        120.337836243359, 31.4589903314005, 7.073,
        120.337646485274, 31.4591660579305, 7.076
      ]
  }

];



let floor2Data =[
  {
    color:'#0b5e5d',
    datas:[120.337842133,31.459358406,9.5,120.337794256,31.459320971,9.5,
      120.337739694,31.459278318,9.5,120.338027043,31.459011652,9.5,
      120.338128621,31.459091965,9.5,120.338076034,31.45913876,9.5,
      120.338043544,31.45911287,9.5,120.33804045,31.459115754,9.5,
      120.338030278,31.459107284,9.5,120.338033006,31.459103584,9.5,
      120.337985035,31.459066973,9.5,120.337775429,31.459265501,9.5,
      120.337867212,31.459335122,9.5
    ]
  },
  {
    color:'#0070d9',
    datas:[120.337866923,31.459335465,9.5,120.337819721,31.459299289,9.5,
    120.337776225,31.45926637,9.5,120.33798542,31.459068644,9.5,
    120.338032151,31.459103658,9.5,120.338029503,31.459107697,9.5,
    120.338041145,31.459115708,9.5,120.338044793,31.45911388,9.5,
    120.338076091,31.459139732,9.5]
  }
]

let floor3Data =[
  {
    color:'#0b5e5d',
    datas:[120.337977758,31.459427132,9.5,
      120.337873886,31.459345356,9.5,
      120.338163654,31.459078524,9.5,
      120.338264587,31.459159854,9.5,
      120.338213497,31.45920532,9.5,
      120.338126684,31.459136901,9.5,
      120.337918205,31.459330662,9.5,
      120.33800885,31.459398154,9.5
    ],

  },
  {
    color:'#0070d9',
    datas:[
      120.338213497,31.45920532,9.5,
      120.338126684,31.459136901,9.5,
      120.337918205,31.459330662,9.5,
      120.33800885,31.459398154,9.5
    ],
  }

  ]

// 灯源
let lightPosition =Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 200)
// 目标
let targetPosition=Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 10)
let floorIndex=0;
export default {
  name: "index",
  data(){
    return{
      serverUrl: 'http://10.8.46.81:8090',
      position3:[31.467492554928405,120.31534732635636],
      position2:[31.4602673996742,120.3378848034973],
    }
  },
  beforeDestroy(){
    viewer.dataSources.destroy();
    viewer.destroy();
    handler.destroy();

  },
  mounted() {
    viewer = supermapJs.init3('map3d');
    window.viewer = viewer;
    viewer.scene.skyBox.show =false;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#395D87");
    viewer.scene.globe.show=false;
    viewer.scene.moon.show =false;
    this.initScene();
    let self = this;
    const hanlder = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    hanlder.setInputAction(function(res) {
      let pointName = viewer.scene.pick(res.position).id._name;
      if(typeof(pointName)!=="undefined"){
        if(pointName ==="camera"){
          let cameraId =  viewer.scene.pick(res.position).id.description._value;
          self.$store.dispatch('security/setvideoID', cameraId)
          self.$store.commit('security/SET_OPENDIALOG', 1)
        }else if(pointName ==="door"){
          let doorId =  viewer.scene.pick(res.position).id.description._value;
          self.$store.dispatch('security/setvideoID', doorId)
          self.$store.commit('security/SET_OPENDIALOG', 2)
        }
      }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.scene.addLightSource(new Cesium.SpotLight(lightPosition,targetPosition,{
      intensity:6,
      color:Cesium.Color.WHITE,
      distance:300,
    }))
    viewer.dataSources.add(waringCameraLayer);
    viewer.dataSources.add(waringDoorLayer);
    viewer.dataSources.add(personCameraLayer);

    // 楼切换
    EventBus.$on("sFloor",function(obj) {
      floorIndex=obj;
      personCameraLayer.entities.removeAll();
      self.changeSceneLayer(obj);
      self.changeCamera(obj);
    })

    // 点位数据
    EventBus.$on("pointData",function(obj) {
      console.log(obj)
      self.changeLayerType(obj.data,obj.type);
    })

    EventBus.$on("pointData2",function(obj) {
      self.addPersonLayerData(obj)
    })

    EventBus.$on("clearLayer",function(obj) {
      if(Number(obj)===0){
        waringCameraLayer.entities.removeAll();
      }else if(Number(obj)===2){
        waringDoorLayer.entities.removeAll();
      }
    })

  },

  methods: {
    /**
     * 添加图层位置
     * @param url
     * @param location x,y,z
     * @param height
     * @param layerName
     */
    addLayerToScene(url, location, height, layerName) {
      let promise = viewer.scene.addS3MTilesLayerByScp(url, { name: layerName });
      promise.then(function(layer) {
        layer.style3D.bottomAltitude = height;
        if (location !== "") {
          layer.lat = location[0];
          layer.lon = location[1];
        }
      });
    },
    azimuth_offset(origin_lon, origin_lat, azimuth, distance) {
      let lonlat = new Array();
      if(origin_lat!=="null" && origin_lon!=="null" && origin_lat!==null){
        lonlat[0] = origin_lon + distance * Math.sin(azimuth * Math.PI / 180) * 180 / (Math.PI * 6371229 * Math.cos(origin_lat * Math.PI / 180));
        lonlat[1] = origin_lat + distance * Math.cos(azimuth * Math.PI / 180) / (Math.PI * 6371229 / 180);
        return lonlat;
      }
    },

    addPersonLayerData(data){
      personCameraLayer.entities.removeAll();
      let height =10;
      for(let i=0;i<data.length;i++){
        if(data[i].floor===1 || data[i].floor ==="1"){
          height=22
        }else if(data[i].floor===2 || data[i].floor ==="2"){
          height=26
        }else if(data[i].floor===3 || data[i].floor ==="3"){
          height=27
        }
        personCameraLayer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(parseFloat(data[i].longitude),parseFloat(data[i].latitude), height),
          label: new Cesium.LabelGraphics({
            font: '15px sans-serif',
            text:data[i].count.toString(),
            outlineWidth:2.0,
            pixelOffset: new Cesium.Cartesian2(0,-5),
          }),
          billboard: {
            image:"./newLayerImage/pop.png",
            width: 44,
            height: 30,
          }
        })
      }


    },
    datasEditTest(datas){
      let newData =[];
      for(let i=0;i<datas.length;i++){
        let obj =this.azimuth_offset(datas[i][0],datas[i][1],60,30);
        newData.push(obj[0],obj[1],datas[i][2]);
      }
    },

    windowToWGS84(cartesian2) {
      /**
       *
       * let cartesitan2 = new Cesium.Cartesian2(parseFloat(res.position.x),parseFloat(res.position.y));
       let obj =self.windowToWGS84(cartesitan2);
       polygonData.push(parseFloat(obj.jd))
       polygonData.push(parseFloat(obj.wd))
       polygonData.push(9.5);
       */

      let cartesian =viewer.scene.pickPosition(cartesian2);
      let catographic = Cesium.Cartographic.fromCartesian(cartesian);
      let jd = Number(Cesium.Math.toDegrees(catographic.longitude)).toFixed(9);
      let wd = Number(Cesium.Math.toDegrees(catographic.latitude)).toFixed(9);
      return { jd: jd, wd: wd };
    },

    initScene(){
      this.addLayerToScene(serverFloor1,"",1,"floor1");
      this.addLayerToScene(serverFloor2,this.position2,5,"floor2");
      this.addLayerToScene(serverFloor3,this.position3,5,"floor3");
      viewer.dataSources.add(floorPolygon1);
      viewer.scene.camera.setView({
        destination: {x: -2748100.330393861, y: 4695674.299301175, z: 3328727.756069423},
        orientation: {
          heading:0.829629993436329,
          pitch:-1.370787496306319,
          roll:0
        }
      });
    },

    /**
     * 添加图形图层
     */
    addFloorPolygonLayer(){
      floorPolygon1.entities.removeAll();
      for(let i=0;i<floor1Data.length;i++){
        supermapJs.addPolygonToScene(floorPolygon1,floor1Data[i].datas,floor1Data[i].color,8.5)
      }
      for(let i=0;i<floor2Data.length;i++){
        supermapJs.addPolygonToScene(floorPolygon1,floor2Data[i].datas,floor2Data[i].color,16.5)
      }
      for(let i=0;i<floor2Data.length;i++){
        supermapJs.addPolygonToScene(floorPolygon1,floor3Data[i].datas,floor3Data[i].color,21.5)
      }
    },

    /**
     * @param serverUrl
     * @param floor
     * @param layerName
     * 添加单个图层
     */
    addOneLayerToMap(serverUrl,layerName){
      let promise =viewer.scene.addS3MTilesLayerByScp(serverUrl, { name:layerName});
      promise.then(function(layer) {
        layer.style3D.bottomAltitude = 10;
      });
    },

    /**
     * 控制楼层展示
     * @param floorParam
     */
    changeSceneLayer(floorParam){
      viewer.scene.layers.removeAll();
      switch (Number(floorParam)) {
        case 0:
          this.initScene();
          break;
        case 1:
          floorPolygon1.entities.removeAll();
          this.addOneLayerToMap(serverFloor1,"floorLayer1");
          break;
        case 2:
          floorPolygon1.entities.removeAll();
          this.addOneLayerToMap(serverFloor2,"floorLayer2");
          break;
        case 3:
          floorPolygon1.entities.removeAll();
          this.addOneLayerToMap(serverFloor3,"floorLayer3");
          break;
        default:
          console.log("参数异常！")
          break;
      }
    },

    changeCamera(num){
      switch (num) {
        case 0:
          break;
        case 1:
          viewer.scene.camera.setView({
            destination: {x: -2748064.183766557, y: 4695674.477191309, z: 3328694.080170117},
            orientation: {
              heading:0.8296276228134447,
              pitch:-0.9592718447304764,
              roll:6.283185307179586
            }
          });
          break;
        case 2:
          viewer.scene.camera.setView({
            destination: {x: -2748064.183766557, y: 4695674.477191309, z: 3328694.080170117},
            orientation: {
              heading:0.8296276228134447,
              pitch:-0.9592718447304764,
              roll:6.283185307179586
            }
          });
          break;
        case 3:
          viewer.scene.camera.setView({
            destination: {x: -2748066.758280766, y: 4695677.702359398, z: 3328700.6761577143},
            orientation: {
              heading:0.82962767968717,
              pitch:-0.959272614832509,
              roll:6.283185307179586
            }
          });
          break;
        default:
          break;

      }

    },

    /**
     * 控制图层展示类型
     * @param data
     * @param param 0 -- camera  1--- 环控  2--- 门禁
     *
     */
    changeLayerType(data,param){
      let self = this;
      let imgSrc =null,height=null,jd =null,wd =null;
      waringDoorLayer.entities.removeAll();
      waringCameraLayer.entities.removeAll();
      floorPolygon1.entities.removeAll();
      if(data.length>0){
         if(Number(param) ===2){
          // 门禁
          self.addFloorPolygonLayer();
          personCameraLayer.entities.removeAll();
        }
        for(let i=0;i<data.length;i++){
          if(data[i].floor===1 || data[i].floor ==="1"){
            height =20;
            jd = data[i].longitude;
            wd = data[i].latitude;
          }else if(data[i].floor===2 || data[i].floor ==="2"){
            height =18;
            let obj = this.azimuth_offset(parseFloat(data[i].longitude),parseFloat(data[i].latitude),60,15);
            jd = obj[0].toString().substr(0,10);
            wd = obj[1].toString().substr(0,10);
          }else if(data[i].floor ===3 || data[i].floor ==="3"){
            height =25;
            let obj = this.azimuth_offset(parseFloat(data[i].longitude),parseFloat(data[i].latitude),60,30);
            jd = obj[0].toString().substr(0,10);
            wd = obj[1].toString().substr(0,10);
          }else {
            height=0;
          }
          switch (Number(data[i].type)) {
            case 0:
               if(data[i].eventNum>0){
                 imgSrc ="./newLayerImage/c1.png";
               }else {
                 imgSrc ="./newLayerImage/c0.png";
               }
               self.addEntityPoint(waringCameraLayer,"camera",jd,wd,height,imgSrc,data[i].id,data[i]);
               break;
            case 2:
              if(data[i].eventNum>0){
                imgSrc ="./newLayerImage/d1.png";
              }else {
                imgSrc ="./newLayerImage/d0.png";
              }
              self.addEntityPoint(waringDoorLayer,"door",jd,wd,height,imgSrc,data[i].id,data[i]);
              break;
            default:
              console.log("参数异常");
              break;
          }
        }
      }
    },
    singleFloorLayer(data,param){
      let self = this;
      let imgSrc =null,height=0,jd =null,wd =null;
      if(data.length>0){
        if(param ===0){
          waringCameraLayer.entities.removeAll();
        }else if(param ===2){
          waringDoorLayer.entities.removeAll();
        }
        for(let i=0;i<data.length;i++){
          jd = data[i].longitude;
          wd = data[i].latitude;
          if(data[i].floor===1 || data[i].floor ==="1"){
            height =20;
          }else if(data[i].floor===2 || data[i].floor ==="2"){
            height =25;
          }else if(data[i].floor ===3 || data[i].floor ==="3"){
            height =25;
          }
          switch (Number(data[i].type)) {
            case 0:
              if(data[i].eventNum>0){
                imgSrc ="./newLayerImage/c1.png";
              }else {
                imgSrc ="./newLayerImage/c0.png";
              }
              self.addEntityPoint(waringCameraLayer,"camera",jd,wd,height,imgSrc,data[i].id,data[i]);
              break;
            case 2:
              if(data[i].eventNum>0){
                imgSrc ="./newLayerImage/d1.png";
              }else {
                imgSrc ="./newLayerImage/d0.png";
              }
              self.addEntityPoint(waringDoorLayer,"door",jd,wd,height,imgSrc,data[i].id,data[i]);
              break;
            default:
              console.log("参数异常");
              break;
          }
        }
      }
    },

    /**
     * 添加实体
     * @param layer
     * @param type
     * @param jd
     * @param wd
     * @param height
     * @param imgSrc
     * @param id
     * @param value
     */
    addEntityPoint(layer,type,jd,wd,height,imgSrc,id,value){
      if(jd !=="null" && wd !=="null" && jd!==null && height!==0){
        layer.entities.add({
          id:id,
          name:type,
          position: Cesium.Cartesian3.fromDegrees(parseFloat(jd), parseFloat(wd), height),
          billboard: new Cesium.BillboardGraphics({
            image:imgSrc,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
          }),
          description:value
        });
      }

    }

}

}
</script>

<style scoped>
#map3d{
  padding:0;
  margin:0;
  width: 100%;
  height: 100%;
}

</style>
