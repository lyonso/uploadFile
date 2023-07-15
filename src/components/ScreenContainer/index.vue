<template>
  <div class='wrap'>
<!--    <div class='ScaleBox'-->
<!--         ref='ScaleBox'-->
<!--         :style='{width,height}'>-->
    <div class='ScaleBox'
         ref='ScaleBox'
         style='width:1920px;height:1080px'>
      <slot />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ScreenContainer',
  props: {
    width: {
      type: Number,
      default: 1920
    },
    height: {
      type: Number,
      default: 1080
    }
  },
  data() {
    return {
      scale: null
    }
  },
  mounted() {
    // this.setScale()
    // window.addEventListener('resize', _.debounce(this.setScale, 150))
  },
  methods: {
    getScale() {
      const { width, height } = this
      console.log(width, height)
      let ww = window.innerWidth / width
      let wh = window.innerHeight / height
      return ww < wh ? ww : wh
    },
    setScale() {
      this.scale = this.getScale()
      this.$refs.ScaleBox.style.width = `${this.width}px`
      this.$refs.ScaleBox.style.height = `${this.height}px`
      this.$refs.ScaleBox.style.setProperty('--scale', this.scale)
    }
  }
}
</script>

<style lang='less' scoped>
#ScaleBox {
  --scale: 1;
}

.wrap {
  width: 100%;
  //height: 5000px;
}

.ScaleBox {
  //transform: scale(var(--scale)) translate(-50%, -50%);
  //display: flex;
  height: 100%;
  //flex-direction: column;
  transform-origin: 0 0;
  //position: absolute;
  //left: 50% ;
  //top: 50%;
  //transition: 0.3s;
  //z-index: 999;
}
</style>
