/**
 * @description 存放各种实体类，广告牌的方法
 * @author mly
 */
/* eslint-disable */


/**
 * 地图初始化
 * @param div
 */
function initMap(div) {
    let viewer = new Cesium.Viewer(div,{
        geocoder:false,
        homeButton:false,
        sceneModePicker:false,
        baseLayerPicker:false,
        navigationHelpButton:false,
        animation:false,    //左下角的动画控件的显示
        shouldAnimate:false,   //控制模型动画
        timeline:false,
        fullscreenButton:false,
        scene3DOnly: true,
        // contextOptions:{
        //     maxDrawingBufferWidth:7480,
        //     maxDrawingBufferHeight:4320
        // }
    });
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    return viewer;
}

function initMap2(div) {
    let viewer = new Cesium.Viewer(div,{
        geocoder:false,
        homeButton:false,
        sceneModePicker:false,
        baseLayerPicker:false,
        navigationHelpButton:false,
        animation:false,    //左下角的动画控件的显示
        shouldAnimate:false,   //控制模型动画
        timeline:false,
        fullscreenButton:false,
        scene3DOnly: true,
        // contextOptions:{
        //     maxDrawingBufferWidth:7480,
        //     maxDrawingBufferHeight:4320
        // }
    });

    var options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;

    CesiumNavigation.umd(viewer, options);

    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    return viewer;
}



function init2(div) {
    let viewer = new Cesium.Viewer(div,{
        geocoder:false,
        homeButton:false,
        sceneModePicker:false,
        baseLayerPicker:false,
        navigationHelpButton:false,
        animation:false,    //左下角的动画控件的显示
        shouldAnimate:false,   //控制模型动画
        timeline:false,
        fullscreenButton:false,
        scene3DOnly: true,
        contextOptions:{
            maxDrawingBufferWidth:7480,
            maxDrawingBufferHeight:4320
        }
    });

    var options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;

    CesiumNavigation.umd(viewer, options);

    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    return viewer;
}


function init3(div) {
    let viewer = new Cesium.Viewer(div,{
        geocoder:false,
        shadows:true,
        homeButton:false,
        sceneModePicker:false,
        baseLayerPicker:false,
        navigationHelpButton:false,
        animation:false,    //左下角的动画控件的显示
        shouldAnimate:false,   //控制模型动画
        timeline:false,
        fullscreenButton:false,
        scene3DOnly: true,
        contextOptions:{
            maxDrawingBufferWidth:7480,
            maxDrawingBufferHeight:4320
        }
    });
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    return viewer;
}


/**
 * 屏幕坐标转换地理坐标
 * @param cartesian2
 */
function windowToWGS84(cartesian2,viewer) {
    let cartesian =viewer.scene.globe.pick(viewer.camera.getPickRay(cartesian2),viewer.scene);
    let catographic = Cesium.Cartographic.fromCartesian(cartesian);
    let jd = Number(Cesium.Math.toDegrees(catographic.longitude)).toFixed(9);
    let wd = Number(Cesium.Math.toDegrees(catographic.latitude)).toFixed(9);
    return { jd: jd, wd: wd };
}

/**
 * 添加广告牌
 * @param id
 * @param x
 * @param y
 * @param height
 * @param labelName
 * @param viewer
 */
function addBillboard(id,name,x,y,height,viewer,src) {
    viewer.entities.add({
        id: id,
        name:name,
        position: Cesium.Cartesian3.fromDegrees(x, y, height),
        billboard: {
            image:src,
            width: 44,
            height: 44,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
            heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    })
}

/**
 * 添加线
 * @param viewer
 * @param id
 * @param pointArray
 */
function addLine(viewer,id,pointArray) {
    viewer.entities.add({
        id:id,
        name:"lines",
        polyline: {
            loop:true,
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArray),
            width: 5,
            // material: new Cesium.PolylineOutlineMaterialProperty({
            //     color:Cesium.Color.fromCssColorString("rgba(66,106,179,0.9)"),
            // })
            material:new Cesium.PolylineTrailMaterialProperty({
                color:Cesium.Color.DODGERBLUE,
                trailLength:5,
                period:10
            })
        },
    });
}

