<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="query['tcXm']" size="mini" placeholder="请输入姓名"></el-input>
      <el-select v-model="query['tcGzgw']" size="mini" placeholder="请选择工作岗位">
         <el-option
          v-for="item in tcGzgw"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcWhcd']" size="mini" placeholder="请选择文化程度">
         <el-option
          v-for="item in tcWhcd"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcYgxz']" size="mini" placeholder="请选择用工性质">
         <el-option
          v-for="item in tcYgxz"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcBayz']" size="mini" placeholder="请选择保安员证">
         <el-option
          v-for="item in tcBayz"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcCqz']" size="mini" placeholder="请选择持枪证">
         <el-option
          v-for="item in tcCqz"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
       <el-select v-model="query['tcXfzs']" size="mini" placeholder="请选择消防专业职业资质证">
         <el-option
          v-for="item in tcXfzs"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
    <!-- </div>
    <div class="filter-btn"> -->
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>
<style scoped>
h4{
  color:#03c552;
  margin-bottom: 5px;
  text-align: center
}
</style>


<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  props:[
    'tcGzgw','tcWhcd','tcYgxz','tcBayz','tcCqz','tcXfzs','tcXb'
  ],
  data() {
    return {
      query: {
        tcXm:''
      }
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.query)
    }
  }
}
</script>