<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-date-picker clearable v-model="bindData['tcNd']" type="year" size="mini" placeholder="请选择年度"></el-date-picker>
      <el-select clearable v-model="bindData['tnZt']" size="mini" placeholder="请选择进展状态">
        <el-option v-for="option in optionsStatus" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <el-input clearable v-model="bindData['tcDwmc']" type="text" size="mini" placeholder="请输入单位名称"></el-input>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import CommonModel from '@commons/model.js'

export default {
  mixins: [Mixin.Filter],
  data() {
    return {
      optionsStatus: [
        {
          tcSjubm: 0,
          tcSjnr: '进行中'
        },
        {
          tcSjubm: 1,
          tcSjnr: '已完结'
        }
      ],
      optionsSeason: [
        {
          tcSjubm: '第一季度',
          tcSjnr: '第一季度'
        },
        {
          tcSjubm: '第二季度',
          tcSjnr: '第二季度'
        },
        {
          tcSjubm: '第三季度',
          tcSjnr: '第三季度'
        },
        {
          tcSjubm: '第四季度',
          tcSjnr: '第四季度'
        },
      ],
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  },
}
</script>

<style scoped>
  .demonstration {
    font-size: 14px;
    color: #666;
  }
</style>

