<template>
  <div style='margin: 0;padding: 0;width: 100%;height: 100%;'>
    <div id='map'></div>
    <PopupInfo />
    <PersonInfo />
  </div>
</template>

<script>
import supermapJs from '@/mapJs/supermapJs'
import addFlyCzml from '@/mapJs/czmlJs'
import { EventBus } from '@/mapJs/EventBus'
import { PopupBus } from '@/mapJs/PopupBus'
import PopupInfo from '@/views/popupInfo'
import PersonInfo from '@/views/personInfo'
import storage from 'store'
let serverHttp=process.env.VUE_APP_GIS


let imageryProvider= new Cesium.SuperMapImageryProvider({
  url: serverHttp+'/iserver/services/map-tianditu/rest/maps/影像底图_经纬度',
  maximumLevel: 17
});
let vecProvider=new Cesium.SuperMapImageryProvider({
  url: serverHttp+'/iserver/services/map-tianditu/rest/maps/矢量底图_经纬度',
  maximumLevel: 17
})

let meiyanqiaoLayer=new Cesium.UrlTemplateImageryProvider({
  url:"http://10.8.45.60:8888/4/{z}/{x}/{y}.png"
})

let viewer=null;
let handler=null;
let datasourceEntity =null,entityFly1=null,entityFly2=null;



