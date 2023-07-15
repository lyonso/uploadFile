import * as echarts from 'echarts'

export const getOption = (x, ch2oY, vocY, CH2O, VOC) => {
  return {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(0, 255, 233, 0)'
            }, {
              offset: 0.5,
              color: 'rgba(255, 255, 255, 1)'
            }, {
              offset: 1,
              color: 'rgba(0, 255, 233, 0)'
            }],
            global: false
          }
        }
      }
    },
    // legend: {
    //   x: '4%',
    //   textStyle: {
    //     color: '#F5FDFD',
    //     fontSize: '15px'
    //   },
    //   data: [
    //     { name: '甲醛', icon: 'roundRect' },
    //     { name: 'VOC', icon: 'roundRect' },
    //   ]
    // },
    grid: {
      top: '20%',
      left: '12%',
      right: '12%',
      bottom: '15%'
    },
    xAxis: {
      data: x,
      axisLabel: {
        margin: 10,
        color: 'rgba(173, 177, 182, 1)',
        textStyle: {
          fontSize: 12
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 1)'
        }
      },
      axisTick: {
        show: false
      }
    },
    // yAxis: {
    //   type: 'value',
    //   // max: '1200',
    //   splitLine: {
    //     show: true,
    //     lineStyle: {
    //       type: 'solid',
    //       width: 1,
    //       color: '#16AEE0'
    //     }
    //   },
    //   axisLine: {
    //     show: false,
    //     lineStyle: {
    //       color: '#ffffff',
    //       fontSize: 14
    //     }
    //   },
    //   axisTick: {
    //     inside: true,
    //     show: false
    //   },
    //   axisLabel: {
    //     inside: true,
    //     margin: -10,
    //     verticalAlign: "bottom"
    //   }
    // },
    yAxis: [
      {
        type: 'value',
        name: '甲醛（mg/m³）',
        nameTextStyle: {
          fontSize: 12,
          color: '#fff'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(255, 255, 255, 0.15)',
            width: 1
          }
        },
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        axisLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: 'VOC（mg/m³）',
        nameTextStyle: {
          fontSize: 12,
          color: '#fff'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed',
            color: '#ddd',
            width: 1
          }
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        axisLine: {
          show: false
        }
      }
    ],
    series: [
      {
        markLine: {
          data: [
            [
              { name: '', xAxis: 0, yAxis: CH2O, symbol: 'circle'},
              { name: '', xAxis: x[x.length - 1], yAxis: CH2O, symbol: 'circle' },
            ]
          ]
        },
        name: '甲醛',
        type: 'line',
        yAxisIndex: 0,
        smooth: false, //是否平滑
        showAllSymbol: false,
        symbol: 'none',
        lineStyle: {
          normal: {
            color: '#16AEE0',
            borderWidth: 0.5
          }
        },
        itemStyle: {
          color: '#16AEE0',
          borderColor: '#16AEE0'
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#0B2136'
            },
              {
                offset: 1,
                color: '#0F4D71'
              }
            ], false)
          }
        },
        data: ch2oY
      },
      {
        markLine: {
          data: [
            [
              { name: '', xAxis: 0, yAxis: VOC, symbol: 'circle'},
              { name: '', xAxis: x[x.length - 1], yAxis: VOC, symbol: 'circle' },
            ]
          ]
        },
        name: 'VOC',
        type: 'line',
        yAxisIndex: 1,
        smooth: false, //是否平滑
        showAllSymbol: false,
        symbol: 'none',
        lineStyle: {
          normal: {
            color: '#F33131',
            borderWidth: 0.5
          }
        },
        itemStyle: {
          color: '#F33131',
          borderColor: '#F33131'
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#4e0808'
            },
              {
                offset: 1,
                color: '#900e0e'
              }
            ], false)
          }
        },
        data: vocY
      }
    ]
  }
}