<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="query['tcEwmmc']" size="mini" placeholder="请输入二维码名称"></el-input>
      <el-select v-model="query['tcSfgzbj']" size="mini" placeholder="请选择是否故障报警">
        <el-option
          v-for="el in [{tcSjubm: '', tcSjnr: '请选择是否故障报警' }, ...options['0001']]"
          :key="el && el.tcSjubm"
          :label="el && el.tcSjnr"
          :value="el && el.tcSjubm">
        </el-option>
      </el-select>
      <el-select v-model="query['tcSfdcjj']" size="mini" placeholder="请选择是否当场解决">
        <el-option
          v-for="el in [{tcSjubm: '', tcSjnr: '请选择是否当场解决' }, ...options['0001']]"
          :key="el && el.tcSjubm"
          :label="el && el.tcSjnr"
          :value="el && el.tcSjubm">
        </el-option>
      </el-select>
      <el-select v-model="query['tnWxzt']" size="mini" placeholder="请选择维修状态">
        <el-option
          v-for="el in wxzt"
          :key="el.tcSjubm"
          :label="el.tcSjnr"
          :value="el.tcSjubm">
        </el-option>
      </el-select>
      <el-date-picker v-model="query['tcJcsj']" placeholder="请选择时间" width='200px' :unlink-panels="true" size="mini" type="date" format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import CommonModel from '@commons/model.js'

export default {
 mixins: [Mixin.Filter, Mixin.init],
  data () {
    return {
      query: {
        tcEwmmc: '',
        tcSfgzbj: '',
        tcSfdcjj: '',
        tnWxzt: '',
        tcJcsj: ''
      },
      dict: ['0001'],
      wxzt: [
        { tcSjubm: '', tcSjnr: '请选择维修状态' },
        { tcSjubm: '0', tcSjnr: '未提交' },
        { tcSjubm: '1', tcSjnr: '已提交' },
        { tcSjubm: '2', tcSjnr: '正常' }
      ],
      options: {
        
      }
    }
  },
  methods: {
    $init(options){
      if (options && options['0001']) {
        this.options = options
      }
    },
    _ButtonClick() {
      this.$emit('query', this.query)
    },
  }
}
</script>

