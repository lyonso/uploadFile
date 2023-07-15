<template>
  <div style="height: 100%;width: 100%;">
    <div id="container"></div>
    <el-row style="position: absolute;top: 30%;right: 1%;">
      <el-button
        type="primary"
        :plain=true
        @click="changeFloor4">全景</el-button>
      <el-button type="primary" plain @click="changeFloor1">1F</el-button>
      <el-button type="primary" plain @click="changeFloor2">2F</el-button>
      <el-button type="primary" plain @click="changeFloor3">3F</el-button>
    </el-row>
  </div>
</template>

<script>
import supermapJs from "@/mapJs/supermapJs";
import wuxiData from "@/mapJs/wuxiData";
import {EventBus} from '@/mapJs/EventBus';
import {mapGetters} from 'vuex'

export default {
  name: "index",
  data() {
    return {
      viewer: null,
      imageSrc: null,
      sceneStatus: 0,
      areaLayer: null,
      serverUrl: 'http://192.168.1.107:8090',
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
          "jd": 120.337779579,
          "wd": 31.459134143
        }
      ],
      points: [
        {
          "name": "浮筏",
          "jd": 120.338433963,
          "wd": 31.459343310
        },
        {
          "name": "风机",
          "jd": 120.337973369,
          "wd": 31.459022099
        },
        {
          "name": '移动监测车',
          "jd": 120.337602610,
          "wd": 31.459475492
        },
        {
          "name": "热泵",
          "jd": 120.337711904,
          "wd": 31.459279375
        },{
          "name": "气瓶间",
          "jd": 120.337783886,
          "wd": 31.459263273
        },
      ],
      floorTwoName:[
        {jd: '120.337681379', wd: '31.459271877',name:'油类分析室'},
        {jd: '120.337655901', wd: '31.459211283',name:'细菌分析室'},
        {jd: '120.337742174', wd: '31.459234306',name:'BOD室'},
        {jd: '120.337680114', wd: '31.459185676',name:'天平间'},
        {jd: '120.337748274', wd: '31.459180661',name:'常规理化室(1)'},
        {jd: '120.337806166', wd: '31.459116900',name:'常规理化室(2)'},
        {jd: '120.337874106', wd: '31.459050992',name:'常规仪器室'}

      ],

      billboardLayer:new Cesium.CustomDataSource('billboardLayer'),
      polylineLayer: new Cesium.CustomDataSource('polylineLayer'),
      billboardLayer2: new Cesium.CustomDataSource('billboardLayer2'),
      boxP1:null,
      boxP2:null,
      boxP3:null,
      boxP4:null,
      boxP5:null,
      boxP6:null
    }
  },
  mounted() {
    this.viewer = supermapJs.init2('container');
    let self = this;
    this.viewer.dataSources.add(this.billboardLayer)
    this.billboardLayer.entities.removeAll();
    for (let i = 0; i < self.points.length; i++) {
      let icon ="./label/001.png";
      switch (self.points[i].name) {
        case '浮筏':
          icon ="./label/002.png";
          break;
        case '热泵':
          icon ="./label/004.png";
          break;
        case '移动监测车':
          icon ="./label/001.png";
          break;
        case '风机':
          icon ="./label/005.png";
          break;
        case '气瓶间':
          icon="./label/003.png";
          break;
      }
      self.addPointInfoWindow(self.billboardLayer,icon, self.points[i].jd, self.points[i].wd, 20);
    }

    let promise = this.viewer.scene.open(this.serverUrl + "/iserver/services/3D-dimian-SYS003/rest/realspace");
    Cesium.when(promise, function() {
      self.viewer.scene.camera.setView({
        destination: { x: -2748009.3730675387, y: 4695726.247755796, z: 3328727.405748374 },
        orientation: {
          heading: 1.5907101406831776,
          pitch: -0.8244568276255,
          roll: 0.00000235
        }
      })
    });

    self.billboardLayer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(120.337764726, 31.459072194, 25),
      billboard: new Cesium.BillboardGraphics({
        image: "./label/floor.png",
        pixelOffset:new Cesium.Cartesian2(40, 0)
      })
    })

    const hanlder = new Cesium.ScreenSpaceEventHandler(self.viewer.scene.canvas);

    hanlder.setInputAction(function(res) {
      let cartesitan2 = new Cesium.Cartesian2(res.position.x, res.position.y);
      let jdAndWd = supermapJs.windowToWGS84(cartesitan2, self.viewer);
      console.log("返回的坐标值....")
      console.log(jdAndWd)
      let nowClick = self.viewer.scene.layers.getSelectedLayer();
      console.log(nowClick.name)
      if (nowClick.name === "SecondFloorWLM@SYS003" || nowClick.name === "erlouWLM") {
        self.$store.dispatch('map/setLaboratoryDetails', true)
      } else if (nowClick.name === "Camera1F@SYS003") {
        let param = nowClick.getSelection();
        console.log(param)
        if (param[0] === "1") {
          self.$store.dispatch('map/setopenVideo', "296ffade35cd43aab152adfe95b79bc9")
          self.$store.dispatch('map/setopenVideo', true);
        }
        if (param[0] === "2") {
          self.$store.dispatch('map/setopenVideo', "561508c5f8484fc3a66b008e0a32c038")
          self.$store.dispatch('map/setopenVideo', true);
        }
      } else if (nowClick.name === "BuKongQiu1@SYS003") {
        let param = nowClick.getSelection();
        if (param[0] === "1") {
          self.$store.dispatch('map/setopenVideo', "561508c5f8484fc3a66b008e0a32c038")
          self.$store.dispatch('map/setopenVideo', true);
        }
      } else if (nowClick.name === "BuKongQiu2@SYS003") {
        let param = nowClick.getSelection();
        if (param[0] === "1") {
          self.$store.dispatch('map/setopenVideo', "64b95c62916d4688a8d5ceb22308922e")
          self.$store.dispatch('map/setopenVideo', true);
        }
      } else if (nowClick.name === "jianceche@SYS003") {
        self.$store.dispatch('map/setLaboratoryDetailsTwo', true)
      } else if (nowClick.name === "fupai@SYS003") {
        self.$store.dispatch('map/setLaboratoryDetailsOne', true)
      }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);

    self.addDoingLine(self.gd1, self.polylineLayer);
    self.addDoingLine(self.gd, self.polylineLayer);
    self.addDoingLine(self.gd2, self.polylineLayer);
    self.addDoingLine(self.gd3, self.polylineLayer);
    self.addDoingLine(self.gd4, self.polylineLayer);
    self.addDoingLine(self.gd5, self.polylineLayer);
    self.initFloor2();

  },
  methods: {
    changeFloor1() {
      this.sceneStatus = 1
      this.viewer.scene.layers.find("qiping@SYS003").visible = true;
      this.viewer.scene.layers.find("qipingshi@SYS003").visible = true;
      this.viewer.scene.layers.find("FirstFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Camera1F@SYS003").visible = true;

      // 二楼
      this.viewer.scene.layers.find("BuKongQiu1@SYS003").visible = false;
      this.viewer.scene.layers.find("SecondFloor@SYS003").visible = false;
      this.viewer.scene.layers.find("Environmental2F@SYS003").visible = false;
      this.viewer.scene.layers.find("Light2F@SYS003").visible = false;
      this.viewer.scene.layers.find("SecondFloorWLM@SYS003").visible = false;

      // 三楼
      this.viewer.scene.layers.find("BuKongQiu2@SYS003").visible = false;
      this.viewer.scene.layers.find("YiQi1@SYS003").visible = false;
      this.viewer.scene.layers.find("ThirdFloor@SYS003").visible = false;
      this.viewer.scene.layers.find("YiQi@SYS003").visible = false;
      this.viewer.scene.layers.find("Environmental3F@SYS003").visible = false;
      this.viewer.scene.layers.find("Light3F@SYS003").visible = false;
      this.viewer.scene.layers.find("WLM3F@SYS003").visible = false;

      // 全景
      this.viewer.scene.layers.find("LouDing@SYS003").visible = false;

      supermapJs.removeByLayer('polylineLayer', this.viewer);
      supermapJs.removeByLayer('billboardLayer', this.viewer);
      supermapJs.removeByLayer('billboardLayer2', this.viewer);
      this.addBoxPrimitive(false)

    },
    changeFloor2() {

      this.sceneStatus = 2
      this.viewer.scene.layers.find("qiping@SYS003").visible = true;
      this.viewer.scene.layers.find("qipingshi@SYS003").visible = true;
      this.viewer.scene.layers.find("FirstFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Camera1F@SYS003").visible = true;

      // 二楼
      this.viewer.scene.layers.find("BuKongQiu1@SYS003").visible = true;
      this.viewer.scene.layers.find("SecondFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental2F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light2F@SYS003").visible = true;
      this.viewer.scene.layers.find("SecondFloorWLM@SYS003").visible = true;

      // 三楼
      this.viewer.scene.layers.find("BuKongQiu2@SYS003").visible = false;
      this.viewer.scene.layers.find("YiQi1@SYS003").visible = false;
      this.viewer.scene.layers.find("ThirdFloor@SYS003").visible = false;
      this.viewer.scene.layers.find("YiQi@SYS003").visible = false;
      this.viewer.scene.layers.find("Environmental3F@SYS003").visible = false;
      this.viewer.scene.layers.find("Light3F@SYS003").visible = false;
      this.viewer.scene.layers.find("WLM3F@SYS003").visible = false;

      // 全景
      this.viewer.scene.layers.find("LouDing@SYS003").visible = false;

      this.viewer.dataSources.add(this.polylineLayer);
      this.viewer.dataSources.add(this.billboardLayer2);
      supermapJs.removeByLayer('billboardLayer', this.viewer);
      this.addBoxPrimitive(true)

    },
    changeFloor3() {
      this.sceneStatus = 3
      this.viewer.scene.layers.find("qiping@SYS003").visible = true;
      this.viewer.scene.layers.find("qipingshi@SYS003").visible = true;
      this.viewer.scene.layers.find("FirstFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Camera1F@SYS003").visible = true;

      // 二楼
      this.viewer.scene.layers.find("BuKongQiu1@SYS003").visible = true;
      this.viewer.scene.layers.find("SecondFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental2F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light2F@SYS003").visible = true;
      this.viewer.scene.layers.find("SecondFloorWLM@SYS003").visible = true;

      // 三楼
      this.viewer.scene.layers.find("BuKongQiu2@SYS003").visible = true;
      this.viewer.scene.layers.find("YiQi1@SYS003").visible = true;
      this.viewer.scene.layers.find("ThirdFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("YiQi@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental3F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light3F@SYS003").visible = true;
      this.viewer.scene.layers.find("WLM3F@SYS003").visible = true;

      // 全景
      this.viewer.scene.layers.find("LouDing@SYS003").visible = false;

      supermapJs.removeByLayer('polylineLayer', this.viewer);
      supermapJs.removeByLayer('billboardLayer', this.viewer);
      supermapJs.removeByLayer('billboardLayer2', this.viewer);
      this.addBoxPrimitive(false)

    },
    changeFloor4() {
      this.sceneStatus = 0;
      this.viewer.scene.layers.find("qiping@SYS003").visible = true;
      this.viewer.scene.layers.find("qipingshi@SYS003").visible = true;
      this.viewer.scene.layers.find("FirstFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light1F@SYS003").visible = true;
      this.viewer.scene.layers.find("Camera1F@SYS003").visible = true;

      // 二楼
      this.viewer.scene.layers.find("BuKongQiu1@SYS003").visible = true;
      this.viewer.scene.layers.find("SecondFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental2F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light2F@SYS003").visible = true;
      this.viewer.scene.layers.find("SecondFloorWLM@SYS003").visible = true;

      // 三楼
      this.viewer.scene.layers.find("BuKongQiu2@SYS003").visible = true;
      this.viewer.scene.layers.find("YiQi1@SYS003").visible = true;
      this.viewer.scene.layers.find("ThirdFloor@SYS003").visible = true;
      this.viewer.scene.layers.find("YiQi@SYS003").visible = true;
      this.viewer.scene.layers.find("Environmental3F@SYS003").visible = true;
      this.viewer.scene.layers.find("Light3F@SYS003").visible = true;
      this.viewer.scene.layers.find("WLM3F@SYS003").visible = true;

      // 全景
      this.viewer.scene.layers.find("LouDing@SYS003").visible = true;

      supermapJs.removeByLayer('polylineLayer', this.viewer);
      supermapJs.removeByLayer('billboardLayer', this.viewer);
      supermapJs.removeByLayer('billboardLayer2', this.viewer);
      this.addBoxPrimitive(false)
      this.viewer.dataSources.add(this.billboardLayer);
    },

    initFloor2(){
      this.billboardLayer2.entities.removeAll();
      for(let i=0;i<this.floorTwoName.length;i++){
          this.addBillboardForColor(this.billboardLayer2,parseFloat(this.floorTwoName[i].jd),parseFloat(this.floorTwoName[i].wd),18,this.floorTwoName[i].name);
      }
    },
    addPointInfoWindow(layer,billboardUrl, x, y, height) {
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        billboard: new Cesium.BillboardGraphics({
          image: billboardUrl
        }),
        polyline: new Cesium.PolylineGraphics({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([x, y, 5, x, y, height]),
          width:1.0,
          material: new Cesium.PolylineDashMaterialProperty({
            image:"./label/line2.png"
          })
        })
      })
      layer.entities.add({
        position:Cesium.Cartesian3.fromDegrees(x, y, 5),
        billboard: new Cesium.BillboardGraphics({
          image: "./label/00.png",
        }),
        point:new Cesium.PointGraphics({
          color:Cesium.Color.fromCssColorString("#00fbff"),
          pixelSize:2,
          outlineColor:Cesium.Color.fromCssColorString("#00fbff"),
          outlineWidth:1
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
    addBoxPrimitive(status){
      if(status){
        this.boxP1=supermapJs.addBoxPrimitive(self.viewer, 120.337847, 31.459146, 9, 0.8, 0.5, 7, new Cesium.Cartesian3(0.5, 0.5, 0.0), Cesium.Math.toRadians(46))
        this.boxP2=supermapJs.addBoxPrimitive(self.viewer, 120.337843, 31.459136, 11.5, 2.8, 0.4, 0.3, new Cesium.Cartesian3(1.0, 1.2, 0.0), Cesium.Math.toRadians(46.5))
        this.boxP3=supermapJs.addBoxPrimitive(self.viewer, 120.337839, 31.459121, 11.5, 5.2, 0.4, 0.3, new Cesium.Cartesian3(0.3, 0.3, 0.0), Cesium.Math.toRadians(136.5))
        this.boxP4=supermapJs.addBoxPrimitive(self.viewer, 120.337860, 31.459078, 11.5, 7.6, 0.4, 0.3, new Cesium.Cartesian3(-0.7, 0.5, 0.0), Cesium.Math.toRadians(47.5))
        this.boxP5=supermapJs.addBoxPrimitive(self.viewer, 120.337865354178, 31.459072849147, 11.5, 8.2, 0.4, 0.3, new Cesium.Cartesian3(0.3, 0.3, 0.0), Cesium.Math.toRadians(138))
        this.boxP6=supermapJs.addBoxPrimitive(self.viewer, 120.337879623341, 31.4590591473081, 11.5, 8.2, 0.4, 0.3, new Cesium.Cartesian3(0.3, 0.3, 0.0), Cesium.Math.toRadians(138))
        this.viewer.scene.primitives.add(this.boxP1);
        this.viewer.scene.primitives.add(this.boxP2);
        this.viewer.scene.primitives.add(this.boxP3);
        this.viewer.scene.primitives.add(this.boxP4);
        this.viewer.scene.primitives.add(this.boxP5);
        this.viewer.scene.primitives.add(this.boxP6);
      }else{
        if(this.boxP1!==null){
          this.viewer.scene.primitives.remove(this.boxP1);
          this.viewer.scene.primitives.remove(this.boxP2);
          this.viewer.scene.primitives.remove(this.boxP3);
          this.viewer.scene.primitives.remove(this.boxP4);
          this.viewer.scene.primitives.remove(this.boxP5);
          this.viewer.scene.primitives.remove(this.boxP6);
        }
      }
    },

    addBillboardForColor(layer,x,y,height,name){
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        label: new Cesium.LabelGraphics({
          font:'8px sans-serif',
          text:name,
          showBackground:true,
          backgroundColor:Cesium.Color.fromCssColorString("#1a7bdc")
        }),
        polyline: new Cesium.PolylineGraphics({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([x, y, 5, x, y, height]),
          width:1.0,
          material: new Cesium.PolylineDashMaterialProperty({
            image:"./label/line2.png"
          })
        })
      })
      layer.entities.add({
        position:Cesium.Cartesian3.fromDegrees(x, y, 5),
        billboard: new Cesium.BillboardGraphics({
          image: "./label/00.png",
        }),
        point:new Cesium.PointGraphics({
          color:Cesium.Color.fromCssColorString("#00fbff"),
          pixelSize:2,
          outlineColor:Cesium.Color.fromCssColorString("#00fbff"),
          outlineWidth:1
        })
      })

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

</style>
