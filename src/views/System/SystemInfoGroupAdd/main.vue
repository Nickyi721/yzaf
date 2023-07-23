<template>
  <CustomView :location="[{ text: '新增群组' }]">
    <el-form :model="formData" ref="form" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="群组名称" prop="tcQzmc">
        <el-input v-model="formData['tcQzmc']" size="mini" style="width:300px;" placeholder="请输入群组名称"></el-input>
      </el-form-item>
      <el-form-item label="群组说明" prop="tcQzsm">
        <el-input v-model="formData['tcQzsm']" type="textarea" :rows="3" placeholder="请输入群组说明"></el-input> 
      </el-form-item>
      <el-form-item label="单位">
        <!-- <el-input v-model="formData['tcDwmc']" size="mini" style="margin-bottom:20px" :readonly="true"></el-input> -->
        <CommonMultiSelect class="form-tree" ref="commonTree" fnCode="000403"  />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonClick()">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<script>
import Model from './model.js'
import Validator from '@commons/validator.js'

export default {
  data () {
    return {
      rules: {
        tcQzmc: [
          Validator.required('请输入群组名称'),
          Validator.length(1, 50)
        ],
        tcQzsm: [
          Validator.required('请输入群组说明'),
          Validator.length(1, 300)
        ],
        tcDwmc: [
          //  Validator.required('请选择单位')
        ]
      },
      Dwdm: [],
      Dwmc: [],
      formData: {
        tcQzmc: '',
        tcQzsm: '',
        dwpzList: []
        // tcDwdm: '',
        // tcDwmc: ''
      }
    }
  },
  methods: {
    // 保存按钮点击
    _ButtonClick () {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.saveData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 勾选事件
    _OrgTreeCheckChanged () {
      let data = this.$refs.commonTree.getCheckedNodes()
      let newData = data.map(item => {
        const { xjxz, id, bjxz } = item
        if (xjxz && xjxz !== 3) {
          return {
            mode: xjxz,
            dwdm: id,
            selected: !!bjxz
          }
        } else {
          return {
            dwdm: id,
            selected: !!bjxz
          }
        }
      })
      return newData
    },
    async saveData () {
      this.formData.dwpzList = this._OrgTreeCheckChanged()
      if (!this.formData.dwpzList.length) {
        this.$msgbox({
          message: `请选择单位`,
          type: 'warning'
        })
        return
      }
      const result = await Model.addData({
        isQuery: 0,  //是否是查询类 0-否 1-是
        cdId: '00040204', //菜单ID
        // sessionId: window.sessionStorage.sessionId,
        requestData: this.formData
      })
      if (result.state === "1") {
        this.$message({
          message: '新增成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({ path: '/system/info-group' })
      }
      else {
        this.$message({
          message: '新增失败!',
          type: "fail",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
      }
    }
  }
}
</script>
