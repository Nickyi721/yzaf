<template lang="html">
  <el-form :model="formData" label-width="150px" class="common-form">
    <el-form-item label="是否通过">
      <el-select v-model="formData['tnPgztid']" size="mini" placeholder="请选择是否审核通过">
        <el-option v-for="option in options['tnPgztid']" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="审核意见">
      <el-input type="textarea" :rows="3" v-model="formData['tcShyj']" size="mini" placeholder="请输入审核意见"></el-input>
    </el-form-item>
    

    <el-form-item>
      <el-button type="primary" size="mini" @click="_ButtonClick()">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      formData: {},
      options: {
        tnPgztid: [
          { label: '审核通过', value: 3 },
          { label: '审核不通过', value: 2 }
        ]
      }
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('control', this.formData)
    },
    reset () {
      this.formData = {}
    }
  }
}
</script>

<style lang="scss">
</style>