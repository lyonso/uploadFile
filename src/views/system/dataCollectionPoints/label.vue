<template>
  <div class="uas-container">
    <div v-if="first"></div>
    <div v-else>
      <el-form :model="searchlabeldata" ref="searchlabeldata" :inline="true" size="small" class="searchParams__style">
        <el-form-item class="appendSelect">
          <el-input
              style="width: 400px"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字"
              v-model="searchlabeldata[searchItem]"
          >
            <el-select
                style="width: 160px; color: #1f2e4d"
                v-model="value"
                slot="append"
                @change="selected"
            >
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select
              v-model="searchlabeldata.tagType"
              placeholder="请选择标签类型"
          >
            <el-option label="水质" :value="0"></el-option>
            <el-option label="水文" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
              @click="initLabel(labelNum, labelSize, searchlabeldata)"
              icon="el-icon-search"
              style="background: transparent; color: white;border: 1px solid #007896;"
          >搜索</el-button
          >
          <el-button
              @click="reset2"
              style="background: transparent; color: white;border: 1px solid #007896;"
              icon="el-icon-refresh"
          >重置</el-button
          >
        </el-form-item>
        <el-form-item style="float: right;margin-right: 0px">
          <el-button
              @click="
            dialogVisible2 = true;
            labeEditNum = 0;
          "
              style="background: transparent; color: white;border: 1px solid #007896;"
              icon="el-icon-plus"
          >新增标签</el-button>
        </el-form-item>
      </el-form>
      <div class="tableReset__style">
        <el-table
          ref="multipleTable"
          :data="labelList"
          tooltip-effect="dark"
          style="width: 100%"
          max-height="670"
          :cell-style="{background: 'transparent',color:'#fff'}"
          :header-cell-style="{background: 'linear-gradient(0deg, rgba(0, 48, 83, 0.14), rgba(0, 143, 255, 0.14))'}"
        >
          <el-table-column
            prop="jcsjCollectionTagId"
            label="ID"
            min-width="150px"
          />
          <el-table-column prop="tagName" label="标签名称	" min-width="100px" />
          <el-table-column prop="tagUnit" label="标签单位	" min-width="100px" />
          <el-table-column prop="tagType" label="标签类型" min-width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.tagType == 0">水质</span>
              <span v-else>水文</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="创建时间"
            min-width="100px"
          />
          <el-table-column label="操作" min-width="150px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                style="color: #2999ebff"
                icon="el-icon-edit-outline"
                plain
                @click="editlabel(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                style="color: #e02020ff"
                icon="el-icon-delete"
                plain
                @click="dellabel(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="text-align: right;margin-top: 20px">
          <el-pagination
            background
            @size-change="labelsizechange"
            @current-change="labelchangepage"
            :current-page="labelNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加标签 -->
    <el-dialog
      :title="labeltitle"
      v-if="dialogVisible2"
      :visible.sync="dialogVisible2"
      width="600px"
      :modal="false"
      :close-on-click-modal="false"
      @close="closeWin"
      class="dialogReset__style"
    >
      <el-form ref="form" :model="labelData" label-width="100px" label-suffix=":">
        <el-form-item prop="tagName" label="标签名称" :rules="ruleArray.tagName">
          <el-input v-model="labelData.tagName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="tagUnit" label="标签单位" :rules="ruleArray.tagUnit">
          <el-input v-model="labelData.tagUnit" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="tagType" label="标签类型" :rules="ruleArray.tagType">
          <el-select v-model="labelData.tagType" placeholder="请选择标签类型">
            <el-option label="水质" :value="0"></el-option>
            <el-option label="水文" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="cancelBtns"
            @click="
                dialogVisible2 = false;
                labelData = {};
              "
        >取消</el-button
        >
        <el-button class="sureBtns" @click="addLabel" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  tagdel,
  tagedit,
  taglist,
  tagadd,
  pointList,
} from "@/api/baseInfo";
const ruleArray = {
  tagName: [
    {
      required: true,
      message: "标签名称不能为空",
      trigger: ["blur"],
    },
  ],
  tagUnit: [
    {
      required: true,
      message: "标签单位不能为空",
      trigger: ["blur"],
    },
  ],
  tagIdentifier: [
    {
      required: true,
      message: "标签标识符不能为空",
      trigger: ["blur"],
    },
  ],
  tagType: [{ required: true, message: "请选择标签类型", trigger: ["change"] }],
};
export default {
  data() {
    return {
      ruleArray,
      value: "tagName",
      options: [
        {
          label: "按标签名称搜索",
          value: "tagName",
        },
        {
          label: "按标签单位搜索",
          value: "tagUnitLike",
        },
      ],
      total2: 0,
      searchlabeldata: {
        tagName: "",
        tagUnitLike: "",
        beginTime: "",
        endTime: "",
        tagType: "",
      },
      labelList: [],
      labeltitle: "添加标签",
      choicepointid: 0,
      first: false,
      pointdata: {},
      labelData: {
        tagName: "",
        tagUnit: "",
        tagIdentifier: "",
        tagType: "",
      },
      dialogVisible: false,
      dialogVisible2: false,
      uastitle: "添加采集点",
      searchdata: { beginTime: "", endTime: "", pointName: "", pointCode: "" },
      list: [],
      total: 0,
      pageNum: 0,
      pageSize: 10,
      addOrEditNum: 0, //0添加 1编辑
      labeEditNum: 0, //0添加 1编辑
      labelNum: 1,
      labelSize: 10,
      searchItem: "tagName",
    };
  },
  created() {
    this.initLabel(1, 10, this.searchlabeldata);
  },
  methods: {
    resetRuleForm() {
      this.$nextTick(() => {
        this.$refs.labelData.clearValidate();
      });
    },
    closeWin() {
      this.resetRuleForm();
      this.dialogVisible2 = false;
      this.labelData = {};
      this.$refs.uploadimg.$children[0].clearFiles();
    },
    selected(e) {
      this.searchlabeldata = {
        beginTime: "",
        endTime: "",
        tagName: "",
        tagUnitLike: "",
      };
      this.searchItem = e;
    },
    editlabel(row) {
      console.log(row);
      this.labelData = {
        id: row.jcsjCollectionTagId,
        tagName: row.tagName,
        tagUnit: row.tagUnit,
        tagIdentifier: row.tagIdentifier,
        tagType: parseInt(row.tagType),
      };
      this.dialogVisible2 = true;
      this.labeEditNum = 1;
    },
    dellabel(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          tagdel(row.jcsjCollectionTagId).then((res) => {
            if (res.code == 200) {
              console.log(res);
              this.$message.success("删除成功");
              this.initLabel(
                this.labelNum,
                this.labelSize,
                this.searchlabeldata
              );
            } else {
              this.$message.error(res.message);
            }
            this.$refs.uploadimg.$children[0].clearFiles();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addLabel() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = this.labelData;
          console.log(data);
          if (this.labeEditNum == 0) {
            tagadd(data).then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.$message.success(res.message);
                this.labelData = {};
                this.reset2();
              } else {
                this.$message.error(res.message);
              }
              this.dialogVisible2 = false;
            });
          } else {
            tagedit(data).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.message);
                this.initLabel(
                  this.labelNum,
                  this.labelSize,
                );
              } else {
                this.$message.error(res.message);
              }
              this.dialogVisible2 = false;
            });
          }
          this.$refs.uploadimg.$children[0].clearFiles();
        }
      });
    },
    seting(row) {
      this.first = false;
      this.initLabel(1, 10, this.searchlabeldata);
      this.choicepointid = row.jcsjCollectionPointId;
    },

    // 图片上传
    // 添加船只

    // 删除

    // 查看详情
    seecol(row) {
      console.log(row);
      console.log(row);
    },
    // 选择时间
    changetime(e) {
      this.searchdata.beginTime = e[0];
      this.searchdata.endTime = e[1];
    },
    // 重置
    reset2() {
      this.searchlabeldata = {
        beginTime: "",
        endTime: "",
        tagName: "",
        tagUnitLike: "",
      };
      this.labelNum = 1;
      this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
    },
    // 切换每页显示

    labelsizechange(e) {
      console.log(e);
      this.labelSize = e;
      this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
    },
    // 换页

    labelchangepage(e) {
      console.log(e);
      this.labelNum = e;
      this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
    },
    // 初始化标签
    initLabel(pageNum, pageSize, searchlabeldata) {
      taglist(pageNum, pageSize, searchlabeldata).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.labelList = res.data.rows;
          this.total2 = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 初始化页面
    initpage(pageNum, pageSize, searchdata) {
      console.log(pageNum, pageSize, searchdata);
      delete searchdata.value1;

      pointList(pageNum, pageSize, searchdata).then((res) => {
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
