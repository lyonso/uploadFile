<template>
  <div class="searchInput">
    <el-select
        v-model="value"
        filterable
        remote
        reserve-keyword
        placeholder="输入查询内容"
        :remote-method="remoteMethod"
        :loading="loading">
      <el-option
          v-for="(item,index) in options"
          :key="index"
          :label="item.pointName"
          :value="index">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { map }from '@/api'
import {EventBus} from '@/mapJs/EventBus';

export default {
  name:'searchInput',
  data() {
    return {
      options: [],
      value: '',
      loading: false,
    }
  },
  watch:{
    bluePanel(val){
      this.options = []
      this.value = ''
    },
    value(val){
      if (val!==''){
        const obj = JSON.stringify(this.options[val])
        this.$store.dispatch('map/setBlueDialogDetails',obj)
        const locationobj = {
          jw:this.options[val].longitude,
          wd:this.options[val].latitude
        }
        EventBus.$emit('location',locationobj)
      }
    }
  },
  computed: {
    ...mapGetters([
      'bluePanel'
    ]),
  },
  mounted() {

  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        const  obj = {
          keyword:query,
          type:Number(this.bluePanel)-1
        }
        map.selectPoint(obj).then(res=>{
          this.loading = false;
          this.options = res.data;
        })
      } else {
        this.options = [];
      }
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .el-input__inner{
  background:#0B2C2C ;
  border-color:#0086C7 ;
  color: #FFFFFF;
}
</style>