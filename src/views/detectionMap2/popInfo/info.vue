<template>
    <div class="layers-tree-panel">
        <div class="panel-close" @click.stop="removed"></div>
        <div class="panel-li" v-for="(ele,i) in list" :key="i">
            <span>{{ele['分析项']}}：</span>
            <span class="panel-value">{{ele['分析结果']}} {{ele['单位']}}</span>
        </div>
    </div> 
</template>

<script>
export default {
    props: {
        data: {
            typeof: Object,
            default(){ return{} }
        }
    },
    computed: {
        list() {
            // 第一次创建default值（注意不是函数），第二次会更新数据
            let { list } = this.data;
            // debugger
            return list;
        }
    }
}
</script>

<style lang="less">
.layers-tree-panel {
    padding: 4px 18px 4px 8px;
    background-color: rgba(8, 59, 121, .75);
    position: absolute;
    font-size: 13px;
    display: none;
    color: #fff;
    .panel-close {
        width: 10px;
        height: 10px;
        position: absolute;
        right: 5px;
        top: 5px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        background-image: url('~@/assets/inspect/close.png');
        cursor: pointer;
    }
    .panel-li {
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .panel-value {
        margin-left: 6px;
    }
}
</style>