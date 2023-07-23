<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable @change="change" v-model="formData['c_dwmc']" size="mini" placeholder="请输入机构名称"></el-input>
      <el-input clearable @change="change" v-model="formData['c_pgrmc']" size="mini" placeholder="请输入评估人"></el-input>
      <el-select clearable @change="change" v-model="formData['c_pgdj']" placeholder="请选择评估等级" size="mini">
        <el-option v-for="option in levelOptions['c_pgdj']" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
      <el-select clearable @change="change" v-model="formData['c_pgztid']" placeholder="请选择评估状态" size="mini">
        <el-option v-for="option in statusOptions['c_pgztid']" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
      <el-date-picker clearable @change="change" v-model="formData['c_time']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期"></el-date-picker>
      <el-button type="primary" size="mini" @click="query">查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    
  ],
  data () {
    return {
      formData: {},
      levelOptions: {
        c_pgdj: [
          { label: '优秀', value: "优秀" },
          { label: '合格', value: "合格" },
          { label: '未达标', value: "未达标" },
          { label: '隐患单位', value: "隐患单位" }
        ]
      },
      statusOptions: {
        c_pgztid: [
          { label: '正在评估', value: 0 },
          { label: '待审核', value: 1 },
          { label: '审核未通过', value: 2 },
          { label: '审核通过', value: 3 },
          { label: '评估完成', value: 4 }
        ]
      }
    }
  },
  methods: {
    query () {
      this.$emit('query', this.formData)
    },
    change () {
      this.$emit('change', this.formData)
    }
  }
}
</script>

<style lang="scss">
</style>
