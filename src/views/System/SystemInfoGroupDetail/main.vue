<template>
  <CustomView :location="[{ text: '群组详情' }]">
    <el-form :model="formData" ref="form" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="群组名称" prop="tcQzmc">
        <el-input v-model="formData['tcQzmc']" size="mini" placeholder="请输入群组名称"></el-input>
      </el-form-item>
      <el-form-item label="群组说明" prop="tcQzsm">
        <el-input v-model="formData['tcQzsm']" type="textarea" :rows="3" placeholder="请输入群组说明"></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <!-- <el-input v-model="formData['tcDwmc']" size="mini" style="margin-bottom:20px" :readonly="true"></el-input> -->
        <CommonMultiSelect class="form-tree" ref="commonTree" fnCode="000403" :requestData='treeRequestData' />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonClick()">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init
  ],
  components: {
    // DataTree
  },
  data () {
    return {
      treeRequestData: {
        name: 'tnQzglid',
        tnLx: 4,
        id: this.$route.query.tnQzglid
      },
      rules: {
        tcQzmc: [
          Validator.required('请输入群组名称'),
          Validator.length(1, 50)
        ],
        tcQzsm: [
          Validator.required('请输入群组说明'),
          Validator.length(1, 300)
        ]
      },
      checkList: [],
      formData: {
        tcQzmc: '',
        tcQzsm: '',
        tnQzglid: '',
        dwpzList: []
      }
    }
  },
  methods: {
    async $init (options) {
      // const row = this.$route.query
      // this.formData.tcQzmc = row.tcQzmc
      // this.formData.tcQzsm = row.tcQzsm
      // this.formData.tnQzglid = row.tnQzglid.toString()
      const result = await Model.getData({
        tnQzglid: this.$route.query.tnQzglid
      })
      this.formData = result.data
      this.checkList = []
    },
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
    //  机构树勾选事件
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
      if (this.$refs.commonTree.isLoading) {
        this.$msgbox({
          message: `正在加载数据请稍后！`,
          type: 'warning'
        })
        return
      }
      this.formData.dwpzList = this._OrgTreeCheckChanged()
      if (!this.formData.dwpzList.length) {
        this.$msgbox({
          message: `请选择单位`,
          type: 'warning'
        })
        return
      }
      const result = await Model.updateData({
        isQuery: 0, // 是否是查询类 0-否 1-是
        cdId: '00040204', // 菜单ID
        // sessionId: window.sessionStorage.sessionId,
        requestData: this.formData
      })
      if (result.state === '1') {
        this.$message({
          message: '修改成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle',
          showClose: true,
        })
        this.$router.push({ path: '/system/info-group' })
      } 
      // else {
      //   this.$message({
      //     message: '修改失败!',
      //     type: 'fail',
      //     duration: 2000,
      //     customClass: 'middle'
      //   })
      // }
    }
  }
}
</script>
