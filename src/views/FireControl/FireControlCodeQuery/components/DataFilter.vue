<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="query['tcEwmmc']" size="mini" placeholder="请输入二维码名称"></el-input>
      <el-select v-model="query['tcEwmDlbm']" size="mini" placeholder="请选择二维码大类"  @change="_selectChange">
        <el-option
          v-for="el in dl"
          :key="el.tcSjubm"
          :label="el.tcSjnr"
          :value="el.tcSjubm">
        </el-option>
      </el-select>
      <el-select v-model="query['tcEwmXlbm']" size="mini" placeholder="请选择二维码小类">
        <el-option
          v-for="el in xl"
          :key="el.tcSjubm"
          :label="el.tcSjnr"
          :value="el.tcSjubm">
        </el-option>
      </el-select>
      <!-- <el-select v-model="query['tnSfyx']" size="mini" placeholder="请选择二维码状态">
        <el-option
          v-for="el in sfyx"
          :key="el.tcSjubm"
          :label="el.tcSjnr"
          :value="el.tcSjubm">
        </el-option>
      </el-select> -->
      <el-date-picker v-model="query['time']" :unlink-panels="true" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
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
        time: '',
        tcEwmXlbm: ''
      },
      dl: [],
      xl: [],
      sfyx: []
    }
  },
  methods: {
    $init(){
      this.getEwmDl()
      this.getEwmZt()
    },
    _selectChange(val){
      let type
      if(val!==''){
        let type = val === '000701' ? '1001' : '0301'
        this.query.tcEwmXlbm = ''
        this.getEwmXl(type)
      }
      else{
        this.xl = []
      }
      this.$forceUpdate()
    },
    _ButtonClick() {
      this.$emit('query', this.query)
    },
    //获取二维码大类
    async getEwmDl() {
      const result = await CommonModel.getDictData(['0007']);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "请选择二维码大类" }];
        this.dl = all.concat(result.data["0007"]);
      }
    },
    //获取二维码小类
    async getEwmXl(type) {
      const result = await CommonModel.getDictData([type]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "请选择二维码小类" }];
        this.xl = all.concat(result.data[type]);
      }
    },
    //获取二维码状态
    async getEwmZt() {
      const result = await CommonModel.getDictData(["100304"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "请选择二维码状态" }];
        this.sfyx = all.concat(result.data["100304"]);
      }
    },
  }
}
</script>

