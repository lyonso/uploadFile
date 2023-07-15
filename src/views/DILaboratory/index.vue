<template>
  <transition name='fade-transform' mode='out-in'>
    <router-view />
  </transition>
</template>

<script>
import '@/client'

export default {
  name: 'DILaboratory',
  data() {
    return {}
  }
}
</script>


<style leng='less' scoped>
::v-deep .el-input .el-input__inner {
  color: #FFFFFF;
}

</style>
