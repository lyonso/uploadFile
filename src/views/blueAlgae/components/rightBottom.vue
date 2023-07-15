<template>
  <div class='rightBottom'>
    <div class='title'>
      <span>太湖各湖区{{ value.label }}含量对比</span>
      <el-select class='select' v-model="value"  size='mini' placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div id="circularEcharts" style='height:calc(100vh - 775px);width:100%' />
  </div>
</template>
<script >
import * as echarts from 'echarts'
import {map} from '@/api'
import _ from 'lodash'
export  default {
  name:'rightBottom',
  watch:{
    value:{
      deep:true,
      handler(val){
        this.echartList =_.cloneDeep(this.shujuList[val.value])
        console.log(this.echartList)
        this.initEcharts()
      }
    }
  },
  data(){
    return{
      value:{
        label:'总氮',
        value:'TN',
        Company:'（mg/L）'
      },
      options: [
        {
          label:'砷',
          value:'ARS',
          Company:'（mg/L）'
        },{
          label:'叶绿素',
          value:'CHLA',
          Company:'(μg/L)'
        },{
          label:'氟化物',
          value:'F',
          Company:'（mg/L）'
        },{
          label:'挥发性酚',
          value:'VLPH',
          Company:'（mg/L）'
        },{
          label:'氨氮',
          value:'NH3N',
          Company:'（mg/L）'
        },{
          label:'化学需氧量',
          value:'CODCR',
          Company:'（mg/L）'
        },{
          label:'硒',
          value:'SE',
          Company:'（mg/L）'
        },{
          label:'水温',
          value:'WT',
          Company:'   ℃'
        },{
          label:'五日生化需氧量',
          value:'BOD5',
          Company:'（mg/L）'
        },{
          label:'镉',
          value:'CD',
          Company:'（mg/L）'
        },{
          label:'六价铬',
          value:'CR6',
          Company:'（mg/L）'
        },{
          label:'氰化物',
          value:'CN',
          Company:'（mg/L）'
        },{
          label:'溶解氧',
          value:'DOX',
          Company:'（mg/L）'
        },{
          label:'高锰酸盐指数',
          value:'CODMN',
          Company:'（mg/L）'
        },{
          label:'铜',
          value:'CU',
          Company:'（mg/L）'
        },{
          label:'铅',
          value:'PB',
          Company:'（mg/L）'
        },{
          label:'石油类',
          value:'OIL',
          Company:'（mg/L）'
        },{
          label:'锌',
          value:'ZN',
          Company:'（mg/L）'
        },{
          label:'PH',
          value:'PH',
          Company:'   PH'
        },{
          label:'总氮',
          value:'TN',
          Company:'（mg/L）'
        },{
          label:'总磷',
          value:'TP',
          Company:'（mg/L）'
        },{
          label:'汞',
          value:'HG',
          Company:'（mg/L）'
        },{
          label:'阴离子',
          value:'LAS',
          Company:'（mg/L）'
        },{
          label:'硫化物',
          value:'S2',
          Company:'（mg/L）'
        }
      ],
      shujuList:{},
      echartList:[],
      dataTime:[],
    }
  },
  mounted() {
    map.getSjLakeMonth().then(res=>{
      let shuju = {
        ARS:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, // 砷(mg/L)
        CHLA:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //叶绿素a(μg/L)
        F:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  // 氟化物(mg/L)
        VLPH:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //挥发性酚(mg/L)
        NH3N:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //氨氮(mg/L)
        CODCR: {
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //化学需氧量(mg/L)
        SE:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //硒(mg/L)
        WT: {
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //水温
        BOD5:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //五日生化需氧量(mg/L)
        CD: {
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //镉(mg/L)
        CR6:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //六价铬(mg/L)
        CN:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //氰化物(mg/L)
        DOX:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },   //溶解氧(mg/L)
        CODMN:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //高锰酸盐指数(mg/L)
        CU:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //铜(mg/L)
        PB:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //铅(mg/L)
        OIL:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //石油类(mg/L)
        ZN:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //锌(mg/L)
        PH:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //PH
        TN:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //总氮(mg/L)
        TP:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        },  //总磷(mg/L)
        HG:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //汞(mg/L)
        LAS:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }, //阴离子mg/L
        S2:{
          '0':[],
          '1':[],
          '2':[],
          line:''
        }  //硫化物(mg/L)
      }
      const dataTime = res.data.dataTime
      res.data[dataTime[0]].forEach(item=>{
        switch (item.HQNM){
          case '太湖':
                shuju.ARS['0'][0]=item.ARS || 0,// 砷(mg/L)
                shuju.CHLA['0'][0]=item.CHLA || 0, //叶绿素a(μg/L)
                shuju.F['0'][0]=item.F || 0,  // 氟化物(mg/L)
                shuju.VLPH['0'][0]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][0]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][0]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][0]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][0]=item.WT||0,  //水温
                shuju.BOD5['0'][0]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][0]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][0]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][0]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][0]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][0]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][0]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][0]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][0]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][0]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][0]=item.PH||0,  //PH
                shuju.TN['0'][0]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][0]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][0]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][0]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][0]=item.S2||0  //硫化物(mg/L)
            break
          case '梅梁湖':
                shuju.ARS['0'][1]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][1]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][1]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][1]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][1]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][1]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][1]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][1]=item.WT||0,  //水温
                shuju.BOD5['0'][1]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][1]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][1]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][1]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][1]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][1]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][1]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][1]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][1]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][1]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][1]=item.PH||0,  //PH
                shuju.TN['0'][1]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][1]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][1]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][1]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][1]=item.S2||0  //硫化物(mg/L)
            break
          case '竺山湖':
            shuju.ARS['0'][2]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][2]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][2]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][2]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][2]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][2]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][2]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][2]=item.WT||0,  //水温
                shuju.BOD5['0'][2]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][2]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][2]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][2]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][2]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][2]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][2]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][2]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][2]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][2]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][2]=item.PH||0,  //PH
                shuju.TN['0'][2]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][2]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][2]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][2]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][2]=item.S2||0  //硫化物(mg/L)
            break
          case '贡湖':
            shuju.ARS['0'][3]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][3]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][3]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][3]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][3]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][3]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][3]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][3]=item.WT||0,  //水温
                shuju.BOD5['0'][3]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][3]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][3]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][3]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][3]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][3]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][3]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][3]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][3]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][3]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][3]=item.PH||0,  //PH
                shuju.TN['0'][3]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][3]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][3]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][3]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][3]=item.S2||0  //硫化物(mg/L)
            break
          case '东太湖':
            shuju.ARS['0'][4]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][4]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][4]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][4]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][4]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][4]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][4]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][4]=item.WT||0,  //水温
                shuju.BOD5['0'][4]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][4]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][4]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][4]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][4]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][4]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][4]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][4]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][4]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][4]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][4]=item.PH||0,  //PH
                shuju.TN['0'][4]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][4]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][4]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][4]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][4]=item.S2||0  //硫化物(mg/L)
            break
          case '湖心区':
            shuju.ARS['0'][5]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][5]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][5]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][5]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][5]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][5]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][5]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][5]=item.WT||0,  //水温
                shuju.BOD5['0'][5]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][5]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][5]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][5]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][5]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][5]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][5]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][5]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][5]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][5]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][5]=item.PH||0,  //PH
                shuju.TN['0'][5]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][5]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][5]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][5]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][5]=item.S2||0  //硫化物(mg/L)
            break
          case '西部沿岸区':
            shuju.ARS['0'][6]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][6]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][6]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][6]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][6]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][6]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][6]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][6]=item.WT||0,  //水温
                shuju.BOD5['0'][6]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][6]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][6]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][6]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][6]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][6]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][6]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][6]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][6]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][6]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][6]=item.PH||0,  //PH
                shuju.TN['0'][6]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][6]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][6]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][6]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][6]=item.S2||0  //硫化物(mg/L)
            break
          case '东部沿岸区':
            shuju.ARS['0'][7]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][7]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][7]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][7]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][7]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][7]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][7]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][7]=item.WT||0,  //水温
                shuju.BOD5['0'][7]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][7]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][7]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][7]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][7]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][7]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][7]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][7]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][7]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][7]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][7]=item.PH||0,  //PH
                shuju.TN['0'][7]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][7]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][7]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][7]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][7]=item.S2||0  //硫化物(mg/L)
            break
          case '南部沿岸区':
                console.log(item.ARS)
                shuju.ARS['0'][8]= item.ARS || 0,// 砷(mg/L)
                shuju.CHLA['0'][8]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][8]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][8]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][8]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][8]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][8]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][8]=item.WT||0,  //水温
                shuju.BOD5['0'][8]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][8]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][8]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][8]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][8]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][8]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][8]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][8]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][8]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][8]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][8]=item.PH||0,  //PH
                shuju.TN['0'][8]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][8]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][8]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][8]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][8]=item.S2||0  //硫化物(mg/L)
            break
          case '五里湖':
            shuju.ARS['0'][9]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][9]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][9]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][9]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][9]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][9]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][9]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][9]=item.WT||0,  //水温
                shuju.BOD5['0'][9]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][9]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][9]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][9]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][9]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][9]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][9]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][9]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][9]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][9]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][9]=item.PH||0,  //PH
                shuju.TN['0'][9]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][9]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][9]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][9]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][9]=item.S2||0  //硫化物(mg/L)
            break
          case '淀山湖':
            shuju.ARS['0'][10]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][10]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][10]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][10]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][10]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][10]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][10]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][10]=item.WT||0,  //水温
                shuju.BOD5['0'][10]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][10]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][10]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][10]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][10]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][10]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][10]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][10]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][10]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][10]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][10]=item.PH||0,  //PH
                shuju.TN['0'][10]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][10]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][10]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][10]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][10]=item.S2||0  //硫化物(mg/L)
            break
          case '元荡':
            shuju.ARS['0'][11]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['0'][11]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['0'][11]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['0'][11]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['0'][11]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['0'][11]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['0'][11]=item.SE||0, //硒(mg/L)
                shuju.WT['0'][11]=item.WT||0,  //水温
                shuju.BOD5['0'][11]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['0'][11]=item.CD||0, //镉(mg/L)
                shuju.CR6['0'][11]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['0'][11]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['0'][11]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['0'][11]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['0'][11]=item.CU||0,  //铜(mg/L)
                shuju.PB['0'][11]=item.PB||0,  //铅(mg/L)
                shuju.OIL['0'][11]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['0'][11]=item.ZN||0,  //锌(mg/L)
                shuju.PH['0'][11]=item.PH||0,  //PH
                shuju.TN['0'][11]=item.TN||0,  //总氮(mg/L)
                shuju.TP['0'][11]=item.TP||0,  //总磷(mg/L)
                shuju.HG['0'][11]=item.HG||0, //汞(mg/L)
                shuju.LAS['0'][11]=item.LAS||0, //阴离子mg/L
                shuju.S2['0'][11]=item.S2||0  //硫化物(mg/L)
            break
        }
      })
      res.data[dataTime[1]].forEach(item=>{
        switch (item.HQNM){
          case '太湖':
            shuju.ARS['1'][0]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][0]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][0]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][0]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][0]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][0]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][0]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][0]=item.WT||0,  //水温
                shuju.BOD5['1'][0]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][0]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][0]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][0]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][0]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][0]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][0]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][0]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][0]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][0]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][0]=item.PH||0,  //PH
                shuju.TN['1'][0]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][0]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][0]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][0]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][0]=item.S2||0  //硫化物(mg/L)
            break
          case '梅梁湖':
                shuju.ARS['1'][1]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][1]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][1]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][1]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][1]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][1]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][1]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][1]=item.WT||0,  //水温
                shuju.BOD5['1'][1]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][1]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][1]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][1]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][1]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][1]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][1]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][1]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][1]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][1]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][1]=item.PH||0,  //PH
                shuju.TN['1'][1]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][1]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][1]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][1]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][1]=item.S2||0  //硫化物(mg/L)
            break
          case '竺山湖':
            shuju.ARS['1'][2]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][2]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][2]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][2]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][2]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][2]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][2]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][2]=item.WT||0,  //水温
                shuju.BOD5['1'][2]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][2]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][2]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][2]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][2]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][2]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][2]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][2]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][2]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][2]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][2]=item.PH||0,  //PH
                shuju.TN['1'][2]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][2]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][2]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][2]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][2]=item.S2||0  //硫化物(mg/L)
            break
          case '贡湖':
            shuju.ARS['1'][3]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][3]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][3]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][3]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][3]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][3]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][3]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][3]=item.WT||0,  //水温
                shuju.BOD5['1'][3]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][3]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][3]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][3]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][3]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][3]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][3]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][3]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][3]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][3]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][3]=item.PH||0,  //PH
                shuju.TN['1'][3]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][3]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][3]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][3]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][3]=item.S2||0  //硫化物(mg/L)
            break
          case '东太湖':
            shuju.ARS['1'][4]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][4]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][4]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][4]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][4]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][4]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][4]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][4]=item.WT||0,  //水温
                shuju.BOD5['1'][4]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][4]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][4]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][4]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][4]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][4]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][4]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][4]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][4]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][4]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][4]=item.PH||0,  //PH
                shuju.TN['1'][4]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][4]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][4]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][4]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][4]=item.S2||0  //硫化物(mg/L)
            break
          case '湖心区':
            shuju.ARS['1'][5]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][5]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][5]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][5]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][5]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][5]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][5]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][5]=item.WT||0,  //水温
                shuju.BOD5['1'][5]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][5]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][5]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][5]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][5]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][5]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][5]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][5]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][5]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][5]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][5]=item.PH||0,  //PH
                shuju.TN['1'][5]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][5]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][5]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][5]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][5]=item.S2||0  //硫化物(mg/L)
            break
          case '西部沿岸区':
            shuju.ARS['1'][6]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][6]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][6]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][6]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][6]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][6]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][6]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][6]=item.WT||0,  //水温
                shuju.BOD5['1'][6]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][6]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][6]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][6]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][6]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][6]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][6]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][6]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][6]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][6]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][6]=item.PH||0,  //PH
                shuju.TN['1'][6]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][6]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][6]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][6]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][6]=item.S2||0  //硫化物(mg/L)
            break
          case '东部沿岸区':
            shuju.ARS['1'][7]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][7]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][7]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][7]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][7]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][7]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][7]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][7]=item.WT||0,  //水温
                shuju.BOD5['1'][7]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][7]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][7]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][7]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][7]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][7]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][7]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][7]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][7]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][7]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][7]=item.PH||0,  //PH
                shuju.TN['1'][7]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][7]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][7]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][7]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][7]=item.S2||0  //硫化物(mg/L)
            break
          case '南部沿岸区':
            shuju.ARS['1'][8]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][8]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][8]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][8]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][8]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][8]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][8]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][8]=item.WT||0,  //水温
                shuju.BOD5['1'][8]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][8]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][8]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][8]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][8]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][8]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][8]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][8]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][8]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][8]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][8]=item.PH||0,  //PH
                shuju.TN['1'][8]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][8]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][8]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][8]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][8]=item.S2||0  //硫化物(mg/L)
            break
          case '五里湖':
            shuju.ARS['1'][9]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][9]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][9]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][9]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][9]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][9]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][9]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][9]=item.WT||0,  //水温
                shuju.BOD5['1'][9]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][9]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][9]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][9]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][9]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][9]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][9]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][9]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][9]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][9]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][9]=item.PH||0,  //PH
                shuju.TN['1'][9]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][9]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][9]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][9]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][9]=item.S2||0  //硫化物(mg/L)
            break
          case '淀山湖':
            shuju.ARS['1'][10]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][10]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][10]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][10]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][10]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][10]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][10]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][10]=item.WT||0,  //水温
                shuju.BOD5['1'][10]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][10]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][10]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][10]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][10]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][10]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][10]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][10]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][10]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][10]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][10]=item.PH||0,  //PH
                shuju.TN['1'][10]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][10]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][10]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][10]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][10]=item.S2||0  //硫化物(mg/L)
            break
          case '元荡':
            shuju.ARS['1'][11]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['1'][11]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['1'][11]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['1'][11]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['1'][11]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['1'][11]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['1'][11]=item.SE||0, //硒(mg/L)
                shuju.WT['1'][11]=item.WT||0,  //水温
                shuju.BOD5['1'][11]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['1'][11]=item.CD||0, //镉(mg/L)
                shuju.CR6['1'][11]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['1'][11]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['1'][11]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['1'][11]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['1'][11]=item.CU||0,  //铜(mg/L)
                shuju.PB['1'][11]=item.PB||0,  //铅(mg/L)
                shuju.OIL['1'][11]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['1'][11]=item.ZN||0,  //锌(mg/L)
                shuju.PH['1'][11]=item.PH||0,  //PH
                shuju.TN['1'][11]=item.TN||0,  //总氮(mg/L)
                shuju.TP['1'][11]=item.TP||0,  //总磷(mg/L)
                shuju.HG['1'][11]=item.HG||0, //汞(mg/L)
                shuju.LAS['1'][11]=item.LAS||0, //阴离子mg/L
                shuju.S2['1'][11]=item.S2||0  //硫化物(mg/L)
            break
        }
      })
      res.data[dataTime[2]].forEach(item=>{
        switch (item.HQNM){
          case '太湖':
                shuju.ARS['2'][0]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][0]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][0]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][0]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][0]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][0]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][0]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][0]=item.WT||0,  //水温
                shuju.BOD5['2'][0]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][0]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][0]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][0]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][0]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][0]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][0]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][0]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][0]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][0]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][0]=item.PH||0,  //PH
                shuju.TN['2'][0]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][0]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][0]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][0]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][0]=item.S2||0  //硫化物(mg/L)
            break
          case '梅梁湖':
                shuju.ARS['2'][1]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][1]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][1]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][1]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][1]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][1]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][1]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][1]=item.WT||0,  //水温
                shuju.BOD5['2'][1]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][1]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][1]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][1]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][1]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][1]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][1]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][1]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][1]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][1]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][1]=item.PH||0,  //PH
                shuju.TN['2'][1]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][1]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][1]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][1]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][1]=item.S2||0  //硫化物(mg/L)
            break
          case '竺山湖':
                shuju.ARS['2'][2]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][2]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][2]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][2]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][2]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][2]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][2]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][2]=item.WT||0,  //水温
                shuju.BOD5['2'][2]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][2]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][2]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][2]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][2]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][2]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][2]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][2]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][2]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][2]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][2]=item.PH||0,  //PH
                shuju.TN['2'][2]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][2]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][2]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][2]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][2]=item.S2||0  //硫化物(mg/L)
            break
          case '贡湖':
                shuju.ARS['2'][3]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][3]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][3]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][3]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][3]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][3]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][3]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][3]=item.WT||0,  //水温
                shuju.BOD5['2'][3]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][3]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][3]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][3]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][3]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][3]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][3]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][3]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][3]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][3]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][3]=item.PH||0,  //PH
                shuju.TN['2'][3]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][3]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][3]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][3]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][3]=item.S2||0  //硫化物(mg/L)
            break
          case '东太湖':
                shuju.ARS['2'][4]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][4]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][4]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][4]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][4]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][4]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][4]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][4]=item.WT||0,  //水温
                shuju.BOD5['2'][4]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][4]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][4]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][4]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][4]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][4]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][4]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][4]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][4]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][4]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][4]=item.PH||0,  //PH
                shuju.TN['2'][4]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][4]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][4]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][4]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][4]=item.S2||0  //硫化物(mg/L)
            break
          case '湖心区':
                shuju.ARS['2'][5]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][5]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][5]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][5]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][5]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][5]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][5]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][5]=item.WT||0,  //水温
                shuju.BOD5['2'][5]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][5]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][5]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][5]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][5]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][5]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][5]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][5]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][5]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][5]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][5]=item.PH||0,  //PH
                shuju.TN['2'][5]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][5]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][5]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][5]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][5]=item.S2||0  //硫化物(mg/L)
            break
          case '西部沿岸区':
                shuju.ARS['2'][6]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][6]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][6]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][6]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][6]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][6]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][6]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][6]=item.WT||0,  //水温
                shuju.BOD5['2'][6]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][6]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][6]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][6]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][6]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][6]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][6]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][6]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][6]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][6]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][6]=item.PH||0,  //PH
                shuju.TN['2'][6]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][6]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][6]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][6]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][6]=item.S2||0  //硫化物(mg/L)
            break
          case '东部沿岸区':
                shuju.ARS['2'][7]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][7]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][7]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][7]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][7]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][7]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][7]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][7]=item.WT||0,  //水温
                shuju.BOD5['2'][7]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][7]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][7]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][7]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][7]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][7]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][7]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][7]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][7]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][7]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][7]=item.PH||0,  //PH
                shuju.TN['2'][7]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][7]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][7]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][7]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][7]=item.S2||0  //硫化物(mg/L)
            break
          case '南部沿岸区':
            shuju.ARS['2'][8]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][8]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][8]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][8]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][8]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][8]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][8]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][8]=item.WT||0,  //水温
                shuju.BOD5['2'][8]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][8]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][8]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][8]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][8]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][8]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][8]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][8]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][8]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][8]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][8]=item.PH||0,  //PH
                shuju.TN['2'][8]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][8]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][8]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][8]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][8]=item.S2||0  //硫化物(mg/L)
            break
          case '五里湖':
            shuju.ARS['2'][9]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][9]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][9]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][9]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][9]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][9]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][9]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][9]=item.WT||0,  //水温
                shuju.BOD5['2'][9]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][9]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][9]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][9]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][9]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][9]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][9]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][9]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][9]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][9]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][9]=item.PH||0,  //PH
                shuju.TN['2'][9]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][9]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][9]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][9]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][9]=item.S2||0  //硫化物(mg/L)
            break
          case '淀山湖':
            shuju.ARS['2'][10]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][10]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][10]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][10]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][10]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][10]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][10]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][10]=item.WT||0,  //水温
                shuju.BOD5['2'][10]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][10]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][10]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][10]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][10]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][10]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][10]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][10]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][10]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][10]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][10]=item.PH||0,  //PH
                shuju.TN['2'][10]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][10]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][10]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][10]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][10]=item.S2||0  //硫化物(mg/L)
            break
          case '元荡':
            shuju.ARS['2'][11]=item.ARS||0,// 砷(mg/L)
                shuju.CHLA['2'][11]=item.CHLA||0, //叶绿素a(μg/L)
                shuju.F['2'][11]=item.F||0,  // 氟化物(mg/L)
                shuju.VLPH['2'][11]=item.VLPH||0, //挥发性酚(mg/L)
                shuju.NH3N['2'][11]=item.NH3N||0, //氨氮(mg/L)
                shuju.CODCR['2'][11]=item.CODCR||0, //化学需氧量(mg/L)
                shuju.SE['2'][11]=item.SE||0, //硒(mg/L)
                shuju.WT['2'][11]=item.WT||0,  //水温
                shuju.BOD5['2'][11]=item.BOD5||0,  //五日生化需氧量(mg/L)
                shuju.CD['2'][11]=item.CD||0, //镉(mg/L)
                shuju.CR6['2'][11]=item.CR6||0,  //六价铬(mg/L)
                shuju.CN['2'][11]=item.CN||0,  //氰化物(mg/L)
                shuju.DOX['2'][11]=item.DOX||0,   //溶解氧(mg/L)
                shuju.CODMN['2'][11]=item.CODMN||0,  //高锰酸盐指数(mg/L)
                shuju.CU['2'][11]=item.CU||0,  //铜(mg/L)
                shuju.PB['2'][11]=item.PB||0,  //铅(mg/L)
                shuju.OIL['2'][11]=item.OIL||0,  //石油类(mg/L)
                shuju.ZN['2'][11]=item.ZN||0,  //锌(mg/L)
                shuju.PH['2'][11]=item.PH||0,  //PH
                shuju.TN['2'][11]=item.TN||0,  //总氮(mg/L)
                shuju.TP['2'][11]=item.TP||0,  //总磷(mg/L)
                shuju.HG['2'][11]=item.HG||0, //汞(mg/L)
                shuju.LAS['2'][11]=item.LAS||0, //阴离子mg/L
                shuju.S2['2'][11]=item.S2||0  //硫化物(mg/L)
            break
        }
      })
      res.data.indexStandardValues.forEach(item=>{
        shuju[item.dictType]['line']=item.dictValue
      })
      this.dataTime = dataTime
      this.shujuList = shuju
      this.echartList =_.cloneDeep(this.shujuList[this.value.value])
      this.initEcharts()
    })
  },
  methods:{
    initEcharts() {
      let option = {
        backgroundColor: 'rgba(11, 37, 50, 0.64)',
        title: {
          text: this.value.Company,
          textStyle: {
            color: 'rgba(173, 177, 182, 0.65)',
            fontSize:'14px'
          },
          top:'20px'
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '3%',
          top: '30%',
          containLabel: true,
        },
        legend: {
          data: this.dataTime,
          right: 'center',
          top: 12,
          textStyle: {
            color: '#fff',
          },
          itemWidth: 12,
          itemHeight: 10,
          itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: ['太湖','梅梁湖','竺山湖','贡湖', '东太湖', '湖心区', '西部沿岸区', '东部沿岸区', '南部沿岸区', '五里湖', '淀山湖','元荡'],
          axisLine: {
            lineStyle: {
              color: 'rgba(173, 177, 182, 0.65)',
              fontSize:11,
              fontWeight:400
            },

          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontSize:11,
              fontFamily: 'Microsoft YaHei',
            },
            rotate:30,
          },
        },
        yAxis: {
          type: 'value',
          // max: '1200',
          splitLine: {
            show: true,
            lineStyle:{
              type:'dashed',
              width :1,
              color:'rgba(229, 229, 229, 0.35)'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(173, 177, 182, 0.65)',
              fontSize:14,
            }
          }
        },
        series: [
          {
            name: this.dataTime[0],
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                color:'rgba(255, 255, 0, 0.31)'
              },
            },
            markLine: {
              silent: true,             //基线显示 隐藏
              symbol:'none',
              lineStyle: {
                type: 'solid',
                color: 'rgba(246, 91, 91, 1)'   // 这儿设置安全基线颜色
              },
              label: {
                show:false
              },
              data: [{
                yAxis: this.echartList['line']
              }]
            },
            data: this.echartList[0],
          },
          {
            name: this.dataTime[1],
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal:{
                color:'rgba(0, 255, 198, 0.31)'
              }
            },
            data: this.echartList[1],
          },
          {
            name: this.dataTime[2],
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal:{
                color:'rgba(255, 84, 0,  0.31)'
              }
            },
            data: this.echartList[2],
          },
        ],
      };
      this.chart = echarts.init(document.getElementById("circularEcharts"))
      this.chart.setOption(option)
    }
  }
}
</script>
<style lang='less' scoped>
.rightBottom{
  width: 714px;
  border: 1px solid rgba(229, 229, 229, 0.31);

}
.title{
  background: #2A3E41;
  height: 40px;
  line-height:40px;
  font-size: 15px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  >:first-child:before{
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    background: #00CCFF;
    vertical-align: top;
    margin: 10px;
  }
}
.select{
  position: absolute;
  right: 12px;
}

::v-deep .el-input__inner{
  background-color:rgba(0, 51, 76, 0.49);
  border: 1px solid #05556B;
  border-radius: 4px;
  color:rgba(255, 255, 255, 0.67)
}

</style>
