<template>
  <Draw :is-open='isOpen' @changOpen='changOpen'>
    <slot>
      <DialogTitle dialogTitle='任务列表'>
        <slot>
          <el-date-picker
            v-model='value'
            type='year'
            size='mini'
            value-format='yyyy'
            placeholder='选择年'>
          </el-date-picker>
        </slot>
      </DialogTitle>
      <div class='body'>
        <el-scrollbar style='height:100%'>
          <div v-for='(item , index) in list'
               :class='chose===index? "item chose":"item"'
               @click='chose = index'
               :key='index'>
            <span>{{ index + 1 }}</span>
            <span>{{ item['合同名称'] }}</span>
          </div>
        </el-scrollbar>
      </div>
      <DialogTitle dialogTitle='任务详情' />
      <div class='body bottom'>
        <el-scrollbar style='height:100%'>
          <div class='item'>
            <span>任务名称</span>
            <span>{{ TaskCommitmentDetails['合同名称'] || '-' }}</span>
          </div>
          <div class='item'>
            <span>客户单位名称</span>
            <span>{{ TaskCommitmentDetails['客户名称'] || '-' }}</span>
          </div>
          <div class='item'>
            <span>任务内容</span>
            <span>{{ TaskCommitmentDetails['检测内容'] || '-' }}</span>
          </div>
          <div class='item'>
            <span>技术要求</span>
            <span>{{ TaskCommitmentDetails['技术要求'] || '-' }}</span>
          </div>
          <div class='item'>
            <span>时限要求</span>
            <span>{{ TaskCommitmentDetails['时限要求'] || '-' }}</span>
          </div>
          <div class='item'>
            <span>合同编号</span>
            <span>{{ TaskCommitmentDetails['合同编号'] || '-' }}</span>
          </div>
          <div class='item'>
            <span>客户联系人</span>
            <span>{{ TaskCommitmentDetails['客户联系人'] || '-' }}</span>
          </div>
          <div class='item'>
            <span>联系方式</span>
            <span>{{ TaskCommitmentDetails['客户联系方式'] || '-' }}</span>
          </div>
        </el-scrollbar>
      </div>
    </slot>
  </Draw>
</template>
<script>
import DialogTitle from '@/components/DialogTitle'
import Draw from '@/components/Draw'
import { linuxApi } from '@/api'
import { mapState } from 'vuex'

export default {
  name: 'TaskCommitment',
  components: {
    DialogTitle,
    Draw
  },
  watch: {
    value(val) {
      this.getContractReview()
    },
    chose(val) {
      this.$store.commit('inspect/SET_TASK_COMMITMENT_DETAILS', this.list[val])
    }
  },
  computed: {
    ...mapState({
      TaskCommitmentDetails: state => state.inspect.TaskCommitmentDetails
    })
  },
  data() {
    return {
      isOpen: true,
      value: '',
      chose: 0,
      list: [],
    }
  },
  mounted() {
    const data = new Date()
    this.value = data.getFullYear().toString()
  },
  methods: {
    changOpen(type) {
      this.isOpen = type
    },
    getContractReview() {
      linuxApi.getContractReview({ YEAR: this.value }).then(res => {
        this.list = res.data
        if (res.data.length > 0) {
          this.chose = 0
          this.$store.commit('inspect/SET_TASK_COMMITMENT_DETAILS', this.list[0])
        } else {
          this.$store.commit('inspect/SET_TASK_COMMITMENT_DETAILS', {})
        }
      })
    }
  }
}
</script>


<style lang='less' scoped>
.body {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 500;
  height: 400px;
  color: #FFFFFF;

  .item {
    :first-child {
      color: rgba(156, 205, 251, 1);
      margin-right: 20px;
      line-height: 40px;
    }

    :nth-child(2) {
      cursor: pointer;
    }
  }

  .chose {
    color: rgba(255, 240, 0, 1);
  }
}

.bottom {
  .item {
    :first-child {
      display: inline-block;
      width: 110px;
    }

    :nth-child(2) {
      cursor: auto;
    }
  }
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

::v-deep .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100px;
  vertical-align: top;
  position: relative;
  left: 215px;
}
</style>
