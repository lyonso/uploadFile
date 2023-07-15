<template>
  <div class='floorControl'>
    <div :class='buildingControl==0? "chose":""'>
      <div v-if='buildingControl==0'>
        <span :class="scene==4||scene==0? 'blue':''" @click='changeScene(4)'>前</span>
        <span :class="scene==5? 'blue':''" @click='changeScene(5)'>后</span>
        <span :class="scene==6? 'blue':''" @click='changeScene(6)'>左</span>
        <span :class="scene==7? 'blue':''" @click='changeScene(7)'>俯</span>
        <span @click='changeScene(0)'>全</span>
      </div>
      <span v-else @click='changeFloor(0)'>全</span>
    </div>
    <div :class='buildingControl==3? "chose":""'>
      <div v-if='buildingControl==3'>
        <span :class="scene==4||scene==3? 'blue':''" @click='changeScene(4)'>前</span>
        <span :class="scene==5? 'blue':''" @click='changeScene(5)'>后</span>
        <span :class="scene==6? 'blue':''" @click='changeScene(6)'>左</span>
        <span :class="scene==7? 'blue':''" @click='changeScene(7)'>俯</span>
        <span @click='changeScene(3)'>3F</span>
      </div>
      <span v-else @click='changeFloor(3)'>3F</span>
    </div>
    <div :class='buildingControl==2? "chose":""'>
      <div v-if='buildingControl==2'>
        <span :class="scene==4||scene==2? 'blue':''" @click='changeScene(4)'>前</span>
        <span :class="scene==5? 'blue':''" @click='changeScene(5)'>后</span>
        <span :class="scene==6? 'blue':''" @click='changeScene(6)'>左</span>
        <span :class="scene==7? 'blue':''" @click='changeScene(7)'>俯</span>
        <span @click='changeScene(2)'>2F</span>
      </div>
      <span v-else @click='changeFloor(2)'>2F</span>
    </div>
    <div :class='buildingControl==1? "chose":""'>
      <div v-if='buildingControl==1'>
        <span :class="scene==4? 'blue':''" @click='changeScene(4)'>前</span>
        <span :class="scene==5? 'blue':''" @click='changeScene(5)'>后</span>
        <span :class="scene==6? 'blue':''" @click='changeScene(6)'>左</span>
        <span :class="scene==7||scene==1? 'blue':''" @click='changeScene(7)'>俯</span>
        <span @click='changeScene(1)'>1F</span>
      </div>
      <span v-else @click='changeFloor(1)'>1F</span>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/mapJs/EventBus'
import { mapGetters } from 'vuex'

export default {
  name: 'floorControl',
  data() {
    return {
      chose: 0,
      scene: -1
    }
  },
  computed: {
    ...mapGetters([
      'buildingControl',
      'duplicateList'
    ])
  },
  methods: {
    changeFloor(type) {
      this.$store.dispatch('map/setBuildingControl', type.toString())
      this.scene = type
      EventBus.$emit('floor', type)
      if (type != 0) {
        let data = {
          floor: type,
          data: []
        }
        this.duplicateList.forEach(item => {
          if (item['floor'] == type) {
            data.data.push(item)
          }
        })
        EventBus.$emit('houseWaring', data)
      }
    },
    changeScene(type) {
      this.scene = type
      EventBus.$emit('floor', type)
    }
  }
}
</script>

<style lang='less' scoped>
.floorControl {
  text-align: right;
  width: 31px;
  position: absolute;
  top: 10px;
  left: -60px;

  > div {
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

  > div::after {
    display: block;
    content: '';
    position: absolute;
    width: 10px;
    height: 14px;
    background: #001825;
    left: 8px;
  }

  span {
    cursor: pointer;
  }

  > :last-child::after {
    display: none;
  }

  .chose {
    width: 141px;
    left: -110px;
    background: #001825;
    border-radius: 14px !important;

    span {
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

    :first-child {
      margin-left: 0px;
    }

    .blue {
      background: rgba(2, 116, 147, 0.9);;
    }
  }

  .chose::after {
    left: 117px;
  }
}

</style>
