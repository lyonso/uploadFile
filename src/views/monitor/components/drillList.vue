<template>
  <div class="drillList">
    <el-container>
      <el-aside width="314px">
        <div class="navigation">
          <div class="navigation_top">
            <div>任务类型</div>
            <div>2</div>
          </div>
          <div class="navigation_body">
            <div :class="chose===1? 'chose':''" @click="chose=1">演练任务</div>
            <div :class="chose===2? 'chose':''" @click="chose=2">演练任务</div>
          </div>
        </div>
      </el-aside>
      <el-main class="body">
        <div class="body_top">
          <el-form :inline="true" :model="form" class="body_top_form">
            <el-form-item >
              <el-input v-model="form.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="时间 ：">
              <el-date-picker
                  v-model="form.time"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="onSubmit" @click="onSubmit">查 询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-scrollbar style="height: 100%" >
            <div v-for="(item,index) in list" :key="index" class="item">
              <div>
              </div>
              <div>
                <div>
                    <span>
                      任务编号：{{item}}
                    </span>
                  <span style="margin-left: 84px">
                      指挥长：{{item}}
                    </span>
                  <span style="margin-left: 84px">
                      任务日期：{{item}}
                    </span>
                </div>
                <div>
                  任务名称：<span style="color: #0CE1E4">{{item}}</span>
                </div>
                <div>任务描述：{{item}}</div>
              </div>
              <div>进入场景</div>
            </div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
const  pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }]
}
export  default {

  name:'drillList',
  data(){
    return{
      chose:1,
      form: {
        name: '',
        time: '',
      },
      pickerOptions,
      list:[1,1,1,11,1,1,1,1,1,1,1,1,1,1,1,1,1,1,]
    }
  },
  methods:{
    onSubmit(){

    }
  }
}

</script>

<style lang='less' scoped>
.drillList{
  width: 100%;
  height: 100vh;
  background:#131B26 ;
  position: absolute;
  z-index: 10;
  padding-top: 95px;
}
.navigation{
  margin-left:38px ;
  height: calc(100vh - 120px);
  background: rgba(1, 41, 61, 1);
  .navigation_top{
    width: 276px;
    height: 162px;
    background: #024657;
    border-top:2px solid rgba(12, 225, 228, 1) ;
    :first-child{
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 600;
      color: #0CE1E4;
      line-height: 60px;
      text-align: center;
    }
    :nth-child(2){
      font-size: 54px;
      font-family: SSFangYuanTi;
      font-weight: bold;
      color: #0CE1E4;
      line-height: 100px;
      text-align: center;
    }
  }
  .navigation_body{
    margin-top: 40px;
    div{
      width: 276px;
      height: 76px;
      text-align: center;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFDF2;
      line-height: 76px;
      cursor: pointer;
    }
    .chose{
      color: #F9D000;
      background: #073141;
    }
    .chose:after{
      content: '';
      position: relative;
      display: block;
      left: 272px;
      bottom: 76px;
      width: 4px;
      height: 76px;
      background: rgba(249, 208, 0, 1);
    }

  }
}
.body{
  height: calc(100vh - 120px);
  padding: 0;
  margin:  0 20px;
  .body_top{
    height: 76px;
    background: rgba(1, 41, 61, 0.48);
    border: 1px solid rgba(0, 204, 255,  0.08);
    .body_top_form{
      padding: 10px 0;
    }
  }
  >:last-child{
    margin-top: 20px;
    height: calc(100vh - 220px);
  }
  .item{
    height: 151px;
    border: 1px solid rgba(5, 89, 109, 0.4);
    background: rgba(7, 49, 65, 0.4);
    margin-bottom: 20px;
    >:first-child{
      display: inline-block;
      width: 192px;
      height: 100%;
      background: rgba(7, 49, 65, 0.56);
    }
    >:nth-child(2){
      display: inline-block;
      width: calc(100% - 507px);
      padding: 18px 0 0 12px ;
      vertical-align: top;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #E6FFFF;
      line-height: 40px;
    }
    >:last-child{
      display: inline-block;
      width: 231px;
      height: 87px;
      margin: 32px 29px;
      border: 4px solid #C0C7C6;
      line-height:  87px;
      text-align: center;
      vertical-align: top;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      background: #033D53;
      cursor: pointer;
    }

  }
  .item:hover{
    border: 1px solid rgba(249, 208, 0, 0.4);
    background: rgba(255, 215, 0, 0.4);
    >:last-child{
      background-image: linear-gradient(#C69F47,#CDB86A );
    }
  }
}

::v-deep .el-form-item{
  margin:  8px 50px  0 30px ;
}
::v-deep .el-form-item__label{
  color: #AFCAD1;
}
::v-deep .el-input__inner{
  background: rgba(0,0,0,0);
  color: #fff;
  border-color: rgba(0, 120, 150, 1);
}
::v-deep .el-date-editor .el-range-input{
  color: #fff;
  background: rgba(0,0,0,0);
}
::v-deep .el-date-editor .el-range-separator{
  color: #fff;
}

::v-deep .el-scrollbar{
  overflow: hidden;
  position: relative;
}
::v-deep  .el-scrollbar__wrap {
  overflow-x: hidden;
  height: 100%;
}

</style>

