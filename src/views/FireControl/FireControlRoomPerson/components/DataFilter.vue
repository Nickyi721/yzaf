<template>
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcXm']" size="mini" placeholder="请输入人员姓名"></el-input>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "../model.js";

export default {
  mixins: [Mixin.init],
  data() {
    return {
      list: [],
      bindData: {}
    };
  },
  methods: {
    // 点击查询按钮
    _ButtonClick() {
        this.$emit('query', this.bindData)
    },
  }
};
</script>

