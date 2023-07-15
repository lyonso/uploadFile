<template>
  <div class='details'>
    <div class='dialogTitle'>
      <span>门禁</span>
      <i class='el-icon-close close' @click='closeDialog(0)' />
    </div>
    <div class='details_body'>
      <div>
        <div>人员进入人数</div>
        <div>{{ details.in }}</div>
      </div>
      <div>
        <div>人员出门人数</div>
        <div>{{ details.out }}</div>
      </div>

      <div @click='closeDialog(8)'>门禁日志</div>
      <div>
        <span style='margin-right: 210px'>门禁状态：</span>
        <el-switch   active-color="rgba(0, 246, 255, 0.5)" v-model="value" />
      </div>
    </div>
  </div>
</template>
<script>
import { map } from '@/api'
import {EventBus} from '@/mapJs/EventBus';
export default {
  mounted() {
    this.getDoorEvents()
  },
  watch: {
    value(val) {
      this.doControl()
      EventBus.$emit("openDoor",val)
    }
  },

  data() {
    return {
      details: {},
      value: false
    }
  },

  methods: {
    getDoorEvents() {
      map.getDoorEvents({ doorIndexCode: 'be0c90dbe4d44b469d397fe815a599f5' }).then(res => {
        this.details = res.data
      })
    },
    closeDialog(type) {
      this.$store.dispatch('map/setOpenDialog', type)
    },
    doControl() {
      map.doControl({
        controlType: this.value? '2':'1',
        doorIndexCodes: 'be0c90dbe4d44b469d397fe815a599f5'
      }).then(res => {
        console.log(res)
      })
    }

  }
}
</script>

<style lang='less' scoped>
.details {
  position: absolute;
  top: 580px;
  left: 850px;
  width: 390px;
  background: rgba(2, 19, 30, 0.6);

  &_body {
    padding: 15px;
    color: #FFFFFF;
    font-family: PingFang SC;
    font-size: 20px;
    line-height: 36px;

    >:first-child,
    >:nth-child(2){
      background: rgba(8, 39, 65, 0.38);
      margin-bottom: 10px;
      border: 1px solid #255258;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(253, 249, 249, 0.74);
      div{
        display: inline-block;
      }
      :first-child{
        width: 49%;
        padding-left: 10px;
        position: relative;
      }
      :first-child:after{
        display: block;
        content: '';
        position: absolute;
        width: 1px;
        height: 24px;
        background: #3B6E79;
        right: 0;
        top: 6px;
      }
      :nth-child(2){
        width: 46%;
        text-align: center;
      }

    }
    >:nth-child(3){
      height: 36px;
      background: rgba(3, 203, 211, 0.14);
      border: 1px solid #00FFFF;
      opacity: 0.75;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}

.dialogTitle {
  background: #2A3E41;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  > :first-child {
    margin-left: 20px;
  }

}

.close {
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}

::v-deep .el-radio {
  margin-right: 10px;
  color: #fff;
}
</style>
