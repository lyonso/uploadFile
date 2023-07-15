<template>
  <div class='content'>
    <div class='example'>
      <div class='unit'>{{ infoList[check - 1].unit }}</div>
      <img :src='infoList[check - 1].img' alt='' />
      <div class='min'>{{ infoList[check - 1].min }}</div>
      <div class='max'>{{ infoList[check - 1].max }}</div>
    </div>
    <ul>
      <li v-for='(item, index) in list' :key='`check-${index + 1}`' @click='changeCheck(index + 1)'>
        <img class='img' :src='check === (index + 1) ? item.b : item.a' alt='' />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'checkList',
  computed: {
    ...mapState({
      check: state => state.environment.check
    })
  },
  data() {
    return {
      list: [
        { a: require('@/assets/environment/a.png'), b: require('@/assets/environment/a-active.png') },
        { a: require('@/assets/environment/tem.png'), b: require('@/assets/environment/tem-active.png') },
        { a: require('@/assets/environment/s.png'), b: require('@/assets/environment/s-active.png') },
        { a: require('@/assets/environment/j.png'), b: require('@/assets/environment/j-active.png') },
        { a: require('@/assets/environment/VOC.png'), b: require('@/assets/environment/VOC-active.png') }
      ],
      infoList: [
        { min: '-5', max: '40', unit: '', img: require('@/assets/environment/温度.png') },
        { min: '-5', max: '40', unit: '温度：℃', img: require('@/assets/environment/湿度.png') },
        { min: '0.00', max: '2.00', unit: '湿度：RH', img: require('@/assets/environment/空气质量.png') },
        { min: '0.00', max: '2.00', unit: '甲醛：mg/m³', img: require('@/assets/environment/空气质量.png') },
        { min: '0.00', max: '2.00', unit: 'VOC：mg/m³', img: require('@/assets/environment/空气质量.png') }
      ]
    }
  },
  methods: {
    /**
     * 改变选择态
     * @param index
     */
    changeCheck(index) {
      this.$store.dispatch('environment/changeCheck', index)
    }
  }
}
</script>

<style lang='less' scoped>
.content {
  position: relative;

  .example {
    position: absolute;
    right: 75px;

    .unit {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFBEE;
      position: absolute;
      top: -25px;
      left: -75px;
      width: 120px;
      text-align: center;
    }

    .min {
      position: absolute;
      top: 265px;
      left: -50px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #007CDC;
      width: 40px;
      text-align: right;
    }

    .max {
      position: absolute;
      top: 0;
      left: -50px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #DCA800;
      width: 40px;
      text-align: right;
    }
  }

  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    cursor: pointer;
    margin-bottom: 15px;

    .img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>