<template>
  <div id='app' onselectstart='return false;' style='-moz-user-select:none;'>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang='less'>
.fc-container {
  margin-top: 20px;
}

.clearfloat {
  clear: both;
}

</style>
