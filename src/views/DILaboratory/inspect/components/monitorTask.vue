<template>
  <Draw :is-open='isOpen' @changOpen='changOpen'>
    <slot>
      <DialogTitle dialogTitle='监测任务安排'>
        <slot>
          <el-date-picker
            v-model='value'
            size='mini'
            value-format='yyyy-MM-dd'
            placeholder='选择日期'>
          </el-date-picker>
        </slot>
      </DialogTitle>
      <div class='body'>
        <div class='body_left'>
          <el-scrollbar style='height:100%'>
            <div v-for='(item,index) in list' :class='choseOne===index?"item chose":"item"' @click='choseOne=index'>
              {{ '任务组' + (index + 1) }}
            </div>
          </el-scrollbar>
        </div>
        <div class='body_right'>
          <el-scrollbar style='height:100%'>
            <div class='body_right_item'>
              <span>现场负责人 ：</span>
              <span>{{ details['组长'] || '-' }}</span>
            </div>
            <div class='body_right_item'>
              <span>组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员：</span>
              <span>{{ details['组员'] || '-' }}</span>
            </div>
            <div class='body_right_item'>
              <span>站&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 ：</span>
              <span>{{ details['站点'] || '-' }}</span>
            </div>
            <div class='body_right_item'>
              <span>司&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机 ：</span>
              <span>{{ details['司机'] || '-' }}</span>
            </div>
            <div class='body_right_item'>
              <span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注 ：</span>
              <span>{{ details['备注'] || '-' }}</span>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <DialogTitle dialogTitle='现场监测数据' />
      <div class='body body2'>
        <div class='body_left'>
          <el-scrollbar style='height:100%'>
            <div v-for='(item,index) in list1' :class='choseTwo===index?"item chose":"item"' @click='choseTwo=index'>
              {{ '任务组' + (index + 1) }}
            </div>
          </el-scrollbar>
        </div>
        <div class='body_right'>
          <div class='body_right_item'>
            <span>水&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;温 ：</span>
            <span>{{ details1['水温'] || '-' }}</span>
          </div>
          <div class='body_right_item'>
            <span>溶&nbsp;&nbsp;&nbsp;&nbsp;解&nbsp;&nbsp;&nbsp;&nbsp;氧 ：</span>
            <span>{{ details1['溶解氧'] || '-' }}</span>
          </div>
          <div class='body_right_item'>
            <span>透&nbsp;&nbsp;&nbsp;&nbsp;明&nbsp;&nbsp;&nbsp;&nbsp;度 ：</span>
            <span>{{ details1['透明度'] || '-' }}</span>
          </div>
          <div class='body_right_item'>
            <span>嗅&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;味 ：</span>
            <span>{{ details1['嗅味'] || '-' }}</span>
          </div>
          <div class='body_right_item'>
            <span>水&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色 ：</span>
            <span>{{ details1['水色'] || '-' }}</span>
          </div>
          <div class='body_right_item'>
            <span>风&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;速 ：</span>
            <span>{{ details1['风速'] || '-' }}</span>
          </div>
          <div class='body_right_item'>
            <span>风&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向 ：</span>
            <span>{{ details1['风向'] || '-' }}</span>
          </div>
          <div class='body_right_item'>
            <span>现&nbsp;&nbsp;场&nbsp;&nbsp;情&nbsp;况&nbsp;：</span>
            <span>{{ details1['现场情况'] || '-' }}</span>
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

export default {
  name: 'MonitorTask',
  components: {
    DialogTitle,
    Draw
  },
  watch: {
    value(val) {
      this.SamplingSchedule()
    },
    choseOne(val) {
      this.details = this.list[val]
      if (this.list.length > 0) {
        this.SamplingResluts()
      }
    },
    choseTwo(val) {
      this.details1 = this.list1[val]
    }
  },
  mounted() {
    const Data = new Date()
    const year = Data.getFullYear().toString()
    let month = (Data.getMonth() + 1).toString()
    let data = Data.getDate().toString()
    if (month.length < 2) month = '0' + month
    if (data.length < 2) data = '0' + data
    this.value = year + '-' + month + '-' + data
  },
  data() {
    return {
      isOpen: true,
      value: '',
      list: [],
      choseOne: 0,
      details: {},

      list1: [],
      choseTwo: 0,
      details1: {}
    }
  },
  methods: {
    changOpen(type) {
      this.isOpen = type
    },

    SamplingSchedule() {
      const obj = {
        SDATE: this.value,
        EDATE: this.value
      }
      linuxApi.SamplingSchedule(obj).then(res => {
        this.list = res.data
        if (res.data.length > 0) {
          this.choseOne = 0
          this.details = this.list[0]
          this.SamplingResluts()
        } else {
          this.details = {}
          this.list1 = []
          this.details1 = {}
        }
      })
    },
    SamplingResluts() {
      const obj = {
        LEADER: this.details['组长'],
        DATE: this.value
      }
      linuxApi.SamplingResluts(obj).then(res => {
        if (res.data.length > 0) {
          let data = this.removeDuplicateObj(res.data, '站点名称')
          data.forEach(item => {
            const list2 = []
            res.data.forEach((i) => {
              if (item['站点名称'] === i['站点名称']) {
                list2.push(i)
              }
            })
            list2.forEach(m => {
              item[m['参数']] = m['分析结果']
            })
          })
          this.list1 = data
          this.choseTwo = 0
          this.details1 = data[0]
        } else {
          this.details1 = {}
        }
      })
    },

    removeDuplicateObj(arr, key) {
      let obj = {}
      let arrs = arr.reduce((newArr, next) => {
        obj[next[key]] ? '' : (obj[next[key]] = true && newArr.push(next))
        return newArr
      }, [])
      return arrs
    }
  }
}
</script>
<style lang='less' scoped>
.body {
  height: 245px;
  padding: 14px;

  &_left {
    display: inline-block;
    vertical-align: top;
    width: 110px;
    height: 100%;


    .item {
      color: #FFFFFF;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background-image: url("../../../../assets/but_bg_hover.png");
      background-size: 100% 100%;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .chose {
      background-image: url("../../../../assets/but_bg.png");
    }

  }

  &_right {
    display: inline-block;
    width: 227px;
    padding: 0 20px;
    height: 100%;
    margin-left: 12px;
    background: #0B2532;
    border: 1px solid #556770;
    border-radius: 8px;
    opacity: 0.8;

    &_item {
      font-size: 18px;
      font-weight: 500;
      line-height: 36px;
      margin-top: 15px;
      color: #FFFFFF;

      :first-child {
        display: inline-block;
        width: 122px;
        color: #9CCDFB;
      }
    }
  }
}

.body2 {
  height: 545px;

}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

::v-deep .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 130px;
  vertical-align: top;
  position: relative;
  left: 155px;
}
</style>