function addWaterAnimation (viewer,coordinates) {
    const primitive = new Cesium.Primitive({
        show: true,
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(coordinates)),
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                extrudedHeight: 0.8, // 只显示水面
                height: 100,
                stRotation:0.5,
            })
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: true,
            material: new Cesium.Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        normalMap: "../image/water3.png",
                        frequency: 2000.0,
                        animationSpeed:0.02,
                        amplitude: 2.0
                    }
                }
            })
        })
    });
    viewer.scene.primitives.add(primitive);
}

/**
 * 初始化
 * @param datasource
 * @param color
 * @param viewer
 */
function initFiveWarZone(datasource,viewer) {
    viewer.dataSources.add(datasource)
    const entities = datasource.entities.values
    for (let i = 0; i < entities.length; i++) {
        entities[i].polyline.material.color.setValue(23,67,189)
    }
}

function addLayerToMap(layerType,status,viewer) {
    switch (layerType) {
        case 1:
            if(status){
                let points =[{x:120.092496,y:31.284391},{x:120.048803,y:31.206343}]
                let pointLayer1 = new Cesium.CustomDataSource('pointLayer1');
                viewer.dataSources.add(pointLayer1);
                let imageSrc ="../image/point3.png";
                for(let i=0;i<points.length;i++){
                    addPointLayer(pointLayer1,imageSrc,points1[i].x,points1[i].y,20,Math.round(Math.random()*200+20)+Math.round(Math.random()*50+20))
                }
            }else{
                viewer.dataSources.remove(pointLayer1,true);
            }
            break;
        case 2:
            if(status){
                let points2 =[{x:120.098803,y:31.256343}];
                let pointLayer2 = new Cesium.CustomDataSource('pointLayer2');
                viewer.dataSources.add(pointLayer2);
                let imageSrc ="../image/point2.png";
                for(let i=0;i<this.points2.length;i++){
                    addPointLayer(pointLayer2,imageSrc,points2[i].x,points2[i].y,20,Math.round(Math.random()*90+50)+Math.round(Math.random()*90+60))
                }
            }else{
                viewer.dataSources.remove(pointLayer2,true);
            }
            break;
        case "3":
            if(status){
                let points3 =[{x:120.149988,y:31.308089}];
                let pointLayer3 = new Cesium.CustomDataSource('pointLayer3');
                viewer.dataSources.add(pointLayer3);
                let imageSrc ="../image/point2.png";
                for(let i=0;i<points3.length;i++){
                    addPointLayer(pointLayer3,imageSrc,points3[i].x,points3[i].y,20,Math.round(Math.random()*90+50)+Math.round(Math.random()*90+60))
                }
            }else{
                viewer.dataSources.remove(pointLayer3,true);
            }
            break;
        case "4":
            if(status){
                let points4 =[{x:120.335111,y:31.220179}];
                let pointLayer4 = new Cesium.CustomDataSource('pointLayer4');
                viewer.dataSources.add(pointLayer4);
                let imageSrc ="../image/point2.png";
                for(let i=0;i<points4.length;i++){
                    addPointLayer(pointLayer4,imageSrc,points4[i].x,points4[i].y,20,Math.round(Math.random()*90+50)+Math.round(Math.random()*90+60))
                }
            }else{
                viewer.dataSources.remove(pointLayer4,true);
            }
            break;
    }

}

function addPointLayer(pointLayer,imageSrc,x,y,z,id){
    pointLayer.entities.add({
        id:id,
        name:pointLayer,
        position: Cesium.Cartesian3.fromDegrees(parseFloat(x),parseFloat(y),Number(z)),
        billboard: {
            image:imageSrc,
            width: 24,
            height: 36,
            pixelOffset: new Cesium.Cartesian2(0, 0),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
    })
}

/**
 * 删除指定图层
 * @param layername
 */
function removeByLayer(layername,viewer) {
    const dataSources = viewer.dataSources._dataSources;
    console.log("返回数据...");
    console.log(dataSources)
    if (dataSources.length > 0) {
        for (let i = 0; i < dataSources.length; i++) {
            if (dataSources[i]._name === layername) {
                viewer.dataSources.remove(dataSources[i], true)
            }
        }
    }
}

function addCircleToMap(jd,wd,viewer) {
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(jd,wd),
        ellipse: {
            semiMinorAxis: 250.0,
            semiMajorAxis: 250.0,
            material: Cesium.Color.RED.withAlpha(0.5),
            outlineColor: Cesium.Color.RED
        }
    });
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(jd,wd),
        ellipse: {
            semiMinorAxis: 500.0,
            semiMajorAxis: 500.0,
            material: Cesium.Color.GREEN.withAlpha(0.5),
            outlineColor: Cesium.Color.GREEN
        }
    });
}


