<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcPxnr']" size="mini" placeholder="请输入培训内容"></el-input>
      <span class="demonstration">培训时间：</span>
      <el-date-picker v-model="bindData['tdPxsj']" 
        type="date"
        placeholder="选择培训时间"
        size="mini" 
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  data() {
    return {
      bindData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  },
}
</script>