<template>
  <div class="rightTop">
    <div class="rightTop-search">
      <el-select
          v-model="value"
          filterable
          style="width: 500px"
          remote
          reserve-keyword
          placeholder="输入查询内容"
          :remote-method="remoteMethod"
          >
        <el-option
            v-for="(item,index) in options"
            :key="item.STCD"
            :label="item.STNM"
            :value="item.STCD">
        </el-option>
      </el-select>

      <!--      <el-input placeholder="请输入查询内容" style="width: 500px" v-model="value1"></el-input>-->
      <!--      <el-button style="float: right">查询</el-button>-->
    </div>
    <div class="rightTop-bottom">
        <div class="lineText">
          <div class="pointsInfo" style="padding: 0px 0px 8px">
            监 测 点：
            <span class="colorText">{{ $route.query.name }}</span>
            <span class="labelBtns colorText" @click="goBIM">BIM</span>
          </div>
        </div>
        <div class="lineText" style='height: auto'>
          <div class="pointsInfo operator">
            <span>详细信息</span>
            <span v-if='isOpen' class='none-line-clam' v-html="text"/>
            <span v-else='isOpen' class='textAround' v-html="text"/>
            <span class='iconStyle' @click="changeStatus">
              {{ isOpen ? '收起详情' : '展开详情' }}
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
            </span>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import {map} from "@/api";

export default {
  name: 'RightTop',
  components: {},
  watch: {
    $route() {
      this.init()
    },
    value(value){
      this.options.forEach(item=>{
        if (value===item.STCD){
          this.$router.push({
            path: '/commandDetails',
            query:{id:item.STCD,name:item.STNM}
          })
        }

      })
    }
  },
  data() {
    return {
      isOpen: false,
      text: '',
      options: [],
      value: '',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      map.getStcdIntroduction(this.$route.query.id).then(res => {
        this.text = res.data.introduction
      })
    },
    changeStatus() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$emit('changeStatus', {
          flag: true
        })
      } else {
        this.$emit('changeStatus', {
          flag: false
        })
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        const obj = {
          stnm: query,
        }
        map.zidongzhanByName(obj).then(res => {
          this.options = res.data;
        })
      } else {
        this.options = [];
      }
    },
    goBIM() {
      this.$store.dispatch('map/setMapState', 3)
      this.$router.push({
        path: '/automaticStation/BIMDetails',
        query: {id: this.$route.query.id, name: this.$route.query.name}
      })

    }
  }
}

</script>

<style lang='less' scoped>
.rightTop {
  padding: 10px 10px 0;

  &-search {
    ::v-deep .el-input__inner {
      background-color: rgba(31, 92, 107, 0.43);
      border: 1px solid #0086C7;
      border-radius: 3px;
      color: #fff;
    }

    .el-button {
      width: 116px;
      height: 38px;
      background: rgba(0, 137, 215, 0);
      //opacity: 0.48;
      border-radius: 3px;
      border: 1px solid rgba(0, 137, 215, 0.48);
      color: #fff;
      border-radius: 3px;
    }
  }

  &-bottom {
    padding-top: 10px;
    box-sizing: border-box;
      .lineText {
        padding: 9px 0px;
        font-size: 18px;
        height: 20px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;

        .pointsInfo {
          position: relative;
          width: 100%;
          padding: 5px 0px 0px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.35);
        }

        .operator {
          border-bottom: none;
          .iconStyle {
            cursor: pointer;
            position: absolute;
            right: 0px;
            top: 10px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #00F7FF;

          }
        }

        .colorText {
          color: #00F7FF
        }

        .labelBtns {
          position: absolute;
          right: 0px;
          display: inline-block;
          padding: 1px 5px;
          background: #012F42;
          border: 1px solid #00E4FF;
          border-radius: 4px;
          cursor: pointer;
        }
      }

      .textAround {
        font-size: 18px;
        width: 540px;
        height: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(252, 252, 252, 0.69);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        vertical-align: middle;
      }

      .none-line-clam {
        display: block;
      }
  }



}
</style>