function addCircle2(jd,wd,layer,r,url) {
    layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(parseFloat(jd),parseFloat(wd),10),
        ellipse: {
            semiMinorAxis: r,
            semiMajorAxis: r,
            material:new Cesium.ImageMaterialProperty({
                image:url,
                transparent:true,
                // color:new Cesium.CallbackProperty(function () {
                //     if ((num % 2) === 0){
                //         alp -=0.06;
                //     }else {
                //         alp +=0.06;
                //     }
                //
                //     if (alp <= 0.3){
                //         num++;
                //     }else if (alp >= 1){
                //         num++;
                //     }
                //     return  Cesium.Color.WHITE.withAlpha(alp)
                //     //entity的颜色透明 并不影响材质，并且 entity也会透明
                // },false)
            }),
        }
    });
}

function addCircle(layer,jd,wd,z,list) {
    var alp = 1;
    var num = 0;
    if(list.length>0){
        let color,r=2000,radlist;
        for(let i=0;i<list.length;i++){
            switch(list[i].eventType){
                case "颗粒":
                    color =Cesium.Color.GREEN.withAlpha(0.7);
                    radlist = list[i].presetPointScope.split("-");
                    // r = Number(list[i].presetPointAngle)*1000
                    layer.entities.add({
                        position:Cesium.Cartesian3.fromDegrees(jd,wd,z),
                        orientation:Cesium.Transforms.headingPitchRollQuaternion(
                          Cesium.Cartesian3.fromDegrees(jd,wd,z),
                          new Cesium.HeadingPitchRoll(Cesium.Math.PI/0.5, 0, 0.0),
                          // new Cesium.HeadingPitchRoll(headings, 0, 0.0)
                        ),
                        ellipsoid:{
                            radii:new Cesium.Cartesian3(r,r,r),  // 扇形半径
                            innerRadii:new Cesium.Cartesian3(1.0, 1.0, 1.0), // 内半径
                            minimumClock:Cesium.Math.toRadians(Number(radlist[1])), // 左右偏角
                            maximumClock:Cesium.Math.toRadians(Number(radlist[0])),
                            minimumCone:Cesium.Math.toRadians(90),// 上下偏角  可以都设置为90
                            maximumCone:Cesium.Math.toRadians(90),
                            material:color,
                            outline:false
                        }
                    });
                    break
                case "带状":
                    color =Cesium.Color.ORANGERED.withAlpha(0.7);
                    radlist = list[i].presetPointScope.split("-");
                    // r = Number(list[i].presetPointAngle)*1000
                    layer.entities.add({
                        position:Cesium.Cartesian3.fromDegrees(jd,wd,z),
                        orientation:Cesium.Transforms.headingPitchRollQuaternion(
                          Cesium.Cartesian3.fromDegrees(jd,wd,z),
                          new Cesium.HeadingPitchRoll(Cesium.Math.PI/0.5, 0, 0.0),
                          // new Cesium.HeadingPitchRoll(headings, 0, 0.0)
                        ),
                        ellipsoid:{
                            radii:new Cesium.Cartesian3(r,r,r),  // 扇形半径
                            innerRadii:new Cesium.Cartesian3(1.0, 1.0, 1.0), // 内半径
                            minimumClock:Cesium.Math.toRadians(Number(radlist[1])), // 左右偏角
                            maximumClock:Cesium.Math.toRadians(Number(radlist[0])),
                            minimumCone:Cesium.Math.toRadians(90),// 上下偏角  可以都设置为90
                            maximumCone:Cesium.Math.toRadians(90),
                            material:color,
                            outline:false
                        }
                    });
                    break;
                case "片状":
                    color =Cesium.Color.RED.withAlpha(0.7);
                    radlist = list[i].presetPointScope.split("-");
                    // r = Number(list[i].presetPointAngle)*1000
                    layer.entities.add({
                        position:Cesium.Cartesian3.fromDegrees(jd,wd,z),
                        orientation:Cesium.Transforms.headingPitchRollQuaternion(
                          Cesium.Cartesian3.fromDegrees(jd,wd,z),
                          new Cesium.HeadingPitchRoll(Cesium.Math.PI/0.5, 0, 0.0),
                          // new Cesium.HeadingPitchRoll(headings, 0, 0.0)
                        ),
                        ellipsoid:{
                            radii:new Cesium.Cartesian3(r,r,r),  // 扇形半径
                            innerRadii:new Cesium.Cartesian3(1.0, 1.0, 1.0), // 内半径
                            minimumClock:Cesium.Math.toRadians(Number(radlist[1])), // 左右偏角
                            maximumClock:Cesium.Math.toRadians(Number(radlist[0])),
                            minimumCone:Cesium.Math.toRadians(90),// 上下偏角  可以都设置为90
                            maximumCone:Cesium.Math.toRadians(90),
                            material:color,
                            outline:false
                        }
                    });
                    break;
                default:
                    color =Cesium.Color.BLACK.withAlpha(0.5);
                    // color =new Cesium.Color(1.0,1.0,1.0,0.5);
                    radlist = list[i].presetPointScope.split("-");
                    // r = Number(list[i].presetPointAngle)*1000
                    var rgba = Cesium.Color.fromCssColorString('#00FF33');
                    layer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(jd, wd, z),
                        orientation: Cesium.Transforms.headingPitchRollQuaternion(
                          Cesium.Cartesian3.fromDegrees(jd, wd, z),
                          new Cesium.HeadingPitchRoll(Cesium.Math.PI / 0.5, 0, 0.0),
                          // new Cesium.HeadingPitchRoll(headings, 0, 0.0)
                        ),
                        ellipsoid: {
                            radii: new Cesium.Cartesian3(r, r, r),  // 扇形半径
                            innerRadii: new Cesium.Cartesian3(1.0, 1.0, 1.0), // 内半径
                            minimumClock: Cesium.Math.toRadians(Number(radlist[1])), // 左右偏角
                            maximumClock: Cesium.Math.toRadians(Number(radlist[0])),
                            minimumCone: Cesium.Math.toRadians(90),// 上下偏角  可以都设置为90
                            maximumCone: Cesium.Math.toRadians(90),
                            material:
                              new Cesium.ImageMaterialProperty({
                                  image:"../image/jianbian.png",
                                  transparent:true,
                                  color:new Cesium.CallbackProperty(function () {
                                      if ((num % 2) === 0){
                                          alp -=0.06;
                                      }else {
                                          alp +=0.06;
                                      }

                                      if (alp <= 0.3){
                                          num++;
                                      }else if (alp >= 1){
                                          num++;
                                      }
                                      return  Cesium.Color.WHITE.withAlpha(alp)
                                      //entity的颜色透明 并不影响材质，并且 entity也会透明
                                  },false)
                              }),
                            outline: false
                        }
                    })
                    break

            }
        }
    }
}
function getColorRamp(val){
    if(val==null){
        val={0.0:"blue",0.1:"cyan",0.37:"lime",0.54:"yellow",1:"red"}
    }
    var ramp=document.createElement('canvas');
    ramp.width=1;
    ramp.height=100;
    var ctx=ramp.getContext('2d');
    var grd=ctx.createLinearGradient(0,0,0,100);
    for(var key in val){
        grd.addColorStop(1-Number(key),val[key]);
    }
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,1,100);
    return ramp;
}

