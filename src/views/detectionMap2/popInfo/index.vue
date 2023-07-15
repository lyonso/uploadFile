<template>
  <div>

  </div>

</template>

<script>
import {EventBus} from '@/mapJs/EventBus'
import Info from './info'
// 创建气泡
import DivLabel from '@/utils/createPanelDiv'
// 静态对比表
import { lonlat_list } from '@/mock/deviceComparisonTable'

let InstanceAggregates = [];
export default {
 name: "index",
 data(){
   return {

   }
 },
 mounted() {
   /**
    * obj - {data:[]}
    */
   EventBus.$on("getValueInfo",(obj) => {
      // 移除标签
      this.remove();
      //
     console.log("返回的数据....")
     console.log(obj)
      let { data } = obj;
      let getValueInfoArr = [];
      data.forEach(list => {
        for( let key in list ) {
          if( !!list[key] ) {
            list[key].forEach(item => {
              let id = item['仪器编号'];
              let dataObj = {
                '仪器编号': id,
                list: []
              };
              let instrumentItem = getValueInfoArr.find(item=>item['仪器编号']===id);
              if( !instrumentItem ) {
                dataObj['list'].push(item);
                getValueInfoArr.push(dataObj)
              } else {
                instrumentItem['list'].push(item);
              }
            });
          }
        }
      });
      if( getValueInfoArr.length !== 0 ) {
        console.log("getValueInfoArr返回的数据.......")
        console.log(getValueInfoArr)
        getValueInfoArr.forEach((param)=>{
          let {value, x, y, xy} = lonlat_list[param['仪器编号']]
          let divHtml = new DivLabel(viewer, value)
          divHtml.createDiv(
            Info,
            {
              leftValue: x,
              bottomValue: y,
              xy: xy||0
            },
            { list: param['list'] }
          );
          InstanceAggregates.push(divHtml)
        });
      }
   })
  },
  methods: {
    remove() {
      InstanceAggregates.forEach(divHtml=>{
        divHtml?.removed()
      })
      InstanceAggregates = []
    }
  }
}
</script>

<style>
</style>
