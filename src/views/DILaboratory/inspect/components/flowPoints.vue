<template>
  <div class='flow-points'>
    <div v-if='currentFlow>0' class='back' @click='changeFlow(0)' />
    <div class='title'>业务流程</div>
    <ul class='flow-list'>
      <li v-for='(item, index) in flows' :key='`flow-${index + 1}`' :class='currentFlow === item.index ? "active" : ""'
          @click='changeFlow(item.index)'>
        <div class='name'>{{ item.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FlowPoints',
  computed: {
    ...mapState({
      currentFlow: state => state.inspect.currentFlow,
      flows: state => state.inspect.flows
    })
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions('inspect', ['changeFlow'])
  }
}
</script>

<style lang='less' scoped>
.title {
  font-size: 22px;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 20px;
  text-align: center;
}

.back {
  width: 102px;
  height: 36px;
  background-image: url("../../../../assets/go_Back.png");
  background-size: 100% 100%;
  cursor: pointer;
  margin-bottom: 15px;
}

.flow-points {
  position: absolute;
  right: 465px;
  top: 110px;
  z-index: 10;
}

.flow-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    width: 96px;
    height: 96px;
    list-style: none;
    margin: 0;
    margin-bottom: 20px;
    padding: 0;
    cursor: pointer;
    position: relative;

    &.active {
      &:nth-child(1) {
        background: url("~@/assets/inspect/flow_active_1.png") no-repeat;
        background-size: cover;
      }

      &:nth-child(2) {
        background: url("~@/assets/inspect/flow_active_2.png") no-repeat;
        background-size: cover;
      }

      &:nth-child(3) {
        background: url("~@/assets/inspect/flow_active_3.png") no-repeat;
        background-size: cover;
      }

      &:nth-child(4) {
        background: url("~@/assets/inspect/flow_active_4.png") no-repeat;
        background-size: cover;
      }

      .name {
        color: #FFFFFF;
      }
    }

    &:nth-child(1) {
      background: url("~@/assets/inspect/flow_1.png") no-repeat;
      background-size: cover;
    }

    &:nth-child(2) {
      background: url("~@/assets/inspect/flow_2.png") no-repeat;
      background-size: cover;
    }

    &:nth-child(3) {
      background: url("~@/assets/inspect/flow_3.png") no-repeat;
      background-size: cover;
    }

    &:nth-child(4) {
      background: url("~@/assets/inspect/flow_4.png") no-repeat;
      background-size: cover;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, .5);
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
