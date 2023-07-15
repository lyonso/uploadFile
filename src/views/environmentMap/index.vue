<template>
   <div id="map3d"></div>
</template>

<script>
import {EventBus} from '@/mapJs/EventBus'
import supermapJs from "@/mapJs/supermapJs"

let viewer=null;
let serverHttp=process.env.VUE_APP_GIS
let serverUrl=serverHttp+"/iserver/services/3D-FengJi5-SYS003/rest/realspace/datas";

let serverFloor1 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS1F@SYS003/config";
let serverFloor2 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS2F@SYS003/config";
let serverFloor3 =serverHttp+"/iserver/services/3D-dimian-SYS003-5/rest/realspace/datas/SYS3F@SYS003/config";

let serverWLF3 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/WLM3F@SYS003/config";
let serverWLF2 =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/WLM2F@SYS003/config";
let fengdaoServer =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/fengdao@SYS003/config";
let loudingServer =serverHttp+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/louding@SYS003/config";

let tipLayer =new Cesium.CustomDataSource('tipLayer');
let flyLineLayer =new Cesium.CustomDataSource('flyLineLayer');

// 灯源
let lightPosition =Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 200)
// 目标
let targetPosition=Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 10)
export default {
name: "index",
  data(){
     return{
       floor1Server:[
         {
           url:serverUrl+"/SYS1FSTRoom@SYS003/config",
           layerName:"f1",
         },
         {
           url:serverUrl+"/SYS1FKong@SYS003/config",
           layerName:"f2",
         },
         {
           url:serverUrl+"/SYS1FFQWZCRoom@SYS003/config",
           layerName:"f3",

         },
         {
           url:serverUrl+"/SYS1FWJFXS2@SYS003/config",
           layerName:"f4",
         },
         {
           url:serverUrl+"/SYS1FSwitchingRoom@SYS003/config",
           layerName:"f5",
         },
         {
           url:serverUrl+"/SYS1FjingjianRoom@SYS003/config",
           layerName:"f6",
         },
         {
           url:serverUrl+"/SYS1FYZDRoom@SYS003/config",
           layerName:"f7",
         },
         {
           url:serverUrl+"/SYS1FWXFQURoom@SYS003/config",
           layerName:"f8",
         },
         {
           url:serverUrl+"/SYS1FWJFXS1@SYS003/config",
           layerName:"f9",
         },
         {
           url:serverUrl+"/SYS1FSTYCLRoom@SYS003/config",
           layerName:"f10",
         },
         {
           url:serverUrl+"/SYS1FOther@SYS003/config",
           layerName:"f11",
         },
         {
           url:serverUrl+"/SYS1FSengTaiRoom@SYS003/config",
           layerName:"f12",
         },
         {
           url:serverUrl+"/SYS1FStairs@SYS003/config",
           layerName:"f13",
         },
         {
           url:serverUrl+"/SYS1FWJFXS1To2@SYS003/config",
           layerName:"f14",
         }
       ],
       floor2Server:[
         {
           url:serverUrl+"/SYS2FBalanceRoom@SYS003/config",
           layerName:"f15",
         },

         {
           url:serverUrl+"/SYS2FOther@SYS003/config",
           layerName:"f16",
         },
         {
           url:serverUrl+"/SYS2FCGLHRoom1@SYS003/config",
           layerName:"f17",
         },
         {
           url:serverUrl+"/SYS2FCGYQRoom@SYS003/config",
           layerName:"f18",
         },
         {
           url:serverUrl+"/SYS2FShiYouCeShiRoo@SYS003/config",
           layerName:"f19",
         },
         {
           url:serverUrl+"/SYS2FCGLHRoom2@SYS003/config",
           layerName:"f20",
         },
         {
           url:serverUrl+"/SYS2FBacteriologyRo@SYS003/config",
           layerName:"f21",
         },
         {
           url:serverUrl+"/SYS2FBODRoom@SYS003/config",
           layerName:"f22",
         },
       ],
       floor3Server:[
         {
           url:serverUrl+"/SYS3FYJQCLRoom@SYS003/config",
           layerName:"f27",
         },
         {
           url:serverUrl+"/SYS3FOther@SYS003/config",
           layerName:"f23",
         },
         {
           url:serverUrl+"/SYS3FYJJCRoom1@SYS003/config",
           layerName:"f24",
         },
         {
           url:serverUrl+"/SYS3FYJJCRoom2@SYS003/config",
           layerName:"f25",
         },
         {
           url:serverUrl+"/SYS3FSJCLRoom@SYS003/config",
           layerName:"f26",
         }
       ],
       flyLineData:[
         {
           data:[
             120.337605323774,31.4592107573982, 6.667,
             120.337619213609,31.4592208121257, 6.647,
             120.337650241692,31.4591920463728, 6.646,
             120.337729890319,31.4592546775937, 6.740,
             120.337733844702,31.4592571654198, 6.746,
             120.337749527794,31.459243898749 ,6.794,
             120.337750479055,31.4592402829371, 6.830,
             120.337750821005,31.4592399910804, 15.336,
             120.337748943755,31.4592420894275, 15.840,
             120.337743058853,31.4592374483424, 15.908,
             120.337740145609,31.4592352683713, 15.923
             ]
         },
         {
           data:[
              120.337769209861, 31.4590855580151, 6.649,
              120.337760155735, 31.4590790167346, 6.653,
              120.33772987189 ,31.4591072107731 ,6.653,
              120.337748467086, 31.4591227421507, 6.653,
              120.337691234037, 31.4591774249674, 6.679,
              120.337758901384, 31.4592298369874, 6.751,
              120.337767938396, 31.4592226016058, 6.742,
              120.337776205371, 31.4592192434817, 6.742,
              120.337797186236, 31.4591971591288, 6.755,
              120.337795797749, 31.4591964356716, 15.647,
              120.337795638907, 31.4591965875835, 15.957,
              120.337791658025, 31.4592002531453, 15.974
           ]
         },
         {
           data:[
           120.337805797334,31.4591581261108, 6.708,
           120.337800343836,31.4591639549411,6.736,
           120.337818375352,31.459179385004,6.749,
           120.337808211482, 31.4591900330151,6.740,
           120.3378041072,31.4591907472713,6.785,
           120.337802317921, 31.4591899030236, 15.581
          ]

         },
         {
           data:[
              120.337800971829,31.4590756355232,6.643
,              120.337857784536,31.4591210955541,6.669
,              120.337839937617,31.4591382793177,6.680
,              120.337850890783,31.4591468217866,6.703
,              120.337850868959,31.4591468369773,15.294,
              120.337849700705,31.4591463378899,15.946,
              120.337845368311,31.4591503919941,15.974,
              120.337839906391,31.4591487494926,16.050,
          ]
         },
         {

           data:[
              120.33789923712 ,31.4590798048415 ,14.526
,              120.337864210775, 31.4591106789823, 14.527,
              120.337859048626, 31.4591269484145, 14.546,
              120.337851784096, 31.4591341990511, 14.519,
              120.337851329059, 31.4591362375907, 14.517,
              120.337856441391, 31.4591405158074, 14.551,
              120.337855773158, 31.4591413852467, 15.379,
              120.337850093642, 31.4591366992009, 15.746
           ]
         },
         {
           data:[
              120.337788447938,31.45912660957,14.380,
              120.337825754099,31.4590920844457,  14.380,
              120.337850314062,31.4591117721738,  14.379,
              120.337842314614,31.459119301555 , 14.379,
              120.337854827529,31.4591294855818,  14.522

           ]

         },
         {
           data:[
              120.337696131352,31.4592780269515,10.611,
              120.337739797196,31.4592378959164,10.659,
              120.337743163598,31.4592352482811,10.662,
              120.337750799822,31.459239972244,10.664
           ]
         },

         {
           data:[
            120.337694831348,31.4592253682545, 14.400,
            120.337726520269,31.4592495711724, 14.399,
            120.337740871554,31.4592365243754, 14.400,
            120.337750523697,31.459228308599 ,14.399,
            120.337759504843,31.4592350602281, 14.399,
            120.337753636927,31.4592385278395, 15.455
         ]

         },
         {
           data:[

            120.337777296601,31.459137124062 ,14.380,
            120.337739671978,31.4591725881176, 14.381,
            120.337772108622,31.4591975242589, 14.381,
            120.337776179112,31.459194171012 ,14.382,
            120.337790618427,31.4592046612738, 14.388,
            120.337796499555,31.4592001983467, 14.384
           ]
         },
         {
           data:[
             120.33781895368 ,31.4591686427461 , 10.644,
              120.337813824307, 31.4591733322386,  10.658,
              120.33780701554 ,31.4591685355308 , 10.659,
              120.337794037382, 31.459182488347 , 10.668,
              120.337803815689, 31.459191012166 , 10.682
            ]

         },
         {
           data:[
            120.337805972843,31.4591582599087,10.646,
            120.337800934605,31.4591628781303,10.660,
            120.337807260645,31.4591682350407,10.660
           ]

         },
         {
           data:[
             120.337885914857 ,31.4590486675112 ,10.589,
            120.337818055952 ,31.4591131445445 ,10.600,
            120.337854695197 ,31.4591423714798 ,10.575
           ]

         },
         {
           data:[
            120.337841537094,31.4590386540114,14.378,
            120.337853555647,31.4590483252398,14.377,
            120.337844322972,31.4590571473212,14.378,
            120.33788526724 ,31.4590893348899,14.376
          ]

         },
         {
           data:[
             120.337855917573,31.4590357856771,10.548,
             120.337879532483,31.4590544308106,10.585
  ]
         },
         {
           data:[
             120.337646317664,31.4591699140567,6.644,
            120.337661367446,31.4591811956188,6.643,
            120.337650106718,31.4591926720483,6.643
           ]
         },
         {
           data:[
             120.337682476785,31.459197893843 ,6.643,
             120.337661693427,31.4591813966608, 6.643
           ]

         },
         {
           data:[
             120.337669190169,31.4592140078725,10.610,
             120.337719460918,31.4592531761291,10.623
  ]
         },
         {
           data:[
            120.337755109858,31.4592050158502,6.638,
            120.337757261262,31.4592066826423,6.664,
            120.337769502798,31.4591956692297,6.662,
            120.337785499068,31.4592079749297,6.646
           ]

         },
         {
           data:[
            120.337804063775, 31.4590746209581, 14.379,
            120.337849868204, 31.4591114070621, 14.381,
            120.33784208179 ,31.4591189541141 ,14.381,
            120.337853826291, 31.4591281033548, 14.393
           ]
         }
       ],
       indexType:0,
       booleanFlyIndex:false
     }
  },
  mounted() {
    viewer = supermapJs.init3('map3d');
    window.viewer = viewer;
    viewer.scene.skyBox.show =false;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#010e24");
    viewer.scene.globe.show=false;
    viewer.scene.moon.show =false;
    tipLayer.entities.removeAll();
    flyLineLayer.entities.removeAll();
    viewer.dataSources.add(tipLayer);
    viewer.dataSources.add(flyLineLayer);
    this.initScene();
    viewer.scene.addLightSource(new Cesium.DirectionalLight(lightPosition,targetPosition,{
      intensity:10,
      color:Cesium.Color.WHITE,
      distance:300,
    }))

    let self = this;
    EventBus.$on("dataType",function(obj) {
      self.showFouseStatusAndValue(obj);
    });

    const hanlder = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    hanlder.setInputAction(function(res) {
      let pointName = viewer.scene.pick(res.position).id._name;
      if(typeof(pointName)!=="undefined"){
        if(pointName ==="waring"){
          let cameraId = viewer.scene.pick(res.position).id.description._value;
          console.log(cameraId)
          self.$store.dispatch('environment/showModal', cameraId)
        }
      }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);

    setTimeout(function() {
      viewer.scene.layers.find("f11").style3D.fillForeColor=Cesium.Color.fromCssColorString("#7ffff4");
      viewer.scene.layers.find("f16").style3D.fillForeColor=Cesium.Color.fromCssColorString("#7ffff4");
      viewer.scene.layers.find("f16").style3D.fillForeColor.alpha = 0.4;
      viewer.scene.layers.find("f11").style3D.fillForeColor.alpha = 0.4;
    },2000)




  },
  methods:{
    initScene(){
      for(let i=0;i<this.floor1Server.length;i++){
         this.addLayerToScene(this.floor1Server[i].url,0,this.floor1Server[i].layerName);
      }
      for(let i=0;i<this.floor2Server.length;i++){
        this.addLayerToScene(this.floor2Server[i].url,9,this.floor2Server[i].layerName);
      }
      for(let i=0;i<this.floor3Server.length;i++){
        this.addLayerToScene(this.floor3Server[i].url,18,this.floor3Server[i].layerName);
      }

      viewer.scene.camera.setView({
        destination: {x: -2748015.745797223, y: 4695688.213876704, z: 3328686.173353489},
        orientation: {
          heading:1.3545463687233594,
          pitch:-0.38611903415230664,
          roll:6.283185307179579
        }
      });
    },
    /**
     * 添加
     * @param url
     * @param height
     * @param layerName
     */
    addLayerToScene(url, height, layerName) {
      let promise = viewer.scene.addS3MTilesLayerByScp(url, { name: layerName });
      promise.then(function(layer) {
        layer.style3D.bottomAltitude = height;
        layer.style3D.fillForeColor =Cesium.Color.fromCssColorString('#00e6ff');
        layer.style3D._fillForeColor.alpha = 0.4;
      });
    },

    initFlyLineLayer(){
      flyLineLayer.entities.removeAll();
      for(let i=0;i<this.flyLineData.length;i++){
        this.addPointLine(this.flyLineData[i].data,flyLineLayer);
      }
    },

    /**
     * 添加动态线
     */
    addPointLine(arrPoint,layer) {
      layer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPoint),
          width: 5,
          material: new Cesium.PolylineTrailMaterialProperty({
            color: Cesium.Color.DODGERBLUE,
            trailLength: 3,
            period: 0.6,
          })
        },
      });
    },
    /**
     * 显示整个风机模型
     */
    changeSceneShowAirModel(){
      // viewer.scene.layers.removeAll();
      for(let i=0;i<this.floor1Server.length;i++){
        viewer.scene.layers.find(this.floor1Server[i].layerName).visible=false
      }
      for(let i=0;i<this.floor2Server.length;i++){
        viewer.scene.layers.find(this.floor2Server[i].layerName).visible=false
      }
      for(let i=0;i<this.floor3Server.length;i++){
        viewer.scene.layers.find(this.floor3Server[i].layerName).style3D.visible=false
      }

      if(this.booleanFlyIndex){
        viewer.scene.layers.find("serverFloor1").visible=true;
        viewer.scene.layers.find("serverFloor2").visible=true;
        viewer.scene.layers.find("serverFloor3").visible=true;
        viewer.scene.layers.find("fengdaoServer").visible=true;
      }else{
        this.setLayerOpacity(serverFloor1,"serverFloor1");
        this.setLayerOpacity(serverFloor2,"serverFloor2");
        this.setLayerOpacity(serverFloor3,"serverFloor3");
        this.setLayerColor(fengdaoServer,"fengdaoServer");
        this.booleanFlyIndex=true;
      }
      viewer.scene.camera.setView({
        destination:{x: -2748020.6415215973, y: 4695659.8565499615, z: 3328690.3420304535},
        orientation: {
          heading:1.3545493076124497,
          pitch:-0.386113416307416,
          roll:6.283185307179579
        }
      });
      this.initFlyLineLayer();
    },
    setLayerOpacity(serverUrl,layerName){
      let promise =viewer.scene.addS3MTilesLayerByScp(serverUrl, { name:layerName});
      promise.then(function(layer) {
        layer.style3D.fillForeColor =Cesium.Color.fromCssColorString('#00e6ff');
        layer.style3D._fillForeColor.alpha = 0.4;
      });
    },
    setLayerColor(serverUrl,layerName){
      let promise =viewer.scene.addS3MTilesLayerByScp(serverUrl, { name:layerName});
      promise.then(function(layer) {
        layer.style3D.fillForeColor =Cesium.Color.fromCssColorString('#4bfc87');
      });
    },
    /**
     * 显示房间状态和value
     * @param obj
     */
    showFouseStatusAndValue(obj){
      tipLayer.entities.removeAll();
      let self = this;
      if(this.indexType===1){
        viewer.scene.layers.find("serverFloor1").visible=false;
        viewer.scene.layers.find("serverFloor2").visible=false;
        viewer.scene.layers.find("serverFloor3").visible=false;
        viewer.scene.layers.find("fengdaoServer").visible=false;
        for(let i=0;i<this.floor1Server.length;i++){
          viewer.scene.layers.find(this.floor1Server[i].layerName).visible=true
        }
        for(let i=0;i<this.floor2Server.length;i++){
          viewer.scene.layers.find(this.floor2Server[i].layerName).visible=true
        }
        for(let i=0;i<this.floor3Server.length;i++){
          viewer.scene.layers.find(this.floor3Server[i].layerName).visible=true
        }
        flyLineLayer.entities.removeAll();
        viewer.scene.camera.setView({
          destination: {x: -2748015.745797223, y: 4695688.213876704, z: 3328686.173353489},
          orientation: {
            heading:1.3545463687233594,
            pitch:-0.38611903415230664,
            roll:6.283185307179579
          }
        });
      }
      switch (Number(obj.type)) {
        case 1:
          this.indexType=0;
          self.addPointValueInModel2(obj.data)
          break;
        case 6:
          this.indexType=1;
          self.changeSceneShowAirModel();
          break;
        case 2:
          this.indexType=0;
          self.addPointValueInModel(obj.data)
          break;
        default:
          this.indexType=0;
          self.addPointValueInModel(obj.data)
          break;
      }
    },
    addPointValueInModel2(data){
      console.log(data)
      for(let i=1;i<28;i++){
        let layerName = 'f'+i;
        viewer.scene.layers.find(layerName).style3D.fillForeColor =Cesium.Color.fromCssColorString('#00e6ff');
        viewer.scene.layers.find(layerName).style3D._fillForeColor.alpha = 0.4;
      }
      let imgSrc ="./newLayerImage/e1.png";
      let self = this;
      let nowLayer =null,modelHeight=9,typeName="waring";
      for(let i=0;i<data.length;i++){
        if(Number(data[i].floor)===2){
          modelHeight=23
        }else if(Number(data[i].floor)===3){
          modelHeight=35
        }else {
          modelHeight=9
        }
        nowLayer = viewer.scene.layers.find(data[i].deviceId);
        self.addBillboardForColor2(tipLayer,parseFloat(data[i].longitude),parseFloat(data[i].latitude),modelHeight,imgSrc,typeName,data[i].eventList);
        viewer.scene.layers.find(data[i].deviceId).style3D.fillForeColor=Cesium.Color.fromCssColorString(data[i].color)
        viewer.scene.layers.find(data[i].deviceId).style3D.fillForeColor.alpha = 0.7;
      }
    },
    addPointValueInModel(data){
      let imgSrc ="./newLayerImage/pop.png";
      let imgSrc1="./newLayerImage/e0.png";
      let modelValue ="";
      let self = this;
      let nowLayer =null,modelHeight=9,modelHeight1=7.7,typeName="success";
      let description="";
      for(let i=0;i<data.length;i++){
        if(Number(data[i].eventValue)>0){
          modelValue =data[i].eventValue;
          imgSrc ="./newLayerImage/popRed.png";
          imgSrc1="./newLayerImage/e1.png";
        }else{
          modelValue = data[i].value;
          imgSrc ="./newLayerImage/pop.png";
          imgSrc1="./newLayerImage/e0.png";
        }
        if(Number(data[i].floor)===2){
          modelHeight=23
          modelHeight1=22
        }else if(Number(data[i].floor)===3){
          modelHeight=35
          modelHeight1=33.7
        }
        nowLayer = viewer.scene.layers.find(data[i].deviceId);
        self.addBillboardForColor(tipLayer,parseFloat(data[i].longitude),parseFloat(data[i].latitude),modelHeight,modelValue,imgSrc,imgSrc1,modelHeight1,data[i].id,typeName,description);
        console.log(data[i].color)
        viewer.scene.layers.find(data[i].deviceId).style3D.fillForeColor=Cesium.Color.fromCssColorString(data[i].color)
        viewer.scene.layers.find(data[i].deviceId).style3D.fillForeColor.alpha = 0.7;
      }
    },
    addBillboardForColor(layer, x, y, height, name,src,src1,height1,modelId,typeName,description) {
      if(height>0){
        layer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(x, y, height),
          label: new Cesium.LabelGraphics({
            font: '12px sans-serif',
            text:name.toString(),
            outlineWidth:2.0,
            pixelOffset: new Cesium.Cartesian2(0, -5),
          }),
          billboard: {
            image:src,
            width: 44,
            height: 30,
          }
        })
        layer.entities.add({
          id:modelId,
          position: Cesium.Cartesian3.fromDegrees(x, y, height1),
          name:typeName,
          billboard: {
            image:src1,
            width: 44,
            height: 44,
          },
          description:description
        })
      }
    },
    addBillboardForColor2(layer, x, y, height,src,typeName,description) {
      if(height>0){
        layer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(x, y, height),
          name:typeName,
          billboard: {
            image:src,
            width: 44,
            height: 44,
          },
          description:description
        })
      }
    },

  },
  destroyed() {
    console.log("close--environmentMap")
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

canvas{
  background-image: url("../../../public/image/color2.png") !important;
}


</style>
