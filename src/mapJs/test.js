// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
//         <meta name="viewport"
//               content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
//           <title>云层天空盒</title>
//           <link href="../../Build/Cesium/Widgets/widgets.css" rel="stylesheet">
//             <link href="./css/pretty.css" rel="stylesheet">
//               <script type="text/javascript" src="./js/jquery.min.js"></script>
//               <script src="./js/tooltip.js"></script>
//               <script src="./js/spectrum.js"></script>
//               <script src="./js/config.js"></script>
//               <script type="text/javascript" src="../../Build/Cesium/Cesium.js"></script>
//   </head>
//   <body>
//     <div id="cesiumContainer"></div>
//     <div id='loadingbar' class="spinner">
//       <div class="spinner-container container1">
//         <div class="circle1"></div>
//         <div class="circle2"></div>
//         <div class="circle3"></div>
//         <div class="circle4"></div>
//       </div>
//       <div class="spinner-container container2">
//         <div class="circle1"></div>
//         <div class="circle2"></div>
//         <div class="circle3"></div>
//         <div class="circle4"></div>
//       </div>
//       <div class="spinner-container container3">
//         <div class="circle1"></div>
//         <div class="circle2"></div>
//         <div class="circle3"></div>
//         <div class="circle4"></div>
//       </div>
//     </div>
//     <div class="params-setting-container">
//       <div class="params-setting-anchor" title="显示/隐藏参数面板"><span class="fui-expand"></span></div>
//       <div  class="params-setting">
//         <div class="param-item">
//           <label for="openCloud">开启云层</label>
//           <input type="checkbox" id="openCloud">
//         </div>
//         <div class="param-item">
//           <label>切换云层</label>
//           <select id="toggle-sky" style="width:170px;height:25px;">
//             <option value="./images/clouds-supermap-sm.png">云层纹理1</option>
//             <option value="./images/clouds.png">云层纹理2</option>
//           </select>
//         </div>
//         <div class="divider"></div>
//         <div class="param-item">
//           <label class="lab" for="openSkybox">开启天空盒</label>
//           <input type="checkbox" id="openSkybox">
//         </div>
//         <div class="param-item">
//           <label>切换天空</label>
//           <select id="toggle-skyBox" style="width:170px;height:25px;">
//             <option value="sunsky">晚霞</option>
//             <option value="bluesky">蓝天</option>
//           </select>
//         </div>
//       </div>
//     </div>
//     <script>
//       var defaultSkyBox,currentSkyBox,skyListener;
//       var handlerCloud = "cloud",handlerSky = "skyBox";
//       function onload(Cesium){
//       var viewer = new Cesium.Viewer("cesiumContainer");
//       var scene = viewer.scene;
//       var widget = viewer.cesiumWidget;
//
//       viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
//       url: 'https://dev.virtualearth.net',
//       mapStyle: Cesium.BingMapsStyle.AERIAL,
//       key: URL_CONFIG.BING_MAP_KEY
//     }));
//
//       //创建云层
//       var cloudBox = new Cesium.CloudBox({
//       url:"./images/clouds-supermap-sm.png"
//     });
//
//       //创建天空盒
//       var sunSkyBox = new Cesium.SkyBox({
//       sources:{
//       positiveX:'./images/SkyBox/sunsetglow/Right.jpg',
//       negativeX:'./images/SkyBox/sunsetglow/Left.jpg',
//       positiveY:'./images/SkyBox/sunsetglow/Front.jpg',
//       negativeY:'./images/SkyBox/sunsetglow/Back.jpg',
//       positiveZ:'./images/SkyBox/sunsetglow/Up.jpg',
//       negativeZ:'./images/SkyBox/sunsetglow/Down.jpg'
//     }
//     });
//       var blueSkyBox = new Cesium.SkyBox({
//       sources:{
//       positiveX:'./images/SkyBox/bluesky/Right.jpg',
//       negativeX:'./images/SkyBox/bluesky/Left.jpg',
//       positiveY:'./images/SkyBox/bluesky/Front.jpg',
//       negativeY:'./images/SkyBox/bluesky/Back.jpg',
//       positiveZ:'./images/SkyBox/bluesky/Up.jpg',
//       negativeZ:'./images/SkyBox/bluesky/Down.jpg'
//     }
//     });
//       defaultSkyBox = viewer.scene.skyBox;
//
//       //初始化时把天空盒资源准备好
//       function initialSkyBox(){
//       if(scene.frameState.passes.render){
//       sunSkyBox.update(scene.frameState,true);
//       blueSkyBox.update(scene.frameState,true);
//       scene.postRender.removeEventListener(initialSkyBox);
//        }
//     }
//
//
//     scene.postRender.addEventListener(initialSkyBox);
//
//       //开启云层
//       $("#openCloud").on("input change",function(){
//       var openCloud = this.checked;
//       if(openCloud){
//       scene.cloudBox = cloudBox;
//     }else{
//       scene.cloudBox = null;
//     }
//       handlerCamera(handlerCloud);  //操作相机
//     });
//
//       //切换云层
//       $("#toggle-sky").on('input propertychange',function(){
//       var cloudTextureUrl = $(this).val();
//       scene.cloudBox.url = cloudTextureUrl;
//     });
//
//       //开启天空盒
//       $("#openSkybox").on("input change",function(){
//       var openSkybox = this.checked;
//       if(openSkybox){
//       sunSkyBox.WSpeed = 0.5;
//       sunSkyBox.show = true;
//       currentSkyBox = sunSkyBox;
//       loadScene();      //加载场景
//       handlerCamera(handlerSky);  //切换视角
//       gradualChange();
//     }else{
//       scene.postRender.removeEventListener(skyListener);
//       scene.skyBox = defaultSkyBox;
//       scene.skyAtmosphere.show = true;
//       handlerCamera(handlerCloud);  //切换视角
//     }
//     });
//
//       //切换天空盒
//       $("#toggle-skyBox").on("input propertychange",function(){
//       var skyBoxName = $(this).val();
//       if(skyBoxName == "sunsky"){
//       sunSkyBox.WSpeed = 0.5;
//       sunSkyBox.show = true;
//       currentSkyBox = sunSkyBox;
//       scene.skyBox = currentSkyBox;
//       blueSkyBox.show = false;
//     }else{
//       blueSkyBox.WSpeed = 0.5;
//       blueSkyBox.show = true;
//       currentSkyBox = blueSkyBox;
//       scene.skyBox = currentSkyBox;
//       sunSkyBox.show = false;
//     }
//     });
//
//       //加载场景
//       function loadScene(){
//       var promise = scene.open(URL_CONFIG.SCENE_CBD);
//       try{
//       Cesium.when(promise,function(){
//       var layer = scene.layers.find("Config");
//     },function(e){
//       if(widget._showRenderLoopErrors){
//       var title = "渲染时发生错误,已停止渲染";
//       widget.showErrorPanel(title,undefined,e);
//     }
//     })
//     }catch(e){
//       if(widget._showRenderLoopErrors){
//       var title = "渲染时发生错误,已停止渲染。";
//       widget.showErrorPanel(title,undefined,e);
//     }
//     }
//     }
//
//       //相机上升到一定位置,天空盒出现渐变效果
//       function gradualChange(){
//       skyListener =  function () {
//       var cameraHeight = scene.camera.positionCartographic.height;
//
//       var skyAtmosphereH1 = 22e4; // 大气开始渐变的最大高度
//       var skyBoxH1 = 15e4; // 天空开始渐变的最大高度
//       var skyBoxH2 = 12e4; // 天空开始渐变的最小高度
//       var bufferHeight = 1e4;
//       if (cameraHeight < skyAtmosphereH1 && Cesium.defined(currentSkyBox)) {
//       var skyAtmosphereT = (cameraHeight - skyBoxH2) / (skyAtmosphereH1 - skyBoxH2);
//       if (skyAtmosphereT > 1.0) {
//       skyAtmosphereT = 1.0;
//     } else if (skyAtmosphereT < 0.0) {
//       skyAtmosphereT = 0.0;
//     }
//       var skyBoxT = (cameraHeight - skyBoxH2) / (skyBoxH1 - skyBoxH2);
//       if (skyBoxT > 1.0) {
//       skyBoxT = 1.0;
//     } else if (skyBoxT < 0.0) {
//       skyBoxT = 0.0;
//     }
//       currentSkyBox.alpha = 1.0 - skyBoxT;
//       if(cameraHeight>skyBoxH2){
//       scene.skyAtmosphere.show = true;
//       scene.skyAtmosphere.alpha = skyAtmosphereT;
//       scene.skyBox = currentSkyBox;
//     }else{
//       scene.skyAtmosphere.show = false;
//     }
//     } else {
//       scene.skyAtmosphere.alpha = 1.0;
//       scene.skyBox = defaultSkyBox;
//     }
//
//       //控制相机 速率
//       if (scene.skyBox !== defaultSkyBox) {
//       if (cameraHeight > (skyBoxH2 - 2 * bufferHeight) && cameraHeight < skyBoxH1 + 3 * bufferHeight) {
//       scene.screenSpaceCameraController.zoomFactor = 0.4;
//     } else {
//       scene.screenSpaceCameraController.zoomFactor = 5.0;
//     }
//     } else {
//       scene.skyBox.alpha = 1.0;
//       scene.skyAtmosphere.alpha = 1.0;
//       scene.screenSpaceCameraController.zoomFactor = 5.0;
//     }
//
//     };
//       scene.postRender.addEventListener(skyListener);
//     }
//
//       //操作相机
//       function handlerCamera(val){
//       var isSkyBox = handlerCloud;
//       if(val == isSkyBox){
//       scene.camera.flyTo({
//       destination:new Cesium.Cartesian3(-5701705.704276292,21279055.37816442,12718852.74864528)
//     })
//     }else{
//       scene.camera.flyTo({
//       destination:new Cesium.Cartesian3(-2179825.7788852383,4380581.427298224,4091538.107446992),
//       orientation:{
//       heading:0.005352643897039933,
//       pitch:-0.03880119222393663,
//       roll:6.2831853071795845
//     }
//     })
//     };
//     }
//
//       $(".params-setting-anchor").click(function(){
//       $(".params-setting").toggleClass("params-setting-hide");
//     });
//
//       $('#loadingbar').remove();
//     }
//       if(typeof Cesium !== "undefined"){
//       window.startupCalled = true;
//       onload(Cesium);
//     }
//     </script>
//   </body>
// </html>
