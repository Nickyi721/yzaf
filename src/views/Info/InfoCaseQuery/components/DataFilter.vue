<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcXxbt']" size="mini" placeholder="请输入信息标题"></el-input>
      <el-select clearable v-model="bindData['tcXxlx']" size="mini" placeholder="请选择信息类型">
        <el-option v-for="option in optionsInfoType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <el-select clearable v-model="bindData['tcAfbw']" size="mini" placeholder="请选择案发部位">
        <el-option v-for="option in optionsCrimePart" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <el-select clearable v-model="bindData['tcAfbwss']" size="mini" placeholder="请选择案发部位所属">
        <el-option v-for="option in optionsCrimePartParent" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <el-input clearable v-model="bindData['tcDwmc']" size="mini" placeholder="请选择区域" @clear="clearInput" @focus="formChooseHandle"></el-input>
      <el-select clearable v-model="bindData['tnSjzt']" size="mini" placeholder="请选择事件状态">
        <el-option v-for="option in optionsInfoState" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <br>
      <span class="demonstration">案发时间：</span>
      <el-date-picker v-model="bindData['tcAfsj']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="demonstration">上报时间：</span>
      <el-date-picker v-model="bindData['tcSbsj']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
  
</template>

<script>
import Mixin from '@mixins'
import CommonModel from '@commons/model.js'

export default {
  mixins: [Mixin.init, Mixin.Filter],
  props: {
    curRegion: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      dict: ["04020201", "04020202", "04020203", "040204"],
      optionsInfoType: [],
      optionsCrimePart: [],
      optionsCrimePartParent: [],
      bindData: {
        tcDwmc: '',
        tcDwdm: ''
      },
      optionsInfoState: []
    }
  },
  methods: {
    $init(options) {
      let obj = {
        tcSjubm: "",
        tcSjnr: "全部"
      };
      this.optionsInfoType.push(obj);
      this.optionsCrimePart.push(obj);
      this.optionsCrimePartParent.push(obj);
      this.optionsInfoState.push(obj);
      options["04020201"].forEach(element => {
        this.optionsInfoType.push(element);
      });
      options["04020202"].forEach(element => {
        this.optionsCrimePart.push(element);
      });
      options["04020203"].forEach(element => {
        this.optionsCrimePartParent.push(element);
      });
      options["040204"].forEach(element => {
        this.optionsInfoState.push(element);
      });

    },
    formChooseHandle() {
      this.$emit('choose')
    },
    clearInput() {
      this.bindData = {
        tcDwmc: '',
        tcDwdm: ''
      }
    },
  },
  watch: {
    curRegion(val) {
      if(val) {
        this.bindData.tcDwmc = val.name
        this.bindData.tcDwdm = val.id
      }
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
