<template>
  <Draw :is-open='isOpen' @changOpen='changOpen'>
    <slot>
      <DialogTitle dialogTitle='实验室在检样品'>
        <div class='time'>
          <el-date-picker
            v-model='time'
            class='mw-25'
            size='mini'
            type='date'
            value-format='yyyy-MM-dd'
            placeholder='选择日期'>
          </el-date-picker>
        </div>
      </DialogTitle>
      <sp-table
        :height='350'
        :list='sampleList'
        :columns='[
          { label: "站点名称", prop: "监测站点", width: 30 },
          { label: "采样时间", prop: "采样时间", width: 20 },
          { label: "样品接收人", prop: "样品接收人", width: 16 }
        ]'
        :check-selected='checkSelected'
        @detail='yangDetail'
      />
      <DialogTitle dialogTitle='实验室重要仪器' />
      <sp-table
        :height='350'
        :list='importantList'
        :columns='[
          { label: "仪器编号", prop: "仪器编号", width: 14 },
          { label: "仪器名称", prop: "仪器名称", width: 18 },
          { label: "检测项目", prop: "检测项目", width: 24 },
          { label: "仪器价格", prop: "价格", width: 16 }
        ]'
      />
    </slot>
  </Draw>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import Draw from '@/components/Draw'
import SpTable from '@/components/SpTable'
import { mapState } from 'vuex'
import { linuxApi } from '@/api'
import { EventBus } from '@/mapJs/EventBus'

export default {
  name: 'MonitoringAnalysis',
  components: {
    DialogTitle,
    Draw,
    SpTable
  },
  computed: {
    ...mapState({
      importantList: state => state.ma.list,
      sampleList: state => state.ma.sampleList,
      detailId: state => state.ma.detailId
    }),
    time: {
      get() {
        return this.$store.state.ma.time
      },
      set(time) {
        this.$store.dispatch('ma/fetchSample', time)
      }
    }
  },
  data() {
    return {
      isOpen: true,
      chose: 0
    }
  },
  mounted() {
    const Data = new Date()
    const year = Data.getFullYear().toString()
    let month = (Data.getMonth() + 1).toString()
    let data = Data.getDate().toString()
    if (month.length < 2) month = '0' + month
    if (data.length < 2) data = '0' + data
    this.$store.dispatch('ma/fetchSample', year + '-' + month + '-' + data)
  },
  methods: {
    changOpen(type) {
      this.isOpen = type
    },
    /**
     * 判断是否选择
     */
    checkSelected(item, index) {
      return this.detailId === `${item['样品编号']}-${index + 1}`
    },
    /**
     * 样品点击
     * @param val
     * @param index
     */
    yangDetail(val, index) {
      this.$store.dispatch('ma/fetchDetail', {
        key: `${val['样品编号']}-${index + 1}`,
        id: val['样品编号']
      })
      linuxApi.aqjkOrderTaskResluts({ ORDERNO: val['样品编号'] }).then(res => {
        EventBus.$emit('getValueInfo', res.data)
      })
    }
  }
}
</script>

<style lang='less' scoped>
.time {
  position: absolute;
  right: 15px;
  top: -2px;
}
</style>
