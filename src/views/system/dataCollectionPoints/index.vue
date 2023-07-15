<!--
 * 基础数据管理
 * 自动监测站管理
-->
<template>
  <div class="uas-container">
    <el-form :model="searchdata" ref="searchdata" :inline="true" size="small" class="searchParams__style">
      <el-form-item class="appendSelect">
        <el-input
            style="width: 450px"
            prefix-icon="el-icon-search"
            placeholder="请输入关键字"
            v-model="searchdata[searchItem]"
        >
          <el-select
              style="width: 200px; color: #1f2e4d"
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
        >新增自动监测站</el-button>
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
          <el-table-column
            prop="jcsjCollectionPointId"
            label="ID"
            min-width="100px"
          />
          <el-table-column
            prop="pointName"
            label="自动监测站名称"
            min-width="100px"
          />
          <el-table-column
            prop="pointCode"
            label="监测站编码"
            min-width="100px"
          />

          <el-table-column prop="longitude" label="经度" min-width="100px" />

          <el-table-column prop="latitude" label="纬度" min-width="100px" />
          <el-table-column
            prop="gmtCreate"
            label="创建时间"
            min-width="100px"
          />

          <el-table-column label="操作" min-width="200px">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="text"
                style="color: #2999ebff"
                plain
                icon="el-icon-setting"
                @click="seting(scope.row)"
                >标签管理</el-button
              > -->
              <el-button
                size="mini"
                type="text"
                style="color: #2999ebff"
                plain
                icon="el-icon-edit-outline"
                @click="editcol(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                style="color: #e02020ff"
                plain
                icon="el-icon-delete"
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
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    <el-dialog
      title="标签管理"
      :visible.sync="second"
      width="720px"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div style="padding: 10px">
        <div
          class="header-search"
          style="position: relative; padding-top: 0px; padding-bottom: 0px"
        >
          <div class="header-search-list">
            <!-- <div class="header-search-title">标签名称：</div> -->
            <div class="small">
              <el-input
                placeholder="标签名称"
                prefix-icon="el-icon-search"
                v-model="searchlabeldata.tagName"
              ></el-input>
            </div>
            <div class="clearfloat"></div>
          </div>
          <div class="header-search-list">
            <!-- <div class="header-search-title">标签单位：</div> -->
            <div class="small">
              <el-input
                placeholder="标签单位"
                prefix-icon="el-icon-search"
                v-model="searchlabeldata.tagUnit"
              ></el-input>
            </div>
            <div class="clearfloat"></div>
          </div>

          <div class="header-search-list">
            <div class="header-sarch-button">
              <el-button
                @click="initLabel(labelNum, labelSize, searchlabeldata)"
                icon="el-icon-search"
                style="background-color: #2999ebff; color: white"
                >搜索</el-button
              >
              <el-button
                style="color: #2999ebff"
                @click="reset2"
                icon="el-icon-refresh"
                >重置</el-button
              >
            </div>
            <div class="clearfloat"></div>
          </div>
          <div class="clearfloat"></div>
          <div class="uas-container-buttonContent" style="top: 0px; right: 0px">
            <el-button
              style="background: #09943bff; color: white"
              @click="
                dialogVisible2 = true;
                labeEditNum = 0;
              "
              icon="el-icon-plus"
              >新增标签</el-button
            >
          </div>
        </div>

        <div class="uas-container-table" style="padding: 5px">
          <el-table
            ref="multipleTable"
            :data="labelList"
            tooltip-effect="dark"
            style="width: 100%"
            max-height="1000"
            border
            :header-cell-style="{ background: '#f4f4f5', color: '##1F2E4DFF' }"
          >
            <el-table-column
              prop="jcsjCollectionTagId"
              label="ID"
              min-width="56px"
            />
            <el-table-column prop="tagName" label="标签名称	" min-width="56px" />
            <el-table-column prop="tagUnit" label="标签单位	" min-width="56px" />
            <el-table-column label="操作" min-width="56px">
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
          <div class="uas-container-table-pagination">
            <el-pagination
              background
              @size-change="labelsizechange"
              @current-change="labelchangepage"
              :current-page="pageNum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total2"
            >
            </el-pagination>
          </div>
        </div>
      </div>

      <div class="fc-container-bottom">
        <!-- <el-button @click="addLabel" type="warning">确定</el-button> -->
        <el-button @click="second = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加采集 -->
    <el-dialog
      :title="uastitle"
      :visible.sync="dialogVisible"
      width="1264px"
      :modal="false"
      :close-on-click-modal="false"
      @close="closeWin"
      class="dialogReset__style"
    >
      <el-row>
        <el-col :span="12">
          <el-form ref="pointdata" :model="pointdata" label-width="100px" label-suffix=":">
            <el-form-item prop="pointName" label="监测站名称" :rules="ruleArray.rule">
              <el-input v-model="pointdata.pointName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="pointCode" label="监测站编码" :rules="ruleArray.pointCode">
              <el-input v-model="pointdata.pointCode" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="longitude" label="经度" :rules="ruleArray.longitude">
              <el-input v-model="pointdata.longitude" placeholder="请从小地图选取坐标轴"></el-input>
            </el-form-item>
            <el-form-item prop="latitude" label="纬度" :rules="ruleArray.latitude">
              <el-input v-model="pointdata.latitude" placeholder="请从小地图选取坐标轴"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <mapView
              @send-longitude="getLongitutde"
              @send-latitude="getLatitude"
              :currentLat="pointdata.latitude"
              :currentLng="pointdata.longitude"
          />
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button class="cancelBtns"
                   @click="
                  dialogVisible = false;
                  if (addOrEditNum == 1) {
                    pointdata = {};
                  }
                "
        >取消</el-button
        >
        <el-button class="sureBtns" @click="addNewShip" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加标签 -->
    <el-dialog
      :title="labeltitle"
      :visible.sync="dialogVisible2"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="fc-container">
        <div class="fc-container-list">
          <div class="fc-container-list-input" style="margin-left: 20px">
            <el-input
              v-model="searchname"
              placeholder="请输入要添加的标签名"
            ></el-input>
          </div>
          <div class="fc-container-list-search">
            <el-button
              type="warning"
              style="margin-left: 20px"
              @click="addRelationLabel"
              icon="el-icon-search"
              >搜索</el-button
            >
          </div>
          <div class="clearfloat"></div>
        </div>

        <div v-if="showmore">
          <div class="fc-content-list">
            <div class="fc-container-list-title">标签名称：</div>
          </div>
          <div class="fc-container-list">
            <div
              class="fc-container-list-tagel"
              v-for="(item, index) in tageldata"
              :key="index"
              @click="choicetagel(item)"
              :class="{ active: item.jcsjCollectionTagId == choicelabelid }"
            >
              {{ item.tagName }}
            </div>
            <div class="clearfloat"></div>
          </div>
        </div>

        <div class="fc-container-bottom">
          <el-button
            @click="
              dialogVisible2 = false;
              if (addOrEditNum == 1) {
                labelData = {};
              }
            "
            >取消</el-button
          >
          <el-button @click="addrela" type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  relist,
  readd,
  tagdel,
  tagedit,
  taglist,
  tagadd,
  delpoint,
  editpoint,
  addpoint,
  pointList,
} from "@/api/baseInfo";
import mapView from "@/components/map/index";
//表单验证
const ruleArray = {
  rule: [
    {
      required: true,
      message: "内容不能为空",
      trigger: ["blur"],
    },
  ],
  pointCode: [
    {
      required: true,
      message: "内容不能为空",
      trigger: ["blur"],
    },
  ],
  latitude: [
    {
      required: true,
      message: "请在小地图选取坐标",
      trigger: ["blur", "change"],
    },
  ],
  longitude: [
    {
      required: true,
      message: "请在小地图选取坐标",
      trigger: ["blur", "change"],
    },
  ],
};
export default {
  components: {
    mapView,
  },
  data() {
    return {
      ruleArray,
      value: "pointName",
      options: [
        {
          label: "按自动监测站名称搜索",
          value: "pointName",
        },
        {
          label: "按自动监测站编码搜索",
          value: "pointCodeLike",
        },
      ],
      value1: [],
      choicelabelid: 0,
      showmore: false,
      searchname: "",
      second: false,
      total2: 0,
      searchlabeldata2: {
        tagName: "",
        tagUnit: "",
        beginTime: "",
        endTime: "",
        tagType: "",
      },
      searchlabeldata: {
        beginTime: "",
        endTime: "",
        tagId: "",
        pointId: "",
        beginTime: "",
      },
      labelList: [],
      labeltitle: "添加关联标签",
      choicepointid: 0,
      first: true,
      //监测站信息
      pointdata: {
        longitude: 120.239307,
        latitude: 31.551029,
      },
      labelData: {},
      dialogVisible: false,
      dialogVisible2: false,
      uastitle: "添加自动监测站",
      //监测站信息
      searchdata: {
        beginTime: "",
        endTime: "",
        pointName: "",
        pointCodeLike: "",
      },
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      addOrEditNum: 0, //0添加 1编辑
      labeEditNum: 0, //0添加 1编辑
      labelNum: 1,
      labelSize: 10,
      relationId: 0,
      tageldata: [],
      searchItem: "pointName",
    };
  },
  created() {
    this.initpage(1, 10, this.searchdata);
  },
  methods: {
    /**
     * 重置表单验证
     */
    resetRuleForm() {
      this.$nextTick(() => {
        this.$refs.pointdata.clearValidate();
      });
    },
    /**
     * 关闭弹窗触发
     */
    closeWin() {
      this.resetRuleForm();
      this.dialogVisible = false;
      this.pointdata = {
        longitude: 120.239307,
        latitude: 31.551029,
      };
    },
    /**
     * 子组件监听 获取经度
     */
    getLongitutde(value) {
      this.pointdata.longitude = value;
      console.log("From the child:", value);
    },
    /**
     * 子组件监听 获取纬度
     */
    getLatitude(value) {
      this.pointdata.latitude = value;
      console.log("From the child:", value);
    },
    selected(e) {
      this.searchdata = {
        beginTime: "",
        endTime: "",
        pointName: "",
        pointCodeLike: "",
      };
      this.searchItem = e;
    },
    addrela() {
      if (this.choicelabelid) {
        readd({
          pointId: this.choicepointid,
          tagId: this.choicelabelid,
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success(res.message);
            this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
          } else {
            this.$message.error(res.message);
          }
          this.dialogVisible2 = false;
        });
        console.log(this.choicelabelid);
        console.log(this.choicepointid);
      } else {
        this.$message.warning("请选择标签");
      }
    },

    choicetagel(item) {
      this.choicelabelid = item.jcsjCollectionTagId;
    },
    addRelationLabel() {
      this.choicelabelid = 0;
      if (this.searchname == "") {
        this.$message.warning("请输入标签名");
      } else {
        // 搜索 获取  标签id
        let data = this.searchlabeldata2;
        data.tagName = this.searchname;
        console.log(data);
        taglist(1, 10, data).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.tageldata = res.data.rows;
            this.showmore = true;
          }
        });
      }
    },

    editlabel(row) {
      console.log(row);
      // this.labelData={
      //   id:row.jcsjCollectionTagId,
      //   tagName:row.tagName,
      //   tagUnit:row.tagUnit
      // }
      this.dialogVisible2 = true;
      // this.relationId =
      // this.labeEditNum= 1
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
      let data = this.labelData;
      console.log(data);
      if (this.labeEditNum == 0) {
        tagadd(data).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success(res.message);
            this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
          } else {
            this.$message.error(res.message);
          }
          this.dialogVisible2 = false;
        });
      } else {
        tagedit(data).then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
          } else {
            this.$message.error(res.message);
          }
          this.dialogVisible2 = false;
        });
      }
    },
    seting(row) {
      console.log(row);
      this.searchlabeldata.pointId = row.jcsjCollectionPointId;
      this.first = false;
      this.second = true;
      this.initLabel(1, 10, this.searchlabeldata);
      this.choicepointid = row.jcsjCollectionPointId;
    },

    // 图片上传
    // 添加船只
    addNewShip() {
      this.$refs.pointdata.validate((valid) => {
        if (valid) {
          let data = this.pointdata;
          console.log(data);
          if (this.addOrEditNum == 0) {
            addpoint(data).then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.$message.success("操作成功");
                this.reset();
                this.pointdata = {};
                this.dialogVisible = false;
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            editpoint(data).then((res) => {
              console.log(res);
              if (res.code == 200) {
                this.$message.success("操作成功");
                this.initpage(this.pageNum, this.pageSize);
                this.pointdata = {};
                this.dialogVisible = false;
              } else {
                this.$message.error(res.message);
              }
            });
          }
        }
      });
    },

    adduas() {
      this.uastitle = "添加自动监测站";
      this.dialogVisible = true;
      this.addOrEditNum = 0;
    },
    // 编辑
    editcol(row) {
      console.log(row);
      this.addOrEditNum = 1;
      this.uastitle = "编辑自动监测站";
      this.dialogVisible = true;
      this.pointdata = {
        pointName: row.pointName,
        pointCode: row.pointCode,
        longitude: row.longitude,
        latitude: row.latitude,
        id: row.jcsjCollectionPointId,
      };
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
          delpoint(row.jcsjCollectionPointId).then((res) => {
            if (res.code == 200) {
              console.log(res);
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
    reset() {
      this.searchdata = {
        beginTime: "",
        endTime: "",
        pointName: "",
        pointCodeLike: "",
      };
      this.pageNum = 1;
      this.value1 = [];
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    reset2() {
      this.searchlabeldata = {
        beginTime: "",
        endTime: "",
        tagName: "",
        tagUnit: "",
      };
      this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
    },
    // 切换每页显示
    sizechange(e) {
      console.log(e);
      this.pageSize = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    labelsizechange(e) {
      console.log(e);
      this.labelSize = e;
      this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
    },
    // 换页
    changepage(e) {
      console.log(e);
      this.pageNum = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    labelchangepage(e) {
      console.log(e);
      this.labelNum = e;
      this.initLabel(this.labelNum, this.labelSize, this.searchlabeldata);
    },
    // 初始化标签
    initLabel(pageNum, pageSize, searchlabeldata) {
      relist(pageNum, pageSize, searchlabeldata).then((res) => {
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
