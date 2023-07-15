<template>
  <div id="map3d"></div>
</template>

<script>
import supermapJs from "@/mapJs/supermapJs"
let viewer=null;
let serverFloor1 =process.env.VUE_APP_GIS+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS1F@SYS003/config";
let serverFloor2 =process.env.VUE_APP_GIS+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS2F@SYS003/config";
let serverFloor3 =process.env.VUE_APP_GIS+"/iserver/services/3D-dimian-SYS003/rest/realspace/datas/SYS3F@SYS003/config";
let singleServer=process.env.VUE_APP_GIS+"/iserver/services/3D-FengJi5-SYS003/rest/realspace/datas/SYS1FKong@SYS003/config";
let singleServer1=process.env.VUE_APP_GIS+'/iserver/services/3D-FengJi5-SYS003/rest/realspace/datas/SYS1FSTRoom@SYS003/config';

// 灯源
let lightPosition =Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 200);
// 目标
let targetPosition=Cesium.Cartesian3.fromDegrees( 120.338213497,31.45920532, 10)
let LineLayer =new Cesium.CustomDataSource('LineLayer');

export default {
name: "index",
  data(){
    return{
      pointsData:[
        120.337893022982,31.4588920494684,20.278,
        120.337940824236,31.4589305918827,20.278,
        120.337898279079,31.4589955569726,19.2,
        120.337898279079,31.4589955569726,7.278,
        120.337797314435,31.4589287478487,7.278,
        120.337665739689,31.4590442349772,8.278,
        120.337740599555,31.4590905633086,7.278,
        120.337776267998,31.4590560150742, 7.278,
        120.337796776649,31.4590716227565,7.278,
        120.337701774317,31.459159831994 ,7.278,
        120.337701774317,31.459159831994 ,35.278,
        120.337909420998,31.4589877818818,35.278,
        120.337909420998,31.4589877818818,28.278,
        120.337889260508,31.4589724883101,28.278,
        120.337889260508,31.4589724883101,21.278,
        120.337940824236,31.4589305918827,21.278,
        120.337893022982,31.4588920494684,21.278,
      ],
      labelPointsData:[
        {
          name:"1",
          xy:[120.337893022982,31.4588920494684,20.278],
          height:20.9,
        },
        {
          name:"2",
          xy:[120.337665739689,31.4590442349772,8.278],
          height: 10.3
        },
        {
          name:"3",
          xy:[120.337796776649,31.4590716227565,7.278],
          height: 6.8
        },
        {
          name:"4",
          xy:[120.337740599555,31.4590905633086,35.278],
          height: 35.5
        }
      ],
      // 区域名称显示
      namePoints:[
        {
          floor:'3',
          xy:[120.337811165796,31.4591730057203,12.417],
          src:'./label/jiance.png'
        },
        {
          floor:'2',
          xy:[120.337705586078,31.4591334249664,10.335],
          src:'./label/jiance.png'
        },
        {
          floor:'2',
          xy:[120.337906953013,31.4589541411436,11.498],
          src:'./label/data.png'
        },
        {
          floor:'2',
          xy:[120.337862485299,31.4588919925646,10.648],
          src:'./label/bangong.png'
        },
        {
          floor:'1',
          xy:[120.337843174895,31.4590832600497,7.021],
          src:"./label/shengtai.png"
        },
        {
          floor:'1',
          xy:[120.337665739689,31.4590442349772,7.021],
          src:"./label/carLabel.png"
        }
      ]


    }
  },
  mounted() {
    viewer = supermapJs.init3('map3d');
    window.viewer = viewer;
    viewer.scene.skyBox.show =false;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#010e24");
    viewer.scene.globe.show=false;
    viewer.scene.moon.show =false;
    this.initScene();
    LineLayer.entities.removeAll();
    viewer.dataSources.add(LineLayer);
    viewer.scene.addLightSource(new Cesium.SpotLight(lightPosition,targetPosition,{
      intensity:10,
      color:Cesium.Color.WHITE,
      distance:400,
    }))
    this.initLineLayer();

  },
  methods:{
    initScene(){
      this.addLayerToScene(serverFloor1,0,"serverFloor1",'#00e6ff',0.4);
      this.addLayerToScene(serverFloor2,9,"serverFloor2",'#00e6ff',0.4);
      this.addLayerToScene(serverFloor3,18,"serverFloor3",'#00e6ff',0.4);
      this.addLayerToScene(serverFloor3,18,"serverFloor3",'#00e6ff',0.4);
      this.addLayerToScene(singleServer,0,"singleServer",'#25f604',0.7);
      this.addLayerToScene(singleServer1,0,"singleServer1",'#25f604',0.7);
      viewer.scene.camera.setView({
        destination: {x: -2748015.745797223, y: 4695688.213876704, z: 3328686.173353489},
        orientation: {
          heading:1.3545463687233594,
          pitch:-0.38611903415230664,
          roll:6.283185307179579
        }
      });
    },

    initLineLayer(){
      LineLayer.entities.removeAll();
      this.addPointLine(this.pointsData,LineLayer);
      LineLayer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(120.337665739689,31.4590442349772,2.278),
        model:{
          uri:'./gltf/ExportModel.gltf',
          scale:1.0,
          color:Cesium.Color.fromCssColorString('#86e9f8').withAlpha(0.8)
        }
      })

      let nameHeight=0;
      for(let i=0;i<this.namePoints.length;i++){
        if(this.namePoints[i].floor==='3'){
          nameHeight=34
        }else if(this.namePoints[i].floor==='2'){
          nameHeight=22.3;
        }else {
          nameHeight=7;
        }
        LineLayer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(this.namePoints[i].xy[0], this.namePoints[i].xy[1],nameHeight),
          billboard: new Cesium.BillboardGraphics({
            image: this.namePoints[i].src,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM
          })
        })
      }

      let imgSrc ="./label/one.png";
      for(let i=0;i<this.labelPointsData.length;i++){
        if(this.labelPointsData[i].name==="1"){
          imgSrc="./label/one.png";
        }else if(this.labelPointsData[i].name==="2"){
          imgSrc="./label/two.png";
        }else if(this.labelPointsData[i].name==="3"){
          imgSrc="./label/three.png";
        }else{
          imgSrc="./label/four.png";
        }
        LineLayer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(this.labelPointsData[i].xy[0], this.labelPointsData[i].xy[1],this.labelPointsData[i].height),
          billboard: new Cesium.BillboardGraphics({
            image:imgSrc,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM
          })
        })
      }

    },
    addPointLine(arrPoint,layer) {
      layer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPoint),
          width: 5,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.fromCssColorString("#04d55c"),
            outlineColor:Cesium.Color.fromCssColorString("#04d55c"),
            outlineWidth:5
          })
        },
      });

      layer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPoint),
          width: 10,
          material: new Cesium.PolylineTrailMaterialProperty({
            color: Cesium.Color.fromCssColorString("#237fe2"),
            trailLength: 0.2,
            period: 3,
          })
        },
      });
    },
    addLayerToScene(url, height, layerName,color,opacity) {
      let promise = viewer.scene.addS3MTilesLayerByScp(url, { name: layerName });
      promise.then(function(layer) {
        layer.style3D.bottomAltitude = height;
        layer.style3D.fillForeColor =Cesium.Color.fromCssColorString(color);
        layer.style3D._fillForeColor.alpha = opacity;
      });
    },


  },
  destroyed() {
    console.log("close--detectionMap")
    viewer.destroy()
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
