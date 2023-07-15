<template>
  <div class='label'>
    <div class='label-title'>
      <div class='label-title-left'>
        <img src='@/assets/title-icon.png' alt=''>
      </div>
      <div class='label-title-right'>
        <div style='margin-left: 17px;float: left;'>全部</div>
        <div class='clearfloat' />
        <img src='@/assets/linetwo.png' alt=''>
      </div>
    </div>
    <div class='label-container'>
      <div class='label-container-list' v-if="item.totalPoint>0&&item.layerType!='anchor'"
           v-for='(item,index) in labelData' :key='index'>
        <div class='label-container-list-left'>
          <img :src='item.picPath' alt=''>
        </div>
        <div class='label-container-list-content'>
          <div style='color: #2DE0FBFF;font-size: 28px;'>
            <span>{{ item.totalPoint || '0' }}</span>
          </div>
          <div>{{ item.layerName }}</div>
        </div>
        <div class='label-container-list-right'>
          <el-switch
            @change='changeitem($event,item)'
            v-model='item.layerStatus'
            :active-value='0'
            :inactive-value='1'
            active-color='#1F91B6FF' inactive-color='#747F89FF' />
        </div>
        <div class='clearfloat'></div>
      </div>
    </div>
  </div>
</template>

<script>
import { layerlist } from '@/api/command'

export default {
  props: {
    mid: {
      type: String
    }
  },
  data() {
    return {
      value: 0,
      labelData: []
    }
  },
  created() {
    this.initLabel()
  },
  methods: {
    changeitem(e, item) {
      this.$emit('changelabel', { status: e, item })
    },
    initLabel() {
      layerlist(1, 10, { missionId: this.$props.mid }).then(res => {
        if (res.code == 200) {
          let arrs = []
          let arry = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].totalPoint > 0 && res.data[i].layerType != 'anchor') {
              let json = {
                status: 0,
                yjylCommandMissionId: this.$route.query.id,
                sysLayerId: res.data[i].sysLayerId
              }
              arrs.push(res.data[i])
              arry.push(json)
            }
          }
          this.labelData = arrs
          this.$emit('changeData', { item: arry })
        }
      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped lang='less'>
.label {
  width: 225px;
  height: 630px;
  background: url(../../../../assets/base.png);
  background-size: 100% 100%;
  overflow: hidden;
  overflow-y: scroll;
  padding: 19px 15px;

  &-container {
    padding-top: 45px;
    width: 100%;
    // padding-left: 10px;
    height: auto;

    &-list {
      width: 100%;
      margin-bottom: 22px;

      &-left {
        float: left;
        width: 68px;
        height: 68px;
        background: url(../../../../assets/yuan.png);
        text-align: center;

        img {
          width: 32px;
          height: 32px;
          margin-top: 18px;
        }
      }

      &-content {
        float: left;
        margin-left: 15px;
        font-size: 16px;
        color: white;
        margin-top: 5px;
        width: 88px;
      }

      &-right {
        float: left;
        margin-top: 36px;
      }
    }
  }


  &-title {
    width: 100%;
    color: #FEFEFE;
    font-size: 18px;
    font-weight: 400;
    height: auto;

    &-left {
      float: left;
    }

    &-right {
      width: 186px;
      float: left;
      position: relative;

      img {
        position: absolute;
        top: 20px;
      }
    }
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  width: 6px;
  background: rgba(#101F1C, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(#101F1C, 0.5);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(#101F1C, 1);

}
</style>
