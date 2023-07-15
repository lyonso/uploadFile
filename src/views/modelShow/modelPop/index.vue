<template>
  <div id='map' v-show="status"  style="opacity: 0;z-index: -100;">
    <div id='menu_content'>
      <canvas id='canvas' />
    </div>
    <el-row style='position: absolute;top: 1%;'>
      <el-col :span='16'>
        <el-input v-model="input" placeholder="请输入内容" style='color: white;margin-left: 1%;'></el-input>
      </el-col>
      <el-col :span='4'>
        <el-button type="primary" style='margin-left: 13%;' @click='showInfo()'>详情</el-button>
      </el-col>
      <el-col :span='4'>
        <el-button type="primary" style='margin-left: 40%;' @click='closeModel(false)'>关闭</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { OrbitControl } from '@oasis-engine/controls'
import {
  Camera,
  WebGLEngine,
  DirectLight,
  Script,
  Vector3,
} from 'oasis-engine'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: 'Index',
  data() {
    return {
      input:'吹扫捕集-气相色谱仪',
      status: true,
      urls: [
        {
          index: 'f1',
          src: './gltf/yiqi2.png',
          name:"吹扫捕集-气相色谱仪"
        },
        {
          index: 'f2',
          src: './gltf/yiqi6.png',
          name:"流式细胞仪"
        },
        {
          index: 'f3',
          src: './gltf/yiqi5.png',
          name:"藻类人工智能分析系统"
        },
        {
          index: 'f4',
          src: './gltf/yiqi3.png',
          name:"液相色谱质谱仪"
        },
        {
          index: 'f5',
          src: './gltf/yiqi7.png',
          name:"超声波细胞粉碎机"
        }
      ],
      rootEntity: null,
      oneEntity: null,
      engine: null,
      cameraEntity: null
    }
  },
  mounted() {
    let self = this;
    self.engine = new WebGLEngine('canvas')
    self.engine.canvas.resizeByClientSize()
    self.rootEntity = self.engine.sceneManager.activeScene.createRootEntity()
    self.cameraEntity = self.rootEntity.createChild('camera')
    self.cameraEntity.addComponent(Camera)
    self.cameraEntity.transform.setPosition(1.5, 0.1, -1.6)
    self.cameraEntity.addComponent(OrbitControl)
    // window.cameraEntity = self.cameraEntity
    const directLightNode = self.rootEntity.createChild('dir_light')
    const directLightNode2 = self.rootEntity.createChild('dir_light2')
    directLightNode.addComponent(DirectLight)
    directLightNode2.addComponent(DirectLight)
    directLightNode.transform.setRotation(100, 0, 0)
    directLightNode2.transform.setRotation(-15, 50, 0)
    self.engine.sceneManager.activeScene.ambientLight.diffuseSolidColor.setValue(1, 1, 1, 1)
    self.engine.sceneManager.activeScene.background.solidColor.setValue(0.4,0.45,0.45,1)

    self.addEntity('./gltf/3f_1.glb')
    self.cameraEntity.transform.setPosition(3.1, 0.2, -3.4)

    self.engine.canvas.resizeByClientSize()
    self.engine.run()

    EventBus.$on("modelShow",function(obj) {
      if(obj){
        $("#map").css("opacity","1");
        $("#map").css("z-index","1000");
      }else{
        $("#map").css("opacity","0");
        $("#map").css("z-index","-100");
      }
    })
  },
  methods: {
    addEntity(urlModel) {
      if (this.oneEntity !== null) {
        this.rootEntity.removeChild(this.oneEntity)
        this.oneEntity = null
      }
      this.engine.resourceManager.load(urlModel).then((gltf) => {
        this.oneEntity = gltf.defaultSceneRoot
        this.rootEntity.addChild(this.oneEntity)
        gltf.defaultSceneRoot.addComponent(Rotate)
      })

      class Rotate extends Script {
        onUpdate() {
          this.entity.transform.rotate(new Vector3(0, 0.5, 0))
        }
      }
    },
    showModel(data) {
      let self = this;
      switch (data) {
        case 'f1':
          self.cameraEntity.transform.setPosition(3.1, 0.2, -3.4)
          self.addEntity('./gltf/3f_1.glb')
          break
        case 'f2':
          self.cameraEntity.transform.setPosition(1.5, 0.1, -1.6)
          self.addEntity('./gltf/yiqi6.glb')
          break
        case 'f3':
          self.cameraEntity.transform.setPosition(1.5, 0.1, -1.6)
          self.addEntity('./gltf/yiqi5.glb')
          break
        case 'f4':
          self.cameraEntity.transform.setPosition(1.5, 0.1, -1.6)
          self.addEntity('./gltf/yiqi4.glb')
          break;
        case 'f5':
          self.cameraEntity.transform.setPosition(1.5, 0.1, -1.6)
          self.addEntity('./gltf/yiqi9.glb')
          break;
        default:
          break;
      }
    },
    showInfo(){
      this.$router.push('/modelInfo')
    },
    closeModel(index) {
      if(index){
        $("#map").css("opacity","1");
        $("#map").css("z-index","999");
      }else{
        $("#map").css("opacity","0");
        $("#map").css("z-index","-999");
      }

    },


  }
}
</script>

<style scoped>

#map {
  width:500px;
  height:400px;
  position: absolute;
  z-index: -1000;
  top: 7%;
  border-radius: 5px;
  right: 23%;
}


#menu_content{
  height: 100%;
}
#menu_div {
  width: 20%;
  height: 100vh;
  overflow: auto;
  background-color: #2c4355;
}
.el-image {
  cursor: pointer;
}

#canvas {
  width: 100%;
  height: 100%;
}

.el-button--primary{
  background-color: #a5b0bb;
  border-color: white;

}
.el-input ,.el-input__inner{
  border: 1px solid white !important;
  color: white !important;
  background-color: white;
}
</style>
