<template>
  <div :id='`lineEcharts${id}`' style='height: 150px; width:100%' />
</template>
<script>
import * as echarts from 'echarts'
import { getOption } from './option'
import { mapState } from 'vuex'

export default {
  name: 'lineEcharts',
  props: {
    id: {
      type: Number,
      default: 1
    },
    dataX: {
      type: Object
      // default
    }
  },
  computed: {
    ...mapState({
      standard: state => state.environment.standard
    })
  },
  data() {
    return {}
  },
  async mounted() {
    try {
      const { x, ch2oY, vocY } = await this.$store.dispatch('environment/fetchDaysData')
      this.initEcharts(x, ch2oY, vocY)
    } catch (e) {

    }
  },
  methods: {
    initEcharts(x, ch2oY, vocY) {
      let option = getOption(x, ch2oY, vocY, this.standard.CH2O, this.standard.VOC)
      this.chart = echarts.init(document.getElementById('lineEcharts' + this.id))
      this.chart.setOption(option)
    }
  }
}
</script>

<style>

</style>