function wgs84ToWindow(jd, wd,viewer) {
    if (jd !== null && wd !== null) {
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, Cesium.Cartesian3.fromDegrees(jd,wd));
    }
}


/**
 * 添加长方体
 */
function addBox(layer,x,y,z,x1,y1,z1,color) {
    layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x,y,z),
        box:{
            dimensions : new Cesium.Cartesian3(x1,y1,z1),
            material : Cesium.Color.fromCssColorString(color),
            outline : false,
            outlineColor : Cesium.Color.BLACK
        }
    })
}

function addBoxPrimitive(viewer,x,y,z,x1,y1,z1,cartesian3,radians) {
    let material = Cesium.Material.fromType('Color');
    material.uniforms.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.8);
    let center = Cesium.Cartesian3.fromDegrees(x,y,z);
    let dimensions = new Cesium.Cartesian3(x1,y1,z1);
    let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    let hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(
      new Cesium.HeadingPitchRoll(radians, 0.0, 0.0)
    );
    let hpr = Cesium.Matrix4.fromRotationTranslation(hprRotation, cartesian3);
    Cesium.Matrix4.multiply(modelMatrix, hpr, modelMatrix);
    // viewer.scene.primitives.add(
     return  new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
              geometry: Cesium.BoxGeometry.fromDimensions({
                  vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                  dimensions: dimensions,
              }),
              modelMatrix: modelMatrix,//提供位置与姿态参数
          }),
          appearance: new Cesium.EllipsoidSurfaceAppearance({
              aboveGround: false,
              material: material
          })
      })
    // )
}

