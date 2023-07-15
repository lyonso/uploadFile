<template>
  <div class="stationList">
    <el-form ref="form" :model="searchdata"  :inline="true"  label-width="82px">
      <el-form-item label="选择站点：">
        <el-select v-model="searchdata.stcd" filterable placeholder="请选择">
          <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.pointName"
              :value="item.pointCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间：">
        <el-date-picker
            v-model="searchdata.Time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onsubmit" >查询</el-button>
      </el-form-item>
    </el-form>
    <div class="body">
      <div class="title">
        太湖—
        <span style="color: #FFD200">{{ title }}</span>
        监测点数据详情
        <i class="el-icon-s-unfold icon" @click="changeSteps"></i>
      </div>
      <div class="imgList">
        <div class="tableReset__style">
          <el-table
              ref="multipleTable"
              :data="list"
              tooltip-effect="dark"
              style="width: 100%"
              height="630px"
              :cell-style="{backgwround: 'transparent',color:'#fff'}"
              :header-cell-style="{background: 'linear-gradient(0deg, rgba(0, 48, 83, 0.14), rgba(0, 143, 255, 0.14))'}"
          >
            <el-table-column prop="HQNM" label="湖区" />
            <el-table-column prop="STNM" label="监测点"/>
            <el-table-column prop="SPT" label="采样时间"  width="140px"/>
            <el-table-column prop="WT" label="水温 ℃"/>
            <el-table-column prop="PH" label="PH" />
            <el-table-column prop="COND" label="电导率 (us/cm)" width="140px" />
            <el-table-column prop="DOX" label="溶解氧 (mg/L)" />
            <el-table-column prop="TURB" label="浊度 (NTU)" />
            <el-table-column prop="REDOX" label="氧化还原单位 (mV)" />
            <el-table-column prop="CODMN" label="高锰酸盐指数 (mg/L)" />
            <el-table-column prop="TN" label="总氮 (mg/L)" />
            <el-table-column prop="NH3N" label="氨氮 (mg/L)" />
            <el-table-column prop="TP" label="总磷 (mg/L)" />
            <el-table-column prop="TOC" label="总有机碳(mg/L)" width="130px"/>
            <el-table-column prop="CHLA" label="叶绿素a (ug/L)" width="130px"/>
          </el-table>
          <!-- 分页 -->
          <div style="text-align: right;margin-top: 20px">
            <el-pagination
                background
                @size-change="sizechange"
                @current-change="changepage"
                :current-page="searchdata.pageNumber"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import { map } from '@/api'
import {dateFormat} from '@/utils/time'
import { mapGetters } from 'vuex'

export default {
  name:'stationList',
  components:{
    DialogTitle
  },
  watch:{
    'searchdata.Time'(val){
      this.searchdata.startTime = val[0]
      this.searchdata.endTime = val[1]
    }
  },
  created(){
    const details = JSON.parse(this.BlueDialogDetails)
    console.log(details)

    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    end = dateFormat("YYYY-mm-dd", end)
    start = dateFormat("YYYY-mm-dd", start)
    this.searchdata.Time = [start, end]
    this.$store.dispatch('map/setMask',true)
    this.searchdata.stcd = details.pointCode
    this.title = details.pointName
  },
  mounted() {
    map.zdPoint().then(res=>{
      this.options = res.data
      this.getList()
    })
  },
  computed: {
    ...mapGetters([
      'BlueDialogDetails'
    ]),
  },
  data(){
    return{
      formInline: {
        user: '',
        region: ''
      },
      options:[],
      value: "userName",
      //人员信息查询条件
      searchdata: {
        startTime: "",
        endTime: "",
        Time: [],
        stcd:"",
        pageNumber: 1,
        pageSize: 10,
      },
      list: [],
      total: 0,
      title:'',

    }
  },
  beforeDestroy(){
    this.$store.dispatch('map/setMask',false)
  },
  methods:{
    /**
     * 搜索
     */
    onsubmit(){
      this.options.forEach(item=>{
        if (item.pointCode===this.searchdata.stcd){
          this.title = item.pointName
        }
      })
      this.searchdata.pageNumber=1
      this.searchdata.pageSize=10
      this.getList()
    },
    getList(){
      const obj  = {
        startTime: this.searchdata.startTime,
        endTime:this.searchdata.endTime,
        stcd:this.searchdata.stcd,
        pageNumber:this.searchdata.pageNumber,
        pageSize: this.searchdata.pageSize,
      }
      map.lanzaoDataList(obj).then(res=>{
        res.data.records.forEach(item=>{
          item.HQNM = '太湖'
        })
        this.list =res.data.records
        this.total = res.data.page.total
      })
    },
    /**
     * 返回
     */
    changeSteps(){
      this.$emit('chageSteps',4)
    },
    /**
     * 切换每页显示
     */
    sizechange(e) {
      this.searchdata.pageSize = 1
      this.searchdata.pageSize = e
      this.getList()
    },
    /**
     * 换页
     */
    changepage(e) {
      this.searchdata.pageNumber = e;
      this.getList()
    },
  }
}
</script>

<style lang="less" scoped>
.stationList{
  position: absolute;
  width: 1880px;
  height: 960px;
  //background: red;
  top: 90px;
  z-index: 1;
  padding: 20px 30px;
  .body{
    width: 1842px;
    //height: 864px;
    border: 1px solid rgba(229, 229, 229, 0.31);
  }
  .imgList{
    color: #fff;
    padding: 30px 15px 30px 30px;
    height:calc(100vh - 260px);
    .item{
      display: inline-block;
      margin: 0 33px 44px 0;
      >:first-child{
        margin-bottom: 12px;
      }
      >:last-child{
        display: inline-block;
        width: 225px;
        margin-top: 12px;
      }
    }
    .itemEnd{
      margin-right: 0px;
    }
    .img{
      width: 225px;
      height: 183px;
      background: #FFFFFF;
    }

    ::v-deep .el-scrollbar__wrap{
      overflow-x: hidden;
    }


  }
}
.title{
  position: relative;
  height: 44px;
  background: rgba(14, 78, 116, 0.31);
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 44px;
  padding-left: 23px;
  .icon{
    position: absolute;
    right: 16px;
    top: 11px;
    opacity: 0.52;
    font-size: 24px;
    cursor: pointer;
  }
}
::v-deep .el-button--primary{
  width: 116px;
  height: 40px;
  border: 1px solid #0089D7;
  opacity: 0.48;
  background: rgba(0, 137, 215, 0);
  border-radius: 3px;
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #FFFFFF
}
::v-deep .el-input__inner{
  background-color:rgba(0, 51, 76, 0.49);
  border: 1px solid #05556B;
  border-radius: 4px;
  color:rgba(255, 255, 255, 0.67)
}
::v-deep .el-button{
  padding-top: 9px;
}
::v-deep .imgList{
  padding: 10px !important;
}
::v-deep .el-date-editor .el-range-input{
  background-color:rgba(0, 51, 76, 0.49);
  color:rgba(255, 255, 255, 0.67)
}
::v-deep .el-date-editor .el-range-separator{
  color:rgba(255, 255, 255, 0.67)

}
::v-deep .el-table .cell{
  text-align: center;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #212e3e !important;
}
</style>
