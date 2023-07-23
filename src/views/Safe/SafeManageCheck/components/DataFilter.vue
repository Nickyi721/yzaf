<template lang="html">
    <div class="common-filter">
        <div class="filter-items">
            <el-input v-model="bindData['tcJhmc']" size="mini" placeholder="计划名称"></el-input>
            <el-date-picker v-model="bindData['tcJhsj']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
        </div>
    </div>
</template>

<script>
import Mixin from '@mixins'

export default {
    mixins:[Mixin.Filter],
    data (){
        return{
            bindData:{

            }
        }
    },
    methods: {

    }
}
</script>

