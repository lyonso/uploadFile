<template>
    <div class='floorControl'>
      <div :class='floor==0? "chose":""'>
        <div v-if='floor==0'>
          <span :class="angle==1? 'blue':''"  @click="changeScene(1)">前</span>
          <span :class="angle==2? 'blue':''" @click="changeScene(2)">后</span>
          <span  @click="changeScene(0)">全</span>
        </div>
        <span v-else @click='changeFloor(0)'>全</span>
      </div>
      <div :class='floor==2? "chose":""'>
        <div v-if='floor==2'>
          <span :class="angle==1? 'blue':''"  @click="changeScene(1)">前</span>
          <span :class="angle==2? 'blue':''"  @click="changeScene(2)">后</span>
          <span  @click="changeScene(2)">2F</span>
        </div>
        <span v-else @click='changeFloor(2)'>2F</span>
      </div>
      <div :class='floor==1? "chose":""'>
        <div v-if='floor==1'>
          <span :class="angle==1? 'blue':''"  @click="changeScene(1)">前</span>
          <span :class="angle==2? 'blue':''"  @click="changeScene(2)">后</span>
          <span  @click="changeScene(1)">1F</span>
        </div>
        <span v-else @click='changeFloor(1)'>1F</span>
      </div>
    </div>
</template>

<script>
import { EventBus } from '@/mapJs/EventBus'

export default {
  name:'floorControl',
  data(){
    return{
      floor:0,
      angle:-1,
    }
  },
  computed: {
  },
  methods:{
    changeFloor(type){
      this.floor = type
    },
    changeScene(type){
      this.angle = type
      const obj = {
        floor:this.floor,
        angle:type
      }
      EventBus.$emit('caowei',obj)
    }
  }
}
</script>

<style lang="less" scoped>
  .floorControl{
    text-align: right;
    width: 31px;
    >div{
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      border: 3px solid #001825;
      border-radius: 50%;
      background: rgba(5, 48, 63, 0.9);
      color: #FFFFFF;
      font-size: 14px;
      margin-bottom: 8px;
      position: relative;
    }
    >div::after{
      display: block;
      content: '';
      position: absolute;
      width: 10px;
      height: 14px;
      background: #001825;
      left: 8px;
    }
    span{
      cursor: pointer;
    }
    >:last-child::after{
      display: none;
    }
    .chose{
      width: 85px;
      left: -58px;
      background: #001825;
      border-radius: 14px !important;
      span{
        background: rgba(5, 47, 63, 0.9);
        margin-left: 2px;
        display: inline-block;
        width: 25px;
        height: 25px;
        line-height: 25px;
        background: rgba(5, 47, 63, 0.9);
        opacity: 0.95;
        border-radius: 50%;
        font-size: 14px;
      }
      :first-child{
        margin-left: 0px;
      }
      .blue{
        background: rgba(2, 116, 147, 0.9);;
      }
    }
    .chose::after {
      left: 66px;
    }
  }

</style>
