<!--
 * 基础数据管理
 * 船只管理
-->
<template>
  <div class="uas-container">
    <el-form :model="searchdata" ref="searchdata" :inline="true" size="small" class="searchParams__style">
      <el-form-item>
        <el-input
            prefix-icon="el-icon-search"
            placeholder="请输入船只名称"
            v-model="searchdata.shipName"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            @click="initpage(pageNum, pageSize, searchdata)"
            icon="el-icon-search"
            style="background: transparent; color: white;border: 1px solid #007896;"
        >查询</el-button>
        <el-button
            style="background: transparent; color: white;border: 1px solid #007896;"
            @click="reset"
            icon="el-icon-refresh"
        >重置</el-button>
      </el-form-item>
      <el-form-item style="float: right;margin-right: 0px">
        <el-button
            @click="adduas"
            style="background: transparent; color: white;border: 1px solid #007896;"
            icon="el-icon-plus"
        >新增船舶</el-button>
      </el-form-item>
    </el-form>

    <div class="tableReset__style">
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="670"
        :cell-style="{background: 'transparent',color:'#fff'}"
        :header-cell-style="{background: 'linear-gradient(0deg, rgba(0, 48, 83, 0.14), rgba(0, 143, 255, 0.14))'}"
      >
        <el-table-column prop="jcsjShipId" label="ID" min-width="120px" />
        <el-table-column prop="shipName" label="船只名称" min-width="100px" />
        <el-table-column prop="shipType" label="船只类型" min-width="100px" />
        <el-table-column prop="cameraCode" label="视频ID" min-width="100px" />
        <el-table-column label="船只图片" min-width="100px">
          <template slot-scope="scope">
            <img
              v-if="scope.row.shipPhoto"
              :src="scope.row.shipPhoto"
              style="width: 40px; height: 40px"
              alt=""
            />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" min-width="100px" />
        <el-table-column label="操作" min-width="140px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              style="color: #2999ebff"
              icon="el-icon-edit-outline"
              plain
              @click="editcol(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              style="color: #e02020ff"
              icon="el-icon-delete"
              plain
              @click="delcol(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px">
        <el-pagination
          background
          @size-change="sizechange"
          @current-change="changepage"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 添加无人机 -->
    <el-dialog
      :title="uastitle"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="600px"
      :modal="false"
      :close-on-click-modal="false"
      @close="closeWin"
      class="dialogReset__style"
    >
      <el-form
          ref="shipdata"
          :model="shipdata"
          label-width="100px"
          class="demo-ruleForm"
          label-suffix="："
      >
        <el-form-item label="船只名称" prop="shipName" :rules="ruleArray.shipName">
          <el-input v-model="shipdata.shipName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="视频ID" prop="cameraCode" :rules="ruleArray.cameraCode">
          <el-input type="textarea" placeholder='请输入视频码流地址，多个请用","隔开' v-model="shipdata.cameraCode"></el-input>
        </el-form-item>
        <el-form-item label="船只类型" prop="shipType" :rules="ruleArray.shipName">
          <el-select v-model="shipdata.shipType" placeholder="请选择">
            <el-option
                v-for="item in shipTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="船只图片">
          <UpLoadImg
              ref="uploadimg"
              @change-del="changedel"
              :isshowimgs="isshowimgs"
              @child-event="changeImg"
              :imgurl="propsImgUrl"
          ></UpLoadImg>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="cancelBtns"
            @click="
                dialogVisible = false;
                shipdata = {};
                propsImgUrl = '';
                $refs.uploadimg.$children[0].clearFiles();
              "
        >取消</el-button>
        <el-button class="sureBtns" @click="addNewShip" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UpLoadImg from "@/components/imgLoader/index.vue";
