<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-select v-model="bindData['cxlx']" size="mini" placeholder="请选择查询类型">
        <el-option v-for="option in options['cxlx']" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
      <el-input v-model="bindData['tcSjubm']" size="mini" placeholder="请输入数据编码"></el-input>
      <el-input v-model="bindData['tcSjnr']" size="mini" placeholder="请输入数据内容"></el-input>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  data () {
    return {
      options: {
        cxlx: [
          { label: '本级', value: 0 },
          { label: '全部', value: 1 },
        ]
      },
      bindData: {
        cxlx: 0
      }
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  }
}
</script>

<style lang="scss">
</style>
