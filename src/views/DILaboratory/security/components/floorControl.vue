<template>
  <div :class='isOpen? "floorControl ":"floorControl close"'>
    <div @click='choseOne(0)' :class='floorChose===0? "blue":""'>全</div>
    <div @click='choseOne(3)' :class='floorChose===3? "blue":""'>3F</div>
    <div @click='choseOne(2)' :class='floorChose===2? "blue":""'>2F</div>
    <div @click='choseOne(1)' :class='floorChose===1? "blue":""'>1F</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: 'floorControl',
  computed: {
    ...mapState({
      isOpen: state => state.security.isOpen,
      floorChose: state => state.security.floorChose
    })
  },
  watch: {
    floorChose(val) {
      EventBus.$emit('sFloor', val)
    }
  },
  data() {
    return {
      chose: 0
    }
  },

  mounted() {
    EventBus.$emit('sFloor', 0)
  },
  methods: {
    choseOne(type) {
      this.$store.commit('security/SET_FLOORCHOSE', type)
    }
  }
}
</script>

<style lang='less' scoped>
.floorControl {
  text-align: right;
  width: 31px;
  position: absolute;
  top: 110px;
  right: 470px;
  transition: right 1s;


  div {
    position: relative;
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
    cursor: pointer;
  }

  .blue {
    background: rgba(2, 116, 147, 1);
  }

  div::after {
    display: block;
    content: '';
    position: absolute;
    width: 10px;
    height: 14px;
    background: #001825;
    left: 8px;
  }

  :last-child::after {
    display: none;
  }

}

.close {
  right: 30px;
  transition: right 1s;
}
</style>
