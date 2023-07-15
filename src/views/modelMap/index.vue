<template>
  <div style="height: 100%;width: 100%;background-color: #052E43;">
    <div id="container"></div>
    <earth-info/>
    <div id="layerChange">
      <img src="../../../public/image/marker/yingxiang.png" @click="layerStatus(1)"/>
      <img src="../../../public/image/marker/BIM.png" @click="layerStatus(2)"/>
    </div>
  </div>
</template>

<script>
import supermapJs from "@/mapJs/supermapJs"
import {EventBus} from '@/mapJs/EventBus'
import mapHtp from '@/api/mapHttp'
import EarthInfo from '@/views/modelMap2/comments/earthInfo/index'

let viewer =null;
let billboardLayer =new Cesium.CustomDataSource('billboardLayer')
let polylineLayer  =new Cesium.CustomDataSource('polylineLayer')
let billboardLayer2 = new Cesium.CustomDataSource('billboardLayer2')
let billboardLayer1 =new Cesium.CustomDataSource('billboardLayer1')
let billboardLayer3 =new Cesium.CustomDataSource('billboardLayer3')
// 倾斜投影名称
let airBillboardLayer =new Cesium.CustomDataSource("airBillboardLayer")
let fengjiLineLayer =new Cesium.CustomDataSource('fengjiLineLayer')
let qingpingLayer =new Cesium.CustomDataSource('qingpingLayer')
let threeFloorHouseLayer =new Cesium.CustomDataSource('threeFloorHouseLayer')
// 灯源
let lightPosition =Cesium.Cartesian3.fromDegrees(120.337662984, 31.458693224, 40)
// 目标`
let targetPosition=Cesium.Cartesian3.fromDegrees(120.337686928,31.459015055, 5)

let twoFloorDoorLayer=new Cesium.CustomDataSource('twoFloorDoorLayer')
let threeFloorDoorLayer=new Cesium.CustomDataSource('threeFloorDoorLayer')
let twoFloorDoorLayer2=new Cesium.CustomDataSource('twoFloorDoorLayer2')
let threeFloorDoorLayer2=new Cesium.CustomDataSource('threeFloorDoorLayer2')
let serverHttp=process.env.VUE_APP_GIS


let imageryProvider=new Cesium.SuperMapImageryProvider({
  url:serverHttp+"/iserver/services/map-tianditu/rest/maps/影像底图_经纬度",
  maximumLevel:17
})

