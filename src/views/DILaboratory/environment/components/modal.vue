<template>
  <!--  <div class="details"  ref="details" @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">-->
  <div class='details'>
    <div class='dialogTitle'>
      <img src='../../../../assets/icon_title.png'>
      <span>详细信息</span>
      <span style='margin-left: 30px'>{{ details[0] ? details[0]['gmtCreate'] : '' }}</span>
      <i class='el-icon-close close' @click='closeDialog'/>
    </div>
    <div class='table'>
      <el-row :gutter='20'>
        <el-col :span='4' class='table_top'>监测项</el-col>
        <el-col :span='5' class='table_top'>数值</el-col>
        <el-col :span='11' class='table_top'>报警内容</el-col>
      </el-row>
      <el-row :gutter='20' v-for='(item, index) in details' :key='`row-${index + 1}`'>
        <el-col :span='4'>{{ item.name || '-' }}</el-col>
        <el-col :span='5'>{{ item.code || '-' }}</el-col>
        <el-col :span='15'>{{ item.content || '-' }}</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import {environment} from '@/api'
import {mapState} from 'vuex'
import {EventBus} from '@/mapJs/EventBus'

export default {
  name: 'Modal',
  components: {
    DialogTitle
  },
  computed: {
    ...mapState({
      equipmentId: state => state.environment.eId,
      visible: state => state.environment.visible,
    }),
    dateValue: {
      get() {
        return this.$store.state.environment.dateValue
      },
      set(time) {
        this.$store.dispatch('environment/setDateValue', time)
      }
    }
  },
  data() {
    return {
      details: [{
        'gmtCreate': '-'
      }],
      detailsList: [],
      moveDataelse: {
        x: null,
        y: null
      },
      chose: true,
      value1: []
    }
  },
  mounted() {
    environment.environmentDetail({ eventIds: this.equipmentId }).then(res => {
      this.details = res.data
      this.getCurrentTime()
    })
  },
  methods: {
    closeDialog() {
      this.$store.dispatch('environment/closeModal')
    },
  }
}
</script>
<style lang='less' scoped>
.details {
  position: absolute;
  top: 400px;
  left: 241px;
  width: 838px;
  background: rgba(2, 19, 30, 0.6);

  > :last-child {
    padding: 15px 0;
    font-size: 20px;
    font-family: PingFang SC;
    color: #FFFFFF;
    line-height: 36px;
  }
}

.dialogTitle {
  position: relative;
  background: rgba(0, 51, 76, 0.49);
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  font-family: FZLanTingHei-DB-GBK;

  > :first-child {
    margin: 12px;
    vertical-align: top;
  }
}

.top {
  margin: 16px 33px;
  height: 40px;
  border: 1px solid rgba(0, 235, 253, 0.34);
  border-radius: 20px;
  color: #FFFFFF;

  span {
    display: inline-block;
    width: 33%;
    height: 38px;
    text-align: center;
    cursor: pointer;
  }
}

.warningData {
  position: absolute;
  right: 60px;
  height: 33px;
  color: rgba(9, 236, 240, 1);
  cursor: pointer;
  border-bottom: 1px solid rgba(9, 236, 240, 1);
}

.close {
  float: right;
  margin-top: 16px;
  margin-right: 20px;
  cursor: pointer;
}

.table_top {
  color: #02ECEF;
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

.table {
  padding: 10px !important;
}
</style>