/**
 * 添加线
 * @param pointArray
 * @param viewer
 */
function addPolylineToMap(pointArray,viewer) {
    let polyline = viewer.entities.add({
        id: 'line001',
        name: "polyline",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArray),
            width: 5,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.fromCssColorString("rgb(12,154,51)"),
                outlineColor: Cesium.Color.fromCssColorString("rgb(12,154,51)")
            })
        }
    });
}

/**
 * 添加点位
 * @param id
 * @param jd
 * @param wd
 * @param typeName
 * @param iconUrl
 * @param height
 * @param entityName
 */
function addMarkPoint(id,jd,wd,typeName,iconUrl,height,entityName,viewer) {
    viewer.entities.add({
        id:id,
        name:typeName,
        position:Cesium.Cartesian3.fromDegrees(jd,wd,height),
        label:{
            scale:1.0,
            text:entityName,
            font:"16px sans-serif",
            outlineColor:Cesium.Color.fromCssColorString('#e51010'),
            color:Cesium.Color.fromCssColorString('#cb1e1e'),
            verticalOrigin:Cesium.VerticalOrigin.CENTER,//垂直位置
            pixelOffset:new Cesium.Cartesian2(25,-30),
            horizontalOrigin:Cesium.HorizontalOrigin.LEFT,//水平位置
            style:Cesium.LabelStyle.FILL_AND_OUTLINE,
            backgroundPadding:new Cesium.Cartesian2(2, 5)
        },
        billboard:{
            image:iconUrl,
            width:30,
            height:40,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM
        },
    });
}

/**
 * 添加报警圈了
 * @param id
 * @param jd
 * @param wd
 * @param height
 * @param r1
 * @param r2
 * @param imageUrl
 * @param typeName
 * @param iconUrl
 * @param waringName
 */
function addTwoCircleToMap(id,jd,wd,height,r1,r2,imageUrl,typeName,iconUrl,waringName,viewer) {
    let entity =viewer.entities.add({
        id:id,
        name:typeName,
        position:Cesium.Cartesian3.fromDegrees(jd,wd,height),
        billboard:{
            image:iconUrl,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
            // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,
        },
        label:{
            scale:1.0,
            text:waringName,
            font: "18px sans-serif",
            outlineColor:Cesium.Color.fromCssColorString('#fff'),
            verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
            horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
            pixelOffset:new Cesium.Cartesian2(40,-35),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            backgroundColor:Cesium.Color.fromCssColorString('#ee1212'),
            showBackground:true,
        },
    })
    viewer.entities.add({
        id:entity.id+"cir",
        position: Cesium.Cartesian3.fromDegrees(jd,wd,height),
        billboard: {
            image:imageUrl,
            width: 40,
            height:0,
            horizontalOrigin: Cesium.HorizontalOrigin.RELATIVE_TO_GROUND,
            verticalOrigin: Cesium.HorizontalOrigin.BOTTOM,
        },
        ellipse: {
            semiMinorAxis: new Cesium.CallbackProperty(function () {
                r1 = r1 + 0.8;
                if (r1 >= 50) {
                    r1 = 0;
                }
                return r1;
            }, false),
            semiMajorAxis: new Cesium.CallbackProperty(function () {
                r2 = r2 + 0.8;
                if (r2 >= 50) {
                    r2 = 0;
                }
                return r2;
            }, false),
            height: 10,
            material: new Cesium.ImageMaterialProperty({
                image: imageUrl,
                repeat: new Cesium.Cartesian2(1.0, 1.0),
                transparent: true,
                color: Cesium.Color.WHITE.withAlpha(1),
            })
        }
    });

}

