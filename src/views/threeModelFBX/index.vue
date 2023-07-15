<template>
  <div id="map">
    <!-- 3D模型容器 -->
    <span id="closeTag" @click="closeInfo()">×</span>
    <div id="container"></div>
    <model ref="modelInfo" style="top: 5%;height: 94%;right: 4%;overflow-y: auto;"/>
<!--    <el-progress v-show="progressIndex" :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>-->
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js'
import model from '@/views/3DLaboratory/components/model'

const $ = name => document.querySelector(name)

export default {
  name: "index",
  components:{
    model
  },
  data() {
    return {
      progressIndex:true,
      percentage:0,
      scene: null, // 场景
      camera: null, // 照相机
      renderer: null, // 渲染器
      mesh: null, // 网格
      textureLoader: null, // 纹理加载器
      mixer: null,
      groupBox: null,
      stats: null, // 性能监测
      control: null, // 相机控件
      // publicPath: process.env.BASE_URL,
      clearAnim: null,
      clock: null
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() {
    cancelAnimationFrame(this.clearAnim)  // 清除requestAnimationFrame
    // this.renderer.domElement.removeEventListener('click', this.modelMouseClick, false)
    this.scene = null, // 场景
    this.camera = null, // 照相机
    this.renderer = null, // 渲染器
    this.mesh = null, // 网格
    this.textureLoader = null, // 纹理加载器
    this.mixer = null,
    this.groupBox = null,
    this.control = null, // 相机控件
    this.clock = null
  },
  methods: {
    listenChangeModel(modelUrl,modelType,modelCode){
      document.getElementById("map").style.zIndex=10;
      document.getElementById("map").style.opacity=1;
      this.init()
      if(modelType===1){
        this.loadFbxModel(modelUrl);
      }else if(modelType===2){
        this.loadGlbModel(modelUrl);
      }
      this.render()
      if(modelCode!==""){
       this.$refs.modelInfo.showInfo(modelCode);
      }

    },
    //初始化
    init() {
      // 场景
      this.scene = new THREE.Scene();
      // 1.2 相机
      this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
      // 设置摄像机位置,相机方向逆X轴方向，倾斜向下看
      this.camera.position.set(-20, 90, 150);
      //this.camera.position.set(-20, 40 ,30)
      // 指向场景中心
      this.camera.lookAt(this.scene.position);
      // 1.3 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      // 创建纹理加载器
      this.textureLoader = new THREE.TextureLoader();
      // 创建一个组合对象
      this.groupBox = new THREE.Group();
      // 添加坐标轴，辅助判断位置
      let axes = new THREE.AxesHelper(1000);
      // this.scene.add(axes);
      // 设置环境
      this.renderer.setClearColor(new THREE.Color("#f1f9fb"));
      // 设置场景大小
      this.renderer.setSize(
        $('#container').getBoundingClientRect().width,
        $('#container').getBoundingClientRect().height
      );

      // 渲染器开启阴影效果
      this.renderer.shadowMap.enabled = true;
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(500, 300, 500); // 点光源位置
      this.scene.add(point); // 点光源添加到场景中
      // 环境光
      let ambient = new THREE.AmbientLight(0x999999);
      this.scene.add(ambient);

      this.renderer.setClearColor(0x4d6363, 1);

      // 渲染div到canvas
      $('#container').appendChild(this.renderer.domElement);

      //创建相机控件
      this.control = new OrbitControls(this.camera, this.renderer.domElement)
      this.control.enableDamping = true
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
      this.control.dampingFactor = 0.5;
      // 是否可以缩放
      this.control.enableZoom = true;
      // 是否自动旋转
      this.control.autoRotate = true;
      // 设置相机距离原点的最近距离
      this.control.minDistance = 20;
      // 设置相机距离原点的最远距离
      this.control.maxDistance = 1000;
      // 是否开启右键拖拽
      this.control.enablePan = true;
      // 上下翻转的最大角度
      this.control.maxPolarAngle = 1.5;
      // 上下翻转的最小角度
      this.control.minPolarAngle = 0.0;
      // 是否可以旋转
      this.enableRotate = true;
      // 最后进行渲染
      this.render()
    },
    // 最后的渲染
    render() {
      let animate = () => {
        //循环调用函数
        this.clearAnim = requestAnimationFrame(animate)
        //更新相机控件
        if(this.control!==null){
          this.control.update()
        }
        //渲染界面
        if(this.renderer!==null){
          this.renderer.render(this.scene, this.camera)
        }
      }
      animate()
      //  为模型绑定点击事件
      // this.renderer.domElement.addEventListener('click', this.modelMouseClick, false)
    },
    // 创建材质
    // createMaterial() {
    //   // 创建三维用到的材质
    //   /**
    //    *
    //    * MeshBasicMaterial: 网格基础材质
    //    * MeshDepthMaterial: 网格深度材质
    //    * MeshNormalMaterial: 网格法向材质
    //    * MeshLambertMaterial: 网格Lambert 材质
    //    * MeshPhongMaterial: 网格 Phong式材质
    //    * MeshStandardMaterial: 网格标准材质
    //    * MeshPhysicalMaterial: 网格物理材质
    //    * MeshToonMaterial: 网格卡通材质
    //    * ShadowMaterial: 阴影材质
    //    * ShaderMaterial: 着色器材质
    //    * LineBasicMaterial: 直线基础材质
    //    * LineDashMaterial: 虚线材质
    //    */
    //     // 外墙
    //   let wallMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });
    //   let wallGeo = new THREE.BoxGeometry(439 + 2 + 2, 120, 376.5 + 2 + 2); // 创建几何体
    //   let wallMesh = new THREE.Mesh(wallGeo, wallMaterial);
    //   wallMesh.position.set(0, 60, 0); //(0, 60, -14.95);
    //   this.scene.add(wallMesh)
    //   // 内墙
    //   let wallInnerMaterial = new THREE.MeshLambertMaterial({
    //     color: 0x2d1bff,
    //   });
    //   let wallInnerGeo = new THREE.BoxGeometry(439, 120, 376.5); //(270, 120, 390);
    //   let wallInnerMesh = new THREE.Mesh(wallInnerGeo, wallInnerMaterial);
    //   wallInnerMesh.position.set(0, 60, 0); //(0, 60, -14.95);
    //   this.scene.add(wallInnerMesh)
    //   // 门
    //   let doorTexture = this.textureLoader.load(
    //     // require("../../../../assets/img/1.png") // 暂时注掉
    //   );
    //   let boxTextureMaterial = new THREE.MeshStandardMaterial({
    //     map: doorTexture,
    //     metalness: 0.2,
    //     roughness: 0.07,
    //     side: THREE.DoubleSide,
    //   });
    //   //let doorInnerMaterial = new THREE.MeshLambertMaterial({color: 0x2D1BFF});
    //   let doorGeo = new THREE.BoxGeometry(2, 80, 74.5);
    //   let doorMesh = new THREE.Mesh(doorGeo, boxTextureMaterial);
    //   doorMesh.position.set(-220.5, 40, 0);
    //   this.scene.add(doorMesh);
    //
    // },
    // 加载 GLTF 模型
    loadGlbModel(gltfUrl) {
      const loader = new GLTFLoader()
      loader.load(gltfUrl, (gltf) => {
        gltf.scene.scale.set(100,100,100)  //  设置模型大小缩放
        gltf.scene.position.set(0,0,0)
        gltf.scene.traverse( function ( child ) {
          if ( child.isMesh ) {
            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
            child.geometry.center();
          }
        });
        this.scene.add(gltf.scene)
      }, (xhr) => {
        this.percentage = (xhr.loaded / xhr.total) * 100
      }, (error) => {
        console.error(error)
      })
    },
    //  加载 FBX 模型
    loadFbxModel(modelUrl) {
      const loader = new FBXLoader();
      let self = this;
      loader.load(modelUrl,object => {
        object.scale.set(1,1,1)
        object.traverse( child => {
          if ( child.isMesh ){
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        if(modelUrl==='./fbx/liudongfenxiyi.fbx'){
          object.position.set(-100, 0, 0);
        }else{
          object.position.set(-10, 0, 0);
        }
        self.scene.add(object);//模型
      },(xhr)=>{
        this.percentage=(xhr.loaded / xhr.total) * 100
      })
    },
    loadFnxTgaText(name,child){
      let tgzUrl =null;
      switch (name) {

      }
      let tgaLoader=new TGALoader()
      tgaLoader.load(tgzUrl,(texture)=>{
        //模型使用新的贴图纹理
        texture.needsUpdate=true
        child.material.map =texture
      })
    },
    closeInfo(){
      // this.percentage=0;
      // this.progressIndex=true;
      document.getElementById("map").style.opacity=0;
      document.getElementById("map").style.zIndex=-10;
      $('#container').innerHTML=''
      this.renderer.domElement=null;
      cancelAnimationFrame(this.clearAnim)  // 清除requestAnimationFrame
      if(this.scene.children.length>0){
        let self = this
        self.scene.children.forEach(function(obj) {
          if(obj.type==="Group"){
            self.scene.remove(obj);
          }
        })
      }
      this.scene.clear()
      this.scene = null; // 场景
      this.camera = null; // 照相机
      this.renderer = null; // 渲染器
      this.mesh = null; // 网格
      this.textureLoader = null; // 纹理加载器
      this.mixer = null;
      this.groupBox = null;
      this.control = null; // 相机控件
      this.clock = null;

    }
  }
}
</script>
<style scoped>
#map{
  margin: 0;
  padding: 0;
  width: 60%;
  height: 80%;
  position: absolute;
  left: 5%;
  top: 10%;
  z-index: -10;
  opacity: 0;;
  border-radius: 5px;
}
#container {
  width: 100%;
  height:100%;
}

#closeTag{
  position: absolute;
  width: 50px;
  height: 50px;
  margin: 0;
  padding: 0;
  right: 0.1%;
  font-size: 45px;
  color: aquamarine;
  cursor: pointer;
}
</style>