import {
  uploadfile,
  addship,
  shiplist,
  delship,
  editship,
} from "@/api/baseInfo";
export default {
  components: {
    UpLoadImg
  },
  data() {
    return {
      //验证规则
      ruleArray: {
        shipName: [
          {
            required: true,
            message: "船只名称不能为空",
            trigger: ["blur", "change"],
          },
        ],
        shipType: [
          {
            required: true,
            message: "船只类型类型不能为空",
            trigger: ["blur", "change"],
          },
        ],
      },
      value: "搜索类型",
      shipTypes: [
        { label: "水资源移动监测船", value: "水资源移动监测船" },
        { label: "巡逻船", value: "巡逻船" },
        { label: "趸船", value: "趸船" },
        { label: "交通船", value: "交通船" },
      ],
      options: [
        {
          label: "按船只名称查询",
          value: "shipName",
        },
      ],
      //时间选择器绑定数据
      value1: [],
      propsImgUrl: "",
      //新增船舶数据
      shipdata: {},
      dialogVisible: false,
      uastitle: "添加视频",
      //搜索条件
      searchdata: {
        beginTime: "",
        endTime: "",
        equimentId: "",
        shipName: "",
        shipType: "",
      },
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      addOrEditNum: 0, //0添加 1编辑
      isshowimgs: false,
      searchItem: "",
    };
  },
  created() {
    this.initpage(1, 10, this.searchdata);
  },
  methods: {
    /*
     *重置表单验证
     */
    resetRuleForm() {
      this.$nextTick(() => {
        this.$refs.shipdata.clearValidate();
      });
    },
    /*
     *关闭弹窗是触发
     */
    closeWin() {
      this.resetRuleForm();
      this.shipdata = {};
      this.$refs["uploadimg"].$children[0].clearFiles;
    },
    selected(e) {
      this.searchdata = {
        beginTime: "",
        endTime: "",
        equimentId: "",
        shipName: "",
        shipType: "",
      };
      this.searchItem = e;
    },
    changeImg(data) {
      console.log(data);
      this.shipdata.shipPhoto = data;
    },
    changedel(data) {
      this.isshowimgs = false;
      this.shipdata.shipPhoto = "";
    },
    /*提交船只信息*/
    addNewShip() {
      this.$refs.shipdata.validate((valid) => {
        if (valid) {
          let data = this.shipdata;
          console.log(data);
          if (this.addOrEditNum == 0) {
            addship(data).then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.$message.success("新增成功");
                this.dialogVisible = false;
                this.shipdata = {};
                this.reset();
              } else {
                this.$message.error(res.message);
              }
              this.$refs.uploadimg.children[0].clearFiles();
            });
          } else {
            editship(data).then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.$message.success("修改成功");
                this.initpage(this.pageNum, this.pageSize);
                this.dialogVisible = false;
                this.shipdata = {};
              } else {
                this.$message.error(res.message);
              }
              this.$refs.uploadimg.$children[0].clearFiles();
            });
          }
        }
      });
    },

    /*新增船只按钮触发*/
    adduas() {
      this.uastitle = "添加船只";
      this.dialogVisible = true;
      this.addOrEditNum = 0;
      this.isshowimgs = false;
    },
    /*编辑按钮触发条件*/
    editcol(row) {
      this.isshowimgs = true;
      this.addOrEditNum = 1;
      this.uastitle = "编辑船只";
      this.dialogVisible = true;
      if (row.shipPhoto) {
        this.isshowimgs = true;
      } else {
        this.isshowimgs = false;
      }
      this.shipdata = {
        equimentId: row.equimentId,
        shipName: row.shipName,
        shipType: row.shipType,
        id: row.jcsjShipId,
        shipPhoto: row.shipPhoto,
        cameraCode: row.cameraCode,
      };
      console.log(this.shipdata);
      this.propsImgUrl = row.shipPhoto;
    },
    /*检查输入内容格式*/
    checkData(rule, value, callback) {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error("视频ID只可由英文或数字组成"));
        } else {
          callback();
        }
      }
      callback();
    },

    /*删除行*/
    delcol(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delship(row.jcsjShipId).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.initpage(this.pageNum, this.pageSize, this.searchdata);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
   /*查看详情*/
    seecol(row) {
      console.log(row);
    },
    /*选择时间*/
    changetime(e) {
      this.searchdata.beginTime = e[0];
      this.searchdata.endTime = e[1];
    },
    /* 重置*/
    reset() {
      this.searchdata = {
        beginTime: "",
        endTime: "",
        equimentId: "",
        shipName: "",
        shipType: "",
      };
      this.pageNum = 1;
      this.value1 = [];
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    /* 切换每页显示*/
    sizechange(e) {
      console.log(e);
      this.pageSize = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    /*换页*/
    changepage(e) {
      console.log(e);
      this.pageNum = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    /* 初始化页面*/
    initpage(pageNum, pageSize, searchdata) {
      console.log(pageNum, pageSize, searchdata);
      shiplist(pageNum, pageSize, searchdata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.list = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.uas-container {
  background-color: transparent;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
