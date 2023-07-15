  <template>
  <div :class='isOpen? "rightPanel ":"rightPanel close"'>
    <DialogTitle dialogTitle='服务流域治理与管理'>
      <slot>
        <i class='el-icon-s-fold icon' @click='goBack' />
      </slot>
    </DialogTitle>
    <div class='body'>
      <img src='../../../../assets/yl_1.png'>
      <img src='../../../../assets/yl_2.png'>
      <img src='../../../../assets/yl_3.png'>
      <img src='../../../../assets/yl_4.png'>
    </div>

    <!--    收缩图片-->
    <img v-if='isOpen' @click='closeDialog(false)' src='../../../../assets/closePanel.png'>
    <img v-else @click='closeDialog(true)' src='../../../../assets/openPanel.png'>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DialogTitle from '@/components/DialogTitle'

export default {
  components: {
    DialogTitle
  },
  computed: {
    ...mapState({
      isOpen: state => state.security.isOpen
    })
  },
  data() {
    return {}
  },
  methods: {
    goBack() {
      this.$store.commit('security/SET_BIMDETAILSSTATUS', 1)
    },
    /**
     * 左侧收缩
     * @param status
     */
    closeDialog(status) {
      this.$store.commit('security/SET_ISOPEN', status)
    },
  }
}
</script>

<style lang='less' scoped>
.rightPanel {
  position: absolute;
  top: 110px;
  right: 20px;
  background: rgba(11, 37, 50, 0.8);
  width: 422px;
  //height: 978px;
  border: 1px solid rgba(229, 229, 229, 0.31);
  transition: right 1s;
  > img {
    position: absolute;
    transform: rotateY(180deg);
    top: 0;
    width: 20px;
    left: -20px;
    cursor: pointer;
  }
  .body {
    img {
      margin: 10px 49px;
      width: 328px;
      height: 180px;
    }
  }

}

.icon {
  cursor: pointer;
  font-size: 30px;
  position: absolute;
  top: 4px;
  right: 10px;
}

.close {
  right: -425px;
  transition: right 1s;
}
</style>
