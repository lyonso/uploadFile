<template>
  <div id="popInfo" style="width: 100%;height: 100%;">
    <div id="map3d"/>
    <popInfo />
  </div>

</template>

<script>

import supermapJs from "@/mapJs/supermapJs"
import popInfo from '@/views/detectionMap2/popInfo'

let viewer=null;

let pointLayer =new Cesium.CustomDataSource('pointLayer');
let serverHttp=process.env.VUE_APP_GIS
let serverFloor1 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS1F@SYS003/config";
let serverFloor2 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS2F@SYS003/config";
let serverFloor3 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS3F@SYS003/config";
let singleServer=serverHttp+"/iserver/services/3D-FengJi5-SYS003/rest/realspace/datas/SYS1FKong@SYS003/config";
let singleServer1=serverHttp+'/iserver/services/3D-FengJi5-SYS003/rest/realspace/datas/SYS1FSTRoom@SYS003/config';

// 灯源
let lightPosition =Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 200);
// 目标
let targetPosition=Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 10)


// 以前地址
let serverConfig=serverHttp+'/iserver/services/3D-dimian-SYS003/rest/realspace/datas/'; 
// 一楼
let serverConfig1=serverHttp+'/iserver/services/3D-2Fworkspace/rest/realspace';
// 二楼
let serverConfig2=serverHttp+'/iserver/services/3D-2Fworkspace-2/rest/realspace';

