<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>

<script>
  export default{
    data(){
      return{
        loading:true
      }
    },
    created() {
      let id = this.$route.meta.query.id
      // this.$router.push({path: "/mapindex/mapindex", query: {id}})
    }
  }
</script>

<style>
</style>
