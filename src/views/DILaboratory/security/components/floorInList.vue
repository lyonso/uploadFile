<template>
  <div class='table'>
    <div class='table_top'>
      <span>姓名</span>
      <span>时间</span>
      <span>进入场所</span>
    </div>
    <div class='table_body'>
      <div v-for='(item,index) in list' class='item'>
        <span>{{ item.personName }}</span>
        <span>{{ item.time }}</span>
        <span>{{ item.doorName }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { DILaboratory } from '@/api'

export default {
  name: '',
  computed: {
    ...mapState({
      floorChose: state => state.security.floorChose
    })
  },
  watch: {
    floorChose() {
      this.experAreaIntoRecord()
    },

  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.experAreaIntoRecord()
  },
  methods: {
    experAreaIntoRecord() {
      const obj = {
        floor: this.floorChose,
        pageNo: 1,
        pageSize: 6
      }
      DILaboratory.experAreaIntoRecord(obj).then(res => {
        console.log(res)
        this.list = res.data
      })
    },
  }
}

</script>

<style lang='less' scoped>
.table {
  height: 234px
}

.table_top {
  font-size: 18px;
  font-weight: bold;
  color: #09ECF0;
  text-align: center;
  margin-top: 5px;
}


.table_top,
.item {
  span {
    display: inline-block;
  }

  :first-child {
    width: 20%;
  }

  :nth-child(2) {
    width: 40%;
  }

  :nth-child(3) {
    width: 40%;
  }
}

.item {
  font-size: 16px;
  font-weight: bold;
  color: #E0E7E7;
  line-height: 35px;
  text-align: center;
}
</style>
