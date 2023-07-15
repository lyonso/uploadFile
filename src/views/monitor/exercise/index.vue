<template>
  <div class="exercise">
    <div class="back">
      <el-button type="primary" icon="el-icon-back" @click="goBack"  size="mini">返回</el-button>
    </div>
    <div class="uas-container"
         v-loading.fullscreen.lock="loading"
         element-loading-text="上传中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="header-search">
        <div class="header-search-list">
          <el-input
              style="width: 400px"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字"
              v-model="searchdata.missionName"
          >
            <template slot="append">按任务名称搜索</template>
          </el-input>
        </div>
        <div class="header-search-list">
          <div class="small">
            <el-select
                style="width: 100%"
                v-model="searchdata.missionType"
                placeholder="请选择"
            >
              <el-option label="演练任务" :value="0"/>
              <el-option label="指挥任务" :value="1"/>
            </el-select>
          </div>
          <div class="clearfloat"></div>
        </div>
        <div class="header-search-list">
          <div class="header-search-picker">
            <el-date-picker
                v-model="searchdata.value1"
                @change="changetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
          <div class="clearfloat"></div>
        </div>
        <div class="header-search-list">
          <div class="header-sarch-button">
            <el-button
                @click="initpage(pageNum, pageSize, searchdata)"
                icon="el-icon-search"
                style="background-color: #2999ebff; color: white"
            >搜索
            </el-button>
            <el-button
                style="color: #2999ebff"
                @click="reset"
                icon="el-icon-refresh"
            >重置
            </el-button
            >
          </div>
          <div class="clearfloat"></div>
        </div>
        <div class="clearfloat"></div>
      </div>

      <el-button
          class="uas-container-buttonContent"
          @click="adduas"
          icon="el-icon-plus"
      >添加任务
      </el-button>

      <div class="uas-container-table">
        <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            max-height="1000"
            border
            :header-cell-style="{ background: '#f4f4f5', color: '#1F2E4DFF' }"
        >
          <el-table-column
              prop="yjylCommandMissionId"
              label="任务编号"
              min-width="100px"
          />
          <el-table-column
              prop="missionName"
              label="任务名称"
              min-width="100px"
          />
          <el-table-column prop="missionType" label="任务类型" min-width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.missionType == 0">演练任务</span>
              <span v-else>指挥任务</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="missionDescribe"
              label="任务描述"
              min-width="100px"
          />
          <el-table-column
              prop="missionDate"
              label="任务日期"
              min-width="100px"
          />
          <el-table-column label="操作" min-width="200px">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  style="color: #2999ebff"
                  icon="el-icon-view"
                  plain
                  @click="seecol(scope.row)"
              >进入场景
              </el-button
              >
              <el-button
                  size="mini"
                  type="text"
                  style="color: #2999ebff"
                  icon="el-icon-edit-outline"
                  plain
                  @click="editcol(scope.row)"
              >编辑
              </el-button>
              <el-button
                  size="mini"
                  type="text"
                  style="color: #e02020ff"
                  icon="el-icon-delete"
                  plain
                  @click="delcol(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="uas-container-table-pagination">
          <el-pagination
              background
              @size-change="sizechange"
              @current-change="changepage"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          />
        </div>
      </div>

      <!-- 添加无人机 -->
      <el-dialog
          :title="uastitle"
          :visible.sync="dialogVisible"
          width="40%"
          :close-on-click-modal="false"
          :show-close="false"
          :append-to-body="true"
      >
        <el-form
            :model="uasdata"
            :rules="rules"
            ref="Form"
            label-width="25%"
            class="fc-container"
        >
          <div style="width: 100%; height: 610px; overflow-y: auto">
            <el-form-item label="任务名称:" prop="missionName">
              <div class="fc-container-list-input" style="width: 85%">
                <el-input v-model="uasdata.missionName"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="任务类型:" prop="missionType">
              <div class="fc-container-list-input" style="width: 85%">
                <el-select
                    style="width: 100%"
                    v-model="uasdata.missionType"
                    placeholder="请选择"
                >
                  <el-option label="演练任务" :value="0"></el-option>
                  <el-option label="指挥任务" :value="1"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="任务日期:">
              <div class="fc-container-list-input" style="width: 85%">
                <el-date-picker
                    style="width: 100%"
                    v-model="uasdata.missionDate"
                    type="datetime"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="任务描述:">
              <div class="fc-container-list-input" style="width: 85%">
                <el-input
                    type="textarea"
                    v-model="uasdata.missionDescribe"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="指挥部:">
              <div
                  class="fc-container-list-input"
                  style="width: 100%; height: auto"
              >
                <el-button
                    icon="el-icon-plus"
                    @click="addzhb"
                    style="margin-bottom: 10px"
                >添加指挥部
                </el-button>
                <div class="zhb" v-for="(item, index) in uasdata.zhb">
                  <div
                      class="closeZhb el-icon-error"
                      @click="closeZhb(item.id)"
                  ></div>
                  <el-form-item label="指挥部名称:">
                    <div
                        class="fc-container-list-input"
                        style="margin-bottom: 20px"
                    >
                      <el-input v-model="item.headName"/>
                    </div>
                  </el-form-item>
                  <el-form-item label="指挥部地址:">
                    <div
                        class="fc-container-list-input"
                        style="margin-bottom: 20px"
                    >
                      <el-input v-model="item.place"/>
                    </div>
                  </el-form-item>
                  <el-form-item label="指挥长:">
                    <div
                        class="fc-container-list-input"
                        style="margin-bottom: 20px"
                    >
                      <el-input v-model="item.commander"/>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="任务文档:">
              <div class="fc-container-list-input" style="width: 85%">
                <!-- <el-input type="textarea"  v-model="uasdata.missionDescribe"></el-input> -->
                <el-upload
                    class="upload-demo"
                    drag
                    ref="uploadfile"
                    :http-request="upLoadOnSelf"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    multiple
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                  <div class="el-upload__tip" slot="tip">
                    只能上传EXCEL,WORD,PDF,JPG,PNG
                  </div>
                </el-upload>
                <div v-if="editOrAddNum==1&&filelist.length>0">
                  <div>已上传文件</div>
                  <div style="width: 100%;height: auto;position: relative;">
                    <div v-for='(item,index) in filelist' :key='index'
                         style="position: relative;width: 100%;height: auto;line-height: 30px;">
                      {{ item }}
                      <div @click="delfile(index)" style="position: absolute;color: red;bottom: 0px;right: -10px;">删除
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>

          <el-form-item>
            <div class="fc-container-bottom">
              <el-button
                  @click="
                dialogVisible = false;
                if (editOrAddNum == 1) {
                  uasdata = {};
                }
              "
              >取消
              </el-button
              >
              <el-button @click="query" type="primary">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  editRW,
  getMissionInfo,
  addRW,
  headPersonadd,
  headquartersadd,
  fileupload,
  personList,
} from "@/api/baseInfo";
import {addmissionDoc, exerciseList, exerciseAdd} from "@/api/exercise";
import {
  addcommand,
  commandlist,
  editcommand,
  delcommand,
} from "@/api/command";

