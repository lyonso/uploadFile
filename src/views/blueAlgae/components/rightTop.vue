<template>
  <div class='leftTop'>
    <DialogTitle dialogTitle='藻类监测结果' />
    <div class='table'>
      <el-row>
        <div class='table_header'>
          <el-col :span='3'>
            <div>湖区</div>
          </el-col>
          <el-col :span='5'>
            <div>藻类数量(万个/L)</div>
          </el-col>
          <el-col :span='5'>
            <div>生物量(mg/L)</div>
          </el-col>
          <el-col :span='5'>
            <div>蓝藻数量(万个/L)</div>
          </el-col>
          <el-col :span='6'>
            <div>主要优势种</div>
          </el-col>
        </div>
        <div v-if='!List.length' class='noting'>
          暂无数据
        </div>
        <div v-else v-for='(item,index) in List' :key='index'
             :class="(index+1)%2 === 0?'table_body shuang':'table_body'">
          <el-col :span='3'>
            <div>{{ item.HQNM || '-' }}</div>
          </el-col>
          <el-col :span='5'>
            <div>{{ item.PHYD || '-' }}</div>
          </el-col>
          <el-col :span='5'>
            <div>{{ item.PHYBM || '-' }}</div>
          </el-col>
          <el-col :span='5'>
            <div>{{ item.CYNCD || '-' }}</div>
          </el-col>
          <el-col :span='6'>
            <el-tooltip :disabled='item.PHYDS.length<10' class='item' effect='dark' :content='item.PHYDS'
                        placement='top-start'>
              <div style='height: 35px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap'>
                {{ item.PHYDS || '-' }}
              </div>
            </el-tooltip>
          </el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import { map } from '@/api'

export default {
  name: 'leftTop',
  components: {
    DialogTitle
  },
  data() {
    return {
      List: []
    }
  },
  mounted() {
    map.getLakePhyMonth().then(res => {
      this.List = res.data
    })
  },
  methods: {}
}
</script>
<style lang='less' scoped>
.leftTop {
  width: 714px;
  background: rgba(11, 37, 50, 0.64);
  border: 1px solid rgba(229, 229, 229, 0.31);

}

.table_header {
  height: 30px;
  background: rgba(0, 51, 76, 0.49);
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(0, 255, 252, 1);
  line-height: 30px;
  padding-left: 20px;
  text-align: center;
}

.table {
  height: 391px;
}

.noting {
  text-align: center;
  line-height: 391px;
  font-size: 26px;
  color: #FFFFFF;
}

.table_body {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #EDFFFF;
  height: 35.7px;
  line-height: 30px;
  padding-left: 20px;
  text-align: center;
}

.shuang {
  background: rgba(1, 142, 159, 0.1);
}
</style>
