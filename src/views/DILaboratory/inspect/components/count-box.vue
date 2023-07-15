<template>
  <Draw :is-open='isOpen' @changOpen='changOpen'>
    <slot>
      <div class='count'>
        <DialogTitle dialogTitle='工作提醒事项' />
        <div class='contentBox' :style='contentBoxStyle'>
          <div class='content' v-for='(row,index) in countList' :key='index' @click='detail(row)'>
            <div>
              <el-image :src='row.icon' />
              <span class='num'>{{ row.count }}</span>
            </div>
            <p class='label'>{{ row.label }}</p>
          </div>
        </div>
        <DialogTitle dialogTitle='任务完成情况' />
        <div class='card' v-for='(row,index) in taskList' :key='index'>
          <div class='rwTitle' :style='titleStyle'>{{ row.title }}</div>
          <div class='contentBox'>
            <div class='item'>
              <div class='boxItem'>
                <el-progress :width='63' type='circle' color='rgba(7, 181, 235, 1)'
                             :percentage='row.ypcjPer'></el-progress>
              </div>
              <div class='boxItem'>
                <p>样品采集</p>
                <p><span>{{ row.ypcjCount }}</span>个</p>
              </div>
            </div>
            <div class='item secItem'>
              <div class='boxItem'>
                <el-progress :width='63' type='circle' color='rgba(255, 255, 0, 1)'
                             :percentage='row.jcfxPer'></el-progress>
              </div>
              <div class='boxItem'>
                <p>检测分析</p>
                <p><span>{{ row.jcfxCount }}</span>个</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </slot>

  </Draw>
</template>

<script>
import DialogTitle from '@/components/DialogTitle'
import Draw from '@/components/Draw'
import { linuxApi } from '@/api'
import { parseTime } from '@/utils'

const {
  taskCompletion,
  equiptTestPlanOverdue,
  equiptCalibrationtPlanOverdue,
  certOverdue,
  stockLowLine,
  expirationDateOverdue,
  testsOverdue
} = linuxApi