/**
 * 添加模型
 * @param id
 * @param gltfUrl
 * @param uav
 * @param jd
 * @param wd
 * @param height
 * @param flyName
 */
function addFlyModel(id,gltfUrl,uav,jd,wd,height,flyName,viewer) {
    viewer.clock.shouldAnimate=true;
    // let entityObj =
      viewer.entities.add({
        id:id,
        name:uav,
        position:Cesium.Cartesian3.fromDegrees(jd,wd,height),
        model: {
            uri:gltfUrl,
            minimumPixelSize: 200,
            color:Cesium.Color.fromCssColorString('#fff')
        },
        // label:{
        //     scale:1.0,
        //     text:flyName,
        //     font: "18px sans-serif",
        //     outlineColor:Cesium.Color.fromCssColorString('#fff'),
        //     verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
        //     horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
        //     pixelOffset:new Cesium.Cartesian2(-40,-75),
        //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //     backgroundColor:Cesium.Color.fromCssColorString('#e22814'),
        //     showBackground:true,
        // }
    });
    // let areaEntity =viewer.entities.add({
    //     id:entityObj.id+"light",
    //     position: Cesium.Cartesian3.fromDegrees(jd,wd,5),
    //     name:'uav',
    //     ellipse: {
    //         semiMinorAxis: 45.0,
    //         semiMajorAxis: 45.0,
    //         material: Cesium.Color.WHITE.withAlpha(0.7),
    //         outlineColor: Cesium.Color.fromCssColorString('#efefef')
    //     }
    // });
}

function addBillboardGraphicsGroup(id,typeName,x,y,height,pointUrl,entityName,leftX,color,viewer) {
    viewer.entities.add({
        id:id,
        name:typeName,
        position:Cesium.Cartesian3.fromDegrees(x,y,height),
        label:{
            scale:1.0,
            text:entityName,
            font: "16px sans-serif",
            outlineColor:Cesium.Color.fromCssColorString('#fff'),
            color:Cesium.Color.fromCssColorString('#fff'),
            verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
            horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
            pixelOffset:new Cesium.Cartesian2(leftX,-85),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            backgroundColor:Cesium.Color.fromCssColorString(color),
            backgroundPadding: new Cesium.Cartesian2(2, 5),
            showBackground:true,
        },
        billboard:{
            image:pointUrl,
            width:30,
            height:40,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
        }
    });
}

function booleanEntity(id,viewer) {
    let entity = viewer.entities.getById(id);
    if(typeof(entity)!=="undefined"){
        entity.show=true;
        return true;
    }else{
        return  false;
    }
}

function addEntityPoint(id,typeName,x,y,height,entityName,leftX,leftY,color,pointUrl,description,viewer) {
    let entity =viewer.entities.add({
        id:id,
        name:typeName,
        position:Cesium.Cartesian3.fromDegrees(x,y,15),
        label:{
            scale:1.0,
            text:entityName,
            font: "16px sans-serif",
            outlineColor:Cesium.Color.fromCssColorString('#fff'),
            color:Cesium.Color.fromCssColorString('#fff'),
            verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
            horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
            pixelOffset:new Cesium.Cartesian2(leftX,leftY),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            backgroundColor:Cesium.Color.fromCssColorString(color),
            backgroundPadding: new Cesium.Cartesian2(2, 5),
            showBackground:true,
        },
        billboard:{
            image:pointUrl,
            width:30,
            height:40,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM
        },
        description:description
    });
    return entity;
}
function addEntityPointId (id,typeName,x,y,height,entityName,leftX,leftY,color,pointUrl,description,viewer) {
    viewer.entities.add({
        id:id,
        name:typeName,
        position:Cesium.Cartesian3.fromDegrees(x,y,height),
        label:{
            scale:1.0,
            text:entityName,
            font: "16px sans-serif",
            outlineColor:Cesium.Color.fromCssColorString('#fff'),
            color:Cesium.Color.fromCssColorString('#fff'),
            verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
            horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
            pixelOffset:new Cesium.Cartesian2(leftX,leftY),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            backgroundColor:Cesium.Color.fromCssColorString(color),
            backgroundPadding: new Cesium.Cartesian2(2, 5),
            showBackground:true,
        },
        billboard:{
            image:pointUrl,
            width:30,
            height:40,
            verticalOrigin:Cesium.VerticalOrigin.BOTTOM
        },
        description:description
    });
}

