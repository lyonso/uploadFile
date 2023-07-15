<template>
  <div class="uas-container">
    <el-form :model="searchdata" ref="searchdata" :inline="true" size="small" class="searchParams__style">
      <el-form-item>
        <el-input
            prefix-icon="el-icon-search"
            placeholder="请输入按标注名称"
            v-model="searchdata.markName"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchdata.markType" placeholder="请选择标注类型">
          <el-option label="文字" :value="0"></el-option>
          <el-option label="图标" :value="1"></el-option>
          <el-option label="符号" :value="2"></el-option>
          <el-option label="三维" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
            @click="initpage(pageNum, pageSize, searchdata)"
            icon="el-icon-search"
            style="background: transparent; color: white;border: 1px solid #007896;"
        >搜索</el-button
        >
        <el-button
            @click="reset"
            style="background: transparent; color: white;border: 1px solid #007896;"
            icon="el-icon-refresh"
        >重置</el-button
        >
      </el-form-item>
      <el-form-item style="float: right;margin-right: 0px">
        <el-button
            @click="adduas"
            style="background: transparent; color: white;border: 1px solid #007896;"
            icon="el-icon-plus"
        >新增标注</el-button>
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
        <el-table-column prop="yjylMarkId" label="ID" min-width="80px" />
        <el-table-column prop="markName" label="标注名称" min-width="120px" />
        <el-table-column prop="markType" label="标识类型" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.markType == 0">文字</span>
            <span v-if="scope.row.markType == 1">图标</span>
            <span v-if="scope.row.markType == 2">符号</span>
            <span v-if="scope.row.markType == 3">三维</span>
          </template>
        </el-table-column>
        <el-table-column prop="markIcon" label="标识图例	" min-width="100px">
          <template slot-scope="scope">
            <img v-if="scope.row.markIcon" style="width:30px;height:30px" :src="scope.row.markIcon" alt="" />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          min-width="100px"
        />
        <el-table-column label="操作" min-width="160px">
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
      <el-form ref="uasdata" :model="uasdata" label-width="100px" label-suffix=":">
        <el-form-item prop="markType" label="标注类型" :rules="ruleArray.rule">
          <el-select v-model="uasdata.markType" placeholder="请选择标注类型">
            <el-option label="文字" :value="0"></el-option>
            <el-option label="图标" :value="1"></el-option>
            <el-option label="符号" :value="2"></el-option>
            <el-option label="三维" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="markName" label="标注名称" :rules="ruleArray.rule">
          <el-input v-model="uasdata.markName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="markCode" label="图标编码" :rules="ruleArray.rule">
          <el-input v-model="uasdata.markCode" placeholder="请输入"></el-input>
        </el-form-item>
        <div v-if="uasdata.markType == 1||uasdata.markType ==2||uasdata.markType==3">
          <el-form-item label="标识图例">
            <UpLoadImg
                ref="uploadimg"
                @change-del="changedel"
                :isshowimgs="isshowimgs"
                @child-event="changeImg"
                :imgurl="propsImgUrl"
            ></UpLoadImg>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button class="cancelBtns"
            @click="
                dialogVisible = false;
                  uasdata = {};
                  propsImgUrl=''
              "
        >取消</el-button
        >
        <el-button class="sureBtns" @click="query" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UpLoadImg from "@/components/imgLoader/index.vue";
import {
  uploadfile,
  marklist,
  markdel,
  markedit,
  addmark,
} from "@/api/baseInfo";
const ruleArray = {
  rule: [
    { required: true, message: "内容不能为空", trigger: [ "blur"] },
  ],
};
export default {
  components: {
    UpLoadImg
  },
  created() {},
  data() {
    return {
      ruleArray,
      value: "搜索类型",
      options: [
        {
          label: "图标名称",
          value: 1,
        },
      ],
      uasdata: {
        // gmtCreateUser:this.$Cookies.get('nickName'),
      },
      dialogVisible: false,
      uastitle: "添加标注",
      currentPage: 1,
      searchdata: {},
      list: [],
      total: 0,
      pageNum: 0,
      pageSize: 10,
      editOrAddNum: 0, //0添加 1编辑
      isshowimgs: false,
      propsImgUrl: "",
    };
  },
  created() {
    this.initpage(this.pageNum, this.pageSize, this.searchdata);
  },
  methods: {
    closeWin() {
      this.propsImgUrl=""
      this.dialogVisible = false
      this.uasdata = {};
    },
    changeImg(data) {
      console.log(data);
      this.uasdata.markIcon = data;
    },
    changedel(data) {
      console.log(data);
      this.isshowimgs = false;
      this.uasdata.markIcon = "";
    },
    query() {
      this.$refs.uasdata.validate((valid) => {
        if (valid) {
          console.log(this.persondata);
          if (this.editOrAddNum == 0) {
            addmark(this.uasdata).then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.$message.success("添加成功");
               this.reset()
              } else {
                this.$message.error(res.message);
              }
              this.dialogVisible = false;
            });
          } else {
            markedit(this.uasdata).then((res) => {
              if (res.code == 200) {
                this.$message.success("添加成功");
                this.initpage(this.pageNum, this.pageSize);
              } else {
                this.$message.error(res.message);
              }
              this.dialogVisible = false;
            });
          }
        }
      });
    },
    adduas() {
      this.isshowimgs = false;
      this.dialogVisible = true;
      this.editOrAddNum = 0;
    },
    // 编辑
    editcol(row) {
      this.uastitle = "编辑标注";
      this.editOrAddNum = 1;
      this.dialogVisible = true;
      if (row.markIcon) {
        this.isshowimgs = true;
      } else {
        this.isshowimgs = false;
      }
      this.uasdata = {
        id: row.yjylMarkId,
        markType: row.markType,
        markName: row.markName,
        markCode: row.markCode,
      };
      // {beginTime:"",endTime:"",},
      this.propsImgUrl = row.markIcon;
      console.log(row);
    },
    // 删除
    delcol(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          markdel(row.yjylMarkId).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.message);
              this.initpage(this.pageNum, this.pageSize, this.searchdata);
            } else {
              this.$message.error(res.message);
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
    // 查看详情
    seecol(row) {
      console.log(row);
    },
    // 选择时间
    changetime(e) {
      this.searchdata.beginTime = e[0];
      this.searchdata.endTime = e[1];
    },
    // 重置
    reset() {
      this.searchdata = {
        uavCode: "",
        uavName: "",
        uavNo: "",
        equipmentId: "",
        beginTime: "",
        endTime: "",
        value1: [],
      };
      this.pageNum=1
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    // 切换每页显示
    sizechange(e) {
      console.log(e);
      this.pageSize = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    // 换页
    changepage(e) {
      console.log(e);
      this.pageNum = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    // 初始化页面
    initpage(pageNum, pageSize, searchdata) {
      delete searchdata.value1;
      marklist(pageNum, pageSize, searchdata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.list = res.data.rows;
          this.total = res.data.total;
        }
      });
      console.log(pageNum, pageSize, searchdata);
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
