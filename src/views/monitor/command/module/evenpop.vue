<template>
  <div class="even">
    <div class="even-title">
      类型：柴油泄漏
    </div>
    <div class="even-close">
      <img src="@/assets/popclose.png" alt="">
    </div>
    <div class="even-container">
      <div class="even-container-left">
        <div class="even-container-content">
          <div class="even-container-list">
            <div class="even-container-title">
              事件地点
            </div>
            <div > |</div>
            <div class="even-container-tips" style="color: #FFD905FF;">
              金泽水库附近
            </div>
            <div class="clearfloat"></div>
          </div>

          <div class="even-container-list">
            <div class="even-container-title">
              发生时间
            </div>
            <div > |</div>
            <div class="even-container-tips">
              13:00  2021-02-11
            </div>
            <div class="clearfloat"></div>
          </div>

          <div class="even-container-list">
            <div class="even-container-title">
              事件详情
            </div>
            <div > |</div>
            <div class="even-container-tips">
              京杭大运河无锡段柴油运输船与运沙船相撞，柴油泄漏，污染物可能影响太浦河下游水源地。
            </div>
            <div class="clearfloat"></div>
          </div>

        </div>
      </div>
      <div class="even-container-right">
        <div class="even-container-right-content">
          <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn00%2F224%2Fw598h426%2F20180522%2F2de5-hawmaua3615715.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617844856&t=bd4bf42e874052d2665518aa47662692" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return{

      }
    },

  }
</script>

<style lang="less" scoped>
  .even{
    width: 598px;
    height: 242px;
    position: relative;
    &-title{
      padding-left: 18px;
      font-size: 20px;
      font-weight: 400;
      color: #FEFEFE;
      line-height: 50px;
      position: absolute;
      top: 0px;
      z-index: 9;
      left: 0rem;
      width: 100%;
      height: 50px;
      background-image: url(../../../../assets/poptitle.png);
    }
    &-close{
      position: absolute;
      top: 0px;
      right: 0rem;
      z-index: 19;
    }
    &-container{
      width: 100%;
      height: 242px;
      background-image: url(../../../../assets/popbg.png);
      position: absolute;
      top: 0px;
      left: 0rem;
      &-right{
        float: left;
        // padding-right: 25px;
        &-content{
          width: 181px;
          height: 136px;
          margin-top: 70px;
          img{
            width: 181px;
            height: 136px;
          }
        }
      }
      &-content{
        width: 100%;
        height: auto;
        padding-top: 50px;
      }
      &-left{
        float: left;
        width: 400px;
        padding: 20px;
        padding-right: 0px;
      }
      &-list{
        width: 100%;
        font-size: 18px;
        margin-bottom: 15px;
        line-height: 31px;
        color: #FFFFFFFF;
        height: auto;
        div{
          float: left;
        }
      }
      &-title{
        width: 81px;
        color: #15CFF7FF;
      }
      &-tips{
        padding-left: 9px;
        width: 292px;
      }
    }
  }
</style>
