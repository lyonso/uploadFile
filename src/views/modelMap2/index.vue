<template>
  <div>
    <div id="container"></div>
    <popup ref="child"/>
    <info ref="info"/>
  </div>
</template>

<script>
import supermapJs from "@/mapJs/supermapJs";
import Popup from '@/views/modelMap2/comments/popup/index'
import Info from '@/views/modelMap2/comments/info/index'
import {EventBus} from '@/mapJs/EventBus'
let serverHttp=process.env.VUE_APP_GIS

export default {
  name: "index",
  components: { Popup,Info },
  data(){
    return{
      viewer: null,
      processPoint3:[120.478083471,31.0099246817,6.129,120.478083246747,31.0099217885952,6.132,
        120.4780831977,31.0099218451587,6.558],
      processPoint4:[120.478087761316,31.0099244832722,7.782,
        120.478081057418,31.0099245375823,7.781,
        120.478081057418,31.0099245375823,6.412,
      120.47808196414,31.0099247199715,6.412,120.47808196414,31.0099247199715,5.891],
      processPoint5:[120.478080593719,31.009921563604,6.683,
        120.478080593719,31.009921563604,6.363,
        120.478080872395,31.0099243887827,6.363,
        120.478080872395,31.0099243887827,6.222],
      processPoint6:[120.478087034626,31.0099222378826,6.612,
        120.478087034626,31.0099222378826,6.197,120.478086942104,31.0099198531427,6.197,
        120.478083285673,31.0099198246096,6.197,120.478083285673,31.0099198246096,6.110,
        120.478083224604,31.0099244758705,6.110,120.478083224604,31.0099244758705,6.089],
      processPoint7:[
        120.478109092104,31.0099249416138,3.818,
        120.478109121768,31.0099249445501,2.961,
        120.478111081441,31.0099248334865,2.959,
        120.478111090714,31.0099249073285,2.591
      ],
      processPoint16:[120.4781088285843,31.0099257007798,2.429,120.478107703621,31.009936087584,2.429,
        120.478107703621,31.009936087584,5.803,
      120.478107697276,31.0099256219052,5.803,120.478089090899,31.0099237701572,5.845,
        120.478084316894,31.0099238114816,5.845,120.478084316894,31.0099238114816,6.195,
        120.478083579953,31.0099240780871,6.195,120.478083579953,31.0099240780871,6.965,
        120.478083723997,31.0099235660254,6.965],
      processPoint10:[120.4781088285843,31.0099257007798,2.429,120.478107703621,31.009936087584,2.429,
        120.478107703621,31.009936087584,5.803,
        120.478107697276,31.0099256219052,5.803,120.478089090899,31.0099237701572,5.845,
        120.478084316894,31.0099238114816,5.845,120.478084316894,31.0099238114816,6.195,
        120.478083579953,31.0099240780871,6.195,120.478083579953,31.0099240780871,6.715,
        120.478080732398,31.0099240945033,6.715,120.478080732398,31.0099240945033,6.603,
        120.478080541492,31.0099226298237,6.603, 120.478080541492,31.0099226298237,6.917,
        120.478080514401,31.009922212463,6.917],
      processPoint9:[
        120.478108155878,31.0099363065398,2.419,
        120.478108271076,31.0099362291596,5.730,
        120.478108271616,31.0099362024513,5.756,
        120.478108271389,31.0099361391096,5.781,
        120.478108271475,31.009936018222,5.800,
        120.478108270408,31.0099358613414,5.814,
        120.47810827088 ,31.0099356164559,5.822,
        120.478108270855,31.0099353760028,5.825,
        120.478108271228,31.0099256136664,5.822,
        120.478108246348,31.0099241238155,5.824,
        120.478108092361,31.009923846336,5.832,
        120.478107807956,31.0099236980224,5.841,
        120.478107320495,31.0099236981668,5.848,
        120.478088358054,31.0099237856496,5.843,
        120.4780843545,31.0099238118596,5.847,
        120.478084397115,31.0099237868455,6.200,
        120.478083649009,31.0099240586548,6.200,
        120.478083552133,31.0099240833069,6.779,
        120.478085486902,31.0099240830948,6.777,
        120.478085520117,31.0099240873664,6.359,
        120.47808661305,31.0099239007187,6.362,
        120.478086680138,31.0099245951682,6.354,
        120.478086670304,31.0099245988243,6.680,
        120.478086532472,31.0099240759484,6.683
      ],
      processPoint12:[
        120.478087013863,31.0099240075831,5.845,
        120.478082947862,31.0099240815302,5.857,
        120.478082933956,31.0099240960436,6.190,
        120.478082217126,31.0099240961632,6.191,
        120.478082247225,31.0099240913567,6.197,
        120.478082196663,31.0099240797355,6.446,
        120.478082891779,31.0099240966946,6.446,
        120.478082876118,31.009924082953,6.712,
        120.478083527717,31.0099240844257,6.711,
        120.478083559972,31.0099240838896,6.779,
        120.478085500665,31.0099240843851,6.777,
        120.478085540795,31.009924084711,6.359,
        120.478086717414,31.0099237596531,6.364,
        120.478086649585,31.0099245915582,6.355,
        120.478086704075,31.00992460096,6.676,
        120.478086533283,31.0099240786063,6.686
      ],

      processPoint17:[
        120.478082326373,31.0099219101805,6.670,
        120.478081546122,31.0099219140756,6.667,
        120.47808157787,31.0099219450962,5.939,
        120.478081314536,31.0099224528578,5.932,
        120.478081181532,31.0099242160491,5.932,
        120.478081292754,31.0099245101814,5.934,
        120.4780803434,31.0099245160222,5.936,
        120.478080353721,31.0099245309367,6.954,
        120.478081067303,31.0099245323167,6.956,
        120.478081056765,31.0099245368178,7.782,
        120.478087832639,31.0099244796016,7.784,
      ],

      processPoint15:[
        120.478107743223,31.0099245938122,2.600,
        120.478107753396,31.0099245944575,2.726,
        120.478112509269,31.009924649997,2.726,
        120.478112662437,31.0099252484257,2.726,
        120.478112646119,31.0099249276339,4.271,
        120.478107836873,31.0099249317319,4.269,
        120.478107804472,31.0099249312073,4.103,
        120.478108382374,31.0099249714391,4.102
      ],
    controlStep:[
        {
          "index":0,
          "number":3,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅰ沉砂桶排水（开3#阀）",
          "description":"排空沉沙桶清洗水",
          "position":{jd: 120.478084, wd: 31.009853, z: 0},
          "obj":{
            top: 680,
            left: 926
          }

        },
        {
          "index":1,
          "number":4,
          "status":true,
          "time":0,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅰ过滤器排水（开4#阀）",
          "description":"排空竖式过滤器清洗水",
          "position":{jd: 120.477936, wd: 31.009744, z: 0},
          "obj":{
            top: 380,
            left: 1026
          }
        },{
          "index":2,
          "number":5,
          "status":true,
          "time":0,
          "flyTo":{
            destination: { x: -2772687.8425971265,
              y: 4711216.855738175,
              z: 3285933.6857479876 },
            orientation: {
              heading:1.6047063697013995,
              pitch:-0.04257698537978727,
              roll:6.283185307179586
            }
          },
          "text":"Ⅰ留样桶排水（开5#阀）",
          "description":"排空留样桶清洗水",
          "position":{jd: 120.478176, wd: 31.009927, z: 0},
          "obj":{
            top: 665.94,
            left: 899.52
          }
        },
        {
          "index":3,
          "number":6,
          "status":true,
          "time":0,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅰ六参排水（开6#阀）",
          "description":"排空常规六参数分析仪浸泡清洗水",
          "position":{jd: 120.478264, wd: 31.009554, z: 0},
          "obj":{
            top: 567.16,
            left: 767
          }
        },
        {
          "index":4,
          "number":7,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: {x: -2772690.137685682, y: 4711210.117350867, z: 3285934.855946186},
            orientation: {
              heading:3.089487038558202,
              pitch:-0.06798223405827963,
              roll:6.2831853071795685
            }
          },
          text:"Ⅰ进样桶排水（开7#阀）",
          "description":"排空进样桶清洗水",
          "position":{jd: 120.478082, wd: 31.009832, z: 0},
          "obj":{
            top: 386,
            left: 730
          }
        },
        {
          "index":5,
          "number":3,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅱ排水结束",
          "description":"关闭3#阀",
          "position":{jd: 120.478099, wd: 31.00982, z: 0},
          "obj":{
            top: 680,
            left: 926
          }
        },
        {
          "index":6,
          "number":4,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅱ排水结束",
          "description":"关闭4#阀",
          "position":{jd: 120.477996, wd: 31.009863, z: 0},
          "obj":{
            top: 380,
            left: 1026
          }
        },
        {
          "index":7,
          "number":5,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772687.8425971265, y: 4711216.855738175, z: 3285933.6857479876 },
            orientation: {
              heading:1.6047063697013995,
              pitch:-0.04257698537978727,
              roll:6.283185307179586
            }
          },
          "text":"Ⅱ排水结束",
          "description":"关闭5#阀",
          "position":{jd: 120.478176, wd: 31.009927, z: 0},
          "obj":{
            top: 665.94,
            left: 899.52
          }
        },
        {
          "index":8,
          "number":6,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅱ排水结束",
          "description":"关闭6#阀",
          "position":{jd: 120.478264, wd: 31.009554, z: 0},
          "obj":{
            top: 567.16,
            left: 767
          }
        },
        {
          "index":9,
          "number":7,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: {x: -2772690.137685682, y: 4711210.117350867, z: 3285934.855946186},
            orientation: {
              heading:3.089487038558202,
              pitch:-0.06798223405827963,
              roll:6.2831853071795685
            }
          },
          "text":"Ⅱ排水结束",
          "description":"关闭7#阀",
          "position":{jd: 120.478082, wd: 31.009832, z: 0},
            "obj":{
              top: 386,
              left: 730
            }
        },
        {
          "index":10,
          "number":10,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: { x: -2772687.8425971265, y: 4711216.855738175, z: 3285933.6857479876 },
            orientation: {
              heading:1.6047063697013995,
              pitch:-0.04257698537978727,
              roll:6.283185307179586
            }
          },
          "text":"Ⅲ留样桶取原水（开10#阀）",
          "description":"留样桶进原水，仪表检测值超标将自动留样",
          "position":{jd: 120.478155, wd: 31.009894, z: 0},
          "obj":{
            top: 598,
            left: 830
          }
        },
      {
        "index":11,
        "number":16,
        "status":true,
        "time":3000,
        "flyTo":{
          destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
          orientation: {
            heading: 3.120972358731195,
            pitch:-0.14057356212382133,
            roll: 6.2831853071795685
          }
        },
        "text":"第二环节取原水:开16#阀",
        "description":"沉沙桶进原水阀门开启，准备开泵进原水",
        "position": {jd: 120.478094, wd: 31.009829, z: 0},
        "obj":{
          top: 347.85,
          left: 909.74
        }
      },
        {
          "index":12,
          "number":16,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"第二环节取原水:关16#阀",
          "description":"沉沙桶水满，关闭进水阀门，原水开始静置沉淀",
          "position": {jd: 120.478094, wd: 31.009829, z: 0},
          "obj":{
            top: 347.85,
            left: 909.74
          }
        },
        {
          "index":13,
          "number":10,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772687.8425971265, y: 4711216.855738175, z: 3285933.6857479876 },
            orientation: {
              heading:1.6047063697013995,
              pitch:-0.04257698537978727,
              roll:6.283185307179586
            }
          },
          "text":"Ⅲ留样桶水满（关10#阀）",
          "description":"留样桶水满，关闭留样桶进水阀门",

          "position":{jd: 120.478155, wd: 31.009894, z: 0},
          "obj":{
            top: 598,
            left: 830
          }
        },
        {
          "index":14,
          "number":9,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅲ多参数分析仪（开9#阀）",
          "description":"常规六参数分析仪测量池开始进原水，持续5分钟",
          "position":{jd: 120.478085, wd: 31.009849, z: 0},
          "obj":{
            top: 495,
            left: 809
          }
        },
        {
          "index":15,
          "number":6,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅳ排空六参数分析仪原水（开6#阀）",
          "description":"常规六参数分析仪持续测量原水5分钟结束，开始排空测量池原水",
          "position":{jd: 120.478264, wd: 31.009554, z: 0},
          "obj":{
            top: 567.16,
            left: 767
          }
        },
        {
          "index":16,
          "number":12,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅳ自来水冲洗常规六参数分析仪（开12#阀）",
          "description":"清洗自来水冲洗常规六参数分析仪测量池及测量电极",

          "position":{jd: 120.478114, wd: 31.009813, z: 0},
          "obj":{
            top: 496,
            left: 942
          }
        },
        {
          "index":17,
          "number":6,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅳ排空测量池原水（关6#阀）",
          "description":"测量池原水排空",
          "position":{jd: 120.478264, wd: 31.009554, z: 0},
          "obj":{
            top: 567.16,
            left: 767
          }
        },
        {
          "index":18,
          "number":12,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅳ自来水冲洗结束",
          "description":"关12#阀",
          "position":{jd: 120.478114, wd: 31.009813, z: 0},
          "obj":{
            top: 496,
            left: 942
          }
        },
        {
          "index":19,
          "number":9,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅳ自来水冲洗结束",
          "description":"关9#阀",
          "position":{jd: 120.478085, wd: 31.009849, z: 0},
          "obj":{
            top: 495,
            left: 809
          }
        },
        {
          "index":20,
          "number":4,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅳ过滤器排水",
          "description":"开4#阀",
          "position":{jd: 120.477996, wd: 31.009863, z: 0},
          "obj":{
            top: 380,
            left: 1026
          }
        },
        {
          "index":21,
          "number":4,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772689.891974514, y: 4711213.587957324, z: 3285936.6195797394 },
            orientation: {
              heading: 3.120972358731195,
              pitch:-0.14057356212382133,
              roll: 6.2831853071795685
            }
          },
          "text":"Ⅳ过滤器排水",
          "description":"关4#阀",
          "position":{jd: 120.477996, wd: 31.009863, z: 0},
          "obj":{
            top: 380,
            left: 1026
          }
        },
        {
          "index":22,
          "number":17,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: { x: -2772687.8425971265, y: 4711216.855738175, z: 3285933.6857479876 },
            orientation: {
              heading:1.6047063697013995,
              pitch:-0.04257698537978727,
              roll:6.283185307179586
            }
          },
          "text":"Ⅴ仪表供水",
          "description":"开增压泵，开17#阀",
          "position":{jd: 120.478095, wd: 31.009839, z: 0},
          "obj":{
            top: 793,
            left: 822
          }
        },
        {
          "index":23,
          "number":15,
          "status":true,
          "time":3000,
          "flyTo":{
            destination: {x: -2772690.137685682, y: 4711210.117350867, z: 3285934.855946186},
            orientation: {
              heading:3.089487038558202,
              pitch:-0.06798223405827963,
              roll:6.2831853071795685
            }
          },
          "text":"Ⅴ仪表供水",
          "description":"开15#阀",
          "position":{jd: 120.478138, wd: 31.009787, z: 0},
          "obj":{
            top: 100,
            left: 774
          }
        },
        {
          "index":24,
          "number":17,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: { x: -2772687.8425971265, y: 4711216.855738175, z: 3285933.6857479876 },
            orientation: {
              heading:1.6047063697013995,
              pitch:-0.04257698537978727,
              roll:6.283185307179586
            }
          },
          "text":"Ⅴ仪表供水结束",
          "description":"关17#阀",
          "position":{jd: 120.478095, wd: 31.009839, z: 0},
          "obj":{
            top: 793,
            left: 822
          }
        },
        {
          "number":15,
          "status":false,
          "time":3000,
          "flyTo":{
            destination: {x: -2772690.137685682, y: 4711210.117350867, z: 3285934.855946186},
            orientation: {
              heading:3.089487038558202,
              pitch:-0.06798223405827963,
              roll:6.2831853071795685
            }
          },
          "text":"Ⅴ仪表供水结束",
          "description":"关15#阀",
          "position":{jd: 120.478138, wd: 31.009787, z: 0},
          "obj":{
            top: 100,
            left: 774
          }
        }
      ],
      intervalTime:2000,
      step:1,
      markerData:[
        {jd: 120.478083945523, wd:31.009918503559,name:"自动监测系统",left:0,src:'./label/b5.png',top:0},
        {jd: 120.47809314974, wd:31.0099185401821,name:"分析单元COD",left:0,src:'./label/b1.png',top:-30},
        {jd: 120.478101149485, wd:31.0099185397235,name:"氨氮总氮",left:0,src:'./label/b4.png',top:0},
        {jd: 120.478109837067, wd:31.0099185395407,name:'分析单元总磷',left:0,src:'./label/b2.png',top:-30},
        {jd: 120.478118087205, wd:31.0099185045897,name:"分析单元质控仪",left:0,src:'./label/b3.png',top:0}
      ],
      markerLayer:new Cesium.CustomDataSource('markerLayer')
    }
  },
  mounted() {
    this.viewer = supermapJs.init2('container');
    window.viewer = this.viewer;
    let self = this
    let promise = this.viewer.scene.open(serverHttp+"/iserver/services/3D-dimian-SZJCZ/rest/realspace");
    Cesium.when(promise, function(layer) {
      self.viewer.scene.camera.setView({
        destination: { x: -2772717.124308144, y: 4711224.049839629, z: 3285926.216207532 },
        orientation: {
          heading: 5.505731953519758,
          pitch: -0.6532221724559917,
          roll: 6.283185307179581
        }
      })
    });
    this.initDataMarker();
    let hanlder = new Cesium.ScreenSpaceEventHandler(self.viewer.scene.canvas);
    hanlder.setInputAction(function(res) {
      // let earthPosition =self.viewer.camera.pickEllipsoid(res.position, self.viewer.scene.globe.ellipsoid);
      // let obj =self.cartesian3ToWGS84(earthPosition)
      // console.log(obj)
      let nowClick = self.viewer.scene.layers.getSelectedLayer();
      let selectlayer=self.viewer.scene.layers.getSelectedLayer();
      console.log(selectlayer.name)
      console.log(nowClick.getSelection())
      if(selectlayer.name==="wailimian@SZJCZ01"){
        self.$store.dispatch('automaticStation/setBIMDetailsStatus', 2)
        selectlayer.visible =false
        let setLayer = self.viewer.scene.layers.find("YQYBDoor@SZJCZ01");
        self.viewer.scene.layers.find("Tree@SZJCZ01").visible =false
        setLayer.visible = false;
        self.viewer.scene.camera.setView({
          destination: { x: -2772696.021510951, y: 4711219.161313284, z: 3285922.7206866257 },
          orientation: {
            heading: 6.275719429016772,
            pitch: -0.1491975307687563,
            roll: 6.2831853071795845
          }
        })
      }else if(nowClick.name==="YQYBOther@SZJCZ01"){
        if(nowClick.getSelection()[0]==="5"){
          self.$refs.info.show(24);
          self.viewer.scene.camera.setView({
            destination: { x: -2772691.26491149, y: 4711214.740207192, z: 3285928.2716209353 },
            orientation: {
              heading:6.275719254014636,
              pitch:-0.149195978300214,
              roll:6.2831853071795845
            }
          })
          self.$store.dispatch('automaticStation/setBIMDetailsStatus', 3);
          self.$store.dispatch('automaticStation/setEquipmentImgChose', 0)
        }else if(nowClick.getSelection()[0]==="4"){
          self.$refs.info.show(25);
          self.viewer.scene.camera.setView({
            destination: { x: -2772691.7989357784, y: 4711214.156322917, z: 3285928.6581538185 },
            orientation: {
              heading:6.275719254014636,
              pitch:-0.14919597830021591,
              roll:6.2831853071795845
            }
          })
          self.$store.dispatch('automaticStation/setBIMDetailsStatus', 3);
          self.$store.dispatch('automaticStation/setEquipmentImgChose', 1)
        }else if(nowClick.getSelection()[0]==="1"){
          self.$refs.info.show(26);
          self.viewer.scene.camera.setView({
            destination: { x: -2772692.4838775815, y: 4711213.68730546, z: 3285928.669040678 },
            orientation: {
              heading:6.275719254014636,
              pitch:-0.14919597830021591,
              roll:6.2831853071795845
            }
          })
          self.$store.dispatch('automaticStation/setBIMDetailsStatus', 3);
          self.$store.dispatch('automaticStation/setEquipmentImgChose', 2)
        }
        }else if(nowClick.name ==="YQYB@SZJCZ01"){
          if(nowClick.getSelection()[0]==="163") {
            self.$refs.info.show(27);
            self.viewer.scene.camera.setView({
              destination: { x: -2772692.8749105767, y: 4711213.286200986, z: 3285928.6316228244 },
              orientation: {
                heading:6.275719254014636,
                pitch:-0.14919597830021591,
                roll:6.2831853071795845
              }
            })
            self.$store.dispatch('automaticStation/setBIMDetailsStatus', 3);
            self.$store.dispatch('automaticStation/setEquipmentImgChose', 3)
          }
        }else if(nowClick.name ==="YQYB@SZJCZ01"){
        if(nowClick.getSelection()[0]==="6") {
          self.viewer.scene.camera.setView({
            destination: { x: -2772693.692830142, y: 4711213.70982674, z: 3285928.2772786333 },
            orientation: {
              heading:6.275719500465598,
              pitch:-0.14919631011376144,
              roll:6.283185307179583
            }
          })
          self.$store.dispatch('automaticStation/setBIMDetailsStatus', 3);
          self.$store.dispatch('automaticStation/setEquipmentImgChose', 4)
        }

      }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);

    self.viewer.dataSources.add(self.markerLayer);

    /**
     * 事件名临时填写
     */
    EventBus.$on("caowei",function(obj) {
      if(obj.floor ===1 || obj.floor ==="1"){
        self.floorCamera1(obj.angle)
      }else if(obj.floor ===2 || obj.floor ==="2"){
        self.floorCamera2(obj.angle)
      }else if(obj.floor ===0 || obj.floor ==="0"){
        self.initCamera(obj.angle)
      }
    });

    EventBus.$on("system",function(obj) {
      self.initSystem();
    })
  },
  methods:{
    initCamera(val){
      switch (val) {
         case 1:
           this.viewer.scene.camera.setView({
             destination: { x: -2772696.021510951, y: 4711219.161313284, z: 3285922.7206866257 },
             orientation: {
               heading: 6.275719429016772,
               pitch: -0.1491975307687563,
               roll: 6.2831853071795845
             }
           })
           break;
         case 2:
           this.viewer.scene.camera.setView({
             destination: { x: -2772687.57321165, y: 4711210.433427551, z: 3285942.744584135 },
             orientation: {
               heading:3.1152228813735894,
               pitch:-0.1507967840620634,
               roll:6.283185307179583
             }
           })
           break;
      }
    },
    floorCamera1(val){
      switch (val) {
        case 1:
          this.viewer.scene.camera.setView({
            destination: { x: -2772692.7427193443, y: 4711213.711910677, z: 3285927.568309752 },
            orientation: {
              heading:6.275282924905659,
              pitch:-0.00897695377798069,
              roll:6.283185307179572
            }
          })
          break;
        case 2:
          this.viewer.scene.camera.setView({
            destination: { x: -2772689.1169386804, y: 4711209.5240828, z: 3285936.558907947},
            orientation: {
              heading:3.156677353281241,
              pitch:0.01219591885137849,
              roll:6.283185307179572
            }
          })
          break;
        default:
          break;
      }
    },
    floorCamera2(val){
      switch (val) {
        case 1:
          this.viewer.scene.camera.setView({
            destination: { x: -2772694.1256868416, y: 4711216.166991929, z: 3285929.255517307},
            orientation: {
              heading:6.279577044051294,
              pitch:-0.012375195041411269,
              roll:6.283185307179561
            }
          })
          break;
        case 2:
          this.viewer.scene.camera.setView({
            destination: { x: -2772690.3177510374, y: 4711212.147796924, z: 3285938.486977979},
            orientation: {
              heading:3.09821608731929,
              pitch:-0.0419454950208968,
              roll:6.283185307179583
            }
          })
          break;
      }
    },
    initDataMarker(){
      this.markerLayer.entities.removeAll();
      for(let i=0;i<this.markerData.length;i++){
        this.addMarker(this.markerLayer,this.markerData[i].jd,this.markerData[i].wd,3,this.markerData[i].name,
          this.markerData[i].src,this.markerData[i].left,this.markerData[i].top)
      }
    },
    addMarker(layer,jd,wd,height,name,src,left,top){
      layer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(jd, wd, height),
        name:name,
        billboard: new Cesium.BillboardGraphics({
          image:src,
          width:60,
          height:50,
          verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(left,top)
        }),
      })
    },
    initSystem(){
        this.controlWorkmanship();
    },
    /**
     * 经纬度转换为屏幕坐标
     * @param jd
     * @param wd
     * @returns {Cartesian2}
     * @constructor
     */
    wgs84ToWindow(jd,wd) {
      if(jd!==null && wd!==null){
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene,Cesium.Cartesian3.fromDegrees(jd,wd));
      }
    },
    /**
     * 屏幕坐标转换地理坐标
     * @param cartesian2
     */
    windowToWGS84(cartesian2) {
      let cartesian = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(cartesian2),this.viewer.scene);
      let catographic =Cesium.Cartographic.fromCartesian(cartesian);
      let jd =Number(Cesium.Math.toDegrees(catographic.longitude)).toFixed(6);
      let wd =Number(Cesium.Math.toDegrees(catographic.latitude)).toFixed(6);
      let position ={jd:jd,wd:wd};
      return position;
    },
    addBillboardGraphicsGroup(pointLayer,id,typeName,x,y,height,entityName,leftX,color) {
      pointLayer.entities.add({
        id:id,
        name:typeName,
        position:Cesium.Cartesian3.fromDegrees(x,y,height),
        label:{
          scale:1.0,
          text:entityName,
          font: "10px sans-serif",
          outlineColor:Cesium.Color.fromCssColorString('#f51313'),
          color:Cesium.Color.fromCssColorString('#ee0a0a'),
          verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
          horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
          pixelOffset:new Cesium.Cartesian2(5,-35),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          backgroundColor:Cesium.Color.fromCssColorString(color),
          backgroundPadding: new Cesium.Cartesian2(2, 5),
          showBackground:true,
        }
      });
    },
    removeLayer(layerName){
      this.viewer.dataSources.remove(layerName, true);
    },
    addPointLine(arrPoint,id){
      this.viewer.entities.add({
        id:id,
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPoint),
          width:3,
          material:new Cesium.PolylineTrailMaterialProperty({
            color:Cesium.Color.DODGERBLUE,
            trailLength:5,
            period:0.8,
          })
        },
      });

      // this.viewer.entities.add({
      //   id:id+'polyline11',
      //   polyline: {
      //     positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPoint),
      //     width:3,
      //     material: new Cesium.PolylineOutlineMaterialProperty({
      //         color: Cesium.Color.CYAN.withAlpha(0.9),
      //         outlineWidth: 5,
      //         outlineColor: Cesium.Color.CYAN,
      //     })
      //   },
      // });
    },
    removeById(id){
      console.log(id);
      this.viewer.entities.removeById(id)
      // this.viewer.entities.removeById(id+'polyline')
      // if(!status){
      //   this.viewer.entities.getById(id+'polyline').show=false
      // }
    },
    cartesian3ToWGS84:function (cartesian3) {
      let cartographic =Cesium.Cartographic.fromCartesian(cartesian3);
      let obj ={
        "jd":Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(9)),
        "wd":Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(9)),
        "z":0
      }
      return obj;
    },
    // 控制工艺节点
    controlWorkmanship(){
      let time =2000;
      let self = this
      let index =0;
      let nowNumber =0;
      let nowStatus =true;
      let entityId = null;
      let lookAt =null;
      let position =null,textDescription =null,info=null
      for (let i = 0; i < self.viewer.scene.layers._layers._array.length; i++) {
        if (self.viewer.scene.layers._layers._array[i]._name !== "YQYB@SZJCZ01") {
          self.viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha = 0.4;
        }
      }
      let s =setInterval(function() {
          if(index<self.controlStep.length){
            time = self.controlStep[index].time;
            nowNumber =self.controlStep[index].number;
            nowStatus = self.controlStep[index].status;
            lookAt = self.controlStep[index].flyTo;
            position = self.controlStep[index].obj;

            textDescription = self.controlStep[index].text;
            info = self.controlStep[index].description
            entityId = nowNumber+"polyline";
            if(nowNumber===3 || nowNumber==="3"){
                if(nowStatus===true){
                   self.addPointLine(self.processPoint3,entityId);
                }else{
                   self.removeById(entityId)
                }
            }else if(nowNumber ===4 || nowNumber ==="4"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint4,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===5 || nowNumber ==="5"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint5,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===6 || nowNumber ==="6"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint6,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===7 || nowNumber ==="7"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint7,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===16 || nowNumber ==="16"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint16,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===10 || nowNumber ==="10"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint10,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===9 || nowNumber ==="9"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint9,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===12 || nowNumber ==="12"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint12,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===17 || nowNumber ==="17"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint17,entityId);
              }else{
                self.removeById(entityId)
              }
            }else if(nowNumber ===15 || nowNumber ==="15"){
              if(nowStatus===true){
                self.addPointLine(self.processPoint15,entityId);
              }else{
                self.removeById(entityId)
              }
            }
            self.viewer.scene.camera.flyTo(lookAt);
            self.$refs.child.changeStatus(false)
            setTimeout(function() {
              self.$refs.child.changeDivScreenPosition(position,textDescription,info)
            },1500)
            index++;
            self.step=index
          }else{
            window.clearInterval(s);
            self.$refs.child.changeStatus(false)
            self.$store.dispatch('automaticStation/setBIMDetailsStatus', 2)
            self.step=1;
            self.viewer.scene.camera.setView({
              destination: { x: -2772696.021510951, y: 4711219.161313284, z: 3285922.7206866257 },
              orientation: {
                heading: 6.275719429016772,
                pitch: -0.1491975307687563,
                roll: 6.2831853071795845
              }
            });
            for (let i = 0; i < self.viewer.scene.layers._layers._array.length; i++) {
              if (self.viewer.scene.layers._layers._array[i]._name !== "YQYB@SZJCZ01") {
                self.viewer.scene.layers._layers._array[i]._style3D._fillForeColor.alpha =1.0;
              }
            }

          }
       },6000)
    },

    allInitMethod(val){
      switch (val) {
        case 0:
          this.viewer.scene.camera.setView({
            destination: { x: -2772717.124308144, y: 4711224.049839629, z: 3285926.216207532 },
            orientation: {
              heading: 5.505731953519758,
              pitch: -0.6532221724559917,
              roll: 6.283185307179581
            }
          })
          break;
        case 1:
          this.viewer.scene.camera.setView({
            destination: { x: -2772703.094913274, y: 4711228.724835323, z: 3285917.924277881 },
            orientation: {
              heading:6.275840423759547,
              pitch:-0.3374285021614001,
              roll: 6.283185307179581
            }
          });
           break;
        case 2://左
          this.viewer.scene.camera.setView({
            destination: { x: -2772673.977986377, y: 4711228.483891676, z: 3285932.7915303395 },
            orientation: {
              heading:1.5951493655010998,
              pitch:-0.18042989399005682,
              roll: 6.283185307179586
            }
          });
          break;
        case 3:// 后
          this.viewer.scene.camera.setView({
            destination: {x: -2772681.6921679457, y: 4711202.396804786, z: 3285953.6515334207 },
            orientation: {
              heading:3.146582726663845,
              pitch:0.06305842419933971,
              roll: 6.283185307179586
            }
          });
          break;
        case 4:
          this.viewer.scene.camera.setView({
            destination: {x: -2772709.8460819772, y: 4711203.66142732, z: 3285934.5948425457},
            orientation: {
              heading:4.697881139292652,
              pitch:-0.10312927293716001,
              roll: 6.283185307179586
            }
          });
          break;

      }
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
  position: absolute;
}


.el-row{
  position: absolute;
  top: 28%;
  right: 1%;
  /* height: 300px; */
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
.cesium-viewer-bottom{
  display: none;
}

/*.el-button:hover{*/
/*  background-color: #00A7FB;*/
/*}*/
</style>
