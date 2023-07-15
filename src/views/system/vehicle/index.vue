<!--
 * 基础数据管理
 * 车辆管理
-->
<template>
  <div class='vp-content'>
    <!-- 查询表单 -->
    <el-form :model='searchdata' ref='searchdata' :inline='true' class='searchParams__style' size='small'>
      <el-form-item class='appendSelect'>
        <el-input prefix-icon='el-icon-search' placeholder='请输入关键字' v-model='searchdata[selectedItem]'>
          <el-select
            style='width: 188px; color: #1f2e4d'
            v-model='value'
            slot='append'
            @change='selected'
          >
            <el-option
              v-for='item in options'
              :key='item.value'
              :label='item.label'
              :value='item.value'
            />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          @click='initpage(pageNum, pageSize, searchdata)'
          icon='el-icon-search'
          style='background: transparent; color: white;border: 1px solid #007896;'
        >搜索
        </el-button
        >
        <el-button
          @click='reset()'
          icon='el-icon-refresh'
          style='background: transparent; color: white;border: 1px solid #007896;'
        >重置
        </el-button
        >
      </el-form-item>
      <el-form-item style='float: right;margin-right: 0px'>
        <el-button
          @click='adduas'
          icon='el-icon-plus'
          style='background: transparent; color: white;border: 1px solid #007896;'
        >新增车辆
        </el-button
        >
      </el-form-item>
    </el-form>
    <!-- 新增按钮 -->

    <!-- 表格 -->
    <div class='tableReset__style'>
      <el-table
        ref='multipleTable'
        :data='list'
        tooltip-effect='dark'
        style='width: 100%'
        max-height='670'
        :cell-style="{background: 'transparent',color:'#fff'}"
        :header-cell-style="{background: 'linear-gradient(0deg, rgba(0, 48, 83, 0.14), rgba(0, 143, 255, 0.14))'}"
      >
        <el-table-column prop='jcsjCarId' label='ID' min-width='120px' />
        <el-table-column prop='carName' label='车辆名称' min-width='100px' />
        <el-table-column prop='carNo' label='车牌号码' min-width='100px' />
        <el-table-column prop='cameraCode' label='视频ID' min-width='100px' />
        <el-table-column label='车辆图片' min-width='100px'>
          <template slot-scope='scope'>
            <img
              v-if='scope.row.carPhoto'
              :src='scope.row.carPhoto'
              style='width: 40px; height: 40px'
              alt=''
            />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop='gmtCreate' label='创建时间' min-width='100px' />
        <el-table-column label='操作' min-width='140px'>
          <template slot-scope='scope'>
            <el-button
              size='mini'
              type='text'
              plain
              style='color: #2999ebff'
              icon='el-icon-edit-outline'
              @click='editcol(scope.row)'
            >编辑
            </el-button>
            <el-button
              size='mini'
              type='text'
              style='color: #e02020ff'
              icon='el-icon-delete'
              plain
              @click='delcol(scope.row)'
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style='text-align: right;margin-top: 20px'>
        <el-pagination
          background
          @size-change='sizechange'
          @current-change='changepage'
          :current-page='pageNum'
          :page-sizes='[10, 20, 30, 40]'
          :page-size='100'
          layout='total, sizes, prev, pager, next, jumper'
          :total='total'
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :title='uastitle'
      :visible.sync='dialogVisible'
      width='600px'
      :modal='false'
      :close-on-click-modal='false'
      class='dialogReset__style'
      @closed='closedWin'
    >
      <el-form label-width='100px' ref='cardata' :model='cardata' label-suffix=':'>
        <el-form-item prop='carName' label='车辆名称' :rules='ruleArray.carName'>
          <el-input v-model='cardata.carName' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item prop='carNo' label='车牌号码' :rules='ruleArray.carNo'>
          <el-input v-model='cardata.carNo' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item prop='cameraCode' label='视频ID' :rules='ruleArray.cameraCode'>
          <el-input type='textarea' autosize v-model='cardata.cameraCode' placeholder="请输入视频码流地址，多个请用','隔开"></el-input>
        </el-form-item>
        <el-form-item label='车辆图片'>
          <UpLoadImg
            ref='uploadimg'
            @change-del='changedel'
            :isshowimgs='isshowimgs'
            @child-event='changeImg'
            :imgurl='propsImgUrl'
          ></UpLoadImg>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button class='cancelBtns' @click='cancel'>取消</el-button>
        <el-button class='sureBtns' type='primary' @click='addvehicle'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  vehicleList,
  addVehicle,
  editVehicle,
  delVehicle
} from '@/api/bbaseInfo'
import UpLoadImg from '@/components/imgLoader/index.vue'