/**
 * 初始化天空盒
 */
function initSkyBox(viewer) {
    let blueSkyBox = new Cesium.SkyBox({
        sources:{
            positiveX:'./images/SkyBox/bluesky/Right.jpg',
            negativeX:'./images/SkyBox/bluesky/Left.jpg',
            positiveY:'./images/SkyBox/bluesky/Front.jpg',
            negativeY:'./images/SkyBox/bluesky/Back.jpg',
            positiveZ:'./images/SkyBox/bluesky/Up.jpg',
            negativeZ:'./images/SkyBox/bluesky/Down.jpg'
        }
    })

    let initialSkyBox =function() {
        if(viewer.scene.frameState.passes.render){
            blueSkyBox.update(scene.frameState,true);
            viewer.scene.postRender.removeEventListener(initialSkyBox);
        }
    }
    blueSkyBox.WSpeed = 0.5;
    blueSkyBox.show = true;
    let currentSkyBox =blueSkyBox;
    viewer.scene.skyBox = blueSkyBox;
    gradualChange(viewer,currentSkyBox)


}

function gradualChange(viewer,currentSkyBox){
    console.log(1111111111111)
    let skyListener =  function () {
        var cameraHeight = viewer.scene.camera.positionCartographic.height;
        var skyAtmosphereH1 = 22e4; // 大气开始渐变的最大高度
        var skyBoxH1 = 15e4; // 天空开始渐变的最大高度
        var skyBoxH2 = 12e4; // 天空开始渐变的最小高度
        var bufferHeight = 1e4;
        if (cameraHeight < skyAtmosphereH1 && Cesium.defined(currentSkyBox)) {
            var skyAtmosphereT = (cameraHeight - skyBoxH2) / (skyAtmosphereH1 - skyBoxH2);
            if (skyAtmosphereT > 1.0) {
                skyAtmosphereT = 1.0;
            } else if (skyAtmosphereT < 0.0) {
                skyAtmosphereT = 0.0;
            }
            var skyBoxT = (cameraHeight - skyBoxH2) / (skyBoxH1 - skyBoxH2);
            if (skyBoxT > 1.0) {
                skyBoxT = 1.0;
            } else if (skyBoxT < 0.0) {
                skyBoxT = 0.0;
            }
            currentSkyBox.alpha = 1.0 - skyBoxT;
            if(cameraHeight>skyBoxH2){
                viewer.scene.skyAtmosphere.show = true;
                viewer.scene.skyAtmosphere.alpha = skyAtmosphereT;
                viewer.scene.skyBox = currentSkyBox;
            }else{
                viewer.scene.skyAtmosphere.show = false;
            }
        } else {
            viewer.scene.skyAtmosphere.alpha = 1.0;
            viewer.scene.skyBox = currentSkyBox;
        }

        //控制相机 速率

        if (cameraHeight > (skyBoxH2 - 2 * bufferHeight) && cameraHeight < skyBoxH1 + 3 * bufferHeight) {
            viewer.scene.screenSpaceCameraController.zoomFactor = 0.4;
        } else {
            viewer.scene.screenSpaceCameraController.zoomFactor = 5.0;
        }
    };
    viewer.scene.postRender.addEventListener(skyListener);
}


function addPolygonToScene(layer,datas,color,height) {
    layer.entities.add({
        polygon:{
            hierarchy:Cesium.Cartesian3.fromDegreesArrayHeights(datas),
            material:Cesium.Color.fromCssColorString(color).withAlpha(0.4),
            height:height,
            outline:true,
            outlineWidth:3,
            outlineColor:Cesium.Color.fromCssColorString(color)
        }
    });
}











export default {
    initMap,addBillboard,addLine,addWaterAnimation,addLayerToMap,removeByLayer,init2,init3,
    addCircleToMap,addCircle,addCircle2,windowToWGS84,wgs84ToWindow,addBox,addBoxPrimitive,
    addMarkPoint,addTwoCircleToMap,addBillboardGraphicsGroup,addFlyModel,booleanEntity,addEntityPoint,addEntityPointId,
    initMap2,addPolylineToMap,initSkyBox,addPolygonToScene
}
