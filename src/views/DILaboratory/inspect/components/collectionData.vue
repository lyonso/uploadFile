<template>
  <Draw :is-open='isOpen' @changOpen='changOpen'>
    <slot>
      <DialogTitle dialogTitle='数据在线采集情况表'>
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
          { label: "仪器编号", prop: "仪器编号", width: 14 },
          { label: "时间", prop: "日期", width: 20 },
          { label: "采集项目", prop: "采集项目", width: 19 },
          { label: "采集数据量", prop: "采集数据量", width: 16 },
        ]'
        :check-selected='checkSelected'
        @detail='yangDetail'
      />
      <DialogTitle dialogTitle='报告机器预编制' style='position: relative'>
        <slot>
          <div class='time'>
            <el-date-picker
              v-model='timeOne'
              type='month'
              class='mw-25'
              size='mini'
              placeholder='选择月'
              value-format='yyyy-MM'>
            </el-date-picker>
          </div>
        </slot>
      </DialogTitle>
      <sp-table
        :height='350'
        :list='importantList'
        :columns='[
          { label: "名称", prop: "fileName", width: 30 },
          { label: "日期", prop: "makeTime", width: 20 },
          { label: "创建人", prop: "createBy", width: 10 }
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

export default {
  name: 'CollectionData',
  components: {
    DialogTitle,
    Draw,
    SpTable
  },
  computed: {
    ...mapState({
      importantList: state => state.ma.list
    })
  },
  watch: {
    time() {
      this.EquiptDCU()
    },
    timeOne() {
      this.report()
    }
  },
  data() {
    return {
      sampleList: [],
      importantList: [],
      isOpen: true,
      chose: 0,
      time: '',
      timeOne: ''
    }
  },
  mounted() {
    const Data = new Date()
    const year = Data.getFullYear().toString()
    let month = (Data.getMonth() + 1).toString()
    let data = Data.getDate().toString()
    if (month.length < 2) month = '0' + month
    if (data.length < 2) data = '0' + data
    this.time = year + '-' + month + '-' + data
    this.timeOne = year + '-' + month
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
    },

    EquiptDCU() {
      const obj = {
        SDATE: this.time,
        EDATE: this.time
      }
      linuxApi.EquiptDCU(obj).then(res => {
        this.sampleList = res.data
      })
    },

    report() {
      const obj = {
        month: this.timeOne
      }
      linuxApi.report(obj).then(res => {
        this.importantList = res.data
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
