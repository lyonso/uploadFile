<!--
 * 基础数据管理
 * 人员管理
-->
<template>
  <div class='uas-container'>
    <el-form :model='searchdata' ref='searchdata' :inline='true' size='small' class='searchParams__style'>
      <el-form-item class='appendSelect'>
        <el-input prefix-icon='el-icon-search' placeholder='请输入关键字' v-model='searchdata[searchItem]'>
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
        </el-button>
        <el-button
          @click='reset'
          style='background: transparent; color: white;border: 1px solid #007896;'
          icon='el-icon-refresh'
        >重置
        </el-button>
      </el-form-item>
      <el-form-item style='float: right;margin-right: 0px'>
        <el-button
          @click='adduas'
          style='background: transparent; color: white;border: 1px solid #007896;'
          icon='el-icon-plus'
        >新增人员
        </el-button>
      </el-form-item>
    </el-form>

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
        <el-table-column prop='jcsjPersonId' label='ID' min-width='120px' />
        <el-table-column prop='userName' label='人员姓名' min-width='80px' />
        <el-table-column prop='userSex' label='人员性别' min-width='60px'>
          <template slot-scope='scope'>
            <span v-if='scope.row.userSex == 1'>女</span>
            <span v-else>男</span>
          </template>
        </el-table-column>
        <el-table-column prop='userPhone' label='人员电话' min-width='80px' />
        <el-table-column prop='userDuty' label='人员职务' min-width='100px' />
        <el-table-column label='人员照片' min-width='100px'>
          <template slot-scope='scope'>
            <img v-if='scope.row.userPhoto' :src='scope.row.userPhoto' style='width: 40px; height: 40px' alt='' />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop='gmtCreate' label='创建时间' min-width='100px' />
        <el-table-column label='操作' min-width='120px'>
          <template slot-scope='scope'>
            <el-button
              size='mini'
              type='text'
              style='color: #2999ebff'
              icon='el-icon-edit-outline'
              plain
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
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style='text-align: right;margin-top: 20px'>
        <el-pagination
          background
          @size-change='sizechange'
          @current-change='changepage'
          :current-page='pageNum'
          :page-sizes='[10, 20, 30, 40]'
          :page-size='100'
          layout='total, sizes, prev, pager, next, jumper'
          :total='total' />
      </div>
    </div>

    <!-- 添加无人机 -->
    <el-dialog
      :title='uastitle'
      :visible.sync='dialogVisible'
      v-if='dialogVisible'
      width='600px'
      :modal='false'
      :close-on-click-modal='false'
      @close='closeWin'
      class='dialogReset__style'
    >
      <el-form :model='persondata' ref='persondata' label-width='100px' label-suffix=':'>
        <el-form-item prop='userDuty' label='人员职位' :rules='ruleArray.userDuty'>
          <el-select v-model='persondata.userDuty'>
            <el-option
              v-for='item in dictNameList.rows'
              :key='item.dictValue'
              :label='item.dictKey'
              :value='item.dictKey'
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop='userName' label='人员姓名' :rules='ruleArray.userName'>
          <el-input v-model='persondata.userName' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item prop='userPhone' label='人员电话' :rules='ruleArray.userPhone'>
          <el-input v-model='persondata.userPhone' placeholder='请输入'></el-input>
        </el-form-item>
        <el-form-item prop='userSex' label='性别' :rules='ruleArray.userSex'>
          <el-radio-group v-model='persondata.userSex'>
            <el-radio :label=0>男</el-radio>
            <el-radio :label=1>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='人员照片'>
          <UpLoadImg
            ref='uploadimg'
            @change-del='changedel'
            :isshowimgs='isshowimgs'
            @child-event='changeImg'
            :imgurl='propsImgUrl'
          />
        </el-form-item>
      </el-form>
      <div slot='footer'>
        <el-button class='cancelBtns' @click='cancel'>取消</el-button>
        <el-button class='sureBtns' @click='query' type='primary'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UpLoadImg from '@/components/imgLoader/index.vue'
import {
  addperson,
  personList,
  editperson,
  delperson
} from '@/api/baseInfo'
import { systemDict } from '@/api/bbaseInfo'