export default {
  name: 'exercise',
  data() {
    return {
      filelist: [],
      loading: false,
      options: [
        {label: "yjylCommandMissionId", value: "commander"},
        {label: "任务名称", value: "missionName"},
      ],
      persondata: [],
      zhb: [],
      // 任务名称  任务类型 任务日期 任务地点 任务描述
      // missionName  missionType  missionDate  missionPlace missionDescribe
      rules: {
        missionCode: [
          {required: true, message: "请输入任务编号	", trigger: "blur"},
        ],
        headName: [{required: true, message: "指挥部名称	", trigger: "blur"}],
        commander: [
          {required: true, message: "请输入指挥长", trigger: "blur"},
        ],
        missionName: [
          {required: true, message: "请输入任务名称", trigger: "blur"},
        ],
        missionType: [
          {required: true, message: "请选择任务类型", trigger: "change"},
        ],
        missionDate: [
          {required: true, message: "请选择任务日期", trigger: "change"},
        ],
        missionPlace: [
          {required: true, message: "请输入任务地点", trigger: "blur"},
        ],
        missionDescribe: [
          {required: true, message: "请输入任务描述", trigger: "blur"},
        ],
      },
      uasdata: {
        zhb: [
          {
            headName: "",
            place: "",
            commander: "",
            id: 0,
          },
          {
            headName: "",
            place: "",
            commander: "",
            id: 1,
          },
        ],
        // gmtCreateUser:this.$Cookies.get('nickName'),
      },
      dialogVisible: false,
      uastitle: "添加任务",
      currentPage: 1,
      searchdata: {},
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      editOrAddNum: 0, //0添加 1编辑
    };
  },
  mounted() {
    let date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? "0" + second : second;
    this.uasdata.missionDate =
        y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    this.time = y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
  },

  created() {
    this.initpage(this.pageNum, this.pageSize, this.searchdata);
    personList(1, 10000, {}).then((res) => {
      if (res.code == 200) {
        for (let i = 0; i < res.data.rows.length; i++) {
          let json = {
            key: res.data.rows[i].jcsjPersonId,
            label: res.data.rows[i].userName,
          };
          this.persondata.push(json);
        }
      }
    });
  },
  methods: {
    delfile(index) {
      this.filelist.splice(index, 1)
      let filearr = ""
      for (let i = 0; i < this.filelist.length; i++) {
        if (i == 0) {
          filearr = this.filelist[i]
        } else {
          filearr = filearr + ',' + this.filelist[i]
        }
      }
      this.uasdata.missionFile = filearr
    },
    closeZhb(id) {
      if (this.uasdata.zhb.length > 0) {
        for (let i = 0; i < this.uasdata.zhb.length; i++) {
          if (id == this.uasdata.zhb[i].id) {
            this.uasdata.zhb.splice(i, 1);
          }
        }
      }
    },
    addzhb2(data) {
      let json = {
        headName: data.headName,
        place: data.place,
        commander: data.commander,
        id: data.id,
      };
      this.uasdata.zhb.push(json);
    },
    addzhb() {
      let json = {
        headName: "",
        place: "",
        commander: "",
        id: this.uasdata.zhb.length,
      };
      this.uasdata.zhb.push(json);
    },
    upLoadOnSelf(fileParam) {
      this.loading = true
      const fileObj = fileParam.file;
      const form = new FormData();
      // form.append("type", this.$props.typenum);
      form.append("file", fileObj);
      fileupload(form).then((res) => {
        this.loading = false
        if (res.code == 200) {
          this.$message.success("操作成功");
          if (this.uasdata.missionFile) {
            this.uasdata.missionFile =
                this.uasdata.missionFile + "," + res.data;
          } else {
            this.uasdata.missionFile = res.data;
          }
          // this.evenTaggingdata.eventPic =[]
          // this.evenTaggingdata.eventPic.push(res.data.thumbUrl)
        }
      });
    },
    query() {
      // this.$refs.uploadfile.$children[0].clearFiles()
      this.$refs.Form.validate((valid) => {
        if (valid) {
          if (this.editOrAddNum == 0) {
            let data = [];
            for (let i = 0; i < this.uasdata.zhb.length; i++) {
              let json = {
                place: this.uasdata.zhb[i].place,
                headName: this.uasdata.zhb[i].headName,
                commander: this.uasdata.zhb[i].commander,
              };
              data.push(json);
            }
            let params = {
              missionCode: this.uasdata.missionCode,
              missionType: this.uasdata.missionType,
              missionDate: this.uasdata.missionDate,
              missionDescribe: this.uasdata.missionDescribe,
              missionName: this.uasdata.missionName,
              missionFile: this.uasdata.missionFile,
              yjylMissionHeadquartersList: data,
            };
            addRW(params).then((res) => {
              if (res.code == 200) {
                this.$message.success("添加成功");
                this.initpage(this.pageNum, this.pageSize, this.searchdata);
              }
              this.dialogVisible = false;
            });
          } else {
            let data = [];
            for (let i = 0; i < this.uasdata.zhb.length; i++) {
              let json
              if (this.uasdata.zhb[i].id < 100) {
                json = {
                  place: this.uasdata.zhb[i].place,
                  headName: this.uasdata.zhb[i].headName,
                  commander: this.uasdata.zhb[i].commander,
                };
              } else {
                json = {
                  place: this.uasdata.zhb[i].place,
                  headName: this.uasdata.zhb[i].headName,
                  commander: this.uasdata.zhb[i].commander,
                  id: this.uasdata.zhb[i].id,
                };
              }

              data.push(json);
            }
            let params = {
              missionCode: this.uasdata.missionCode,
              missionType: this.uasdata.missionType,
              missionDate: this.uasdata.missionDate,
              missionDescribe: this.uasdata.missionDescribe,
              missionName: this.uasdata.missionName,
              missionFile: this.uasdata.missionFile,
              yjylMissionHeadquartersList: data,
            };

            params.id = this.uasdata.yjylCommandMissionId;
            editRW(params).then((res) => {
              if (res.code == 200) {
                this.$message.success("编辑成功");
                this.initpage(this.pageNum, this.pageSize, this.searchdata);
              } else {
                this.$message.error(res.message);
              }
              this.dialogVisible = false;
            });


          }
        } else {
          return false;
        }
      });
    },
    adduas() {
      this.dialogVisible = true;
      this.editOrAddNum = 0;
      this.uasdata = {
        missionDate: this.time,
        zhb: [],
      };
    },
    // 编辑
    editcol(row) {
      this.uasdata = {
        yjylCommandMissionId: row.yjylCommandMissionId,
        missionCode: row.missionCode,
        missionDate: row.missionDate,
        missionDescribe: row.missionDescribe,
        missionFile: row.missionFile,
        missionName: row.missionName,
        missionPlace: row.missionPlace,
        missionType: row.missionType,
        zhb: [],
      };
      if (this.uasdata.missionFile) {
        this.filelist = []
        this.filelist = this.uasdata.missionFile.split(',')
      }


      getMissionInfo(row.yjylCommandMissionId).then((res) => {
        if (res.code == 200) {
          let data = [];
          for (
              let i = 0;
              i < res.data.yjylMissionHeadquartersList.length;
              i++
          ) {
            let json = {
              headName: res.data.yjylMissionHeadquartersList[i].headName,
              place: res.data.yjylMissionHeadquartersList[i].place,
              commander: res.data.yjylMissionHeadquartersList[i].commander,
              id: res.data.yjylMissionHeadquartersList[i].id,
            };
            data.push(json);
            // this.addzhb2(json)
            // this.uasdata.zhb.push(json)
          }
          // this.$set(this.uasdata.zhb,data)
          this.uasdata.zhb = data;
        }
      });
      this.editOrAddNum = 1;
      this.uasdata.missionType = 1;
      this.dialogVisible = true;
      // {beginTime:"",endTime:"",},
    },
    // 删除
    delcol(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            delcommand(row.yjylCommandMissionId).then((res) => {
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
      this.$router.push({
        path: "/monitor/monitorExmap",
        query: {id: row.yjylCommandMissionId},
      });
    },
    // 选择时间
    changetime(e) {
      this.searchdata.beginTime = e[0];
      this.searchdata.endTime = e[1];
    },
    // 重置
    reset() {
      this.searchdata = {missionType: ''};
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    // 切换每页显示
    sizechange(e) {
      this.pageSize = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    // 换页
    changepage(e) {
      this.pageNum = e;
      this.initpage(this.pageNum, this.pageSize, this.searchdata);
    },
    // 初始化页面
    initpage(pageNum, pageSize, searchdata) {
      console.log('12312312',searchdata)
      commandlist(pageNum, pageSize, searchdata).then((res) => {
        if (res.code == 200) {
          this.list = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    goBack(){
      this.$router.push('/monitor/monitorList')
    }
  },
};
</script>
<style lang="less" scoped>
.exercise {
  padding: 90px 20px 0;
  height: 100vh;
  position: relative;
  z-index: 10;
  background: #F0F2F5;
}
.back{
  background: #FFFFFF;
  margin-bottom: 20px;
  padding: 10px 20px;
}

.closeZhb {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  z-index: 20;
}

.zhb {

  ::v-deep.el-input__inner {
    width: 200px;
  }

  ::v-deep.el-select {
    width: 200px;
  }

  width: 84%;
  height: auto;
  border: 1px solid #e3e3e3;
  padding: 10px;
  position: relative;
  margin-bottom: 20px;
}

.el-button--text {
  border: 0px;
  padding: 0px;
}

.fc-container {
  width: 100%;
  height: auto;

  &-bottom {
    width: 100%;
    height: 72px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    // background-color: #F5F5F5;
    padding-right: 20px;
    text-align: right;
    line-height: 72px;
  }

  &-list {
    width: 100%;
    padding: 0px 10px;
    margin-bottom: 10px;
    height: auto;

    &-title {
      width: 100px;
      text-align: right;
      float: left;
      line-height: 40px;
    }

    &-input {
      width: 250px;
      float: left;
    }
  }
}

.uas-container {
  padding: 20px;
  background: #fff;

  &-table {
    margin-top: 20px;
    padding: 5px;
    height: auto;
    &-pagination {
      text-align: right;
      margin-top: 20px;
    }
  }

  &-buttonContent {
    position: absolute;
    top: 175px;
    right: 40px;
    background: #09943bff;
    color: white;
  }
}

.header-search-list {
  display: inline-block;
  margin-right: 20px;
}
::v-deep .el-dialog{
  margin-top: 10vh !important;
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 250px;
}
</style>
