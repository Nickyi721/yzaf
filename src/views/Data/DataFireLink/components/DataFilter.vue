<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcAbjgmc']" size="mini" placeholder="请输入安保机构名称"></el-input>
      <el-select v-model="bindData['tcAbjgxz']" size="mini" placeholder="请选择安保机构性质">
         <el-option
          v-for="afjgxzType in afjgxzTypes"
          :key="afjgxzType.tcSjubm"
          :label="afjgxzType.tcSjnr"
          :value="afjgxzType.tcSjubm">
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  props:['afjgxzTypes','tcDwbm'],
  data() {
    return {
      bindData: {
        tcDwbm: '',
        tcAbjgmc: '',
        // tcAbjgxz: ''
      }
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  },
  watch:{
    tcDwbm:{
      immediate: true,
      handler(val){
        this.bindData.tcDwbm = val
      }
    }
  }
}
</script>