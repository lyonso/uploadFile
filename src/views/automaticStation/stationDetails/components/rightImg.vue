<template>
  <div class='rightBottom'>
    <div class='title'>
      AI识别
    </div>
    <div class='bottom'>
      <div v-for='(item,index) in list' :key='index' class='item'>
        <el-image
          class='img'
          style='width: 345px; height: 175px'
          :src='item.url'
        />
        <div>
          <span>{{ item.dateTime }}</span>
          <span> AI识别：{{ item.eventType }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { map } from '@/api'

export default {
  name: 'RightBottom',
  components: {},
  watch: {},
  data() {
    return {
      list: []
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    init() {
      const obj = {
        limit: 2,
        stcd: this.$route.query.id
      }
      map.getAIEvent(obj).then(res => {
        console.log(res)
        this.list = res.data
      })
    }
  }
}

</script>

<style lang='less' scoped>
.rightBottom {
  .title {
    width: 100%;
    height: 32px;
    background: rgba(14, 78, 116, 0.31);
    padding-left: 20px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    box-sizing: border-box;
    line-height: 32px;
    color: #FFFFFF;
  }

  .bottom {
    padding: 15px 0px 10px 20px;
    .item {
      display: inline-block;
      width: 50%;
      color: #fff;
      position: relative;
      .img{
        margin: 0 auto;
      }
      :last-child{
        :last-child{
         position: absolute;
          right: 0;
        }
      }
    }
  }


}
</style>

