<template lang="html">
  <el-form ref="form" :model="formData" :rules="rules" label-position="top" class="common-form common-form-dlg">
    <el-form-item label="数据编码">
      <el-input v-model="formData['tcSjubm']" size="mini" disabled></el-input>
    </el-form-item>
    <el-form-item label="数据内容" prop="tcSjnr">
      <el-input v-model="formData['tcSjnr']" size="mini" placeholder="请输入数据内容" maxlength="24"></el-input>
    </el-form-item>
    <el-form-item label="上级编码">
      <el-input v-model="formData['tcSjibm']" size="mini" disabled></el-input>
    </el-form-item>
    <el-form-item label="是否末级">
      <el-select v-model="formData['tnSfmj']" placeholder="请选择是否末级" size="mini">
        <el-option v-for="option in options['tnSfmj']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="排列顺序" prop="tnPlxx">
      <el-input v-model="formData['tnPlxx']" size="mini" type="number" placeholder="请输入排列顺序(数字)" maxlength="24"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="_ButtonClick('commit')">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Validator from '@commons/validator.js'
export default {
  props: {
    data: Object
  },
  data () {
    return {
      rules: {
        tcSjnr: [
          Validator.required('请输入数据内容'),
          Validator.length(1,24)
        ],
        // tnPlxx: [
        //   Validator.length(1,24)
        // ]
      },
      options: {
        tnSfmj: [
          { tcSjnr: '是', tcSjubm: 1 },
          { tcSjnr: '否', tcSjubm: 0 },
        ]
      },
      formData: {
        tnSfmj: 1
      }
    }
  },
  watch: {
    data: {
      handler () {
        this.formData = this.data
        this.$forceUpdate()
      },
      deep: true
    }
  },
  methods: {
    _ButtonClick (type) {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.$emit('control', type, this.formData)
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    setFormData (data) {
      this.formData = data
    }
  }
}
</script>

<style lang="scss">
</style>