export default {
name: "index",
  components:{
    popInfo
  },
  data() {
    return {
      pointsData: [
        120.337893022982, 31.4588920494684, 20.278,
        120.337940824236, 31.4589305918827, 20.278,
        120.337898279079, 31.4589955569726, 19.2,
        120.337898279079, 31.4589955569726, 7.278,
        120.337797314435, 31.4589287478487, 7.278,
        120.337665739689, 31.4590442349772, 8.278,
        120.337740599555, 31.4590905633086, 7.278,
        120.337776267998, 31.4590560150742, 7.278,
        120.337796776649, 31.4590716227565, 7.278,
        120.337701774317, 31.459159831994, 7.278,
        120.337701774317, 31.459159831994, 35.278,
        120.337909420998, 31.4589877818818, 35.278,
        120.337909420998, 31.4589877818818, 28.278,
        120.337889260508, 31.4589724883101, 28.278,
        120.337889260508, 31.4589724883101, 21.278,
        120.337940824236, 31.4589305918827, 21.278,
        120.337893022982, 31.4588920494684, 21.278,
      ],
      labelPointsData: [
        {
          name: "1",
          xy: [120.337893022982, 31.4588920494684, 20.278],
          height: 20.9,
        },
        {
          name: "2",
          xy: [120.337665739689, 31.4590442349772, 8.278],
          height: 10.3
        },
        {
          name: "3",
          xy: [120.337796776649, 31.4590716227565, 7.278],
          height: 6.8
        },
        {
          name: "4",
          xy: [120.337740599555, 31.4590905633086, 35.278],
          height: 35.5
        }
      ],
      // 区域名称显示
      namePoints: [
        {
          floor: '3',
          xy: [120.337811165796, 31.4591730057203, 12.417],
          src: './label/jiance.png'
        },
        {
          floor: '2',
          xy: [120.337705586078, 31.4591334249664, 10.335],
          src: './label/jiance.png'
        },
        {
          floor: '2',
          xy: [120.337906953013, 31.4589541411436, 11.498],
          src: './label/data.png'
        },
        {
          floor: '2',
          xy: [120.337862485299, 31.4588919925646, 10.648],
          src: './label/bangong.png'
        },
        {
          floor: '1',
          xy: [120.337843174895, 31.4590832600497, 7.021],
          src: "./label/shengtai.png"
        },
        {
          floor: '1',
          xy: [120.337665739689, 31.4590442349772, 7.021],
          src: "./label/carLabel.png"
        }
      ],
      pointListName:[
        {
          level:'3',
          name:"有机指标检测区",
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
          name:"无机指标检测区",
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
            // 120.33779495788 ,31.4590964862183 ,7.073,
            // 120.337755510021, 31.4590654183337, 7.074,
            // 120.337836521203, 31.4589897688825, 7.073,
            // 120.337876361446, 31.4590213203532, 7.073,
          ],
          color:'#2c62ce',
          center:[120.337814097942,31.4590394376439,2.862]
        },
        {
          level:'1',
          name:"生态指标检测区",
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
          name:"无机指标前处理区",
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
      ]
    }
  },
  mounted() {
    viewer = supermapJs.init3('map3d');
    viewer.dataSources.add(pointLayer);
    window.viewer = viewer;
    viewer.scene.addLightSource(new Cesium.SpotLight(lightPosition,targetPosition,{
      intensity:10,
      color:Cesium.Color.WHITE,
      distance:400,
    }))

    let self = this;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(res) {
      let pointName = viewer.scene.pick(res.position).id._name;
      console.log(pointName)
      if(typeof(pointName)!=="undefined"){
        if(pointName==='有机指标检测区' || pointName ==="生态指标检测区"){
          self.$store.commit('inspect/SET_DIALOG_VISIBLE', true)
          self.$store.commit('inspect/SET_VISIBLE_TITLE',pointName)

        }
      }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.showBuilding();

  },
  methods:{
    showBuilding(){
      let layerServer1 = viewer.scene.open(serverConfig1)
      let layerServer2 = viewer.scene.open(serverConfig2)
      Cesium.when(layerServer1,function(layers){
        layers.forEach(layer=>{
          // layer.style3D.bottomAltitude = 10
        })
        viewer.scene.camera.setView({
          destination: {x: -2748045.2314724238, y: 4695684.291505476, z: 3328674.7421118645},
          orientation: {
            heading:.8159117650146186,
            pitch: -0.4506926506550242,
            roll: 0.0000017725543
          }
        })
      })
      Cesium.when(layerServer2,function(layers){
        layers.forEach(layer=>{
          layer.style3D.bottomAltitude = 10
        })
        viewer.scene.camera.setView({
          destination: {x: -2748045.2314724238, y: 4695684.291505476, z: 3328674.7421118645},
          orientation: {
            heading:.8159117650146186,
            pitch: -0.4506926506550242,
            roll: 0.0000017725543
          }
        })
      })

      this.addFloorBorder();
    },

    /**
     * 合并
     */
    mergeLevelModel(){
      pointLayer.entities.removeAll();
      viewer.scene.layers.remove("f15");
      viewer.scene.layers.find("f14").style3D.bottomAltitude =0;
      viewer.scene.layers.find("f3").visible=true;
      viewer.scene.layers.find("f2").visible=true;
      viewer.scene.layers.find("f9").visible=true;
      viewer.scene.layers.find("f10").visible=true;
      viewer.scene.addS3MTilesLayerByScp(serverConfig+"SYS3F@SYS003/config", { name: 'f15' });
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

    /**
     * 添加分区
     */
    addFloorBorder(){
      pointLayer.entities.removeAll();
      let height =0;
      for(let i=0;i<this.pointListName.length;i++){
        if(this.pointListName[i].level==="3"){
          height=32.6;
        }else if(this.pointListName[i].level ==="2"){
          height=20.7;
        }else if(this.pointListName[i].level ==="1"){
          height=7;
        }
        this.addPolygonToScene(pointLayer,this.pointListName[i].data,this.pointListName[i].color,height,this.pointListName[i].name,this.pointListName[i].center)
      }
    },
    addPolygonToScene(layer,datas,color,height,name,centerData) {
      if(datas.length>0){
        layer.entities.add({
          name:name,
          polygon:{
            hierarchy:Cesium.Cartesian3.fromDegreesArrayHeights(datas),
            material:Cesium.Color.fromCssColorString(color).withAlpha(0.8),
            height:height,
            outline:true,
            outlineWidth:2,
            outlineColor:Cesium.Color.fromCssColorString(color)
          }
        });
      }

      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(centerData[0],centerData[1],height+2),
        label: new Cesium.LabelGraphics({
          font: '18px sans-serif',
          text: name.toString(),
          outlineWidth: 2.0,
          // pixelOffset: new Cesium.Cartesian2(0, -5),
        })
      })
    },



  },
  destroyed() {
    console.log("close--detectionMap2")
    viewer.destroy()
  },
  beforeDestroy() {
    console.log(111)
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

