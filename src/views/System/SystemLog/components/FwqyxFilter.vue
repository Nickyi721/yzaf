<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
        <el-input v-model="bindData['tcIp']" size="mini" placeholder="请输入IP" maxlength="50"></el-input>
        <el-input v-model="bindData['tcPort']" size="mini" placeholder="请输入端口" maxlength="50"></el-input>
        <el-select v-model="bindData['tnSflt']" size="mini" placeholder="是否联通">
            <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select> 
        <el-select v-model="bindData['tnLx']" size="mini" placeholder="请选择类型">
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
        option: [
            {value:1,label:'是'},
            {value:2,label:'否'}
        ],
        options: [
            {value:1,label:'SLB'},
            {value:2,label:'PC后台服务'},
            {value:3,label:'PC后台nginx'},
            {value:4,label:'APP后台服务'},
            {value:5,label:'APP后台服务nginx'},
            {value:6,label:'APP-PC后台服务'}
        ],
        bindData: {
            range: [Moment().subtract(1, 'days').format('YYYY-MM-DD'), Moment().format('YYYY-MM-DD')]
        }
    }
  }
}
</script>