export default {
  components: {
    UpLoadImg
  },
  data() {
    return {
      //表单验证
      ruleArray: {
        carName: [
          {
            required: true,
            message: '车辆名称不能为空',
            trigger: 'blur'
          }
        ],
        carNo: [
          {
            required: true,
            message: '车牌号码不能为空',
            trigger: 'blur'
          }
        ]
      },
      options: [
        {
          label: '按车辆名称查询',
          value: 'carName'
        },
        {
          label: '按车牌号码查询',
          value: 'carNoLike'
        }
      ],
      value1: '',
      value: 'carName',
      propsImgUrl: '',
      isshowimgs: false,
      //车辆信息
      cardata: {},
      dialogVisible: false,
      uastitle: '添加车辆信息',
      //查询条件参数
      searchdata: {
        beginTime: '',
        endTime: '',
        equimentId: '',
        beginTime: '',
        carName: '',
        carNoLike: ''
      },
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      addOrEditNum: 0,
      selectedItem: 'carName'
    }
  },
  created() {
    this.initpage(1, 10, this.searchdata)
  },
  methods: {
    /**
     * 重置表单验证
     */
    resetRuleForm() {
      this.$nextTick(() => {
        this.$refs.cardata.clearValidate()
      })
    },
    /**
     * 验证输入内容格式
     */
    checkData(rule, value, callback) {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('视频ID只可由英文或数字组成'))
        } else {
          callback()
        }
      }
      callback()
    },
    /**
     * 关闭弹窗触发
     */
    closedWin() {
      this.resetRuleForm()
      this.dialogVisible = false
      this.cardata = {}
      this.$refs.uploadimg.$children[0].clearFiles()
    },
    selected(e) {
      this.searchdata = {
        carType: '',
        carName: '',
        carNoLike: '',
        latitude: '',
        longitude: ''
      }
      this.selectedItem = e
    },
    /**
     * 取消保存触发方法
     */
    cancel() {
      this.dialogVisible = false
      this.cardata = {}
      this.$refs.uploadimg.$children[0].clearFiles()
    },
    /**
     * 组件监听 变更照片
     */
    changeImg(data) {
      console.log(data)
      this.cardata.carPhoto = data
    },
    /**
     * 组件监听 删除照片
     */
    changedel(data) {
      this.isshowimgs = false
      this.cardata.carPhoto = ''
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.$refs.requestData.resetFields()
    },
    /**
     * 新增按钮触发
     */
    adduas() {
      this.isshowimgs = false
      this.uastitle = '添加车辆信息'
      this.dialogVisible = true
      this.editOrAddNum = 0
    },
    /*
     *添加车辆*/
    addvehicle() {
      this.$refs.cardata.validate((valid) => {
        if (valid) {
          let data = this.cardata
          console.log(data)
          if (this.addOrEditNum == 0) {
            addVehicle(data).then((res) => {
              console.log(res)
              if (res.code == 200) {
                this.$message.success('新增成功')
                this.reset()
                this.dialogVisible = false
              } else {
                this.$message.error(res.message)
              }
              this.$refs.uploadimg.$children[0].clearFiles()
            })
          } else {
            editVehicle(data).then((res) => {
              console.log(res)
              if (res.code == 200) {
                this.$message.success('修改成功')
                this.initpage(this.pageNum, this.pageSize)
                this.dialogVisible = false
              } else {
                this.$message.error(res.message)
              }
              this.$refs.uploadimg.$children[0].clearFiles()
            })
          }
        }
      })
    },
    // 编辑
    editcol(row) {
      this.addOrEditNum = 1
      this.uastitle = '编辑车辆信息'
      this.dialogVisible = true
      this.cardata = {
        equimentId: row.equimentId,
        carName: row.carName,
        carType: row.carType,
        carNo: row.carNo,
        id: row.jcsjCarId,
        cameraCode: row.cameraCode
      }
      this.propsImgUrl = row.carPhoto
      if (this.propsImgUrl) {
        this.isshowimgs = true
      } else {
        this.isshowimgs = false
      }
      console.log(this.propsImgUrl)
      console.log(this.isshowimgs)
    },
    // 删除
    delcol(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delVehicle(row.jcsjCarId).then((res) => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.initpage(this.pageNum, this.pageSize, this.searchdata)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 查看详情
    seecol(row) {
      console.log(row)
    },
    // 选择时间
    changetime(e) {
      this.searchdata.beginTime = e[0]
      this.searchdata.endTime = e[1]
    },
    // 重置
    reset() {
      this.searchdata = {
        carType: '',
        carName: '',
        carNoLike: '',
        latitude: '',
        longitude: ''
      }
      this.pageNum = 1
      this.value1 = []
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 切换每页显示
    sizechange(e) {
      console.log(e)
      this.pageSize = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 换页
    changepage(e) {
      console.log(e)
      this.pageNum = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    // 初始化页面
    initpage(pageNum, pageSize, searchdata) {
      console.log(pageNum, pageSize, searchdata)

      vehicleList(pageNum, pageSize, searchdata).then((res) => {
        console.log(res)
        if (res.code == 200) {
          this.list = res.data.rows
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style scoped lang='less'>
.vp-content {
  background-color: transparent;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

</style>