const TABLEHEAD = {
  YQDJ: [
    {
      label: '仪器编号',
      width: 15,
      prop: '仪器编号'
    },
    {
      label: '仪器名称',
      width: 20,
      prop: '仪器名称'
    },
    {
      label: '定检到期日期',
      width: 30,
      prop: '到期日期',
      initDate: true
    }
  ],
  YQXZ: [
    {
      label: '仪器编号',
      width: 15,
      prop: '仪器编号'
    },
    {
      label: '仪器名称',
      width: 20,
      prop: '仪器名称'
    },
    {
      label: '校准到期日期',
      prop: '到期日期',
      width: 30,
      initDate: true
    }
  ],
  SGZDQ: [
    {
      label: '人员姓名',
      width: 16,
      prop: '姓名'
    },
    {
      label: '证书类别',
      width: 16,
      prop: '证书类型'
    },
    {
      label: '到期日期',
      width: 31,
      prop: '失效日期',
      initDate: true
    }
  ],
  CKKCDX: [
    {
      label: '材料名称',
      width: 30,
      prop: '材料名称'
    },
    {
      label: '剩余库存数量',
      width: 20,
      prop: '剩余库存数量'
    }
  ],
  WZYXQ: [
    {
      label: '物质名称',
      width: 16,
      prop: '物质名称'
    },
    {
      label: '批号',
      width: 30,
      prop: '批号'
    },
    {
      label: '有效期',
      width: 18,
      prop: '失效日期',
      initDate: true
    }
  ],
  JCXMCQ: [
    {
      label: '检测项目',
      width: 16,
      prop: '检测项目'
    },
    {
      label: '样品编号',
      width: 30,
      prop: '样品编号'
    },
    {
      label: '已超期小时',
      width: 18,
      prop: '已超期小时数'
    }
  ]
}
export default {
  name: 'CountBox',
  components: {
    DialogTitle,
    Draw
  },
  data() {
    return {
      titleStyle: {
        backgroundImage: `url(${require('@/assets/count/title.png')})`
      },
      contentBoxStyle: {
        backgroundImage: `url(${require('@/assets/count/bg.png')})`,
        backgroundPosition: '50%'
      },
      isOpen: true,
      countList: [
        {
          label: '仪器定检提醒',
          count: 10,
          icon: require('@/assets/count/icon_yqdjtx.png'),
          head: TABLEHEAD.YQDJ
        },
        {
          label: '仪器校准提醒',
          count: 10,
          icon: require('@/assets/count/icon_yqxztx.png'),
          head: TABLEHEAD.YQXZ
        },
        {
          label: '上岗证到期',
          count: 10,
          icon: require('@/assets/count/icon_sgzdq.png'),
          head: TABLEHEAD.SGZDQ
        },
        {
          label: '仓库库存低限',
          count: 10,
          icon: require('@/assets/count/icon_ckkcdx.png'),
          head: TABLEHEAD.CKKCDX
        },
        {
          label: '物质有效期超期',
          count: 10,
          icon: require('@/assets/count/icon_wzyxqcq.png'),
          head: TABLEHEAD.WZYXQ
        },
        {
          label: '检测项目超期',
          count: 10,
          icon: require('@/assets/count/icon_jcxmcq.png'),
          head: TABLEHEAD.JCXMCQ
        }
      ],
      taskList: [
        {
          title: '省界',
          ypcjPer: 0,
          ypcjCount: 0,
          jcfxPer: 0,
          jcfxCount: 0
        },
        {
          title: '主要入湖河道',
          ypcjPer: 0,
          ypcjCount: 0,
          jcfxPer: 0,
          jcfxCount: 0
        },
        {
          title: '水源地',
          ypcjPer: 0,
          ypcjCount: 0,
          jcfxPer: 0,
          jcfxCount: 0
        },
        {
          title: '金泽湖水源地',
          ypcjPer: 0,
          ypcjCount: 0,
          jcfxPer: 0,
          jcfxCount: 0
        }
      ]
    }
  },
  created() {
    console.log(linuxApi)
    this.init()
  },
  methods: {
    changOpen(type) {
      this.isOpen = type
    },
    async init() {
      const res = await equiptTestPlanOverdue()
      this.countList[0].count = res.data.length || 0
      res.data.forEach(item => {
        const date = new Date(item['到期日期'])
        item['到期日期'] = parseTime(date)
      })
      this.countList[0].info = res.data

      const res1 = await equiptCalibrationtPlanOverdue()
      this.countList[1].count = res1.data.length || 0
      res1.data.forEach(item => {
        const date = new Date(item['到期日期'])
        item['到期日期'] = parseTime(date)
      })
      this.countList[1].info = res1.data

      const res2 = await certOverdue()
      this.countList[2].count = res2.data.length || 0
      res2.data.forEach(item => {
        const date = new Date(item['失效日期'])
        item['失效日期'] = parseTime(date)
      })
      this.countList[2].info = res2.data

      const res3 = await stockLowLine()
      this.countList[3].count = res3.data.length || 0
      this.countList[3].info = res3.data

      const res4 = await expirationDateOverdue()
      this.countList[4].count = res4.data.length || 0
      this.countList[4].info = res4.data

      const res5 = await testsOverdue()
      this.countList[5].count = res5.data?.total || 0
      this.countList[5].info = res5.data.list

      const res6 = await taskCompletion()
      if (res6) {
        const { data } = res6
        data.forEach(row => {
          const ypTotal = row['样品总数']
          const ypwc = row['已完成采样数']
          const csTotal = row['测试总数']
          const cswc = row['已完成测试数']
          const key = row['任务属性']
          const chooseRow = this.taskList.find(item => key === item.title)
          if (chooseRow) {
            chooseRow.jcfxCount = cswc
            chooseRow.jcfxPer = parseInt(cswc / csTotal * 100)
            chooseRow.ypcjCount = ypwc
            chooseRow.ypcjPer = parseInt(ypwc / ypTotal * 100)
          }
        })

      }

    },
    detail(data) {
      const { info, head, label } = data
      console.log(info)
      const list = info
      this.$emit('openDialog', { head, list, title: label })
    }

  }
}
</script>

<style lang='less' scoped>
/deep/ .el-image {
  vertical-align: middle;
}

/deep/ .el-progress__text {
  height: 15px;
  font-size: 15px !important;
  font-weight: 400;
  color: #FFFFFF;
}

.rwTitle {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 40px;
  margin-bottom: 5px;
}

.count {
  width: 422px;

  .contentBox {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 14px;
    border: 1px solid #2c4c54;

    .content {
      width: 120px;
      padding-left: 10px;
      margin: 10px 0;
      cursor: pointer;

      .num {
        display: inline-block;
        width: 12px;
        height: 20px;
        font-size: 28px;
        font-weight: bold;
        color: #00CCFF;
        line-height: 56px;
      }

      .label {
        font-size: 16px;
        font-weight: 500;
        color: #FFFFFF;
        margin: 0;
      }
    }

    .item {
      width: 181px;
      display: flex;
      flex-wrap: wrap;
      position: relative;

      .boxItem {
        width: 85px;
        font-size: 14px;
        font-weight: 500;
        color: #FFFFFF;

        &:nth-child(2) {
          span {
            display: inline-block;
            width: 40px;
            height: 17px;
            font-size: 22px;
            font-weight: 400;
          }
        }

        p {
          margin: 8px 0;
        }
      }

      &:first-child span {
        color: #01C3FF;
      }

      &:nth-child(2) span {
        color: rgba(255, 255, 0, 1)
      }
    }

    .secItem {
      padding-left: 10px;
      width: 171px;

      &:before {
        content: '';
        position: absolute;
        width: 1px;
        height: 60px;
        top: 5px;
        background-color: #2c4c54;
        left: -10px;
      }
    }
  }
}

.card {
  margin: 15px 15px;
}
</style>
