<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcRwmc']" size="mini" placeholder="请输入任务名称"></el-input>
      <el-input clearable v-model="bindData['tcMbmc']" size="mini" placeholder="请输入报表名称"></el-input>
      <el-select v-model="bindData['tnRwzt']" size="mini" placeholder="请选择任务状态">
        <el-option v-for="option in options['tnRwzt']" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
      <el-date-picker v-model="bindData['tcAfsj']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from "@mixins";

export default {
  mixins: [Mixin.Filter],
  data() {
    return {
      bindData: {
        tcRwmc: "",
        tcMbmc: "",
        tcAfsj: "",
        startTime: "",
        endTime: ""
      }
    };
  },
  created() {
    this.options["tnRwzt"] = [
      {
        value: "0",
        label: "进行中"
      },
      {
        value: "1",
        label: "完结"
      },
      {
        value: "2",
        label: "无效"
      }
    ];
  },
  methods: {
    _ButtonClick() {
      if (this.bindData.tcAfsj === null) {
        this.bindData.tcAfsj = ["", ""];
      }
      console.log(this.bindData.tcAfsj);
      this.bindData.startTime = this.bindData.tcAfsj[0];
      this.bindData.endTime = this.bindData.tcAfsj[1];
      this.$emit("query", this.bindData);
    }
  }
};
</script>

<style scoped>
.demonstration {
  font-size: 14px;
  color: #666;
}
</style>