export default {
  components: {
    UpLoadImg
  },
  data() {
    return {
      //表单验证条件
      ruleArray: {
        userDuty: [
          {
            required: true,
            message: '人员职位不能为空',
            trigger: ['blur']
          }
        ],
        userName: [
          {
            required: true,
            message: '人员姓名不能为空',
            trigger: ['blur', 'change']
          }
        ],
        userPhone: [
          { required: true, validator: this.validatePhone, trigger: ['blur', 'change'] }
        ],
        userSex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      },
      value: 'userName',
      options: [
        {
          label: '按人员姓名查询',
          value: 'userName'
        },
        {
          label: '按人员电话查询',
          value: 'userPhoneLike'
        }
      ],
      value1: [],
      //组件传值图片url
      propsImgUrl: '',
      isshowimgs: '',
      //人员信息
      persondata: {
        status: 0
      },
      dialogVisible: false,
      uastitle: '添加人员',
      currentPage: 1,
      //人员信息查询条件
      searchdata: {
        beginTime: '',
        endTime: '',
        equipmentId: '',
        userDuty: '',
        userName: '',
        userPhoneLike: '',
        userSex: ''
      },
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      editOrAddNum: 0, //0添加 1编辑
      searchItem: 'userName',
      //职称表用来获取从数据字典取得的职位信息
      dictNameList: []
    }
  },
  created() {
    this.initpage(1, 10, this.searchdata)
  },
  methods: {
    /*
     *重置表单验证
     */
    resetRuleForm() {
      this.$nextTick(() => {
        this.$refs.persondata.clearValidate()
      })
    },
    /*
     *手机号验证规则
     */
    validatePhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    },
    /*
     *关闭弹窗后触发，清空人员信息，销毁弹窗dom
     */
    closeWin() {
      this.resetRuleForm()
      this.dialogVisible = false
      this.persondata = {}
    },
    selected(e) {
      this.searchdata = {
        beginTime: '',
        endTime: '',
        equipmentId: '',
        userDuty: '',
        userName: '',
        userPhoneLike: '',
        userSex: ''
      }
      this.searchItem = e
    },
    /*
     *子组件监听 更换图片
     */
    changeImg(data) {
      console.log(data)
      this.persondata.userPhoto = data
    },
    /*
     *取消保存触发，清空人员信息，删除图片组件预存照片，销毁弹窗dom节点
     */
    cancel() {
      this.dialogVisible = false
      this.persondata = {}
      this.$refs.uploadimg.$children[0].clearFiles()
    },
    changedel(data) {
      this.isshowimgs = false
      this.persondata.userPhoto = ''
    },

    /**
     * 添加以及编辑
     * */
    query() {
      this.$refs.persondata.validate((valid) => {
        if (valid) {
          if (this.editOrAddNum == 0) {
            addperson(this.persondata).then((res) => {
              if (res.code == 200) {
                this.$message.success('添加成功')
                this.dialogVisible = false
                this.reset()
                this.persondata = {}
                this.$refs.uploadimg.$children[0].clearFiles()
              } else {
                this.$message.error(res.message)
              }
              this.dialogVisible = false
              this.$refs.uploadimg.$children[0].clearFiles()
            })
          } else {
            editperson(this.persondata).then((res) => {
              if (res.code == 200) {
                this.$message.success('添加成功')
                this.dialogVisible = false
                this.persondata = {}
                this.$refs.uploadimg.$children[0] && this.$refs.uploadimg.$children[0].clearFiles()
                this.initpage(this.pageNum, this.pageSize)
              } else {
                this.$message.error(res.message)
              }
              this.$refs.uploadimg.$children[0].clearFiles()
              this.dialogVisible = false
            })
          }
        }
      })
    },
    /**
     * 添加人员按钮触发，将弹窗状态变为新增
     * */
    adduas() {
      this.isshowimgs = false
      this.uastitle = '添加人员'
      this.dialogVisible = true
      this.editOrAddNum = 0
    },
    /**
     * 点击编辑按钮触发,将弹窗状态修改为编辑
     * */
    editcol(row) {
      this.uastitle = '编辑人员'
      this.editOrAddNum = 1
      this.dialogVisible = true
      if (row.userPhoto) {
        this.isshowimgs = true
      } else {
        this.isshowimgs = false
      }
      this.persondata = {
        id: row.jcsjPersonId,
        equipmentId: row.equipmentId,
        userDuty: row.userDuty,
        userName: row.userName,
        userPhone: row.userPhone,
        userSex: row.userSex,
        userPhoto: row.userPhoto
      }
      this.propsImgUrl = row.userPhoto
    },
    /*删除*/
    delcol(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delperson(row.jcsjPersonId).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.message)
              this.initpage(this.pageNum, this.pageSize, this.searchdata)
            } else {
              this.$message.error(res.message)
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
    /*查看详情*/
    seecol(row) {
      console.log(row)
    },
    /*选择时间*/
    changetime(e) {
      this.searchdata.beginTime = e[0]
      this.searchdata.endTime = e[1]
    },
    /*重置*/
    reset() {
      this.searchdata = {
        beginTime: '',
        endTime: '',
        equipmentId: '',
        userDuty: '',
        userName: '',
        userPhoneLike: '',
        userSex: ''
      }
      this.pageNum = 1;
      (this.value1 = []),
        this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    /*切换每页显示*/
    sizechange(e) {
      console.log(e)
      this.pageSize = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    /*换页*/
    changepage(e) {
      console.log(e)
      this.pageNum = e
      this.initpage(this.pageNum, this.pageSize, this.searchdata)
    },
    /*初始化页面*/
    initpage(pageNum, pageSize, searchdata) {
      delete searchdata.value1
      console.log(pageNum, pageSize, searchdata)
      personList(pageNum, pageSize, searchdata).then((res) => {
        console.log(res)
        if (res.code == 200) {
          this.list = res.data.rows
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
      //数据字典 获取人员职位表
      systemDict({ pageNum: 1, limit: 20, dictName: 'person_duty' }).then(
        (res) => {
          if (res.code == 200) {
            this.dictNameList = res.data
            console.log(this.dictNameList)
          }
        }
      )
    }
  }
}
</script>
<style scoped lang='less'>
.uas-container {
  background-color: transparent;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
