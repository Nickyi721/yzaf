<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="query['tcXm']" size="mini" placeholder="请输入姓名"></el-input>
      <el-select v-model="query['tcXb']" size="mini" placeholder="请选择性别">
         <el-option
          v-for="item in xb"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcZw']" size="mini" placeholder="请选择职务">
         <el-option
          v-for="item in zw"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcZzmm']" size="mini" placeholder="请选择政治面貌">
         <el-option
          v-for="item in zzmm"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcWhcd']" size="mini" placeholder="请选择文化程度">
         <el-option
          v-for="item in whcd"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcZjz']" size="mini" placeholder="请选择专兼职">
         <el-option
          v-for="item in zjz"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcZt']" size="mini" placeholder="请选择状态">
         <el-option
          v-for="item in status"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
<!-- 
    </div>
    <div class="filter-btn"> -->
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>
<style scoped>
h4 {
  color: #03c552;
  margin-bottom: 5px;
  text-align: center;
}
</style>
<script>
import Mixin from "@mixins";

export default {
  mixins: [Mixin.Filter],
  props: ["xb", "zw", "zzmm", "whcd", "zjz", "status"],
  data() {
    return {
      query: {
        tcXm: ""
        // xb:'',
        // zw:'',
        // zzmm:'',
        // whcd:'',
        // zjz:'',
        // zt:'',
        // tnAbjgid:''
      }
    };
  },
  methods: {
    _ButtonClick() {
      this.$emit("query", this.query);
      console.log(this.tcXm);
    }
  }
};
</script>