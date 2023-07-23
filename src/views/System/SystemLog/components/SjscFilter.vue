<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
        <el-input v-model="bindData['tcYwgnbm']" size="mini" placeholder="请输入业务功能编码" maxlength="20"></el-input>
        <el-input v-model="bindData['tcYcyybm']" size="mini" placeholder="请输入异常原因编码" maxlength="20"></el-input>
        <el-select v-model="bindData['tnSfjj']" size="mini" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>      
        <el-date-picker v-model="bindData['range']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Moment from 'moment'

export default {
  mixins: [Mixin.Filter],
  data () {
    return {
        options: [
            {value:0,label:'未解决'},
            {value:1,label:'已解决'}
        ],
        bindData: {
            range: [Moment().subtract(1, 'days').format('YYYY-MM-DD'), Moment().format('YYYY-MM-DD')]
        }
    }
  }
}
</script>