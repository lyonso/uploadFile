<template>
  <div style="width: 100%;height: 100%;">
    <div id="map3d"></div>
    <model-show ref='getInfo'/>
  </div>
</template>
<script>

import supermapJs from "@/mapJs/supermapJs"
import {EventBus} from '@/mapJs/EventBus'

let viewer =null,handler;

let serverHttp=process.env.VUE_APP_GIS
let billboardLayer =new Cesium.CustomDataSource('billboardLayer');
let airBillboardLayer =new Cesium.CustomDataSource("airBillboardLayer")

let pointLayer =new Cesium.CustomDataSource('pointLayer');
let imageryProvider=new Cesium.SuperMapImageryProvider({
  url:serverHttp+"/iserver/services/map-tianditu/rest/maps/影像底图_经纬度",
  maximumLevel:17
})
let serverConfig=serverHttp+'/iserver/services/3D-dimian-SYS003/rest/realspace/datas/';
// let serverConfig=serverHttp+'/iserver/services/3D-dimian-SYS0030-5/rest/realspace/datas/';

// 灯源
let lightPosition =Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 200)
// 目标
let targetPosition=Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 10)

import modelShow from '@/views/modelShow/modelPop/index'
import modelInfo from '@/views/modelShow/modelPop/modelInfo'

export default {
name: "index",
  components: {
    modelShow,modelInfo
  },
  data(){
    return{
      status:false,
      serverUrl: 'http://localhost:8090',
      points: [
        {
          "name": "风机",
          "jd": 120.337838985365,
          "wd": 31.4591282118258
        },
        {
          "name": '移动监测车',
          "jd": 120.337602610,
          "wd": 31.459475492
        },
        {
          "name": "气瓶间",
          "jd": 120.337783886,
          "wd": 31.459263273
        },
        {
          "name": "办公",
          "jd": 120.337911703786,
          "wd": 31.4588724689926
        },
        {
          "name": "实验",
          "jd": 120.337759236683,
          "wd": 31.4591416911256
        }
      ],
      pointsFuFai:{
        "name": "浮筏",
        "jd": 120.338388480,
        "wd":31.459226850,
        "jd1":120.338480925,
        "wd1":31.459137703
      },
      layerServer:[
        {
          url:serverConfig+"fengdao@SYS003/config",
          name:'f2',
        },
        {
          url:serverConfig+"louding@SYS003/config",
          name:'f3'
        },
        {
          url:serverConfig+"dimian@SYS003/config",
          name:'f4'
        },
        {
          url:serverConfig+"neiceTree@SYS003/config",
          name:'f5'
        },
        {
          url:serverConfig+"waiceTree@SYS003/config",
          name:'f6'
        },
        {
          url:serverConfig+"ludeng@SYS003/config",
          name:'f7'
        },
        {
          url:serverConfig+"menkou@SYS003/config",
          name:'f8'
        },
        {
          url:serverConfig+"WLM2F@SYS003/config",
          name:'f9'
        },
        {
          url:serverConfig+"WLM3F@SYS003/config",
          name:'f10'
        },
        {
          url:serverConfig+"fupai@SYS003/config",
          name:'f11'
        },
        {
          url:serverConfig+"jianceche@SYS003/config",
          name:'f12'
        },
        {
          url:serverConfig+"SYS1F@SYS003/config",
          name:'f13'
        },
        {
          url:serverConfig+"SYS2F@SYS003/config",
          name:'f14'
        },
        {
          url:serverConfig+"SYS3F@SYS003/config",
          name:'f15'
        },
        {
          url:serverConfig+"yiqi@SYS003/config",
          name:'f16'
        }
      ],
      pointListName:[
        {
          level:'3',
          name:"有机样品检测区",
          data:[
            120.337730861635, 31.4592644947353, 15.129,
            120.337640794141, 31.4591967703132, 14.642,
            120.337850601485, 31.4590025252433, 14.640,
            120.337894639363, 31.4590365156446, 14.640,
            120.337892950539, 31.4590393234415, 14.639,
            120.337904398626, 31.4590475070368, 14.640,
            120.337906805913, 31.4590452594826, 14.640,
            120.33793913254 ,31.4590708590865 ,14.639
          ],
          color:'#e0cd58',
          center:[120.337784060811,31.4591375711423,10.969 ]
         },
        {
          level:'1',
          name:"无机样品检测区",
          data:[
            120.337686204179,31.459196652701 ,7.075,
            120.337646800461,31.4591665196426, 7.075,
            120.337755180576,31.4590653134636, 7.074,
            120.337794398566,31.459096259883 ,7.074,
          ],
          color:'#2c62ce',
          center:[120.337717997143,31.4591286048448,2.863 ]
        },
        {
          level:'1',
          name:"样品仓库",
          data:[
            120.33779495788 ,31.4590964862183 ,7.073,
            120.337755510021, 31.4590654183337, 7.074,
            120.337836521203, 31.4589897688825, 7.073,
            120.337876361446, 31.4590213203532, 7.073,
          ],
          color:'#24b627',
          center:[120.337814097942,31.4590394376439,2.862]
        },
        {
          level:'1',
          name:"危险化学品暂存室",
          data:[
            120.337638502463,31.4592415104343,7.075,
            120.337599546228,31.4592104410344,7.075,
            120.337646573708,31.4591659671519,7.075,
            120.337686241322,31.4591974679933,7.074,
          ],
          color:'#f54b3c',
          center:[120.337635505927,31.4592028501953,2.864 ]
        },
        {
          level:'1',
          name:"生态样品检测区",
          data:[
            120.337832452395,31.4591728527805, 7.073,
            120.337786828214,31.4591365800982, 7.074,
            120.337892237516,31.459039013685 ,7.073,
            120.337903502534,31.4590471159355, 7.073,
            120.337906278698,31.4590445235834, 7.073,
            120.337940788544,31.4590721290389, 7.072,
          ],
          color:'#099340',
          center:[120.337864009853,31.4591047917507,7.073 ]
        },
        {
          level:'2',
          name:"常规理化检测区",
          data:[
            120.337703721381,31.4592909700426,10.765,
            120.337657617263,31.4592548880738,10.765,
            120.337681833247,31.4592323714603,10.765,
            120.337637974567,31.4591983411534,10.765,
            120.337850452858,31.4590001286088,10.763,
            120.337895477032,31.4590359453353,10.763,
            120.337892391591,31.4590384959636,10.763,
            120.337903577724,31.4590478335258,10.763,
            120.337906661814,31.4590452836926,10.763,
            120.337939974197,31.4590719337473,10.763
          ],
          color:'#2c62ce',
          center:[120.337776821116,31.4591298274439 ,8.278]
        },
        {
          level:'1',
          name:"无机样品前处理区",
          data:[
            120.337729268916,31.4592666999291, 7.075,
            120.337684678072,31.4592315228933, 7.075,
            120.337786477487,31.459137044681 ,7.074,
            120.337832064211,31.4591721920864, 7.074
          ],
          color:'#2c62ce',
          center:[ 120.33773490089,31.4592236288212 ,8.278]
        }
      ],
      initExcetion:null,
      pointsArr:[
        {x: 120.337710246981,y: 31.4589049224053,icon:"./image/marker/markerN3.png" },
        {x: 120.337688590612,y: 31.4607990227072,icon:"./image/marker/markerN2.png" },
        {x: 120.339989726999,y: 31.4563668412606,icon:"./image/marker/markerN1.png"},
        {x: 120.335029432465,y: 31.4564326553563,icon:"./image/marker/markerN4.png"}
      ],
      modelIndex:true,
      modelBranchIndex:true

    }
  },
  beforeDestroy(){
    viewer.destroy();
    handler.destroy();

  },
  mounted() {
    let self = this;
    viewer = supermapJs.init3('map3d');
    self.showBuilding();
    viewer.dataSources.add(pointLayer);
    viewer.dataSources.add(billboardLayer);
    viewer.dataSources.add(airBillboardLayer);
    viewer.imageryLayers.addImageryProvider(imageryProvider);
    viewer.scene.addLightSource(new Cesium.SpotLight(lightPosition,targetPosition,{
      intensity:6,
      color:Cesium.Color.WHITE,
      distance:300,
    }))

    handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(res) {
        let pick = viewer.scene.pick(res.position)
        if (typeof (pick) !== 'undefined' && typeof (pick.id) !== 'undefined') {
          if(pick.primitive._name ==="f16"){
            // 调用弹框显示
            self.$refs.getInfo.closeModel(true)
          }
        }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK)



    EventBus.$on("changeInfoShow",function(obj) {
      if(Number(obj)===0 && self.modelBranchIndex===true){
        self.branchLevelModel();
        self.modelBranchIndex=false
      }else if(Number(obj)===1){
        self.mergeLevelModel();
        self.modelBranchIndex=true
      }
    })

    EventBus.$on("changeMap",function(obj) {
      if(Number(obj)===0){
         self.showBuilding();
      }else {
         self.init3dAirScene();
      }
    })

    EventBus.$on("modelShow",function(obj) {
      if(self.modelIndex){
        if(self.modelBranchIndex){
          self.branchLevelModel();
          setTimeout(function() {
            self.layerServer.forEach(function(val) {
              if(val.name!=='f16'){
                viewer.scene.layers.find(val.name).style3D._fillForeColor.alpha = 0.4;
              }
            })
            pointLayer.show=false
            self.modelIndex=false
          },7000)
        }else{
          self.layerServer.forEach(function(val) {
            if(val.name!=='f16'){
              viewer.scene.layers.find(val.name).style3D._fillForeColor.alpha = 0.4;
            }
          })
          pointLayer.show=false
          self.modelIndex=false
        }
        self.$refs.getInfo.closeModel(false)

      }else{
        self.layerServer.forEach(function(val) {
          viewer.scene.layers.find(val.name).style3D._fillForeColor.alpha = 1.0;
        })
        self.modelIndex=true
        pointLayer.show=true
      }
    })

  },
  methods: {
    showBuilding() {
      let self = this;
      viewer.scene.layers.removeAll();
      for (let i = 0; i < this.layerServer.length; i++) {
        let url = this.layerServer[i].url;
        let urlSlice1 = url.slice(url.indexOf('iserver'), url.indexOf('realspace'))
        viewer.scene.addS3MTilesLayerByScp(this.layerServer[i].url,
          {
            name: this.layerServer[i].name,
            subdomainConfig: {
              urlScheme: `http://{s}/${urlSlice1}realspace`,
              subdomains:['10.8.45.60:8081','10.8.45.60:8082','10.8.45.60:8083','10.8.45.60:8090']
            }
          }
          );
      }
      viewer.scene.camera.setView({
        destination: { x: -2748009.3730675387, y: 4695726.247755796, z: 3328727.405748374 },
        orientation: {
          heading: 1.5907101406831776,
          pitch: -0.8244568276255,
          roll: 0.00000235
        }
      })
      self.initBuildingInfo();
      // viewer.camera.speedRatio=0.4
      //    viewer.camera.flyCircle(Cesium.Cartesian3.fromDegrees(120.337759236683,31.4591416911256,100))
    },
    init3dAirScene() {
      let self = this;
      viewer.scene.layers.removeAll();
      billboardLayer.entities.removeAll();
      pointLayer.entities.removeAll();
      // viewer.camera.speedRatio=0;

      let promise =viewer.scene.addS3MTilesLayerByScp("http://10.8.45.60:8090/iserver/services/3D-shuiwen/rest/realspace/datas/Combine/config",
        {
          name:'qingxie',
          subdomainConfig: {
            urlScheme: `http://{s}/iserver/services/3D-shuiwen/rest/realspace`,
            subdomains:['10.8.45.60:8081','10.8.45.60:8082','10.8.45.60:8083','10.8.45.60:8090']
          }
        }
        );
      promise.then(function(layer) {
        layer.style3D.bottomAltitude =-17.5;
        layer.indexedDBSetting.isGeoTilesRootNodeSave = true;
        layer._maxSkipNum =256;
        layer.LoadingPriority= Cesium.LoadingPriorityMode.UsePagedLodInfo;
        layer.residentRootTile = true
        viewer.scene.camera.setView({
          destination: { x: -2747767.548682041, y: 4696396.032620242, z: 3328779.2978854333 },
          orientation: {
            heading: 1.4852246249385512,
            pitch: -0.7101176879169415,
            roll: 6.283185307179544
          }
        })
      })
      this.initPointAirName();
      viewer.scene.layers.find("qingxie").style3D.bottomAltitude = -17.5;

    },
    initPointAirName() {
      airBillboardLayer.entities.removeAll();
      let self = this;
      for (let i = 0; i < this.pointsArr.length; i++) {
        airBillboardLayer.entities.add({
          name: "airName",
          position: Cesium.Cartesian3.fromDegrees(self.pointsArr[i].x, self.pointsArr[i].y, 20),
          billboard: new Cesium.BillboardGraphics({
            image: self.pointsArr[i].icon,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
          })
        })
      }

    },

    initSceneFlyExtent() {
      // 设置仰角
      let pitch = Cesium.Math.toRadians(-10);
      // 旋转的角度
      let angle = 360 / 180;
      // 相机的距离
      let distance = 100;
      // 开始时间
      let startTime = Cesium.JulianDate.fromDate(new Date());
      let stopTime = Cesium.JulianDate.addSeconds(startTime, 300000, new Cesium.JulianDate());
      viewer.clock.startTime = startTime.clone();
      viewer.clock.stopTime = stopTime.clone();
      viewer.clock.currentTime = startTime.clone();// 当前时间
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
      viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
      // 初始化使用当前相机的高度
      let initialHeading = viewer.camera.heading;
      this.initExection = function TimeExecution() {
        let delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
        let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
        viewer.scene.camera.setView({
          destination: { x: -2748023.790973879, y: 4695689.57164911, z: 3328710.84168333 },
          orientation: {
            heading: heading,
            pitch: pitch,
            roll: 0.0000016674
          }
        });
        viewer.scene.camera.moveBackward(distance);
        if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
          viewer.clock.onTick.removeEventListener(this.initExection);
        }
      };
      // 触发当前的事件
      viewer.clock.onTick.addEventListener(this.initExection);
    },


    /**
     * 拆分
     */
    branchLevelModel() {
      viewer.camera.flyCircleLoop = false;
      billboardLayer.entities.removeAll();
      viewer.scene.layers.find("f3").visible = false;
      viewer.scene.layers.find("f2").visible = false;
      viewer.scene.layers.find("f9").visible = false;
      viewer.scene.layers.find("f10").visible = false;
      viewer.scene.camera.flyTo({
        destination: { x: -2748045.2314724238, y: 4695684.291505476, z: 3328674.7421118645 },
        orientation: {
          heading: .8159117650146186,
          pitch: -0.4506926506550242,
          roll: 0.0000017725543
        }
      })
      setTimeout(function() {
        let index = 10, index2 = 5;
        let s = setInterval(function() {
          if (index > 18) {
            viewer.scene.layers.find("f16").visible = true;
            viewer.scene.layers.find("f16").style3D.bottomAltitude = 18.5;
            window.clearInterval(s);
            index = 0;
            let s1 = setInterval(function() {
              if (index2 > 10) {
                window.clearInterval(s1);
                index2 = 0
              } else {
                index2 += 0.4;
                viewer.scene.layers.find("f14").style3D.bottomAltitude = index2;
              }
            }, 100);
          } else {
            index += 0.4;
            viewer.scene.layers.find("f15").style3D.bottomAltitude = index;
          }
        }, 100);
      }, 2500)
      let self = this;
      setTimeout(function() {
        self.addFloorBorder();
      }, 7000);

    },

    /**
     * 合并
     */
    mergeLevelModel() {
      pointLayer.entities.removeAll();
      viewer.scene.layers.remove("f15");
      viewer.scene.layers.find("f14").style3D.bottomAltitude = 0;
      viewer.scene.layers.find("f3").visible = true;
      viewer.scene.layers.find("f2").visible = true;
      viewer.scene.layers.find("f9").visible = true;
      viewer.scene.layers.find("f10").visible = true;
      viewer.scene.layers.find("f16").visible = true;
      viewer.scene.addS3MTilesLayerByScp("http://10.8.45.60:8090/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS3F@SYS003/config", {
        name: 'f15' ,
        ssubdomainConfig: {
          urlScheme: `http://{s}/iserver/services/3D-dimian-SYS003/rest/realspace`,
          subdomains:['10.8.45.60:8081','10.8.45.60:8082','10.8.45.60:8083','10.8.45.60:8090']
        }
      });
      viewer.scene.camera.flyTo({
        destination: { x: -2748009.3730675387, y: 4695726.247755796, z: 3328727.405748374 },
        orientation: {
          heading: 1.5907101406831776,
          pitch: -0.8244568276255,
          roll: 0.00000235
        }
      })
      this.initBuildingInfo();

    },
    initBuildingInfo() {
      billboardLayer.entities.removeAll();
      pointLayer.entities.removeAll();
      airBillboardLayer.entities.removeAll();
      let self = this;
      let icon2 = "./label/002.png";
      for (let i = 0; i < self.points.length; i++) {
        let icon = "./label/001.png";
        switch (self.points[i].name) {
          case '浮筏':
            icon = "./label/002.png";
            break;
          case '热泵':
            icon = "./label/004.png";
            break;
          case '移动监测车':
            icon = "./label/001.png";
            break;
          case '风机':
            icon = "./label/005.png";
            break;
          case '气瓶间':
            icon = "./label/003.png";
            break;
          case '办公':
            icon = "./newLayerImage/shiyan.png";
            break;
          case '实验':
            icon = "./newLayerImage/bangogn.png";
            break;
        }
        self.addPointInfoWindow(billboardLayer, self.points[i].name, icon, self.points[i].jd, self.points[i].wd, 20);
      }
      self.addPointInfoWindow2(billboardLayer, self.pointsFuFai.name, icon2, self.pointsFuFai.jd, self.pointsFuFai.wd, self.pointsFuFai.jd1, self.pointsFuFai.wd1, 3);
      billboardLayer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120.337862954, 31.459017827, 20),
        name: "楼信息",
        billboard: new Cesium.BillboardGraphics({
          image: "./label/floor.png",
          pixelOffset: new Cesium.Cartesian2(20, 0)
        })
      })
    },
    addPointInfoWindow(layer, name, billboardUrl, x, y, height) {
      layer.entities.add({
        name: name,
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        billboard: new Cesium.BillboardGraphics({
          image: billboardUrl
        }),
        polyline: new Cesium.PolylineGraphics({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([x, y, 5, x, y, height]),
          width: 1.0,
          material: new Cesium.PolylineDashMaterialProperty({
            image: "./label/line2.png"
          })
        })
      })
      layer.entities.add({
        name: name,
        position: Cesium.Cartesian3.fromDegrees(x, y, 5),
        billboard: new Cesium.BillboardGraphics({
          image: "./label/00.png",
        }),
        point: new Cesium.PointGraphics({
          color: Cesium.Color.fromCssColorString("#00fbff"),
          pixelSize: 2,
          outlineColor: Cesium.Color.fromCssColorString("#00fbff"),
          outlineWidth: 1
        })
      })
    },
    addPointInfoWindow2(layer, name, billboardUrl, x, y, x1, y1, height) {
      layer.entities.add({
        name: name,
        position: Cesium.Cartesian3.fromDegrees(x1, y1, height),
        billboard: new Cesium.BillboardGraphics({
          image: billboardUrl
        }),
        polyline: new Cesium.PolylineGraphics({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([x, y, height, x1, y1, height]),
          width: 1.0,
          material: new Cesium.PolylineDashMaterialProperty({
            image: "./label/line2.png"
          })
        })
      })
      layer.entities.add({
        name: name,
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        billboard: new Cesium.BillboardGraphics({
          image: "./label/00.png",
        }),
        point: new Cesium.PointGraphics({
          color: Cesium.Color.fromCssColorString("#00fbff"),
          pixelSize: 2,
          outlineColor: Cesium.Color.fromCssColorString("#00fbff"),
          outlineWidth: 1
        })
      })
    },
    /**
     * 添加分区
     */
    addFloorBorder() {
      pointLayer.entities.removeAll();
      let height = 0;
      for (let i = 0; i < this.pointListName.length; i++) {
        if (this.pointListName[i].level === "3") {
          height = 32.8;
        } else if (this.pointListName[i].level === "2") {
          height = 20.7;
        } else if (this.pointListName[i].level === "1") {
          height = 7;
        }
        this.addPolygonToScene(pointLayer, this.pointListName[i].data, this.pointListName[i].color, height, this.pointListName[i].name, this.pointListName[i].center)
      }
    },
    addPolygonToScene(layer, datas, color, height, name, centerData) {
      if (datas.length > 0) {
        layer.entities.add({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(datas),
            material: Cesium.Color.fromCssColorString(color).withAlpha(0.8),
            height: height,
            outline: true,
            outlineWidth: 2,
            outlineColor: Cesium.Color.fromCssColorString(color),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(50, 2000)
          }
        });
      }

      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(centerData[0], centerData[1], height + 2),
        label: new Cesium.LabelGraphics({
          font: '18px sans-serif',
          text: name.toString(),
          outlineWidth: 2.0,
          // pixelOffsetScaleByDistance: new Cesium.NearFarScalar(50, 0, 2000, 0.5),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(50, 100)
        })
      })
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