let floorWaringLayer1=new Cesium.CustomDataSource('floorWaringLayer1')
let floorWaringLayer2=new Cesium.CustomDataSource('floorWaringLayer2')
let floorWaringLayer3=new Cesium.CustomDataSource('floorWaringLayer3')
export default {
  name: "index",
  components:{ EarthInfo },
  data() {
    return {
      imageSrc: null,
      sceneStatus: 0,
      layerIndex:1,
      areaLayer: null,
      serverUrl: 'http://10.8.46.81:8090',
      // serverUrl: 'http://192.168.89.22:8090',
      gd1: [120.337851770191, 31.459150346075, 4,
        120.337851770191, 31.459150346075, 13.5],
      gd: [
        120.337890370426, 31.4590494712552, 11.5,
        120.337822338525, 31.459110151558, 11.5,
        120.33785991687, 31.459139210646, 11.5,
        120.337848806844, 31.4591494883784, 11.5
      ],
      gd2: [
        120.337914467264, 31.4590869566163, 11.5,
        120.337879486794, 31.4590592784329, 11.5
      ],
      gd3: [
        120.337849562237, 31.4590351966067, 11.5,
        120.337879486794, 31.4590592784329, 11.5
      ],
      gd4: [
        120.337901196016, 31.459099303987, 11.5,
        120.337865968631, 31.4590722596592, 11.5
      ],
      gd5: [
        120.33783522488, 31.4590479088521, 11.5,
        120.337865968631, 31.4590722596592, 11.5
      ],
      locationsPoint: [
        {
          "jd": 120.337858189,
          "wd": 31.459058400
        }
      ],
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
      ],
      pointsFuFai:{
        "name": "浮筏",
        "jd": 120.338388480,
        "wd":31.459226850,
        "jd1":120.338480925,
        "wd1":31.459137703
      },
      floorTwoName: [
        { jd: '120.337681379', wd: '31.459271877', name: '油类分析室' },
        { jd: '120.337655901', wd: '31.459211283', name: '细菌分析室' },
        { jd: '120.337742174', wd: '31.459234306', name: 'BOD室' },
        { jd: '120.337680114', wd: '31.459185676', name: '天平室' },
        { jd: '120.337748274', wd: '31.459180661', name: '常规理化室(1)' },
        { jd: '120.337806166', wd: '31.459116900', name: '常规理化室(2)' },
        { jd: '120.337874106', wd: '31.459050992', name: '常规仪器室' }
      ],
      floorOneName: [
        { jd: '120.337628911', wd: '31.459219119', name: '易制毒仓库' },
        { jd: '120.337645884', wd: '31.459198252', name: '危险废弃仓库' },
        { jd: '120.337684758', wd: '31.459164716', name: '无机仪器分析室(2)' },
        { jd: '120.337750020', wd: '31.459103022', name: '无机仪器分析室(1)' },
        { jd: '120.337807491', wd: '31.459050118', name: '生态室(2)' },
        { jd: '120.337899880', wd: '31.459080771', name: '生态室(1)' },
        { jd: '120.337841827', wd: '31.459135979', name: '生态镜检区' },
        { jd: '120.337769485', wd: '31.459198618', name: '无机前处理室' },
        { jd: '120.337717866', wd: '31.459250332', name: '放射性样品分析室' },
        { jd: '120.337683571', wd: '31.459273376', name: '配电室' },
      ],

      floorThreeName: [
        { jd: '120.337649037', wd: '31.459209136', name: '数据处理室' },
        { jd: '120.337721398', wd: '31.459224091', name: '有机检测室(2)' },
        { jd: '120.337789231', wd: '31.459151177', name: '有机检测室(1)' },
        { jd: '120.337895510', wd: '31.459064541', name: '有机前处理室' },

      ],
      boxP1: null,
      boxP2: null,
      boxP3: null,
      boxP4: null,
      boxP5: null,
      boxP6: null,
      fengji: [
        120.337833607802, 31.4591688178155, 2.940,
        120.337831632916, 31.459167497773, 16.121
      ],
      fengji2: [
        120.337806331155, 31.4591500197215, 10.574,
        120.337828116239, 31.4591669797936, 10.530,
      ],
      fengji3: [
        120.337808424257, 31.4590676565319, 6.749,
        120.337864701002, 31.4591123939873, 6.800,
        120.337819879005, 31.4591551050525, 6.754,
      ],
      fengji4: [
        120.337806451692, 31.459150131741, 6.775,
        120.337828252229, 31.4591671138408, 6.733,
      ],
      fengji5: [
        120.337798073782, 31.4591580784051, 6.789,
        120.337803113424, 31.4591620038938, 6.785,
        120.33780982734, 31.4591527604333, 6.793
      ],
      // 气瓶
      qiping:[
        {jd: '120.337779144', wd: '31.459230024',name:'乙炔'},
        {jd: '120.337773792', wd: '31.459245966',name:'氮气'},
        {jd: '120.337785443', wd: '31.459251649',name:'空气(压力:10kg)'},
        {jd: '120.337768637', wd: '31.459247500',name:'氦气'},
        {jd: '120.337757124', wd: '31.459258943',name:'氩气'},
        {jd: '120.337747917', wd: '31.459267125',name:'氧气'},
        {jd: '120.337739555', wd: '31.459275042',name:'氮气'},
        {jd: '120.337745378', wd: '31.459282216',name:'氮气'}
      ],
      // 三楼房间信息
      floorHouseInfo:[
        {
          name:"设备",
          jd:"120.337838223444",
          wd:"31.459150832111",
          height:12,
        },
        {
          name:"环境:13.75-35.8% RH",
          jd:"120.337787313963",
          wd:"31.4591361751102",
          height: 15
        }
      ],
      lightArr:[
        {"floorName":"1F","jd":"120.3376369","wd":"31.45926375"},
        {"floorName":"1F","jd":"120.3378151","wd":"31.45873332"},
        {"floorName":"1F","jd":"120.3376744","wd":"31.45922462"},
        {"floorName":"1F","jd":"120.3379751","wd":"31.45903167"},
        {"floorName":"1F","jd":"120.3378358","wd":"31.45907393"},
        {"floorName":"1F","jd":"120.3379122","wd":"31.45900205"},
        {"floorName":"1F","jd":"120.3379873","wd":"31.45893543"},
        {"floorName":"1F","jd":"120.3378774","wd":"31.45903561"},
        {"floorName":"1F","jd":"120.3377801","wd":"31.45877143"},
        {"floorName":"1F","jd":"120.3379167","wd":"31.45887858"},
        {"floorName":"1F","jd":"120.3377542","wd":"31.45915125"},
        {"floorName":"1F","jd":"120.3377953","wd":"31.45911217"},
        {"floorName":"1F","jd":"120.3377161","wd":"31.45918671"},
        {"floorName":"1F","jd":"120.3378409","wd":"31.45881877"},
        {"floorName":"2F","jd":"120.3376829","wd":"31.4593"},
        {"floorName":"2F","jd":"120.3376383","wd":"31.45926604"},
        {"floorName":"2F","jd":"120.337639","wd":"31.45922052"},
        {"floorName":"2F","jd":"120.3376594","wd":"31.45916443"},
        {"floorName":"2F","jd":"120.3377353","wd":"31.4590962"},
        {"floorName":"2F","jd":"120.3378179","wd":"31.45901835"},
        {"floorName":"2F","jd":"120.3378876","wd":"31.45899312"},
        {"floorName":"2F","jd":"120.3379626","wd":"31.45896275"},
        {"floorName":"2F","jd":"120.3378609","wd":"31.4588344"},
        {"floorName":"2F","jd":"120.3379097","wd":"31.45887236"},
        {"floorName":"2F","jd":"120.3379568","wd":"31.45890968"},
        {"floorName":"2F","jd":"120.3377794","wd":"31.45876899"},
        {"floorName":"3F","jd":"120.3376657","wd":"31.45916079"},
        {"floorName":"3F","jd":"120.3376402","wd":"31.4592183"},
        {"floorName":"3F","jd":"120.3378876","wd":"31.45899312"},
        {"floorName":"3F","jd":"120.3378068","wd":"31.45903078"},
        {"floorName":"3F","jd":"120.3377393","wd":"31.45909302"}
      ],
      lightPoints1:[
        {jd: '120.337723650', wd: '31.459220680',name:"a1"},
        {jd: '120.337812845', wd: '31.459130687',name:"a2"},
        {jd: '120.337971909', wd: '31.458982971',name:"a3"},
        {jd: '120.337953662', wd: '31.458884864',name:"a4"},
        {jd: '120.337831194', wd: '31.458796197',name:"a5"},
      ],
      lightPoints2:[
        {jd: '120.337723650', wd: '31.459220680',name:"b1"},
        {jd: '120.337812845', wd: '31.459130687',name:"b2"},
        {jd: '120.337971909', wd: '31.458982971',name:"b3"},
        {jd: '120.337953662', wd: '31.458884864',name:"b4"},
        {jd: '120.337831194', wd: '31.458796197',name:"b5"},
      ],
      lightPoints3:[
        {jd: '120.337723650', wd: '31.459220680',name:"c1"},
        {jd: '120.337812845', wd: '31.459130687',name:"c2"},
        {jd: '120.337971909', wd: '31.458982971',name:"c3"},
        {jd: '120.337953662', wd: '31.458884864',name:"c4"},
        {jd: '120.337831194', wd: '31.458796197',name:"c5"},
      ],
      floorIndex:0,
      blackStatus:null,
      // 灯光全局
      a1:null,
      a2:null,
      a3:null,
      a4:null,
      a5:null,
      b1:null,
      b2:null,
      b3:null,
      b4:null,
      b5:null,
      c1:null,
      c2:null,
      c3:null,
      c4:null,
      c5:null,
      // 倾斜投影指示牌
      pointsArr:[
        {x:  120.337710246981,y:31.4589049224053,icon:"./image/marker/markerN3.png" },
        {x:  120.337688590612,y: 31.4607990227072,icon:"./image/marker/markerN2.png" },
        {x:  120.339989726999,y: 31.4563668412606,icon:"./image/marker/markerN1.png"},
        {x:  120.335029432465,y: 31.4564326553563,icon:"./image/marker/markerN4.png"}
      ],
      // 单个房间报警
      polygonArr:[
        120.337728862846,31.4592656041357,100,
        120.337685235053,31.4592313283799,100,
        120.337684108037,31.4592321487039,100,
        120.337663742557,31.459216472826,100,
        120.337711878968,31.4591712767852,100,
        120.337776738978,31.4592218220889,100,
        120.337728862846,31.4592656041357,100
      ],
      waringHouseTime:0,
      doorJson:[
        {"jd":120.337643177004,"wd":31.459194505242,"type":0,"id":"three1","floor":3},
        {"jd":120.337652808089,"wd":31.4591855677942,"type":1,"id":"three11","floor":3},
        {"jd":120.337702380903,"wd":31.4591396451397,"type":0,"id":"three2","floor":3},
        {"jd":120.337712019424,"wd":31.459130700481,"type":1,"id":"three21","floor":3},
        {"jd":120.337779005307,"wd":31.4590684922826,"type":0,"id":"three3","floor":3},
        {"jd":120.337788616122,"wd":31.4590595657613,"type":1,"id":"three31","floor":3},
        {"jd":120.33783326209,"wd":31.459018172392,"type":0,"id":"three4","floor":3},
        {"jd":120.337841743701,"wd":31.4590102944408,"type":1,"id":"three41","floor":3},
        {"jd":120.337643976523,"wd":31.4591911835308,"type":0,"id":"three5","floor":2},
        {"jd":120.337653594926,"wd":31.4591822478139,"type":1,"id":"three51","floor":2},
        {"jd":120.337692659349,"wd":31.4591461606617,"type":0,"id":"three6","floor":2},
        {"jd":120.33770211576,"wd":31.4591373729194,"type":1,"id":"three61","floor":2},
        {"jd":120.337749666196,"wd":31.4590931157912,"type":0,"id":"three7","floor":2},
        {"jd":120.337759287545,"wd":31.4590841822911,"type":1,"id":"three71","floor":2},
        {"jd":120.337799797744,"wd":31.4590464674556,"type":0,"id":"three8","floor":2},
        {"jd":120.337809112314,"wd":31.4590378121112,"type":1,"id":"three81","floor":2},
        {"jd":120.337837928776,"wd":31.4589905680844, "type":0, "id":"three9","floor":21},
        {"jd":120.337847972476,"wd":31.4589983852234, "type":1, "id":"three91","floor":21},
      ],
      // 依赖关系变量
      globalOrientation:null,
      leftOrientation:null,
      rightOrientation:null,
      modelDoorIds:null,

    }
  },
  mounted() {
    viewer = supermapJs.init2('container');
    // window.viewer = viewer;
    let self = this;
    self.init3dAirScene();
    // self.showBuilding();
    const hanlder = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    hanlder.setInputAction(function(res) {
      let cartesitan2 = new Cesium.Cartesian2(res.position.x, res.position.y);
      let pointName = viewer.scene.pick(res.position).id._name;
      if(typeof(pointName)!=="undefined"){
        if (pointName === "气瓶间") {
          viewer.scene.camera.flyTo({
            destination: {
              x: -2748047.786078591,
              y: 4695600.824109788,
              z: 3328717.545305439
            },
            orientation: {
              heading: 3.760531141384089,
              pitch: -0.5767667792504971,
              roll: 0.0000019034952041252495
            }
          })
          viewer.dataSources.add(qingpingLayer);
          for (let i = 0; i < viewer.scene.layers._layers._array.length; i++) {
            viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 1.0;
            viewer.scene.layers._layers._array[i].visible = true;
          }
          viewer.scene.layers.find("qipingshi@SYS003")._style3D._fillForeColor.alpha = 0.5;
        }else if(pointName ==="设备"){
          // 设备弹框
          self.$store.dispatch('map/setShowModel',true)

        }else if(pointName ==="airName"){
          let layer = viewer.scene.layers.find("Combine_1");
          layer.visible =false;
          self.showBuilding();
          supermapJs.removeByLayer('airBillboardLayer', viewer);
          self.layerIndex =2;
          self.$store.dispatch('map/setOpenDialog', 0);
        }
      }else {
        let nowClick = viewer.scene.layers.getSelectedLayer();
        if (nowClick.name === "WLM2F@SYS003" && typeof (nowClick.name) !== "undefined" && typeof (pointName) === "undefined") {
          self.$store.dispatch('map/setOpenDialog', 2);
        }else if(nowClick.name === "Camera3F@SYS003"){
          let param = nowClick.getSelection();
          if (param[0] !== null || param[0] !== "") {
            // 视频监控
            self.getCameraVideo(param[0], 3, 0,0)
          }
        }else if(nowClick.name === "Camera2F@SYS003"){
          let param = nowClick.getSelection();
          if (param[0] !== null || param[0] !== "") {
            // 视频监控
            self.getCameraVideo(param[0], 2, 0,0)
          }

        } else if (nowClick.name === "Camera1F@SYS003") {
          let param = nowClick.getSelection();
          if (param[0] !== null || param[0] !== "") {
            // 视频监控
            self.getCameraVideo(param[0], 1, 0,0)
          }
        } else if (nowClick.name === "jianceche@SYS003" && typeof (pointName) === "undefined") {
          self.$store.dispatch('map/setOpenDialog', 4)
        } else if (nowClick.name === "fupai@SYS003" && typeof (pointName) === "undefined") {
          self.$store.dispatch('map/setOpenDialog', 3)
        } else if (nowClick.name === "fengdao@SYS003") {
          supermapJs.removeByLayer('fengjiLineLayer', viewer);
          for (let i = 0; i < viewer.scene.layers._layers._array.length; i++) {
            if (viewer.scene.layers._layers._array[i]._name !== nowClick.name
              && viewer.scene.layers._layers._array[i]._name !== "ludeng@SYS003"
              && viewer.scene.layers._layers._array[i]._name !== "fupai@SYS003"
              && viewer.scene.layers._layers._array[i]._name !== "dimian@SYS003"
              && viewer.scene.layers._layers._array[i]._name !== "jianceche@SYS003"
              && viewer.scene.layers._layers._array[i]._name !== "qipingshi@SYS003"
              && viewer.scene.layers._layers._array[i]._name !== "qiping@SYS003"
              // && viewer.scene.layers._layers._array[i]._name !== "taihulake@water_1"
            ) {
              viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 0.4;
            }
          }
          viewer.dataSources.add(self.fengjiLineLayer);
          viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor.alpha = 0.9;
          viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor = Cesium.Color.fromCssColorString("#0ff3a9");
          supermapJs.removeByLayer('billboardLayer', viewer);
          supermapJs.removeByLayer('qingpingLayer', viewer);
        } else if (nowClick.name === "SYS3F@SYS003") {
          // self.threeFloorHouseLayer.entities.removeAll();
          // supermapJs.removeByLayer("threeFloorHouseLayer", viewer);
          let param = nowClick.getSelection();
          // 单个房间
          if (param[0] === "2") {
            // self.$store.dispatch("map/setBuildingControl", {
            //   type: '4', id: ""
            // })
            for (let i = 0; i < self.floorHouseInfo.length; i++) {
              self.addFloorHouseBillboard(threeFloorHouseLayer, parseFloat(self.floorHouseInfo[i].jd), parseFloat(self.floorHouseInfo[i].wd), self.floorHouseInfo[i].height, 17, self.floorHouseInfo[i].name);
            }
            viewer.dataSources.add(threeFloorHouseLayer);
            // 仪器的显示
          }
          // 环控的
        } else if (nowClick.name === "Environmental3F@SYS003") {
          let param = nowClick.getSelection();
          self.getEnvironmentInfo(param[0], 3, 1)
        } else if (nowClick.name === "Environmental2F@SYS003") {
          let param = nowClick.getSelection();
          self.getEnvironmentInfo(param[0], 2, 1)
        } else if (nowClick.name === "Environmental1F@SYS003") {
          let param = nowClick.getSelection();
          self.getEnvironmentInfo(param[0], 1, 1)
        } else if (nowClick.name === "yiqi@SYS003") {//22
          self.$store.dispatch('map/setOpenDialog', 5)
          self.$store.dispatch('map/setEquipmentId', "A010011");
          self.$store.dispatch('automaticStation/setModelId', 22)
        }else if(nowClick.name === "F2DoorControl@SYS003" ){
          self.getCameraVideo(nowClick.getSelection()[0], 2, 2,2);
          self.returnFloorDoorModelId(2,nowClick.getSelection()[0]);
        }else if(nowClick.name === "F1DoorControl@SYS003"){
          self.getCameraVideo(nowClick.getSelection()[0], 1, 2,2);
        }else if(nowClick.name === "F3DoorControl@SYS003"){
          self.getCameraVideo(nowClick.getSelection()[0], 3, 2,2);
          self.returnFloorDoorModelId(3,nowClick.getSelection()[0]);
        }else if(nowClick.name === "F1HuanNengQi@SYS003"){
          self.$store.dispatch('map/setOpenDialog', 5)
          self.$store.dispatch('automaticStation/setModelId', 30)
          self.$store.dispatch('map/setEquipmentId', "");
          //30
          // 中间
        }else if(nowClick.name ==="F1Algae@SYS003"){
          // 31
          self.$store.dispatch('map/setOpenDialog', 5)
          self.$store.dispatch('automaticStation/setModelId', 31)
          self.$store.dispatch('map/setEquipmentId', "");

        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    self.addDoingLine(self.gd1,polylineLayer);
    self.addDoingLine(self.gd,polylineLayer);
    self.addDoingLine(self.gd2,polylineLayer);
    self.addDoingLine(self.gd3,polylineLayer);
    self.addDoingLine(self.gd4,polylineLayer);
    self.addDoingLine(self.gd5,polylineLayer);
    self.initFloor2();
    self.addDoingLine(self.fengji,fengjiLineLayer);
    self.addDoingLine(self.fengji2,fengjiLineLayer);
    self.addDoingLine(self.fengji3,fengjiLineLayer);
    self.addDoingLine(self.fengji4,fengjiLineLayer);
    self.addDoingLine(self.fengji5,fengjiLineLayer);

    EventBus.$on("floor", function(obj) {
      if (obj === 0 || obj === "0") {
        self.changeFloor4();
        supermapJs.removeByLayer("threeFloorHouseLayer",viewer);
      } else if (obj === 1 || obj === "1") {
        self.changeFloor1();
        self.topCamera();
        supermapJs.removeByLayer("threeFloorHouseLayer",viewer);
      } else if (obj === 2 || obj === "2") {
        self.changeFloor2();
        self.frontCamera();
        supermapJs.removeByLayer("threeFloorHouseLayer",viewer);
      } else if (obj === 3 || obj === "3") {
        self.changeFloor3();
        self.frontCamera();
        supermapJs.removeByLayer("threeFloorHouseLayer",viewer);
      } else if (obj === 4 || obj === "4") {
        self.frontCamera();
      } else if (obj === 5 || obj === "5") {
        self.leftCamera();
      } else if (obj === 6 || obj === "6") {
        self.rightCamera();
      } else if (obj === 7 || obj === "7") {
        self.topCamera();
      }
    })

    EventBus.$on("switch", function(obj) {
      if(obj.floor ==="1" || obj.floor ===1){
        if(obj.value ==="2" || obj.value ===2){
          self.qiguanF1layer(obj.status)
          // self.qiguangzong(obj.status)
        }
      }else if(obj.floor ==="2" || obj.floor ===2){
        if(obj.value ==="1" || obj.value ===1){
          if(obj.status){
            viewer.dataSources.add(self.polylineLayer);
          }else{
            supermapJs.removeByLayer('polylineLayer',viewer);
          }
        }
        if(obj.value ==="2" || obj.value ===2){
          self.qiguanF2layer(obj.status)
        }
      }else if(obj.floor ==="3" || obj.floor ===3){
        if(obj.value ==="2" || obj.value ===2){
          self.qiguanF3layer(obj.status);
        }
      }
    })
    EventBus.$on("light",function(obj) {
      if(obj.status){
        self.floorIndex +=1;
      }else {
        self.floorIndex -=1;
      }
      if(self.floorIndex!==0  && self.floorIndex!=="0"){
        self.changeBlack(true)
        if(obj.floor ==="1" || obj.floor ===1){
          self.addLightSource(self.lightPoints1,1)
        }else if(obj.floor ==="2" || obj.floor ===2) {
          self.addLightSource(self.lightPoints2, 2)
        }else if(obj.floor ==="3" || obj.floor ===3) {
          self.addLightSource(self.lightPoints3, 3)
        }
      }else{
        self.changeBlack(false);
        if(obj.floor ==="1" || obj.floor ===1){
          self.closeLightSource(obj)
        }else if(obj.floor ==="2" || obj.floor ===2) {
          self.closeLightSource(obj)
        }else if(obj.floor ==="3" || obj.floor ===3) {
          self.closeLightSource(obj)
        }
      }
    })
    EventBus.$on("doorCamera",function() {
      self.doorCamera()
    })
    /**
     * 测试报警
     */
    EventBus.$on("houseWaring",function(obj) {
      console.log("房间报警.............")
      console.log(obj);
      self.addWaringEntity(obj.data);
      self.showWaringFloorLayer(obj.floor);

    });

    EventBus.$on("openDoor",function(obj) {
      console.log("返回的门禁..........")
      console.log(obj)
      self.testDoor(obj);
    });

    EventBus.$on("cameraPosition",function(obj) {
      console.log(obj);
      if(obj ===1 || obj ==="1"){
        viewer.scene.camera.flyTo({
          destination: { x: -2747996.977955354, y: 4695702.6772105815, z: 3328701.391570301 },
          orientation: {
            heading:1.5313873304313654,
            pitch:-0.592754627220053,
            roll:0.0000019237349668799197
          }
        })
      }else if(obj ===2 || obj ==="2"){
        viewer.scene.camera.flyTo({
          destination: { x: -2747997.266166847, y: 4695702.4212054275, z: 3328689.45274406 },
          orientation: {
            heading:1.4066726400069722,
            pitch:-0.5386262251410212,
            roll:6.2828580117952839
          }
        })
      }else if(obj ===3 || obj ==="3"){
        viewer.scene.camera.flyTo({
          destination: { x: -2748000.318032048, y: 4695688.437119299, z: 3328702.005773631 },
          orientation: {
            heading:1.317463331730048,
            pitch:-0.5807682203243867,
            roll:0.0000019084670785929347
          }
        })
      }
    })

    EventBus.$on("cameraFly",function(obj) {
      console.log("飞行对象....");
      console.log(obj);
      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(parseFloat(obj.jd), parseFloat(obj.wd), 20.0)
      });
    });

    EventBus.$on("setLookDown",function() {
      self.setLookDown();
    });

    this.initDoorModel();
    // this.addEntityPoint();

  },
  methods: {

    /**
     * 设置俯视角
     */
    setLookDown(){
      viewer.camera.flyTo({
        destination:{x: -2748075.363933052, y: 4695657.333588653, z: 3328710.7563077086},
        orientation:{
          heading:0.8302991718425741,
          pitch:-1.5594992087831088,
          roll:0
        }
      });
    },

    /**
     * 控制显示
     */
    showWaringFloorLayer(obj){
      supermapJs.removeByLayer("floorWaringLayer1", viewer);
      supermapJs.removeByLayer("floorWaringLayer2",viewer);
      supermapJs.removeByLayer("floorWaringLayer3", viewer);
      let self = this;
      switch (Number(obj)) {
        case 1:
          viewer.dataSources.add(floorWaringLayer1);
          self.changeFloor1();
          self.topCamera();
          break;
        case 2:
          viewer.dataSources.add(floorWaringLayer2);
          self.changeFloor2();
          self.frontCamera();
          break;
        case 3:
          viewer.dataSources.add(floorWaringLayer3);
          self.changeFloor3();
          self.frontCamera();
          break;
        default:
          break;
      }
    },

    /**
     *添加实体类
     * @param arry
     */
    addWaringEntity(arry){
      floorWaringLayer1.entities.removeAll();
      floorWaringLayer2.entities.removeAll();
      floorWaringLayer3.entities.removeAll();
      if(arry.length>0) {
        let self = this;
        for (let i = 0; i < arry.length; i++) {
          if (arry[i].floor === "1" || arry[i].floor === 1) {
            self.addEntityPoint(floorWaringLayer1, arry[i].type, arry[i].longitude, arry[i].latitude, 7);
          } else if (arry[i].floor === "2" || arry[i].floor === 2) {
            self.addEntityPoint(floorWaringLayer2, arry[i].type, arry[i].longitude, arry[i].latitude, 10.5);
          } else if (arry[i].floor === "3" || arry[i].floor === 3) {
            self.addEntityPoint(floorWaringLayer3, arry[i].type, arry[i].longitude, arry[i].latitude, 14);
          }
        }
      }
    },

    addEntityPoint(layer,type,jd,wd,height){
      let x=0.8;
      let flog=true;
      let imgsrc = "./image/marker/waring1.png";
      if(type ==="2"){
        imgsrc = "./image/marker/waring2.png";
      }
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(parseFloat(jd), parseFloat(wd), height),
        point:{
          color:new Cesium.CallbackProperty(function () {
            if(flog){
              x=x-0.1;
              if(x<=0){
                flog=false;
              }
            }else{
              x=x+0.1;
              if(x>=0.8){
                flog=true;
              }
            }
            return Cesium.Color.RED.withAlpha(x);
          },false),
          pixelSize:25,
          outlineWidth :0,
          outlineColor:Cesium.Color.RED.withAlpha(0.3)
        },
        billboard: new Cesium.BillboardGraphics({
          image:imgsrc,
        })
      });
    },
    /**
     * 根据返回的参数获取对应的图层id
     * @param floor
     * @param id
     */
    returnFloorDoorModelId(floor,id){
      let self = this;
      if(floor ==="2" || floor ===2){
        switch (Number(id)) {
          case 5:
            self.modelDoorIds ="three5"+","+"three51";
            break;
          case 4:
            self.modelDoorIds ="three6"+","+"three61";
            break;
          case 3:
            self.modelDoorIds ="three7"+","+"three71";
            break;
          case 2:
            self.modelDoorIds ="three8"+","+"three81"
            break;
          default:
            self.modelDoorIds=null;
            break;
        }
      }else if(floor ==="3" || floor ===3){
        switch (Number(id)) {
          case 5:
            self.modelDoorIds ="three1"+","+"three11";
            break;
          case 4:
            self.modelDoorIds ="three2"+","+"three21";
            break;
          case 3:
            self.modelDoorIds ="three3"+","+"three31";
            break;
          case 2:
            self.modelDoorIds ="three4"+","+"three41"
            break;
          default:
            self.modelDoorIds=null;

        }
      }

    },
    changeDoorStatus(val){
      supermapJs.removeByLayer('twoFloorDoorLayer', viewer);
      supermapJs.removeByLayer('threeFloorDoorLayer', viewer);
      switch (val) {
        case 2:
          viewer.dataSources.add(twoFloorDoorLayer);
          break;
        case 3:
          viewer.dataSources.add(threeFloorDoorLayer);
          break;
        default:
          console.log("参数异常");
          break;
      }

    },
    initDoorModel(){
      let self = this;
      for(let i=0;i<self.doorJson.length;i++){
        if(self.doorJson[i].floor===3 || self.doorJson[i].floor ==="3"){
          self.addModelEntity(threeFloorDoorLayer,self.doorJson[i].jd,self.doorJson[i].wd,11,self.doorJson[i].id,"test",self.doorJson[i].type);
        }else if(self.doorJson[i].floor ===2 || self.doorJson[i].floor ==="2"){
          self.addModelEntity(twoFloorDoorLayer,self.doorJson[i].jd,self.doorJson[i].wd,7.25,self.doorJson[i].id,"test",self.doorJson[i].type);
        }
      }
    },
    addModelEntity(layer,jd,wd,height,id,name,type){
      let urlModel =null;
      let position = Cesium.Cartesian3.fromDegrees(jd,wd,height);
      let heading = Cesium.Math.toRadians(-45);
      let pitch = 0;
      let roll = 0;
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
      if(type===0 || type==="0"){
        urlModel ="./gltf/door2.gltf";
      }else{
        urlModel = "./gltf/door3.gltf";
      }
      layer.entities.add({
        id:id,
        position:position,
        orientation:orientation,
        model:{
          uri:urlModel,
          scale:0.01
        }
      })
    },
    testDoor(status){
      if(this.modelDoorIds!==null){
        let modeIdsArrys1 = this.modelDoorIds.substr(0,this.modelDoorIds.indexOf(","));
        let modeIdsArrys0 = this.modelDoorIds.substr(this.modelDoorIds.indexOf(",")+1,this.modelDoorIds.length);
        this.roateDoorModel(modeIdsArrys0,status,1);
        this.roateDoorModel(modeIdsArrys1,status,0);
      }
    },
    /**
     * @param modelId 模型id
     * @param status  状态
     * @param doorType 0---左 ， 1 --- 右
     */
    roateDoorModel(modelId,status,doorType){
      let self  = this;
      let entity =null;
      let obj =  viewer.dataSources._dataSources;
      console.log(obj);
      if(obj.length>0){
        for(let i=0;i<obj.length;i++){
          if(obj[i]._name ==="threeFloorDoorLayer"){
            entity =obj[i].entities.getById(modelId);
          }else  if(obj[i]._name ==="twoFloorDoorLayer"){
            entity =obj[i].entities.getById(modelId);
          }
        }
      }
      console.log(entity)
      if(typeof(entity)!=="undefined") {
        let position = Cesium.Cartesian3.fromDegrees(120.337788616122,31.4590595657613, 11);
        if (status) {
          if (doorType === "0" || doorType === 0) {
            const pitch = Cesium.Math.toRadians(-130);
            const hpr = new Cesium.HeadingPitchRoll(pitch,0, 0);
            const ori = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
            entity.orientation = ori;
          } else {
            const pitch = Cesium.Math.toRadians(60);
            const hpr = new Cesium.HeadingPitchRoll(pitch, 0, 0);
            const ori = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
            entity.orientation = ori;
          }
        } else {
          const pitch = Cesium.Math.toRadians(-45);
          const hpr = new Cesium.HeadingPitchRoll(pitch, 0, 0);
          const ori = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
          entity.orientation = ori;
        }
      }
    },
    showWaringHouseStyle(){
      let self = this;
      viewer.entities.removeById("waringhouse")
      this.waringHouseTime =0;
      viewer.entities.add({
        id:"waringhouse",
        polygon:{
          hierarchy:Cesium.Cartesian3.fromDegreesArrayHeights(self.polygonArr),
          material:Cesium.Color.RED.withAlpha(0.1),
          height:14.7,
          outline:true,
          outlineWidth:5,
          outlineColor:Cesium.Color.CRIMSON
        }
      });
      let entity = viewer.entities.getById("waringhouse");
      this.waringHouseTime =setInterval(function() {
        if(entity.show){
          entity.show =false;
        }else {
          entity.show =true;
        }
      },1000)
      this.changeFloor3();

    },
    /**
     * 测试使用的方法
     */
    openDoor(){
      // 左 50 旋转 -50   // 右 50  旋转 135
      let position = Cesium.Cartesian3.fromDegrees(120.337847978147,31.4589983894853,7.25);
      let heading = Cesium.Math.toRadians(50);
      let pitch = 0;
      let roll = 0;
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
      viewer.entities.add({
        id:'test',
        position: position,
        orientation: orientation,
        model: {
          uri:"./gltf/door2.gltf",
          scale:0.01
        }
      });
    },
    layerStatus(val){
      let self = this;
      viewer.entities.removeById("waringhouse")
      switch (parseFloat(val)) {
        case 1:
          self.$store.dispatch('map/setOpenDialog', -1);
          if(self.layerIndex===1){
            return;
          }else{
            self.layerIndex =1;
            self.hideBuildingAndAirScene();
            self.init3dAirScene();
            supermapJs.removeByLayer('billboardLayer',viewer);
            supermapJs.removeByLayer('qingpingLayer',viewer);
          }
          break;
        case 2:
          self.$store.dispatch('map/setOpenDialog', 0);
          if(self.layerIndex===2){
            return;
          }else{
            self.layerIndex =2;
            supermapJs.removeByLayer('airBillboardLayer',viewer);
            self.hideBuildingAndAirScene();
            self.showBuilding();

          }
          break;
        default:
          console.log("参数故障！")
          break;
      }

    },

    clearBuildingBillbordLayer(){
      let self = this;
      supermapJs.removeByLayer('billboardLayer', viewer);
      supermapJs.removeByLayer('qingpingLayer', viewer);
    },

    /**
     *
     * 初始化倾斜投影数据
     */
    init3dAirScene(){
      let self = this;
      self.$store.dispatch('map/setOpenDialog', -1);
      viewer.imageryLayers.addImageryProvider(imageryProvider);
      // let waterPromise = viewer.scene.open(self.serverUrl + "/iserver/services/3D-Test-4/rest/realspace");
      // Cesium.when(waterPromise, function() {
      //   let layer = viewer.scene.layers.find("taihulake@water_1");
      //   layer.style3D.bottomAltitude = 0.8;
      //   layer.style3D.fillForeColor= Cesium.Color.fromCssColorString('#526d57');
      //   layer.refresh();
      // });
      let airPromise = viewer.scene.open(self.serverUrl+"/iserver/services/3D-shiyan-2/rest/realspace");
      Cesium.when(airPromise, function() {
        let layer = viewer.scene.layers.find("Combine_1");
        layer.cacheEntityCount=10;
        layer.style3D.bottomAltitude=130;
        viewer.scene.camera.setView({
          destination: {x: -2747767.548682041, y: 4696396.032620242, z: 3328779.2978854333},
          orientation: {
            heading:1.4852246249385512,
            pitch:-0.7101176879169415,
            roll:6.283185307179544
          }
        })
      });
      this.initPointAirName();
    },

    initPointAirName(){
      viewer.dataSources.add(airBillboardLayer);
      airBillboardLayer.entities.removeAll();
      let self = this;
      for(let i=0;i<this.pointsArr.length;i++){
        airBillboardLayer.entities.add({
          name: "airName",
          position: Cesium.Cartesian3.fromDegrees(self.pointsArr[i].x, self.pointsArr[i].y,20),
          billboard: new Cesium.BillboardGraphics({
            image: self.pointsArr[i].icon,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM
          })
        })
      }

    },

    /**
     * 显示建筑
     */
    showBuilding(){
      let self = this;
      // let waterPromise = viewer.scene.open(self.serverUrl + "/iserver/services/3D-Test-4/rest/realspace");
      // Cesium.when(waterPromise, function() {
      //   let layer = viewer.scene.layers.find("taihulake@water_1");
      //   layer.style3D.bottomAltitude = 0.8;
      // });
      let promise = viewer.scene.open(this.serverUrl + "/iserver/services/3D-dimian-SYS003-5/rest/realspace");

      Cesium.when(promise, function(layer) {
        viewer.scene.layers.find("waiceTree@SYS003").visible=false;
        viewer.scene.camera.setView({
          destination: { x: -2748009.3730675387, y: 4695726.247755796, z: 3328727.405748374 },
          orientation: {
            heading: 1.5907101406831776,
            pitch: -0.8244568276255,
            roll: 0.00000235
          }
        })
        viewer.scene.layers.find("fupai@SYS003").style3D.bottomAltitude = 0.3;
      });

      self.initBuildingInfo();
    },
    hideBuildingAndAirScene(){
      viewer.scene.layers.removeAll();
    },
    initBuildingInfo(){
      viewer.dataSources.add(billboardLayer)
      billboardLayer.entities.removeAll();
      qingpingLayer.entities.removeAll();
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
        }
        self.addPointInfoWindow(billboardLayer, self.points[i].name, icon, self.points[i].jd, self.points[i].wd, 20);

      }
      self.addPointInfoWindow2(billboardLayer, self.pointsFuFai.name, icon2, self.pointsFuFai.jd, self.pointsFuFai.wd, self.pointsFuFai.jd1, self.pointsFuFai.wd1, 3);

      for(let i=0;i<self.qiping.length;i++){
        self.addQingPingBillboard(qingpingLayer,parseFloat(self.qiping[i].jd),parseFloat(self.qiping[i].wd),4.5,self.qiping[i].name);
      }
      billboardLayer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120.337862954,31.459017827,20),
        name:"楼信息",
        billboard: new Cesium.BillboardGraphics({
          image: "./label/floor.png",
          pixelOffset: new Cesium.Cartesian2(20, 0)
        })
      })
    },
    /**
     * 门禁视角
     */
    doorCamera(){
      viewer.scene.camera.flyTo({
        destination: { x: -2748049.3207703587, y: 4695633.707517527, z: 3328670.2180220117 },
        orientation: {
          heading: 1.1790485279067058,
          pitch: -0.4217662309876231,
          roll: 0.0000017488202663784591
        }
      })
    },

    earthScene(val){
      switch (val) {
        case 1:
          viewer.scene.postProcessStages.snow.enabled = false;
          // viewer.scene.postProcessStages.snow.uniforms.density = 10;
          viewer.scene.postProcessStages.rain.enabled = false;
          // viewer.scene.postProcessStages.rain.uniforms.density = 20;
          break;
        case 2:
          viewer.scene.postProcessStages.rain.enabled = true;
          viewer.scene.postProcessStages.rain.uniforms.density = 10;
          break;
        case 3:
          viewer.scene.postProcessStages.snow.enabled = true;
          viewer.scene.postProcessStages.snow.uniforms.density = 20;
          break;
      }

    },
    // 通风
    changeLayer() {
      surpermapJs.removeByLayer('fengjiLineLayer', viewer);
      for (let i = 0; i < viewer.scene.layers._layers._array.length; i++) {
        if (viewer.scene.layers._layers._array[i]._name !== "fengdao@SYS003"
          && viewer.scene.layers._layers._array[i]._name !== "ludeng@SYS003"
          && viewer.scene.layers._layers._array[i]._name !== "fupai@SYS003"
          && viewer.scene.layers._layers._array[i]._name !== "dimian@SYS003"
          && viewer.scene.layers._layers._array[i]._name !== "jianceche@SYS003"
          && viewer.scene.layers._layers._array[i]._name !== "qipingshi@SYS003"
          && viewer.scene.layers._layers._array[i]._name !== "qiping@SYS003"
          // && viewer.scene.layers._layers._array[i]._name !== "taihulake@water_1"
        ) {
          viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 0.3;
        }
      }
      viewer.dataSources.add(fengjiLineLayer);
      viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor.alpha = 0.9;
      viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor = Cesium.Color.fromCssColorString("#0ff3a9");
      supermapJs.removeByLayer('billboardLayer', viewer);
      supermapJs.removeByLayer('qingpingLayer', viewer);
    },

    // 气管1
    qiguanF1layer(status){
      let layers =["F1N21@SYS003","F1C2H2@SYS003","F1He2@SYS003","F1Ar@SYS003","F1N22@SYS003","F1QiLuZG@SYS003"];
      if(status){
        for(let i=0;i<layers.length;i++){
          let layer =viewer.scene.layers.find(layers[i]);
          layer.visible =true;
          layer._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
          layer.textureUVSpeed = new Cesium.Cartesian2(0, -1);
        }
      }else{
        for(let i=0;i<layers.length;i++){
          let layer =viewer.scene.layers.find(layers[i]);
          layer.textureUVSpeed = new Cesium.Cartesian2(0, 0);
        }
      }

    },

    // 气管2
    qiguanF2layer(status){
      let layers =["F2He2@SYS003","F2N21@SYS003","F2QiLuZG@SYS003"];
      if(status){
        for(let i=0;i<layers.length;i++){
          let layer =viewer.scene.layers.find(layers[i]);
          layer.visible =true;
          layer._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
          layer.textureUVSpeed = new Cesium.Cartesian2(0, -1);
        }
      }else{
        for(let i=0;i<layers.length;i++){
          let layer =viewer.scene.layers.find(layers[i]);
          layer.textureUVSpeed = new Cesium.Cartesian2(0, 0);
        }
      }

    },

    // 气管3
    qiguanF3layer(status){
      let layers =["F3N21@SYS003","F3He1@SYS003","F3AIR@SYS003","F3N2@SYS003","F3QiLuZG@SYS003"];
      if(status){
        for(let i=0;i<layers.length;i++){
          let layer =viewer.scene.layers.find(layers[i]);
          layer.visible =true;
          layer._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
          layer.textureUVSpeed = new Cesium.Cartesian2(0, -1);
        }
      }else{
        for(let i=0;i<layers.length;i++){
          let layer =viewer.scene.layers.find(layers[i]);
          layer.textureUVSpeed = new Cesium.Cartesian2(0, 0);
        }
      }
    },

    // qiguangzong(status){
    //   let layers =["N21Z@SYS003","He1Z@SYS003","He2Z@SYS003","ARZ@SYS003","AIRZ@SYS003","N22Z@SYS003","N2Z@SYS003","ZX@SYS003"];
    //   if(status){
    //     for(let i=0;i<layers.length;i++){
    //       let layer =viewer.scene.layers.find(layers[i]);
    //       layer.visible =true;
    //       layer._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
    //       layer.textureUVSpeed = new Cesium.Cartesian2(0, -1);
    //     }
    //   }else{
    //     for(let i=0;i<layers.length;i++){
    //       let layer =viewer.scene.layers.find(layers[i]);
    //       layer.textureUVSpeed = new Cesium.Cartesian2(0, 0);
    //     }
    //   }
    // },

    // 气管
    changeLayer2() {
      let line = viewer.scene.layers.find("N2@SYS003");
      line.visible =true;
      line._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
      line.textureUVSpeed = new Cesium.Cartesian2(0, -1);

      let line1 = viewer.scene.layers.find("No1@SYS003");
      line1.visible =true;
      line1._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
      line1.textureUVSpeed = new Cesium.Cartesian2(0, -1);

      let line2 = viewer.scene.layers.find("AIR@SYS003");
      line2.visible =true;
      line2._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
      line2.textureUVSpeed = new Cesium.Cartesian2(0, -1);

      let line3 = viewer.scene.layers.find("He1@SYS003");
      line3.visible =true;
      line3._style3D._fillForeColor = Cesium.Color.fromCssColorString("#edf1f0");
      line3.textureUVSpeed = new Cesium.Cartesian2(0, -1);

    },
    changeFloor1() {
      this.changeDoorStatus(1);
      if (this.sceneStatus === 1) return;
      for (let i = 0; i < viewer.scene.layers._layers._array.length; i++) {
        viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 1.0;
      }
      this.sceneStatus = 1
      viewer.scene.layers.find("qiping@SYS003").visible = true;
      viewer.scene.layers.find("qipingshi@SYS003").visible = true;
      viewer.scene.layers.find("SYS1F@SYS003").visible = true;
      viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
      viewer.scene.layers.find("Light1F@SYS003").visible = true;
      viewer.scene.layers.find("Camera1F@SYS003").visible = true;


      viewer.scene.layers.find("qiping@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("qipingshi@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("SYS1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Environmental1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Light1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Camera1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      // 气管：F1
      viewer.scene.layers.find("F1N21@SYS003").visible = true;
      viewer.scene.layers.find("F1C2H2@SYS003").visible = true;
      viewer.scene.layers.find("F1He2@SYS003").visible = true;
      viewer.scene.layers.find("F1Ar@SYS003").visible = true;
      viewer.scene.layers.find("F1N22@SYS003").visible = true;

      viewer.scene.layers.find("F1QiLuZG@SYS003").visible = true;

      viewer.scene.layers.find("F1DoorControl@SYS003").visible = true;
      viewer.scene.layers.find("F1Door@SYS003").visible = true;

      // 气管：F2
      viewer.scene.layers.find("F2He2@SYS003").visible = false;
      viewer.scene.layers.find("F2N21@SYS003").visible = false;
      viewer.scene.layers.find("F2QiLuZG@SYS003").visible = false;

      // 气管：F3
      viewer.scene.layers.find("F3N21@SYS003").visible = false;
      viewer.scene.layers.find("F3He1@SYS003").visible = false;
      viewer.scene.layers.find("F3AIR@SYS003").visible = false;
      viewer.scene.layers.find("F3N2@SYS003").visible = false;
      viewer.scene.layers.find("F3QiLuZG@SYS003").visible = false;


      // 二楼
      viewer.scene.layers.find("SYS2F@SYS003").visible = false;
      viewer.scene.layers.find("Environmental2F@SYS003").visible = false;
      viewer.scene.layers.find("Light2F@SYS003").visible = false;
      viewer.scene.layers.find("WLM2F@SYS003").visible = false;
      viewer.scene.layers.find("Camera2F@SYS003").visible = false;
      viewer.scene.layers.find("F2DoorControl@SYS003").visible = false;
      viewer.scene.layers.find("F2Door@SYS003").visible = false;


      // 三楼
      viewer.scene.layers.find("yiqi@SYS003").visible = false;
      viewer.scene.layers.find("SYS3F@SYS003").visible = false;
      viewer.scene.layers.find("Environmental3F@SYS003").visible = false;
      viewer.scene.layers.find("Light3F@SYS003").visible = false;
      viewer.scene.layers.find("Camera3F@SYS003").visible = false;
      viewer.scene.layers.find("WLM3F@SYS003").visible = false;
      viewer.scene.layers.find("F3DoorControl@SYS003").visible = false;
      viewer.scene.layers.find("F3Door@SYS003").visible = false;

      // 全景
      viewer.scene.layers.find("louding@SYS003").visible = false;
      viewer.scene.layers.find("fengdao@SYS003").visible = false;

      supermapJs.removeByLayer('polylineLayer', viewer);
      supermapJs.removeByLayer('billboardLayer', viewer);
      supermapJs.removeByLayer('fengjiLineLayer', viewer);
      viewer.dataSources.add(billboardLayer1);
      supermapJs.removeByLayer('billboardLayer2', viewer);
      supermapJs.removeByLayer('billboardLayer3', viewer);
      supermapJs.removeByLayer('qingpingLayer', viewer);
      this.addBoxPrimitive(false)

    },
    changeFloor2() {
      this.changeDoorStatus(2);

      if (this.sceneStatus === 2) return;
      for (let i = 0; i < viewer.scene.layers._layers._array.length; i++) {
        viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 1.0;
      }
      this.sceneStatus = 2
      viewer.scene.layers.find("qiping@SYS003").visible = true;
      viewer.scene.layers.find("qipingshi@SYS003").visible = true;
      viewer.scene.layers.find("SYS1F@SYS003").visible = true;
      viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
      viewer.scene.layers.find("Light1F@SYS003").visible = true;
      viewer.scene.layers.find("Camera1F@SYS003").visible = true;

      viewer.scene.layers.find("qiping@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("qipingshi@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("SYS1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Environmental1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Light1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Camera1F@SYS003")._style3D._fillForeColor.alpha = 1.0;

      viewer.scene.layers.find("F1DoorControl@SYS003").visible = true;
      viewer.scene.layers.find("F1Door@SYS003").visible = true;

      // 二楼
      viewer.scene.layers.find("SYS2F@SYS003").visible = true;
      viewer.scene.layers.find("Environmental2F@SYS003").visible = true;
      viewer.scene.layers.find("Light2F@SYS003").visible = true;
      viewer.scene.layers.find("Camera2F@SYS003").visible = true;

      viewer.scene.layers.find("WLM2F@SYS003").visible = false;

      viewer.scene.layers.find("SYS2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Environmental2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Light2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Camera2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("WLM2F@SYS003")._style3D._fillForeColor.alpha = 1.0;


      viewer.scene.layers.find("F2DoorControl@SYS003").visible = true;
      viewer.scene.layers.find("F2Door@SYS003").visible = true;


      // 气管：F1
      viewer.scene.layers.find("F1N21@SYS003").visible = true;
      viewer.scene.layers.find("F1C2H2@SYS003").visible = true;
      viewer.scene.layers.find("F1He2@SYS003").visible = true;
      viewer.scene.layers.find("F1Ar@SYS003").visible = true;
      viewer.scene.layers.find("F1N22@SYS003").visible = true;

      viewer.scene.layers.find("F1QiLuZG@SYS003").visible = true;

      // 气管：F2

      viewer.scene.layers.find("F2He2@SYS003").visible = true;
      viewer.scene.layers.find("F2N21@SYS003").visible = true;
      viewer.scene.layers.find("F2QiLuZG@SYS003").visible = true;


      // 气管：F3
      viewer.scene.layers.find("F3N21@SYS003").visible = false;
      viewer.scene.layers.find("F3He1@SYS003").visible = false;
      viewer.scene.layers.find("F3AIR@SYS003").visible = false;
      viewer.scene.layers.find("F3N2@SYS003").visible = false;


      // 三楼
      viewer.scene.layers.find("yiqi@SYS003").visible = false;
      viewer.scene.layers.find("SYS3F@SYS003").visible = false;
      viewer.scene.layers.find("Environmental3F@SYS003").visible = false;
      viewer.scene.layers.find("Light3F@SYS003").visible = false;
      viewer.scene.layers.find("Camera3F@SYS003").visible = false;
      viewer.scene.layers.find("WLM3F@SYS003").visible = false;
      viewer.scene.layers.find("F3QiLuZG@SYS003").visible = false;
      viewer.scene.layers.find("F3DoorControl@SYS003").visible = false;
      viewer.scene.layers.find("F3Door@SYS003").visible = false;


      // 全景
      viewer.scene.layers.find("louding@SYS003").visible = false;
      viewer.scene.layers.find("fengdao@SYS003").visible = false;

      viewer.dataSources.add(billboardLayer2);
      supermapJs.removeByLayer('billboardLayer', viewer);
      supermapJs.removeByLayer('billboardLayer1', viewer);
      supermapJs.removeByLayer('billboardLayer3', viewer);
      supermapJs.removeByLayer('fengjiLineLayer', viewer);
      supermapJs.removeByLayer('qingpingLayer', viewer);
      this.addBoxPrimitive(true)

    },
    changeFloor3() {
      this.changeDoorStatus(3);
      if (this.sceneStatus === 3) return;
      for (let i = 0; i < viewer.scene.layers._layers._array.length; i++) {
        viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 1.0;
      }
      this.sceneStatus = 3
      viewer.scene.layers.find("qiping@SYS003").visible = true;
      viewer.scene.layers.find("qipingshi@SYS003").visible = true;
      viewer.scene.layers.find("SYS1F@SYS003").visible = true;
      viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
      viewer.scene.layers.find("Light1F@SYS003").visible = true;
      viewer.scene.layers.find("Camera1F@SYS003").visible = true;

      viewer.scene.layers.find("F1DoorControl@SYS003").visible = true;
      viewer.scene.layers.find("F1Door@SYS003").visible = true;

      viewer.scene.layers.find("qiping@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("qipingshi@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("SYS1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Environmental1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Light1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Camera1F@SYS003")._style3D._fillForeColor.alpha = 1.0;

      // 二楼
      viewer.scene.layers.find("Environmental2F@SYS003").visible = true;
      viewer.scene.layers.find("Light2F@SYS003").visible = true;
      viewer.scene.layers.find("Camera2F@SYS003").visible = false;

      viewer.scene.layers.find("SYS2F@SYS003").visible = true;
      viewer.scene.layers.find("WLM2F@SYS003").visible = true;

      viewer.scene.layers.find("F2DoorControl@SYS003").visible = true;
      viewer.scene.layers.find("F2Door@SYS003").visible = true;

      viewer.scene.layers.find("SYS2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Environmental2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Light2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Camera2F@SYS003")._style3D._fillForeColor.alpha = 1.0;

      viewer.scene.layers.find("WLM2F@SYS003")._style3D._fillForeColor.alpha = 1.0;

      // 三楼
      viewer.scene.layers.find("yiqi@SYS003").visible = true;
      viewer.scene.layers.find("SYS3F@SYS003").visible = true;
      viewer.scene.layers.find("Environmental3F@SYS003").visible = true;
      viewer.scene.layers.find("Light3F@SYS003").visible = true;
      viewer.scene.layers.find("Camera3F@SYS003").visible = true;
      viewer.scene.layers.find("WLM3F@SYS003").visible = false;

      viewer.scene.layers.find("yiqi@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("SYS3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Environmental3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Light3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("Camera3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
      viewer.scene.layers.find("WLM3F@SYS003")._style3D._fillForeColor.alpha = 1.0;


      // 气管：F1
      viewer.scene.layers.find("F1N21@SYS003").visible = true;
      viewer.scene.layers.find("F1C2H2@SYS003").visible = true;
      viewer.scene.layers.find("F1He2@SYS003").visible = true;
      viewer.scene.layers.find("F1Ar@SYS003").visible = true;
      viewer.scene.layers.find("F1N22@SYS003").visible = true;

      viewer.scene.layers.find("F1QiLuZG@SYS003").visible = true;


      // 气管：F2
      viewer.scene.layers.find("F2He2@SYS003").visible = true;
      viewer.scene.layers.find("F2N21@SYS003").visible = true;
      viewer.scene.layers.find("F2QiLuZG@SYS003").visible = true;


      // 气管：F3
      viewer.scene.layers.find("F3N21@SYS003").visible = true;
      viewer.scene.layers.find("F3He1@SYS003").visible = true;
      viewer.scene.layers.find("F3AIR@SYS003").visible = true;
      viewer.scene.layers.find("F3N2@SYS003").visible = true;
      viewer.scene.layers.find("F3QiLuZG@SYS003").visible = true;

      viewer.scene.layers.find("F3DoorControl@SYS003").visible = true;
      viewer.scene.layers.find("F3Door@SYS003").visible = true;



      // 全景
      viewer.scene.layers.find("louding@SYS003").visible = false;
      viewer.scene.layers.find("fengdao@SYS003").visible = false;

      supermapJs.removeByLayer('polylineLayer', viewer);
      supermapJs.removeByLayer('billboardLayer', viewer);
      supermapJs.removeByLayer('billboardLayer2', viewer);
      supermapJs.removeByLayer('billboardLayer1', viewer);
      supermapJs.removeByLayer('fengjiLineLayer', viewer);
      supermapJs.removeByLayer('qingpingLayer', viewer);

      viewer.dataSources.add(billboardLayer3);
      this.addBoxPrimitive(false)

    },
    changeFloor4() {
      console.log("123222222222222222222")
      if (this.sceneStatus ===0) {
        for (let i = 0; i < viewer.scene.layers._layers._array.length; i++) {
          viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 1.0;
        }
        viewer.scene.layers.find("qiping@SYS003").visible = true;
        viewer.scene.layers.find("qipingshi@SYS003").visible = true;
        viewer.scene.layers.find("SYS1F@SYS003").visible = true;
        viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
        viewer.scene.layers.find("Light1F@SYS003").visible = true;
        viewer.scene.layers.find("Camera1F@SYS003").visible = true;

        viewer.scene.layers.find("qiping@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("qipingshi@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("SYS1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Environmental1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Light1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Camera1F@SYS003")._style3D._fillForeColor.alpha = 1.0;


        // 二楼
        viewer.scene.layers.find("SYS2F@SYS003").visible = true;
        viewer.scene.layers.find("Environmental2F@SYS003").visible = true;
        viewer.scene.layers.find("Light2F@SYS003").visible = true;
        viewer.scene.layers.find("Camera2F@SYS003").visible = true;

        viewer.scene.layers.find("WLM2F@SYS003").visible = true;

        viewer.scene.layers.find("SYS2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Environmental2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Light2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Camera2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("WLM2F@SYS003")._style3D._fillForeColor.alpha = 1.0;

        // 三楼
        viewer.scene.layers.find("yiqi@SYS003").visible = true;
        viewer.scene.layers.find("SYS3F@SYS003").visible = true;
        viewer.scene.layers.find("Environmental3F@SYS003").visible = true;
        viewer.scene.layers.find("Light3F@SYS003").visible = true;
        viewer.scene.layers.find("Camera3F@SYS003").visible = true;
        viewer.scene.layers.find("WLM3F@SYS003").visible = true;


        viewer.scene.layers.find("yiqi@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("SYS3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Environmental3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Light3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Camera3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("WLM3F@SYS003")._style3D._fillForeColor.alpha = 1.0;

        viewer.scene.layers.find("louding@SYS003").visible = true;
        viewer.scene.layers.find("fengdao@SYS003").visible = true;

        viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("louding@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor = Cesium.Color.fromCssColorString("#616060");

        supermapJs.removeByLayer('polylineLayer', viewer);
        supermapJs.removeByLayer('billboardLayer', viewer);
        supermapJs.removeByLayer('billboardLayer2', viewer);
        supermapJs.removeByLayer('billboardLayer1', viewer);
        supermapJs.removeByLayer('billboardLayer3', viewer);
        supermapJs.removeByLayer('fengjiLineLayer', viewer);
        supermapJs.removeByLayer('qingpingLayer', viewer);
        viewer.dataSources.add(billboardLayer);
        viewer.scene.camera.flyTo({
          destination: { x: -2748009.3730675387, y: 4695726.247755796, z: 3328727.405748374 },
          orientation: {
            heading: 1.5907101406831776,
            pitch: -0.8244568276255,
            roll: 0.00000235
          }
        })

        // 气管：F1
        viewer.scene.layers.find("F1N21@SYS003").visible = true;
        viewer.scene.layers.find("F1C2H2@SYS003").visible = true;
        viewer.scene.layers.find("F1He2@SYS003").visible = true;
        viewer.scene.layers.find("F1Ar@SYS003").visible = true;
        viewer.scene.layers.find("F1N22@SYS003").visible = true;

        // 气管：F2

        viewer.scene.layers.find("F2He2@SYS003").visible = true;
        viewer.scene.layers.find("F2N21@SYS003").visible = true;

        // 气管：F3
        viewer.scene.layers.find("F3N21@SYS003").visible = true;
        viewer.scene.layers.find("F3He1@SYS003").visible = true;
        viewer.scene.layers.find("F3AIR@SYS003").visible = true;
        viewer.scene.layers.find("F3N2@SYS003").visible = true;

      }else{

        this.sceneStatus = 0;
        viewer.scene.layers.find("qiping@SYS003").visible = true;
        viewer.scene.layers.find("qipingshi@SYS003").visible = true;
        viewer.scene.layers.find("SYS1F@SYS003").visible = true;
        viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
        viewer.scene.layers.find("Light1F@SYS003").visible = true;
        viewer.scene.layers.find("Camera1F@SYS003").visible = true;

        viewer.scene.layers.find("qiping@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("qipingshi@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("SYS1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Environmental1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Light1F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Camera1F@SYS003")._style3D._fillForeColor.alpha = 1.0;

        // 二楼
        viewer.scene.layers.find("SYS2F@SYS003").visible = true;
        viewer.scene.layers.find("Environmental2F@SYS003").visible = true;
        viewer.scene.layers.find("Light2F@SYS003").visible = true;
        viewer.scene.layers.find("Camera2F@SYS003").visible = true;
        viewer.scene.layers.find("WLM2F@SYS003").visible = true;

        viewer.scene.layers.find("SYS2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Environmental2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Light2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Camera2F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("WLM2F@SYS003")._style3D._fillForeColor.alpha = 1.0;

        // 三楼
        viewer.scene.layers.find("yiqi@SYS003").visible = true;
        viewer.scene.layers.find("SYS3F@SYS003").visible = true;
        viewer.scene.layers.find("Environmental3F@SYS003").visible = true;
        viewer.scene.layers.find("Light3F@SYS003").visible = true;
        viewer.scene.layers.find("Camera3F@SYS003").visible = true;
        viewer.scene.layers.find("WLM3F@SYS003").visible = true;


        // 气管：F1
        viewer.scene.layers.find("F1N21@SYS003").visible = true;
        viewer.scene.layers.find("F1C2H2@SYS003").visible = true;
        viewer.scene.layers.find("F1He2@SYS003").visible = true;
        viewer.scene.layers.find("F1Ar@SYS003").visible = true;
        viewer.scene.layers.find("F1N22@SYS003").visible = true;

        // 气管：F2

        viewer.scene.layers.find("F2He2@SYS003").visible = true;
        viewer.scene.layers.find("F2N21@SYS003").visible = true;

        // 气管：F3
        viewer.scene.layers.find("F3N21@SYS003").visible = true;
        viewer.scene.layers.find("F3He1@SYS003").visible = true;
        viewer.scene.layers.find("F3AIR@SYS003").visible = true;
        viewer.scene.layers.find("F3N2@SYS003").visible = true;

        viewer.scene.layers.find("yiqi@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("SYS3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Environmental3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Light3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("Camera3F@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("WLM3F@SYS003")._style3D._fillForeColor.alpha = 1.0;


        // 全景
        viewer.scene.layers.find("louding@SYS003").visible = true;
        viewer.scene.layers.find("fengdao@SYS003").visible = true;

        viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor.alpha = 1.0;
        viewer.scene.layers.find("louding@SYS003")._style3D._fillForeColor.alpha = 1.0;

        supermapJs.removeByLayer('polylineLayer', viewer);
        supermapJs.removeByLayer('billboardLayer', viewer);
        supermapJs.removeByLayer('billboardLayer2', viewer);
        supermapJs.removeByLayer('billboardLayer1', viewer);
        supermapJs.removeByLayer('billboardLayer3', viewer);
        supermapJs.removeByLayer('fengjiLineLayer', viewer);
        supermapJs.removeByLayer('qingpingLayer', viewer);
        this.addBoxPrimitive(false)
        viewer.dataSources.add(billboardLayer);

        viewer.scene.layers.find("fengdao@SYS003")._style3D._fillForeColor = Cesium.Color.fromCssColorString("#bdbdbd");

        viewer.scene.camera.flyTo({
          destination: { x: -2748009.3730675387, y: 4695726.247755796, z: 3328727.405748374 },
          orientation: {
            heading: 1.5907101406831776,
            pitch: -0.8244568276255,
            roll: 0.00000235
          }
        })
      }
    },

    initFloor2() {
      billboardLayer2.entities.removeAll();
      billboardLayer1.entities.removeAll();
      billboardLayer3.entities.removeAll();
      for (let i = 0; i < this.floorTwoName.length; i++) {
        this.addBillboardForColor(billboardLayer2, parseFloat(this.floorTwoName[i].jd), parseFloat(this.floorTwoName[i].wd), 15, this.floorTwoName[i].name);
      }

      for (let i = 0; i < this.floorOneName.length; i++) {
        this.addBillboardForColor(billboardLayer1, parseFloat(this.floorOneName[i].jd), parseFloat(this.floorOneName[i].wd), 15, this.floorOneName[i].name);
      }

      for (let i = 0; i < this.floorThreeName.length; i++) {
        this.addBillboardForColor(billboardLayer3, parseFloat(this.floorThreeName[i].jd), parseFloat(this.floorThreeName[i].wd), 20, this.floorThreeName[i].name);
      }


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
    /**
     *
     *视频--0 / 门禁--2
     */
    getCameraVideo(id,floor,type,equType){
      let self = this
      if(equType===0 || equType ==="0"){
        mapHtp.getCameraCode(id,type,floor).then(function (res) {
          console.log(res)
          if(res.code ===200 || res.code ==="200"){
            let cameraCode = res.data.relationId;
            self.$store.dispatch('map/setvideoCode', cameraCode)
            self.$store.dispatch('map/setOpenDialog', 1);
          }
        })
      }else if(equType===2 || equType ==="2"){
        mapHtp.getCameraCode(id,type,floor).then(function (res) {
          if(res.code ===200 || res.code ==="200"){
            let cameraCode = res.data.relationId;
            self.$store.dispatch('map/setmjID',cameraCode);
            self.$store.dispatch('map/setOpenDialog',7);
          }
        })
      }

    },

    /**
     * 获取环境
     * @param id
     * @param floor
     * @param type
     */
    getEnvironmentInfo(id,floor,type){
      let self = this
      mapHtp.getCameraCode(id,type,floor).then(function (res) {
        console.log(res)
        if(res.code ===200 || res.code ==="200"){
          let code = res.data.relationId;
          self.$store.dispatch("map/setEquipmentId",code)
          self.$store.dispatch("map/setOpenDialog",6);
        }
      })
    },

    addPointInfoWindow2(layer, name, billboardUrl, x, y,x1, y1,height) {
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
    addDoingLine(pointArray, layer) {
      layer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArray),
          width: 5,
          material: new Cesium.PolylineTrailMaterialProperty({
            color: Cesium.Color.fromCssColorString("rgb(255,2,2)"),
            trailLength: 0.1,
            period: 2,
            outlineColor: Cesium.Color.fromCssColorString("rgb(255,2,2)")
          })
        },
      });
    },
    addBoxPrimitive(status) {
      if (status) {
        this.boxP1 = supermapJs.addBoxPrimitive(viewer, 120.337847, 31.459146, 9, 0.8, 0.5, 7, new Cesium.Cartesian3(0.5, 0.5, 0.0), Cesium.Math.toRadians(46))
        this.boxP2 = supermapJs.addBoxPrimitive(viewer, 120.337843, 31.459136, 11.5, 2.8, 0.4, 0.3, new Cesium.Cartesian3(1.0, 1.2, 0.0), Cesium.Math.toRadians(46.5))
        this.boxP3 = supermapJs.addBoxPrimitive(viewer, 120.337839, 31.459121, 11.5, 5.2, 0.4, 0.3, new Cesium.Cartesian3(0.3, 0.3, 0.0), Cesium.Math.toRadians(136.5))
        this.boxP4 = supermapJs.addBoxPrimitive(viewer, 120.337860, 31.459078, 11.5, 7.6, 0.4, 0.3, new Cesium.Cartesian3(-0.7, 0.5, 0.0), Cesium.Math.toRadians(47.5))
        this.boxP5 = supermapJs.addBoxPrimitive(viewer, 120.337865354178, 31.459072849147, 11.5, 8.2, 0.4, 0.3, new Cesium.Cartesian3(0.3, 0.3, 0.0), Cesium.Math.toRadians(138))
        this.boxP6 = supermapJs.addBoxPrimitive(viewer, 120.337879623341, 31.4590591473081, 11.5, 8.2, 0.4, 0.3, new Cesium.Cartesian3(0.3, 0.3, 0.0), Cesium.Math.toRadians(138))
        viewer.scene.primitives.add(this.boxP1);
        viewer.scene.primitives.add(this.boxP2);
        viewer.scene.primitives.add(this.boxP3);
        viewer.scene.primitives.add(this.boxP4);
        viewer.scene.primitives.add(this.boxP5);
        viewer.scene.primitives.add(this.boxP6);
      } else {
        if (this.boxP1 !== null) {
          viewer.scene.primitives.remove(this.boxP1);
          viewer.scene.primitives.remove(this.boxP2);
          viewer.scene.primitives.remove(this.boxP3);
          viewer.scene.primitives.remove(this.boxP4);
          viewer.scene.primitives.remove(this.boxP5);
          viewer.scene.primitives.remove(this.boxP6);
        }
      }
    },

    // 各个楼的信息
    addFloorHouseBillboard(layer,x,y,startHeight,height,name){
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        name:name,
        label: new Cesium.LabelGraphics({
          font: '12px sans-serif',
          text: name,
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("#1a7bdc")
        })
      });
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, startHeight),
        billboard: new Cesium.BillboardGraphics({
          image: "./label/00.png",
        }),
        name:name,
        polyline: new Cesium.PolylineGraphics({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([x, y, startHeight, x, y, height]),
          width: 1.0,
          material: new Cesium.PolylineDashMaterialProperty({
            image: "./label/line2.png"
          })
        }),
        point: new Cesium.PointGraphics({
          color: Cesium.Color.fromCssColorString("#00fbff"),
          pixelSize: 2,
          outlineColor: Cesium.Color.fromCssColorString("#00fbff"),
          outlineWidth: 1
        })
      })
    },


    addQingPingBillboard(layer,x,y,height,name){
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        name:name,
        label: new Cesium.LabelGraphics({
          font: '12px sans-serif',
          text: name,
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("#1a7bdc")
        })
      });
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, 3.5),
        name:name,
        polyline: new Cesium.PolylineGraphics({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([x, y, 3.5, x, y, height]),
          width: 1.0,
          material: new Cesium.PolylineDashMaterialProperty({
            image: "./label/line2.png"
          })
        }),
        point: new Cesium.PointGraphics({
          color: Cesium.Color.fromCssColorString("#00fbff"),
          pixelSize: 2,
          outlineColor: Cesium.Color.fromCssColorString("#00fbff"),
          outlineWidth: 1
        })
      })
    },

    addBillboardForColor(layer, x, y, height, name) {
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        name:name,
        label: new Cesium.LabelGraphics({
          font: '12px sans-serif',
          text: name,
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("#1a7bdc")
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
        position: Cesium.Cartesian3.fromDegrees(x, y, 5),
        name:name,
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
    // 前面
    frontCamera() {
      viewer.scene.camera.flyTo({
        destination: { x: -2748040.599901183, y: 4695677.62024837, z: 3328665.2866036524},
        orientation: {
          heading: 0.8554613019934267,
          pitch: -0.5256378318049011,
          roll: 0.0000018445692662183433
        }
      })
    },
    // 后
    leftCamera() {
      viewer.scene.camera.flyTo({
        destination: { x: -2748060.0219470775, y: 4695632.88219388, z: 3328715.5109871565 },
        orientation: {
          heading: 3.9628488518040648,
          pitch: -1.39970816061,
          roll: 0.0000093716019
        }
      })
    },
    rightCamera() {
      viewer.scene.camera.flyTo({
        destination: { x: -2748111.1515442464, y: 4695636.50000373, z: 3328651.8456739616 },
        orientation: {
          heading: 5.5998320803463315,
          pitch: -0.5863558544624916,
          roll: 0.00000191552615280699
        }
      })
    },
    // 俯视
    topCamera() {
      console.log(11111)
      viewer.scene.camera.flyTo({
        destination: { x: -2748073.4652418355,
          y: 4695680.327793308,
          z: 3328700.011065336 },
        orientation: {
          heading:0.8500672587193083,
          pitch: -1.235120332060616,
          roll: 0.000004843700653900385
        }
      })
    },
    // 灯光
    addLightSource(arrPoints,floor){
      let height =10;
      for(let i=0;i<arrPoints.length;i++){
        if(floor ==="1" || floor ===1){
          height =5.0;
          switch (i) {
            case 0:
              this.a1= new Cesium.SpotLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:200
              })
              viewer.scene.addLightSource(this.a1)
              break;
            case 1:
              this.a2= new Cesium.SpotLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:200
              })
              viewer.scene.addLightSource(this.a2)
              break;
            case 2:
              this.a3= new Cesium.SpotLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:200
              })
              viewer.scene.addLightSource(this.a3)
              break;
            case 3:
              this.a4= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:200
              })
              viewer.scene.addLightSource(this.a4)
              break;
            case 4:
              this.a5= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:200
              })
              viewer.scene.addLightSource(this.a5)
              break;
          }
        }else if(floor ==="2" || floor ===2){
          height =8.0;
          switch (i) {
            case 0:
              this.b1= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.b1)
              break;
            case 1:
              this.b2= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.b2)
              break;
            case 2:
              this.b3= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.b3)
              break;
            case 3:
              this.b4= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.b4)
              break;
            case 4:
              this.b5= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.b5)
              break;
          }
        }else if(floor ===3 || floor==="3"){
          height =10.0;
          switch (i) {
            case 0:
              this.c1= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.c1)
              break;
            case 1:
              this.c2= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.c2)
              break;
            case 2:
              this.c3= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.c3)
              break;
            case 3:
              this.c4= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.c4)
              break;
            case 4:
              this.c5= new Cesium.PointLight(Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height),{
                targetPosition:Cesium.Cartesian3.fromDegrees(parseFloat(arrPoints[i].jd),parseFloat(arrPoints[i].wd),height-4),
                intensity:5,
                color:Cesium.Color.WHITE,
                cutoffDistance:300
              })
              viewer.scene.addLightSource(this.c5)
              break;
          }
        }

      }
    },
    closeLightSource(obj){
      let self = this
      if(obj.floor===1 || obj.floor ==="1"){
        // for(let i=0;i<self.lightPoints1;i++){
        //    viewer.scene.removeLightSource(self.lightPoints1[i].name);
        // }
        viewer.scene.removeLightSource(self.a1);
        viewer.scene.removeLightSource(self.a2);
        viewer.scene.removeLightSource(self.a3);
        viewer.scene.removeLightSource(self.a4);
        viewer.scene.removeLightSource(self.a5);
      }else if(obj.floor===2 || obj.floor==="2"){
        // for(let i=0;i<self.lightPoints2;i++){
        //   viewer.scene.removeLightSource(self.lightPoints2[i].name)
        // }
        viewer.scene.removeLightSource(self.b1);
        viewer.scene.removeLightSource(self.b2);
        viewer.scene.removeLightSource(self.b3);
        viewer.scene.removeLightSource(self.b4);
        viewer.scene.removeLightSource(self.b5);
      }else if(obj.floor ===3 || obj.floor ==="3"){
        // for(let i=0;i<self.lightPoints3;i++){
        //   viewer.scene.removeLightSource(self.lightPoints3[i].name)
        // }
        viewer.scene.removeLightSource(self.c1);
        viewer.scene.removeLightSource(self.c2);
        viewer.scene.removeLightSource(self.c3);
        viewer.scene.removeLightSource(self.c4);
        viewer.scene.removeLightSource(self.c5);
      }

    },
    /**
     * 聚光灯
     * @param position
     * @param targetPosition
     */
    addSpotLight(position,targetPosition){
      let posDeg = Cesium.Cartographic.fromCartesian(position);
      let pointPosition = Cesium.Cartesian3.fromRadians(posDeg.longitude, posDeg.latitude, posDeg.height);
      let options = {
        color: new Cesium.Color(1, 1, 1, 1),
        distance: 200,
        decay: 0.9,
        intensity: 50
      };
      let spotLight = new Cesium.SpotLight(position, targetPosition, options);
      viewer.scene.addLightSource(spotLight);
    },
    // 黑夜/白天
    changeBlack(status){
      if(this.blackStatus) return ;
      if(status){
        viewer.scene.sun.show = false;
        viewer.scene.globe.enableLighting = true;
        viewer.scene.lightSource._ambientLightColor = new Cesium.Color(0.1, 0.1, 0.1, 0.1);
        // viewer.scene.hdrEnabled = false;
        //开启颜色校正
        viewer.scene.colorCorrection.show = true;
        viewer.scene.colorCorrection.brightness = 0.4;
        // this.blackStatus =true;
      }else{
        viewer.scene.sun.show = true;
        viewer.scene.globe.enableLighting = false;
        viewer.scene.lightSource._ambientLightColor = new Cesium.Color(0.5, 0.5, 0.5, 1);
        // viewer.scene.hdrEnabled = true;
        //开启颜色校正
        viewer.scene.colorCorrection.show = false;
        viewer.scene.colorCorrection.brightness = 1;
        // this.blackStatus = null
      }



    }

  }
}


</script>

<style scoped>
#container{
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.el-row{
  position: absolute;
  top: 28%;
  right: 1%;
  flex-wrap: wrap;
  display: flex;
  width: 80px;
}

.el-row .el-button{
  margin-left: 0;
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  margin-top: 25px;
}

.map{
  width: 100%;
  height: 100%;
}

#layerChange{
  position: absolute;
  width: 160px;
  height: 110px;
  bottom: 8%;
  left: 1%;
  display: flex;
}

#layerChange img{
  width: 63%;
  height: 67%;
  margin: 5px;
  cursor: pointer;
}



</style>
