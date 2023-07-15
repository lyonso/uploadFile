<template>
  <div class='equipmentImg'>
    <div class='dialogTop'>
      <i class="el-icon-close" @click='changeBIMDetailsStatus' />
    </div>
    <div class='tabList'>
      <div v-for='(item,index) in list' :key='index' @click='choseOne(index)'
           :class='index === equipmentImgChose? "chose":""'>
        {{ item.name }}
      </div>
    </div>
    <div>
      <img  :class='"img"+equipmentImgChose' :src='list[equipmentImgChose]["src"]' >
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'equipmentImgChose'
    ])
  },
  data() {
    return {
      chose: '1',
      list: [
        {
          name: '控制单元',
          src: require('../../../../assets/equipment_1.png')
        },
        {
          name: 'COD mn',
          src: require('../../../../assets/equipment_2.png')
        },
        {
          name: '氨氮总氮',
          src: require('../../../../assets/equipment_3.png')
        },
        {
          name: '总磷',
          src: require('../../../../assets/equipment_4.png')
        },
        {
          name: '分析单元',
          src: require('../../../../assets/equipment_5.png')
        }]
    }
  },
  methods: {
    choseOne(type) {
      this.$store.dispatch('automaticStation/setEquipmentImgChose', type)
    },
    changeBIMDetailsStatus(){
      this.$store.dispatch('automaticStation/setBIMDetailsStatus', 4)
    }
  }
}
</script>

<style lang='less' scoped>
.equipmentImg {
  position: absolute;
  top: 123px;
  left: 233px;
}

.dialogTop {
  width: 1452px;
  height: 56px;
  background: #032D40;
  font-size: 26px;
  text-align: right;
  line-height: 56px;
  padding-right: 20px;
  color: #fff;
  i{
    cursor: pointer;
  }
}

.tabList {
  //padding:a;
  display: inline-block;
  margin: 10px 22px;
  border: 1px dashed rgba(0, 203, 181, 1);

  div {
    width: 285px;
    height: 56px;
    display: inline-block;
    font-family: PingFang SC;
    background: rgba(5, 104, 117, 0.36);
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
    text-align: center;
    line-height: 56px;
    cursor: pointer;
  }

  .chose {
    background: rgba(0, 203, 181, 0.36);
  }

}
img{
  width: 500px;
  position:absolute ;

}
.img0{
  top: 200px;
  left: 45px;
}
.img1{
  width: 600px;
  top: 200px;
  left: 156px;
}
.img2{
  width: 700px;
  top: 200px;
  left: 326px;
}
.img3{
  width: 700px;
  top: 200px;
  left: 626px;
}
.img4{
  width: 500px;
  left: 925px;
}
</style>
