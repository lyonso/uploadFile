
export default function addFlyCzml(viewer,positions,pointId,interval,currentTime) {
  let czml = [
    {
      id: 'document',
      name: 'polygon',
      version: '1.0',
      clock: {
        interval:interval,//规定时间范围
        currentTime:currentTime,//当前时间
        multiplier: 0.5,
      },
    },
    {
      id: pointId,
      name: 'uav',
      //添加图片
      billboard: {
        //图标
        image:'../image/scene001/icon_air_b.png',
        width:40,
        height:36,
        scale:1,
      },
      //添加blb模型及运动路径
      position: {
        interpolationAlgorithm: 'LINEAR',
        forwardExtrapolationType: 'HOLD',
        epoch:currentTime,
        cartographicDegrees: positions
      },
      path: {
        "material": {
          "polylineOutline": {
            "color": {
              "rgba": [0, 255,43,255]
            },
          }
        },
        "width": 3,
        "leadTime": 0, // 路线提前执行时间
        "trailTime": 100000, // 路线跟踪时间
        "resolution": 5,
      },
      orientation: {
        velocityReference: '#position',
      },
    },
  ]

  return  czml;



}

