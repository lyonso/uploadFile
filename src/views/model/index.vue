
<template>
  <div>
    <div id="container" />
    <div class="model_list">
      <div class="item">
        <div>气相色谱仪</div>
        <img src="../../assets/model.png">
      </div>
    </div>
    <div class="close" @click="closeModel()"> 返回楼层</div>
  </div>
</template>

<script>
import * as THREE from "three";
import {OBJLoader, MTLLoader} from 'three-obj-mtl-loader';
import {CSS2DRenderer, CSS2DObject} from 'three-css2drender';

const OrbitControls = require('three-orbit-controls')(THREE);
export default {
  name: "vue-three",
  data() {
    return {
      scene: '',
      light: '',
      camera: '',
      controls: '',
      renderer: '',
      imglist:[
        {id:1}
      ]
    }
  },
  methods: {
    //初始化three.js相关内容
    async init() {
      this.scene = new THREE.Scene();
      this.scene.add(new THREE.AmbientLight(0x999999));//环境光
      this.light = new THREE.DirectionalLight(0x999999);//从正上方（不是位置）照射过来的平行光，0.45的强度
      this.light.position.set(50, 200, 100);
      this.light.position.multiplyScalar(0.3);
      this.scene.add(this.light);
      // this.scene.background=new THREE.Color(0xCCCCCC)
      //初始化相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 12000);
      this.camera.position.set(-70, 100, 65);
      this.camera.lookAt(this.scene.position);
      //初始化控制器
      this.controls = new OrbitControls(this.camera);
      this.controls.target.set(0, 0, 0);
      this.controls.minDistance = 80;
      this.controls.maxDistance = 400;
      this.controls.maxPolarAngle = Math.PI / 3;
      this.controls.update();
      //渲染
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
      });
      // this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      const container = document.getElementById('container');
      container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize, false);//添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
      await this.loadObj();
      await this.animate();
    },
    //窗口监听函数
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    //外部模型加载函数
    loadObj() {
      //包含材质
      new MTLLoader().setPath('/static/models/').load('YiQi.mtl', materials => {
        console.log("materials", materials);
        // materials.preload();
        new OBJLoader().setMaterials(materials).setPath('/static/models/').load('YiQi_N.obj', obj => {
          obj.scale.set(40, 40, 40);
          obj.position.set(0, -10, 0);
          this.scene.add(obj);
        });
      });
    },
    closeModel(){
      this.$store.dispatch('map/setShowModel',false)
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style lang="less" scoped>
#container{
  width: 100%;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  background: url("../../assets/model_bg.jpg");
  background-size: 100% 100%;
}
.close{
  position: absolute;
  top: 115px;
  left: 375px;
  z-index: 99;
  width: 106px;
  height: 36px;
  background: rgba(1, 56, 76, 0.2);
  border: 1px solid #00FFFF;
  border-radius: 4px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #60FFF9;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
}
.model_list{
  position: absolute;
  padding: 6px;
  top: 115px;
  left: 34px;
  width: 312px;
  border: 1px solid #69EEE8;
  background: rgba(82, 114, 148, 0.18);
}
.item{
  border: 1px solid #527294;
  cursor: pointer;

  :first-child{
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    color: rgba(237, 254, 255, 1);
    background: rgba(0, 0, 0, 0.51);
  }
  img{
    width: 310px;
    position: relative;
    top: 4px;
  }
}
</style>
