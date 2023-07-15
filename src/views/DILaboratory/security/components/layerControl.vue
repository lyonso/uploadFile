<template>
  <div>
    <div :class='isOpen? "floorControl ":"floorControl close"'>
      <div v-if='checked' class='img img2' @click='checked=!checked'>告警</div>
      <img v-else src='../../../../assets/icon_gj2.png'  @click='checked=!checked'>
      <div v-if='qyChose' class='img qy' @click='changeOpen(false,2)'>监管区域</div>
      <img v-else src='../../../../assets/icon_qy.png' @click='changeOpen(true,2)'>
      <div v-if='spChose' class='img' @click='changeOpen(false,0)'>视频监控</div>
      <img v-else src='../../../../assets/icon_sp.png' @click='changeOpen(true,0,)'>

    </div>
    <div v-if='qyChose' class='security_bottom'>
      <el-checkbox-group v-model='checkList'>
        <el-checkbox class='green' label='公共区域'></el-checkbox>
        <el-checkbox class='blue' label='常规监测区域'></el-checkbox>
        <el-checkbox class='red' label='重点监控区域（双重认证）'></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { EventBus } from '@/mapJs/EventBus'
import { DILaboratory } from '@/api'

export default {
  name: 'floorControl',
  data() {
    return {
      checked: true,
      spChose: false,
      qyChose: false,
      checkList: []
    }
  },
  watch: {
    checked(val) {
      if (val) {
        this.securityGJ(2, 0).then(res => {
          const obj = {
            data: res.data,
            type: 0
          }
          EventBus.$emit('pointData', obj)
        })
        this.securityGJ(2, 2).then(res => {
          const obj = {
            data: res.data,
            type: 2
          }
          EventBus.$emit('pointData', obj)
        })
        this.spChose = false
        this.qyChose = false
      }
    },
    closeDialog(val) {
      if (val) this.Reset()

    }
  },
  computed: {
    ...mapState({
      isOpen: state => state.security.isOpen,
      closeDialog: state => state.security.closeDialog
    })
  },
  mounted() {
    this.securityGJ(2, 0).then(res => {
      const obj = {
        data: res.data,
        type: 0
      }
      EventBus.$emit('pointData', obj)
    })
    this.securityGJ(2, 2).then(res => {
      const obj = {
        data: res.data,
        type: 2
      }
      EventBus.$emit('pointData', obj)
    })
  },
  methods: {
    /**
     * 改变选中状态
     */
    changeChose(type) {
    },
    /**
     * 获取数据
     */
    securityGJ(flag, type) {
      const data = {
        flag,
        floor: '',
        type
      }
      let res = DILaboratory.securityGJ(data)
      return res
    },
    /**
     * 视频监控
     */
    changeOpen(status, type) {
      if (type === 0) {
        this.spChose = status
        this.qyChose = false
        if (status) {
          DILaboratory.pCount().then(res => {
            EventBus.$emit('pointData2', res.data)
          })
        }
      } else if (type === 2) {
        this.qyChose = status
        this.spChose = false
      }
      if (status) {
        this.checked = false
        this.securityGJ(0, type).then(res => {
          const obj = {
            data: res.data,
            type
          }
          EventBus.$emit('pointData', obj)
        })
      }
    },
    Reset() {
      if (this.checked) {
        this.securityGJ(2, 0).then(res => {
          const obj = {
            data: res.data,
            type: 0
          }
          EventBus.$emit('pointData', obj)
        })
        this.securityGJ(2, 2).then(res => {
          const obj = {
            data: res.data,
            type: 2
          }
          EventBus.$emit('pointData', obj)
        })
      } else if (this.spChose) {
        this.securityGJ(0, 0).then(res => {
          const obj = {
            data: res.data,
            type
          }
          EventBus.$emit('pointData', obj)
          DILaboratory.pCount().then(res => {
            EventBus.$emit('pointData2', res.data)
          })
        })
      } else if (this.qyChose) {
        this.securityGJ(0, 2).then(res => {
          const obj = {
            data: res.data,
            type
          }
          EventBus.$emit('pointData', obj)
        })
      }
      this.$store.dispatch('security/setCloseDialog', false)
    }
  }
}
</script>
<style lang='less' scoped>
.floorControl {
  position: absolute;
  top: 120px;
  right: 470px;
  transition: right 1s;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  img {
    width: 36px;
    height: 36px;
    cursor: pointer;
    margin-top: 20px;
  }

  .img {
    width: 113px;
    height: 37px;
    margin-top: 20px;
    cursor: pointer;
    color: #FFFFFF;
    line-height: 37px;
    padding-left: 10px;
    background-image: url("../../../../assets/icon_sp_hover.png");
    background-size: 100% 100%;
  }

  .img2{
    width: 86px;
    height: 37px;
    background-image: url("../../../../assets/icon_gj_hover.png");
    background-size: 100% 100%;
  }
  .qy {
    background-image: url("../../../../assets/icon_qy_hover.png");
  }
}

.close {
  right: 30px;
  transition: right 1s;
}

::v-deep .el-checkbox__label {
  color: #FFFFFF;
  font-size: 20px;
}

.security_bottom {
  position: absolute;
  left: 60px;
  top: calc(100vh - 160px);


  ::v-deep .el-checkbox__label {
    font-size: 18px;
  }

  ::v-deep .el-checkbox {
    display: block;
    color: #FFFFFF;
    font-weight: 400;
    font-size: 18px;
    margin: 10px 0 10px 20px;
  }

  ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #FFFFFF;
  }

  ::v-deep .el-checkbox__inner {
    width: 18px;
    height: 18px;
  }

  ::v-deep .el-checkbox__inner::after {
    border-color: rgba(0, 0, 0, 0);
  }

  .red {
    ::v-deep .el-checkbox__inner {
      background: rgba(255, 0, 0, 0.55);
      border: 2px solid #FF0000;
    }
  }

  .blue {
    ::v-deep .el-checkbox__inner {
      background: rgba(0, 0, 255, 0.55);
      border: 2px solid #0000FF;
    }
  }

  .green {
    ::v-deep .el-checkbox__inner {
      background: rgba(0, 223, 255, 0.55);
      border: 2px solid #00DFFF;
    }
  }
}

</style>
