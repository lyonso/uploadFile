<template>
  <div class="monitor" >
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  name:'monitor',
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  },
};
</script>