export default {
  name: 'index',
  components: { PopupInfo, PersonInfo },
  data() {
    return {
      serverUrl: serverHttp+'/iserver/services/3D-taipuzha/rest/realspace',
      // serverUrl:"http://61.160.81.178:25534/iserver/services/3D-taipu_sw-3/rest/realspace",
      serverUrlConfig: serverHttp+'http://{s}/iserver/services/3D-taipuzha/rest/realspace/datas/Config/config',
      serverUrlLiangXI: serverHttp+'/iserver/services/3D-liangxi/rest/realspace/datas/Combine/config',
      sceneIndex: true,
      toolLine: null,
      toolPolygon: null,
      clampMode: 0,
      handlerDis: null,
      handlerArea: null,
      layerIndex: false,
      imgIndex: 0,
      baseMapLayer: null,
      pointStatus: false,
      webServer: process.env.VUE_APP_BASE_API2,
      pointPosition: null,
      infoType: null,
      flyPoints:[],
      indexFly:false,
      czmlTimeIndex:0,
      czmlTimeIndex2:0,
      arrFly1:[],
      arrFly2:[]
    }
  },
  beforeDestroy(){
    viewer.dataSources.destroy()
    viewer.destroy();
    handler.destroy();

  },
  mounted() {
    viewer = supermapJs.initMap2('map')
    this.baseMapLayer =viewer.imageryLayers.addImageryProvider(imageryProvider)
    this.handlerDis = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance, this.clampMode)
    let self = this
    self.handlerDis.measureEvt.addEventListener(function(result) {
      let dis = Number(result.distance)
      let distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm'
      self.handlerDis.disLabel.text = '距离:' + distance
    })
    self.handlerDis.activeEvt.addEventListener(function(isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        $('.cesium-widget').css('cursor', 'crosshair')

      } else {
        viewer.enableCursorStyle = true
        $('.cesium-widget').css('cursor', 'pointer')
        viewer.scene.pickPointEnabled = false
      }
    });
    viewer.scene.imageryLayers.addImageryProvider(meiyanqiaoLayer);


    datasourceEntity = new Cesium.CustomDataSource("datasourceEntity");
    viewer.dataSources.add(datasourceEntity)


    //初始化测量面积
    self.handlerArea = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, self.clampMode)
    self.handlerArea.measureEvt.addEventListener(function(result) {
      let mj = Number(result.area)
      let area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡'
      self.handlerArea.areaLabel.text = '面积:' + area
    })
    self.handlerArea.activeEvt.addEventListener(function(isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        $('.cesium-widget').css('cursor', 'crosshair')
      } else {
        viewer.enableCursorStyle = true
        $('.cesium-widget').css('cursor', 'pointer')
        viewer.scene.pickPointEnabled = false
      }
    })

    viewer.clock.multiplier = 200//速度
    viewer.clock.shouldAnimate = true
    let previousTime = viewer.clock.currentTime.secondsOfDay

    function onTickCallback() {
      let spinRate = 1
      let currentTime = viewer.clock.currentTime.secondsOfDay
      let delta = (currentTime - previousTime) / 1000
      previousTime = currentTime
      viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta)
    }

    viewer.clock.onTick.addEventListener(onTickCallback)
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function(click) {
      if (self.sceneIndex) {
        self.sceneIndex = false
        viewer.clock.onTick.removeEventListener(onTickCallback)
        viewer.scene.addS3MTilesLayerByScp("http://10.8.45.60:8090/iserver/services/3D-taipuzha/rest/realspace/datas/Config/config",
          {
            name:"taipuzha",
            subdomainConfig: {
              urlScheme: `http://{s}/iserver/services/3D-taipuzha/rest/realspace`,
              subdomains:['10.8.45.60:8081','10.8.45.60:8082','10.8.45.60:8083','10.8.45.60:8090']
            }
          }
          )
        viewer.scene.addS3MTilesLayerByScp('http://10.8.45.60:8090/iserver/services/3D-liangxi-2/rest/realspace/datas/Combine/config',{
          name:'liangxi',
          subdomainConfig: {
            urlScheme: `http://{s}/iserver/services/3D-liangxi-2/rest/realspace`,
            subdomains:['10.8.45.60:8081','10.8.45.60:8082','10.8.45.60:8083','10.8.45.60:8090']
          }
        })


        let waterPromise2 = viewer.scene.open('http://10.8.45.60:8090/iserver/services/3D-test0820-2/rest/realspace')
        Cesium.when(waterPromise2, function(layer2) {
          layer2.style3D.bottomAltitude = 10
        })


        // 实验室
        let shiyanPromise =viewer.scene.addS3MTilesLayerByScp("http://10.8.45.60:8090/iserver/services/3D-shuiwen/rest/realspace/datas/Combine/config",
          {
            name:'qingxie',
            subdomainConfig: {
              urlScheme: `http://{s}/iserver/services/3D-shuiwen/rest/realspace`,
              subdomains:['10.8.45.60:8081','10.8.45.60:8082','10.8.45.60:8083','10.8.45.60:8090']
            }
          }
        );
        shiyanPromise.then(function(layer) {
          layer.style3D.bottomAltitude =-17.7;
          layer.indexedDBSetting.isGeoTilesRootNodeSave = true;
          layer._maxSkipNum =256;
          layer.LoadingPriority= Cesium.LoadingPriorityMode.UsePagedLodInfo;
          layer.residentRootTile = true
        })


        let liangxiPromise =viewer.scene.addS3MTilesLayerByScp("http://10.8.45.60:8090/iserver/services/3D-liangxi-2/rest/realspace/datas/Combine/config",
          {
            name:'liangxi2',
            subdomainConfig: {
              urlScheme: `http://10.8.45.60:8090/iserver/services/3D-liangxi-2/rest/realspace`,
              subdomains:['10.8.45.60:8081','10.8.45.60:8082','10.8.45.60:8083','10.8.45.60:8090']
            }
          }
        );
        liangxiPromise.then(function(layer) {
          layer.style3D.bottomAltitude =0;
          layer.indexedDBSetting.isGeoTilesRootNodeSave = true;
          layer.LoadingPriority= Cesium.LoadingPriorityMode.UsePagedLodInfo;
          layer.residentRootTile = true
        })

        viewer.scene.open('http://10.8.45.60:8090/iserver/services/3D-1130/rest/realspace','111111',{
          autoSetView : false
        })


        // let waterPromise = viewer.scene.open(serverHttp+'/iserver/services/3D-ShuiYu-tapuzhawater/rest/realspace')
        // Cesium.when(waterPromise, function() {
        //   let layer = viewer.scene.layers.find('水域@tapuzhawater')
        //   layer.style3D.bottomAltitude = 0.6
        // })
        setTimeout(function() {
          viewer.scene.camera.flyTo({
            destination: { x: -2802913.020835352, y: 4796501.279401955, z: 3361957.9684657883},
            orientation: {
              heading: 6.2443872205,
              pitch: -1.52001639240,
              roll: 6.283185307134687
            }
          })
        }, 1200)
      } else {
        if (self.pointStatus) {
          let cartesitan2 = new Cesium.Cartesian2(click.position.x, click.position.y)
          let jdAndWd = supermapJs.windowToWGS84(cartesitan2, viewer)
          console.log('返回当前的位置:')
          console.log(jdAndWd)
        }
      }
      let pick = viewer.scene.pick(click.position)
      if (typeof (pick) !== 'undefined' && typeof (pick.id) !== 'undefined') {
        let entityId = null, data = {}
        self.infoType = pick.id._name
        switch (pick.id._name) {
          case 'event':
            self.pointPosition = pick.id._position._value
            entityId = pick.id._id
            PopupBus.$emit('infoVue', entityId)
            break
          case 'person':
            self.pointPosition = pick.id._position._value
            entityId = pick.id._id
            PopupBus.$emit('personValue', entityId)
            break
          case 'ship':
            self.pointPosition = pick.id._position._value
            entityId = pick.id._id
            PopupBus.$emit('shipValue', entityId)
            break
          case 'uav':
            data.name = pick.id._name
            data.type = 'right'
            data.id = pick.id._id
            self.$emit('mouseChange', JSON.stringify(data))
            break
          case 'car':
            self.pointPosition = pick.id._position._value
            entityId = pick.id._id
            PopupBus.$emit('carValue', entityId)
            break
          case 'camera_gd':
            data.id = pick.id._id
            data.type = 'right'
            data.name = pick.id._name
            self.$emit('mouseChange', JSON.stringify(data))
            break
          case 'camera_ls':
            console.log(pick.id)
            data.id = pick.id._id
            data.type = 'right'
            data.name = pick.id._name
            self.$emit('mouseChange', JSON.stringify(data))
            break
          case 'headquarters':
            data.name = pick.id._name
            data.type = 'right'
            data.id = pick.id._id
            self.$emit('mouseChange', JSON.stringify(data))
            break
          case 'monitor':
            data.name = pick.id._name
            data.type = 'right'
            data.id = pick.id._id
            self.$emit('mouseChange', JSON.stringify(data))
            break
          case 'section':
            data.name = pick.id._name
            data.type = 'right'
            data.id = pick.id._id
            self.$emit('mouseChange', JSON.stringify(data))
            break
          case 'mark':
            data.name = pick.id._name
            data.type = 'right'
            data.id = pick.id._id
            self.$emit('mouseChange', JSON.stringify(data))
            break
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


    viewer.scene.postRender.addEventListener(function() {
      if (self.pointPosition !== null) {
        const windowPosition = new Cesium.Cartesian2()
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, self.pointPosition, windowPosition)
        if (self.infoType === 'event') {
          PopupBus.$emit('popup', windowPosition)

        } else if (self.infoType === 'person') {
          PopupBus.$emit('person', windowPosition)

        } else if (self.infoType === 'ship') {
          PopupBus.$emit('person', windowPosition)
        } else if (self.infoType === 'car') {
          PopupBus.$emit('person', windowPosition)
        }
      }
    })

    handler.setInputAction(function(rightClick) {
      $('.cesium-widget').css('cursor', 'pointer')
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    $('#imgLayer').click(function() {
      if (self.layerIndex) {
        $('#layerIcon').hide(500)
        self.layerIndex = false
      } else {
        $('#layerIcon').show(500)
        self.layerIndex = true
      }
    })


    // 工具
    EventBus.$on('tool', function(val) {
      switch (val) {
        case 1:
          self.drawLine()
          break
        case 2:
          self.drawPolygon()
          break
        case 3:
          self.clearAll()
          break
      }
    })

    EventBus.$on('baseMap', function(val) {
      switch (val) {
        case 1:
          if (self.imgIndex !== 1) {
            viewer.imageryLayers.remove(self.baseMapLayer)
            self.baseMapLayer = viewer.imageryLayers.addImageryProvider(vecProvider)
            self.imgIndex = 0
          }
          break
        case 2:
          let layer = viewer.scene.layers.find('config')
          layer.visible = false
          break
        case 3:
          let layer2 = viewer.scene.layers.find('config')
          layer2.visible = true
          break
        case 4:
          if (self.imgIndex !== 1) {
            viewer.imageryLayers.remove(self.baseMapLayer)
            self.baseMapLayer = viewer.imageryLayers.addImageryProvider(imageryProvider)
            viewer.scene.imageryLayers.addImageryProvider(meiyanqiaoLayer);
            self.imgIndex = 0
          }
          break;
      }
    })

    PopupBus.$on('closeInfo', function() {
      self.pointPosition = null
    })


    EventBus.$on("websocket",function(obj) {
      console.log("返回的数据......")
      console.log(obj)
      switch (obj.id) {
        case '1367368058385186817':
          if(self.czmlTimeIndex===0){
            self.arrFly1.push(parseFloat(obj.longitude),parseFloat(obj.latitude),80)
            entityFly1 =datasourceEntity.entities.add({
              id:'1554289577643978754',
              name:'camera_gd',
              position: Cesium.Cartesian3.fromDegrees(parseFloat(obj.longitude),parseFloat(obj.latitude),80),
              model:{
                uri:'../gldb/CesiumDrone.glb',
                minimumPixelSize: 64,
                maximumScale: 128,
              },
              polyline:{
                positions:Cesium.Cartesian3.fromDegreesArrayHeights(self.arrFly1),
                material: new Cesium.PolylineGlowMaterialProperty({
                  color: Cesium.Color.GREEN
                }),
                width: 5
              }
            })
            self.czmlTimeIndex=1
          }else{
            entityFly1.position=Cesium.Cartesian3.fromDegrees(parseFloat(obj.longitude),parseFloat(obj.latitude),80);
            self.arrFly1.push(parseFloat(obj.longitude),parseFloat(obj.latitude),80)
            entityFly1.polyline.positions= Cesium.Cartesian3.fromDegreesArrayHeights(self.arrFly1);
          }
          break;
        case '1554348534286757890':
          if(self.czmlTimeIndex2===0) {
            self.arrFly2.push(parseFloat(obj.longitude),parseFloat(obj.latitude),80)
            entityFly2 =datasourceEntity.entities.add({
              id:'1535183442223779842',
              name:'camera_gd',
              position: Cesium.Cartesian3.fromDegrees(parseFloat(obj.longitude),parseFloat(obj.latitude),80),
              model:{
                uri:'../gldb/CesiumDrone.glb',
                minimumPixelSize: 64,
                maximumScale: 128,
              },
              polyline:{
                positions:Cesium.Cartesian3.fromDegreesArrayHeights(self.arrFly2),
                material: new Cesium.PolylineGlowMaterialProperty({
                  color: Cesium.Color.BLUE
                }),
                width: 5
              }
            })
            self.czmlTimeIndex2=1
          }else{
            entityFly2.position=Cesium.Cartesian3.fromDegrees(parseFloat(obj.longitude),parseFloat(obj.latitude),80);
            self.arrFly2.push(parseFloat(obj.longitude),parseFloat(obj.latitude),80)
            entityFly2.polyline.positions= Cesium.Cartesian3.fromDegreesArrayHeights(self.arrFly2);
          }
          break;
        default:
          break;
      }

    });



  },
  methods:{
    updateLocation(data){
      let height = 100;
      if(this.flyPoints.length===0){
        viewer.entities.add({
          id:"fly12345",
          name:"uav",
          position: Cesium.Cartesian3.fromDegrees(parseFloat(data[0].longitude),parseFloat(data[1].latitude),height),
          billboard:{
            image:'../image/scene001/icon_air_b.png',
            width:30,
            height:40,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
          }
        });
        let index =1;
        let self = this
        let s = setInterval(function() {
          if(index<data.length){
            self.flyPoints.push(parseFloat(data[index].longitude));
            self.flyPoints.push(parseFloat(data[index].latitude));
            self.flyPoints.push(height);
            viewer.entities.add({
              polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(self.flyPoints),
                width:5,
                material: Cesium.Color.GREEN
              }
            })
            viewer.entities.getById("fly12345").position=Cesium.Cartesian3.fromDegrees(parseFloat(data[index].longitude),parseFloat(data[index].latitude),height);
          }else{
            window.clearInterval(s)
          }
          index=index+1;
        },1500)
      }else{
        let index =0;
        let self = this
        let s2 = setInterval(function() {
          console.log(index)
          console.log(data.length)
          if(index<data.length){
            self.flyPoints.push(parseFloat(data[index].longitude));
            self.flyPoints.push(parseFloat(data[index].latitude));
            self.flyPoints.push(height);
            viewer.entities.add({
              polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(self.flyPoints),
                width:5,
                material: Cesium.Color.GREEN
              }
            })
            viewer.entities.getById("fly12345").position=Cesium.Cartesian3.fromDegrees(parseFloat(data[index].longitude),parseFloat(data[index].latitude),height);
          }else{
            window.clearInterval(s2)
          }
          index=index+1;
        },1500)
      }
    },

    /**
     * 时间格式处理
     */
    spliteDate(strDate){
      let dateArr = strDate.split(' ');
      return dateArr[0]+'T'+dateArr[1]+'Z';
    },

    getSecond(startPosition, endPosition, speed) {
      let geodesic = new Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(startPosition, endPosition)
      let dis = geodesic.surfaceDistance
      let distance = (dis / 1000).toFixed(2)
      let second = Number((distance / speed) * 3600*1.3)
      return second
    },

    addFlyLine(obj){
      let height=150;
      if(this.flyPoints.length===0){
        this.indexFly=true;
        viewer.entities.add({
          id:"fly12345",
          name:"uav",
          position: Cesium.Cartesian3.fromDegrees(parseFloat(obj.jd),parseFloat(obj.wd),height),
          billboard:{
            image:'../image/scene001/icon_air_b.png',
            width:30,
            height:40,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
          }
        });
        this.flyPoints.push(parseFloat(obj.jd));
        this.flyPoints.push(parseFloat(obj.wd));
        this.flyPoints.push(height);
      }else{
        this.flyPoints.push(parseFloat(obj.jd));
        this.flyPoints.push(parseFloat(obj.wd));
        this.flyPoints.push(height);
        let self = this
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(self.flyPoints),
            width:5,
            material: Cesium.Color.GREEN
          }
        })
        viewer.entities.getById("fly12345").position=Cesium.Cartesian3.fromDegrees(parseFloat(obj.jd),parseFloat(obj.wd),height);
      }
    },

    wallRegularDiffuse(options) {
      let _viewer = options.viewer;
      let _center = options.center;
      // 扩散半径半径
      let _radius = options.radius || 1000.0;
      let _edge = options.edge || 64;
      let _speed = options.speed || 5.0;
      let _height = options.height || 10.0;
      // 实时高度
      let _currentHeight = _height;
      // 最小半径
      let _minRadius = options.minRadius || 10;
      // 实时半径
      let _currentRadius = _minRadius;

      if (_edge < 3) {
        return false;
      }

      function _getPositions(_center, _edge, _currentRadius, _currentHeight) {
        let positions = [];
        let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(_center[0], _center[1], 0)
        );
        for (let i = 0; i < _edge; i++) {
          let angle = (i / _edge) * Cesium.Math.TWO_PI;
          let x = Math.cos(angle);
          let y = Math.sin(angle);
          let point = new Cesium.Cartesian3(
            x * _currentRadius,
            y * _currentRadius,
            _currentHeight
          )
          positions.push(Cesium.Matrix4.multiplyByPoint(modelMatrix, point, new Cesium.Cartesian3()));
        }
        positions.push(positions[0]);
        return positions;
      }

      // 添加多边形
      _viewer.entities.add({
        polygon:{
          hierarchy: new Cesium.CallbackProperty(() => {
            let positions = [];
            _currentRadius += _radius * _speed / 100000.0;
            if (_currentRadius > _radius || _currentHeight < 0) {
              positions = _getPositions(_center, _edge, _radius, 2);
            }else{
              positions = _getPositions(_center, _edge, _currentRadius, 2);
            }

            return positions;
          }, false),
          material: Cesium.Color.fromCssColorString("#469de7").withAlpha(0.7)
        },
        wall: {
          positions: new Cesium.CallbackProperty(() => {
            let positions = [];
            _currentRadius += _radius * _speed / 100000.0;
            if (_currentRadius > _radius || _currentHeight < 0) {
              positions = _getPositions(_center, _edge, _radius, 2);
            }else{
              positions = _getPositions(_center, _edge, _currentRadius, 2);
            }

            return positions;
          }, false),
        }
      })
    },
    changeLayerStatus(data) {
      let self = this
      let jsonData = JSON.parse(data)
      if (jsonData.status === '1' || jsonData.status === 1) {
        self.ajaxRemoveDataEntity(jsonData.sysLayerId, jsonData.yjylCommandMissionId)
      } else {
        self.ajaxGetData(jsonData.sysLayerId, jsonData.yjylCommandMissionId)
      }
    },
    ajaxRemoveDataEntity(ids, taskId) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/system/layer/listPoint/' + ids,
        data: {
          missionId: taskId
        },
        dataType: 'json',
        success: function(res) {
          if (res.code === '200' || res.code === 200) {
            if (res.data.length > 0) {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].layerType === 'event') {
                  self.removeEntityByIds(res.data[i].id)
                  self.removeEntityByIds(res.data[i].id + 'cir')
                } else if (res.data[i].layerType === 'uav') {
                  self.removeEntityByIds(res.data[i].id)
                  self.removeEntityByIds(res.data[i].id + 'light')
                } else {
                  self.removeEntityByIds(res.data[i].id)
                }
              }
            }
          }
        },
        err: function() {
        }
      })
    },

    // 消息提示
    openMessage() {
      this.$message({
        message: '删除成功!',
        type: 'success'
      })
    },
    // 添加点位
    addPoint() {
      console.log('选择了类型')
      this.pointStatus = true
      $('.cesium-widget').css('cursor', 'crosshair')

    },

    editEntity(data) {
      let self = this
      switch (data.type) {
        case 'camera_ls':
          self.updateCameraLs(data)
          break
        case 'headquarters':
          self.editHeadquarters(data)
          break
        case 'anchor':
          self.editLocationXY(data)
          break
        case 'event':
          self.editEventInfo(data)
          break
        case 'mark':
          self.editMark(data)
          break
      }
    },
    editMark(data) {
      console.log(data)
      let self = this
      self.updateMarkInfo(data)
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        type: 'post',
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        url: self.webServer + '/api/yjyl/sceneMark/edit',
        data: JSON.stringify({
          'id': data.id,
          'latitude': data.latitude,
          'longitude': data.longitude,
          'markDescribe': data.markDescribe,
          'markId': data.markId,
          'sceneId': data.missionId
        }),
        dataType: 'json',
        success: function(res) {
          console.log(res)
        },
        err: function() {
        }
      })
    },
    updateMarkInfo(data) {
      let entity = viewer.entities.getById(data.id)
      entity.label.text = data.markDescribe
      entity.position = Cesium.Cartesian3.fromDegrees(parseFloat(data.longitude), parseFloat(data.layerType), 12)
      if (data.markId === '1' || data.markId === 1) {
        entity.billboard.image._value = '../image/scene001/school.png'
      } else if (data.markId === '2' || data.markId === 2) {
        entity.billboard.image._value = '../image/scene001/nongtian.png'
      } else {
        entity.billboard.image._value = '../image/scene001/mark.png'
      }
      viewer.render()

    },
    editEventInfo(data) {
      let self = this
      self.updateEventInfo(data.id, data.infoName)
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/missionInfo/edit',
        data: JSON.stringify({
          'delFlag': data.delFlag,
          'eventLevel': data.eventLevel,
          'eventPic': data.eventPic,
          'eventType': data.eventType,
          'gmtCreate': data.gmtCreate,
          'gmtCreateUser': data.gmtCreateUser,
          'gmtModified': data.gmtModified,
          'gmtModifiedUser': data.gmtModifiedUser,
          'id': data.id,
          'infoContent': data.infoContent,
          'infoName': data.infoName,
          'infoTime': data.infoTime,
          'latitude': data.latitude,
          'longitude': data.longitude,
          'missionId': data.missionId
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log('修改成功....修改事件信息成功')
          }
        },
        err: function() {
        }
      })
    },
    updateEventInfo(id, name) {
      if (id !== null && id !== '') {
        let entity = viewer.entities.getById(id)
        entity.label.text = name
        viewer.render()
      }
    },
    editLocationXY(data) {
      let self = this
      console.log(self.$route.params.id)
      self.updateEntityInfo(data.id, data.pointName, '')
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/anchorPoint/edit',
        data: JSON.stringify({
          'delFlag': data.delFlag,
          'gmtCreate': data.gmtCreate,
          'gmtCreateUser': data.gmtCreateUser,
          'gmtModified': data.gmtModified,
          'gmtModifiedUser': data.gmtModifiedUser,
          'id': data.id,
          'latitude': data.latitude,
          'longitude': data.longitude,
          'missionId': self.$route.params.id,
          'pointContent': data.pointContent,
          'pointName': data.pointName,
          'height': 0
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log('更新ok')
          }
        },
        err: function() {
        }
      })
    },
    updateCameraLs(data) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/sceneCameraLs/edit',
        data: JSON.stringify({
          'cameraCode': data.cameraCode,
          'cameraName': data.cameraName,
          'gmtCreate': data.gmtCreate,
          'gmtCreateUser': data.gmtCreateUser,
          'gmtModified': data.gmtModified,
          'gmtModifiedUser': data.gmtModifiedUser,
          'id': data.id,
          'latitude': data.latitude,
          'longitude': data.longitude,
          'sceneId': data.sceneId
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            self.updateEntityInfo(data.id, data.cameraName, data.cameraCode)
          }
        },
        err: function() {
        }
      })
    },
    editHeadquarters(data) {
      this.updateEntityInfo(data.id, data.headName, data.headContent)
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/headquarters/edit',
        data: JSON.stringify({
          'delFlag': data.delFlag,
          'gmtCreate': data.gmtCreate,
          'gmtCreateUser': data.gmtCreateUser,
          'gmtModified': data.gmtModified,
          'gmtModifiedUser': data.gmtModifiedUser,
          'headContent': data.headContent,
          'headName': data.headName,
          'id': data.id,
          'latitude': data.latitude,
          'longitude': data.longitude,
          'missionId': data.missionId
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log('修改成功....修改临时指挥部')
          }
        },
        err: function() {
        }
      })
    },

    updateEntityInfo(id, name, description) {
      let self = this
      if (id !== null && id !== '') {
        let entity = viewer.entities.getById(id)
        entity.label.text = name
        entity.description = description
        entity.label.pixelOffset = new Cesium.Cartesian2(-(name.length) * 10, -80)
        viewer.render()
      }
    },
    // 测距
    drawLine() {
      this.deactiveAll()
      this.handlerDis && this.handlerDis.activate()
    },
    // 测面
    drawPolygon() {
      this.deactiveAll()
      this.handlerArea && this.handlerArea.activate()

    },
    // 清除
    clearAll() {
      this.deactiveAll()
      this.handlerDis && this.handlerDis.clear()
      this.handlerArea && this.handlerArea.clear()
    },
    // 取消激活
    deactiveAll() {
      this.handlerDis && this.handlerDis.deactivate()
      this.handlerArea && this.handlerArea.deactivate()
    },

    /**
     * 飞行定位
     * @param jd
     * @param wd
     */
    flyTo(obj) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(parseFloat(obj.longitude), parseFloat(obj.latitude), 6800),

      })
    },
    // 坐标转换
    windowToWGS84(x, y) {
      let cartesian2 = new Cesium.Cartesian2(x, y)
      return supermapJs.windowToWGS84(cartesian2,viewer)
    },
    // 数据接口对接
    /**
     * 添加标注
     * @param obj
     * @param jd
     * @param wd
     * @param sceneId
     * @param typeName
     * @param iconUrl
     * @param waringName
     * @param markId
     */
    addMark(obj, jd, wd, sceneId, typeName, iconUrl, waringName, markId) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        type: 'post',
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        url: self.webServer + '/api/yjyl/sceneMark/add',
        data: JSON.stringify({
          'latitude': wd,
          'longitude': jd,
          'markDescribe': waringName,
          'markId': markId,
          'sceneId': sceneId,
          'height': 0
        }),
        dataType: 'json',
        success: function(res) {
          console.log(res)
          supermapJs.addMarkPoint(res.data, parseFloat(jd), parseFloat(wd), typeName, iconUrl, 12, waringName,viewer)
        },
        err: function() {
        }
      })
    },
    /**
     * 初始化场景数据
     *@param missionId
     */
    initSceneGetData2(missionId) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        type: 'get',
        headers: {
          'access_token': tokenValue
        },
        url: self.webServer + '/api/system/layer/list?pageNum=1&limit=100',
        dataType: 'json',
        success: function(res) {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            if (res.data.rows.length > 0) {
              let ids = ''
              for (let i = 0; i < res.data.rows.length; i++) {
                if (i !== res.data.rows.length - 1) {
                  ids += res.data.rows[i].sysLayerId + ','
                } else {
                  ids += res.data.rows[i].sysLayerId
                }
              }
              setTimeout(function() {
                self.ajaxGetData2(ids, missionId)
              }, 4000)
            }
          }
        },
        err: function() {
        }
      })
    },
    deleteHeadquarters(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        type: 'get',
        headers: {
          'access_token': tokenValue
        },
        url: self.webServer + '/api/yjyl/headquarters/delete/' + id,
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log('删除删除临时指挥部')
            self.openMessage()
          }
        },
        err: function() {
        }
      })
    },
    ajaxGetData2(ids, taskId) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue||''
        },
        type: 'get',
        url: self.webServer + '/api/system/layer/listPoint/' + ids,
        data: {
          missionId: taskId
        },
        dataType: 'json',
        success: function(res) {
          console.log(res)
          if (res.code === '200' || res.code === 200) {
            if (res.data.length > 0) {
              for (let i = 0; i < res.data.length; i++) {
                let pointFileObj = self.returnColorAndImgUrl(res.data[i].layerType)
                if (res.data[i].latitude !== '' && res.data[i].longitude !== '' && res.data[i].latitude !== '0.0' && res.data[i].id !== null && res.data[i].longitude !== 'null' && res.data[i].latitude !== null && res.data[i].longitude !== null) {
                  if (res.data[i].layerType === 'event') {
                    supermapJs.addTwoCircleToMap(res.data[i].id, parseFloat(res.data[i].longitude), parseFloat(res.data[i].latitude),
                      15, 50, 60, '../image/scene001/circle.png', res.data[i].layerType, '../image/scene001/waring1.png', res.data[i].pointName,viewer)
                  } else if (res.data[i].layerType === 'uav') {
                    // supermapJs.addFlyModel(res.data[i].id, '../gltf/fly.gltf', 'uav', parseFloat(res.data[i].longitude), parseFloat(res.data[i].latitude), 150,viewer)
                  } else if (res.data[i].layerType === 'car') {
                    supermapJs.addBillboardGraphicsGroup(res.data[i].id, res.data[i].layerType, parseFloat(res.data[i].longitude),
                      parseFloat(res.data[i].latitude), 15, pointFileObj.icon, res.data[i].pointName, -(res.data[i].pointName.length) * 5, pointFileObj.color,viewer)
                  } else if (res.data[i].layerType === 'mark') {
                    const tokenValue = window.sessionStorage.getItem('Access-Token')
                    $.ajax({
                      headers: {
                        'access_token': tokenValue
                      },
                      type: 'get',
                      url: self.webServer + '/api/yjyl/sceneMark/' + res.data[i].id,
                      data: {},
                      dataType: 'json',
                      success: function(res) {
                        if (res.code === 200 || res.code === '200') {
                          let imgUrl = '../image/scene001/mark.png'
                          if (res.data.markId === '1' || res.data.markId === 1) {
                            imgUrl = '../image/scene001/school.png'
                          } else if (res.data.markId === '2' || res.data.markId === 2) {
                            imgUrl = '../image/scene001/nongtian.png'
                          } else if (res.data.markId === '4' || res.data.markId === 4) {
                            imgUrl = '../image/scene001/person_s.png'
                          }
                          supermapJs.addMarkPoint(res.data.id, parseFloat(res.data.longitude), parseFloat(res.data.latitude), 'mark', imgUrl, 13, res.data.markDescribe,viewer)
                        }
                      },
                      err: function() {
                      }
                    })
                  } else if (res.data[i].layerType === 'section' || res.data[i].layerType === 'person' || res.data[i].layerType === 'monitor' || res.data[i].layerType === 'headquarters' || res.data[i].layerType === 'camera_ls' || res.data[i].layerType === 'camera_gd') {
                    supermapJs.addEntityPoint(res.data[i].id, res.data[i].layerType, parseFloat(res.data[i].longitude), parseFloat(res.data[i].latitude), 4, res.data[i].pointName, -(res.data[i].pointName.length) * 10, -80, pointFileObj.color, pointFileObj.icon, '',viewer)
                  }
                }
              }
            }
          }
        }
      })
    },
    removeEntityByIds(id) {
      let self = this
      let entity = viewer.entities.getById(id)
      if (typeof (entity) !== 'undefined') {
        let status = viewer.entities.remove(entity)
        if (status) {
          return
        } else {
          let status2 = viewer.entities.removeById(id)
          if (!status2) {
            entity.show = false
          }
        }
      }
      viewer.render()
    },
    deleteEntityById(data) {
      console.log(data)
      let self = this
      if (data !== '' && data !== null) {
        let obj = JSON.parse(data)
        if (obj.type !== 'event' && obj.type !== 'uav') {
          self.removeEntityByIds(obj.id)
          switch (obj.type) {
            case 'camera_ls':
              self.deleteCameraLs(obj.id)
              break
            case 'headquarters':
              self.deleteHeadquarters(obj.id)
              break
            case 'anchor':
              self.deleteLocationXY(obj.id)
              break
            case 'section':
              self.deleteSection(obj.id)
              break
            case 'mark':
              self.deleteMark(obj.id)
              break
          }
        } else {
          if (obj.type === 'event') {
            self.removeEntityByIds(obj.id)
            self.removeEntityByIds(obj.id + 'cir')
            self.ajaxToDeleteEntity(obj.id)
          } else {
            self.removeEntityByIds(obj.id)
            self.removeEntityByIds(obj.id + 'light')
          }
        }
      }
    },
    ajaxToDeleteEntity(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/yjyl/missionInfo/delete/' + id,
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            self.openMessage()
          }
        },
        err: function() {
        }
      })
    },
    deleteMark(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/yjyl/sceneMark/delete/' + id,
        dataType: 'json',
        success: function(res) {
          console.log(res)
          self.openMessage()
        },
        err: function() {
        }
      })
    },
    deleteSection(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/yjyl/sceneSection/delete/' + id,
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log('删除成功巡测断面')
            self.openMessage()
          }
        },
        err: function() {
        }
      })
    },
    deleteLocationXY(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/yjyl/anchorPoint/delete/' + id,
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log(res)
            self.openMessage()
          }
        },
        err: function() {
        }
      })
    },
    ajaxGetData(ids, taskId) {
      console.log(ids)
      console.log(taskId)
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue||''
        },
        type: 'get',
        url: self.webServer + '/api/system/layer/listPoint/' + ids,
        data: {
          missionId: taskId
        },
        dataType: 'json',
        success: function(res) {
          console.log(res)
          if (res.code === '200' || res.code === 200) {
            if (res.data.length > 0) {
              for (let i = 0; i < res.data.length; i++) {
                let entity = viewer.entities.getById(res.data[i].id)
                if (typeof (entity) !== 'undefined') {
                  entity.show = true
                } else {
                  let pointFileObj = self.returnColorAndImgUrl(res.data[i].layerType)
                  if (res.data[i].latitude !== '' && res.data[i].longitude !== '' && res.data[i].latitude !== '0.0' && res.data[i].id !== null && res.data[i].longitude !== 'null' && res.data[i].latitude !== null && res.data[i].longitude !== null) {
                    let status = supermapJs.booleanEntity(res.data[i].id,viewer)
                    if (!status) {
                      if (res.data[i].layerType === 'event') {
                        supermapJs.addTwoCircleToMap(res.data[i].id, parseFloat(res.data[i].longitude), parseFloat(res.data[i].latitude),
                          15, 50, 60, '../image/scene001/circle.png', res.data[i].layerType, './image/scene001/waring1.png', res.data[i].pointName, viewer)
                      } else if (res.data[i].layerType === 'uav') {
                        // supermapJs.addFlyModel(res.data[i].id, './gldb/fly.gltf', 'uav', parseFloat(res.data[i].longitude), parseFloat(res.data[i].latitude), 150, viewer)
                      } else if (res.data[i].layerType === 'car') {
                        supermapJs.addBillboardGraphicsGroup(res.data[i].id, res.data[i].layerType, parseFloat(res.data[i].longitude),
                          parseFloat(res.data[i].latitude), 15, pointFileObj.icon, res.data[i].pointName, -(res.data[i].pointName.length) * 5, pointFileObj.color,viewer)
                      } else if (res.data[i].layerType === 'mark') {
                        const tokenValue = window.sessionStorage.getItem('Access-Token')
                        $.ajax({
                          headers: {
                            'access_token': tokenValue
                          },
                          type: 'get',
                          url: self.webServer + '/api/yjyl/sceneMark/' + res.data[i].id,
                          data: {},
                          dataType: 'json',
                          success: function(res) {
                            if (res.code === 200 || res.code === '200') {
                              let imgUrl = '../image/scene001/mark.png'
                              if (res.data.markId === '1' || res.data.markId === 1) {
                                imgUrl = '../image/scene001/school.png'
                              } else if (res.data.markId === '2' || res.data.markId === 2) {
                                imgUrl = '../image/scene001/nongtian.png'
                              } else if (res.data.markId === '4' || res.data.markId === 4) {
                                imgUrl = '../image/scene001/person_s.png'
                              }
                              supermapJs.addMarkPoint(res.data.id, parseFloat(res.data.longitude), parseFloat(res.data.latitude), 'mark', imgUrl, 13, res.data.markDescribe,viewer)
                            }
                          },
                          err: function() {
                          }
                        })
                      } else {
                        supermapJs.addBillboardGraphicsGroup(res.data[i].id, res.data[i].layerType, parseFloat(res.data[i].longitude),
                          parseFloat(res.data[i].latitude), 15, pointFileObj.icon, res.data[i].pointName, -(res.data[i].pointName.length) * 10, pointFileObj.color,viewer)
                      }
                    }
                  }
                }
              }
            }
          }
        },
        err: function() {
        }
      })

    },
    /**
     * 控制标注
     */
    returnColorAndImgUrl(layerType) {
      let obj = {}, pointUrl = null, color = null
      switch (layerType) {
        case 'event':
          pointUrl = '../image/scene001/waring1.png'
          color = '#dc5539'
          break
        case 'person':
          pointUrl = '../image/scene001/person_s.png'
          color = '#dca639'
          break
        case 'ship':
          pointUrl = '../image/scene001/icon_c.png'
          color = '#dca639'
          break
        case 'car':
          pointUrl = '../image/scene001/car_s.png'
          color = '#dca639'
          break
        case 'camera_ls':
          pointUrl = '../image/scene001/ling_shi_camera.png'
          color = '#3990dc'
          break
        case 'camera_gd':
          pointUrl = '../image/scene001/icon_camera.png'
          color = '#3990dc'
          break
        case 'collect':
          pointUrl = './image/scene001/icon_info_s.png'
          color = '#dc7c3b'
          break
        case 'mark':
          pointUrl = '../image/scene001/icon_waring_s.png'
          color = '#dc7c3b'
          break
        case 'anchor':
          pointUrl = '../image/scene001/location_s.png'
          color = '#f620a8'
          break
        case 'headquarters':
          pointUrl = '../image/scene001/t_zhihui_s.png'
          color = '#0DF1A8'
          break
        case 'monitor':
          pointUrl = '../image/scene001/auto_location.png'
          color = '#81B511'
          break
        case 'section':
          pointUrl = '../image/scene001/person_jiance_duan.png'
          color = '#81B511'
          break
      }
      obj.icon = pointUrl
      obj.color = color
      return obj
    },
    deleteCameraLs(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/yjyl/sceneCameraLs/delete/' + id,
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log('删除成功临时视频点')
            self.openMessage()
          }
        },
        err: function() {
        }
      })
    },

    /**
     * 添加标注
     * @param str 对象
     */
    addEntityToMap(str) {
      console.log('返回数据....')
      console.log(str)
      let self = this
      let leftX = null, name = null, leftY = null, entity = null
      //事件标注点
      let pointFileObj = self.returnColorAndImgUrl(str.type)
      let description = JSON.stringify(str)
      switch (str.type) {
        case 'event':
          self.saveWaringLocation(str, parseFloat(str.longitude), parseFloat(str.longitude), str.id)
          break
        case 'camera_ls':
          leftX = -(str.cameraName.length) * 10
          leftY = -80
          self.addCameraLocation(str, parseFloat(str.longitude), parseFloat(str.latitude), str.type, leftX, leftY, str.cameraName, pointFileObj.color, pointFileObj.icon)
          break
        case 'anchor':
          name = str.pointName
          leftX = -(name.length) * 10
          leftY = -70
          self.saveLocationXY(str, parseFloat(str.latitude), parseFloat(str.longitude), leftX, name, leftY, pointFileObj.color, pointFileObj.icon, description)
          break
        case 'headquarters':
          leftX = -(str.headName.length) * 10
          leftY = -80
          if (typeof (str.headContent) === 'undefined') {
            str.headContent = ''
          }
          self.addHeadquarters(str, parseFloat(str.longitude), parseFloat(str.latitude), str.type, str.headName, leftX, leftY, pointFileObj.color, pointFileObj.icon, str.headContent)
          break
        case 'section':
          leftX = -(str.sectionName.length) * 10
          leftY = -80
          self.addSection(str, parseFloat(str.longitude), parseFloat(str.latitude), str.type, leftX, str.sectionName, leftY, pointFileObj.color, pointFileObj.icon, description)
          break
        case 'mark':
          let imgUrl = '../image/scene001/mark.png'
          if (str.markId === '1' || str.markId === 1) {
            imgUrl = '../image/scene001/school.png'
          } else if (str.markId === '2' || str.markId === 2) {
            imgUrl = '../image/scene001/nongtian.png'
          } else if (str.markId === '4' || str.markId === 4) {
            imgUrl = '../image/scene001/person_s.png'
          }
          self.addMark(str, str.longitude, str.latitude, str.missionId, 'mark', imgUrl, str.markDescribe, str.markId)
          break
      }
    },
    /**
     * 保存事件点位
     * @param str
     * @param jd
     * @param wd
     * @param id
     */
    saveWaringLocation(str, jd, wd, id) {
      let obj = str
      let self = this
      console.log(obj)
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/missionInfo/add',
        data: JSON.stringify({
          'id': id,
          'latitude': str.latitude,
          'longitude': str.longitude,
          'missionId': obj.missionId,
          'height': 0,
          'infoName': obj.infoName,
          'eventType': obj.eventType,
          'infoContent': obj.infoContent,
          'infoTime': obj.infoTime,
          'eventLevel': obj.eventLevel

        }),
        dataType: 'json',
        success: function(res) {
          console.log(res)
          supermapJs.addTwoCircleToMap(res.data, parseFloat(str.longitude), parseFloat(str.latitude), 10, 50, 60, './image/scene001/circle.png',
            'event', '../image/scene001/waring1.png', str.infoName,viewer)
        },
        err: function() {
        }
      })
    },
    bindingEntityByTaskIdAndType(data) {
      console.log('gudingdian')
      console.log(data)
      let self = this
      if (data !== '' && data !== null) {
        switch (data.type) {
          case 'monitor':
            if (data.id.length > 0) {
              for (let i = 0; i < data.id.length; i++) {
                self.getCollectionPoint(data.id[i])
                self.addMonitorInfo(data.id[i], data.missionId)
              }
            }
            break
          case 'camera_gd':
            if (data.id.length > 0) {
              for (let i = 0; i < data.id.length; i++) {
                self.getCameraGdPoint(data.id[i], data.missionId)
              }
            }
            break
          case 'person':
            self.ajaxGetData('1369184215302393857', data.missionId)
            break
          case 'ship':
            self.ajaxGetData('1369184665753866241', data.missionId)
            break
          case 'car':
            self.ajaxGetData('1369184952539402242', data.missionId)
            break
          case 'uav':
            self.ajaxGetData('1369184816643952641', data.missionId)
            break

        }
      }
    },
    getCameraGdPoint(id, missionId) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/jcsj/camera/' + id,
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            let status = self.booleanEntity(id)
            if (status) return
            let pointFileObj = self.returnColorAndImgUrl('camera_gd')
            supermapJs.addEntityPointId(res.data.id, 'camera_gd', parseFloat(res.data.longitude), parseFloat(res.data.latitude), 4,
              res.data.cameraName, -(res.data.cameraName.length) * 10, -80, pointFileObj.color, pointFileObj.icon, res.data.cameraCode)
            const tokenValue = window.sessionStorage.getItem('Access-Token')
            $.ajax({
              headers: {
                'Content-type': 'application/json',
                'access_token': tokenValue
              },
              type: 'post',
              url: self.webServer + '/api/yjyl/sceneCameraGd/add',
              data: JSON.stringify({
                'cameraId': res.data.id,
                'sceneId': missionId
              }),
              dataType: 'json',
              success: function(res) {
                console.log('固定视频添加成功')
              },
              err: function(er) {

              }
            })
          }
        },
        err: function(er) {
        }
      })
    },
    addMonitorInfo(id, missionId) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/missionPoint/add',
        data: JSON.stringify({
          'missionId': missionId,
          'pointId': id
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            console.log('保存成功')
          }
        },
        err: function(er) {
        }
      })

    },

    getCollectionPoint(id) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'access_token': tokenValue
        },
        type: 'get',
        url: self.webServer + '/api/jcsj/collectionPoint/' + id,
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            let pointFileObj = self.returnColorAndImgUrl('monitor')
            let status = self.booleanEntity(id)
            if (status) return
            supermapJs.addEntityPointId(res.data.id, 'monitor', parseFloat(res.data.longitude), parseFloat(res.data.latitude), 4,
              res.data.pointName, -(res.data.pointName.length) * 10, -80, pointFileObj.color, pointFileObj.icon, '')
          }
        },
        err: function(er) {
        }
      })
    },

    addCameraLocation(str, jd, wd, type, leftX, leftY, name, color, icon) {
      let self = this
      let obj = str
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/sceneCameraLs/add',
        data: JSON.stringify({
          'longitude': jd,
          'latitude': wd,
          'sceneId': obj.missionId,
          'cameraCode': obj.cameraCode,
          'cameraName': obj.cameraName,
          'cameraType': obj.cameraType,
          'height': 0
        }),
        dataType: 'json',
        success: function(res) {
          supermapJs.addEntityPoint(res.data, type, jd, wd, 4, name, leftX, leftY, color, icon, obj.cameraCode,viewer)
        },
        err: function() {
        }
      })
    },
    saveLocationXY(str, jd, wd, leftX, name, leftY, color, icon, description) {
      let self = this
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/anchorPoint/add',
        data: JSON.stringify({
          'longitude': jd,
          'latitude': wd,
          'missionId': str.missionId,
          'pointName': str.pointName,
          'pointType': str.type,
          'height': 0
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            supermapJs.addEntityPoint(res.data, str.type, jd, wd, 4, name, leftX, leftY, color, icon, description,viewer)
            console.log(viewer.entities)
          }
        },
        err: function() {
        }
      })
    },
    /**
     *添加临时指挥部点位
     * @param str
     * @param jd
     * @param wd
     * @param type
     * @param name
     * @param leftX
     * @param leftY
     * @param color
     * @param icon
     * @param headContent
     */
    addHeadquarters(str, jd, wd, type, name, leftX, leftY, color, icon, headContent) {
      let obj = str
      let self = this
      console.log('11111111111112222222222222222222')
      console.log(obj)
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/headquarters/add',
        data: JSON.stringify({
          'longitude': jd,
          'latitude': wd,
          'missionId': obj.missionId,
          'headName': obj.headName,
          'headContent': obj.headContent,
          'height': 0
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            supermapJs.addEntityPoint(res.data, type, jd, wd, 4, name, leftX, leftY, color, icon, headContent,viewer)
            let data = []
            let obj2 = {
              'headId': res.data,
              'missionId': obj.missionId,
              'personId': obj.commander,
              'personType': 1
            }
            data.push(obj2)
            if (obj.teamPerson.length > 0) {
              for (let i = 0; i < obj.teamPerson.length; i++) {
                let obj3 = {
                  'headId': res.data,
                  'missionId': obj.missionId
                }
                obj3.personId = obj.teamPerson[i]
                obj3.personType = 0
                data.push(obj3)
              }
              console.log(data)
              const tokenValue = window.sessionStorage.getItem('Access-Token')
              $.ajax({
                headers: {
                  'Content-type': 'application/json',
                  'access_token': tokenValue
                },
                type: 'post',
                url: self.webServer + '/api/yjyl/headPerson/add',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(res) {
                  console.log(res)
                },
                err: function(re) {
                }
              })
            }

          }
        },
        err: function() {
        }
      })
    },
    addSection(str, jd, wd, type, leftX, name, leftY, color, icon, description) {
      let obj = str
      let self = this
      console.log(obj)
      const tokenValue = window.sessionStorage.getItem('Access-Token')
      $.ajax({
        headers: {
          'Content-type': 'application/json',
          'access_token': tokenValue
        },
        type: 'post',
        url: self.webServer + '/api/yjyl/sceneSection/add',
        data: JSON.stringify({
          'longitude': jd,
          'latitude': wd,
          'sceneId': obj.missionId,
          'sectionName': obj.sectionName,
          'sectionCode': obj.sectionCode,
          'height': 0
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code === 200 || res.code === '200') {
            supermapJs.addEntityPoint(res.data, type, jd, wd, 4, name, leftX, leftY, color, icon, description,viewer)
          }
        },
        err: function() {
        }
      })
    }


  },
  destroyed() {
    console.log("commandMap2");
    viewer.destroy()
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-row {
  position: absolute;
  top: 1%;
}

#layerIcon img {
  width: 80px;
  height: 60px;
  padding: 5px;
}

#layerIcon {
  position: absolute;
  right: 4%;
  width: 180px;
  height: 70px;
  top: 20%;
  background-color: silver;
  border-radius: 5px;
  cursor: pointer;
}

#imgLayer {
  position: absolute;
  top: 20%;
  right: 1.3%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  background-color: aliceblue;
  border-radius: 5px;
}


</style>
