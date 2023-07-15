<template>
  <div class='navbar'>
    <div>
      <img src='../../assets/title.png' @click='goHome'>
      <TopMenu class='topMenu' v-if='commandList.includes(activeIndex)' />
      <topMeunLaboratory class='LaboratoryMenu' v-if='LaboratoryList.includes(activeIndex)' />
      <DILaboratory  v-if='DILaboratory.includes(activeIndex)' />
    </div>
    <span class='date'>
      {{ date.dateWeek }}
      <span>{{ date.year }}</span> 年
      <span>{{ date.month }}</span> 月
      <span>{{ date.day }}</span> 日
    </span>
  </div>
</template>

<script>
import TopMenu from './topMeun'
import topMeunLaboratory from './topMeunLaboratory'
import DILaboratory from './DILaboratory'

export default {
  components: {
    TopMenu,
    topMeunLaboratory,
    DILaboratory
  },
  data() {
    return {
      date: {},
      commandList: ['/automaticStation/automaticStationIntroduce', '/automaticStation/stationDetails', '/automaticStation/BIMDetails'],
      LaboratoryList: ['/DILaboratory/UETestScene','/DILaboratory/BIMIndex', '/DILaboratory/inspect', '/DILaboratory/IntelligentBuilding', '/DILaboratory/IntelligentBuilding/security', '/DILaboratory/IntelligentBuilding/environment'],
      DILaboratory: ['/DILaboratory/IntelligentBuilding/security', '/DILaboratory/IntelligentBuilding/environment']

    }
  },
  computed: {
    activeIndex() {
      return this.$route.path
    }
  },
  mounted() {
    const todayDate = new Date()
    const day = todayDate.getDate()
    const month = todayDate.getMonth() + 1
    const year = todayDate.getFullYear()
    let dateWeek = ''
    switch (todayDate.getDay()) {
      case 0:
        dateWeek += '星期日'
        break
      case 1:
        dateWeek += '星期一'
        break
      case 2:
        dateWeek += '星期二'
        break
      case 3:
        dateWeek += '星期三'
        break
      case 4:
        dateWeek += '星期四'
        break
      case 5:
        dateWeek += '星期五'
        break
      case 6:
        dateWeek += '星期六'
        break
    }
    this.date = {
      day,
      month,
      year,
      dateWeek
    }
  },
  methods: {
    goHome() {
      this.$router.push('/homePage')
      this.$store.dispatch('map/setHomeDialogDetails', '')
    }
  }
}
</script>

<style lang='less' scoped>
.navbar {
  position: relative;
  line-height: 74px;
  width: 100%;
  font-size: 34px;
  font-family: SingyiEG-Ultra-GB;
  font-weight: 600;
  background-image: linear-gradient(#052E43 0%, #052E43 20%, rgba(229, 229, 229, 0));

  > :first-child {
    display: inline-block;
    height: 95px;
    width: 1391px;
    background: url("../../assets/bg_title.png");
    background-size: 100% 100%;

    > img {
      cursor: pointer;
      margin: 8px 0 0 8px;
    }

    .title_left {
      color: #0CE1E4;
      margin-left: 35px;
      letter-spacing: 4px;
      text-shadow: 0 0 8px #0CE1E4;
    }

    .title_right {
      color: #FFFFFF;
      letter-spacing: 4px;
      text-shadow: 0 0 8px #fff;
    }

    .topMenu {
      position: absolute;
      left: 1180px;
      top: -10px;
    }
  }

  .date {
    position: absolute;
    right: 29px;
    width: 462px;
    height: 58px;
    font-size: 18px;
    font-family: DS-DIGIB;
    font-weight: 500;
    color: #FFFFFF;
    letter-spacing: 5px;
    background: url("../../assets/bg_date.png");
    background-size: 100% 100%;
    text-align: right;
    padding-right: 60px;

    span {
      font-size: 20px;
      color: #0CE1E4;
    }
  }

  .LaboratoryMenu {
    position: absolute;
    left: 800px;
    top: 45px;
  }
}
</style>
