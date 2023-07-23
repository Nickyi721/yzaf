<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="query['tcEwmmc']" size="mini" placeholder="请输入二维码名称"></el-input>
       <el-select v-model="query['tcEwmxl']" size="mini" placeholder="请选择二维码小类">
         <el-option
          v-for="el in xl"
          :key="el.tcSjubm"
          :label="el.tcSjnr"
          :value="el.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcQyzt']" size="mini" placeholder="请选择状态">
         <el-option
          v-for="el in qyzt"
          :key="el.tcSjubm"
          :label="el.tcSjnr"
          :value="el.tcSjubm">
        </el-option>
      </el-select>
      <el-select v-model="query['tcSczt']" size="mini" placeholder="请选择状态">
         <el-option
          v-for="el in sczt"
          :key="el.tcSjubm"
          :label="el.tcSjnr"
          :value="el.tcSjubm">
        </el-option>
      </el-select>
      <el-date-picker v-model="query['tcEwmscsj']" type="date" size="mini" placeholder="请选择二维码录入时间"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
 mixins: [Mixin.Filter],
 props: ['xl', 'qyzt', 'sczt'],
  data () {
    return {
      query: {
        tcEwmmc: '',
        tcEwmscsj: ''
      }
    }
  },
  methods: {
    _buttonClick() {
      this.$emit('query', this.query)
    }
  }
}
</script>

