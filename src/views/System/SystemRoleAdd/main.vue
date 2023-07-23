<template>
  <CustomView :location="[{ text: '新增角色' }]">
    <el-form :model="formData" label-position="top" :rules="rules" class="common-form" ref="form">
      <el-form-item label="角色名称" prop="tcJsmc">
        <el-input v-model="formData['tcJsmc']" size="mini" placeholder="请输入角色名称" maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="tcBz">
      <el-input  type="textarea" v-model="formData['tcBz']" size="mini" placeholder="请输入备注" maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="授权的菜单" prop="idArrs">
        <el-tree ref="expandMenuList" class="form-tree"
          :data="menu"
          node-key="tcCdid"
          :props="defaultProps"
          :expand-on-click-node="false"
          >
          <span slot-scope="{ node, data }">
            <el-checkbox v-model="node.data.selected" @change="value => _CheckChange(node, data, value)">{{ data.text }}</el-checkbox>
          </span>
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonClick">确定</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>


<script>
import Model from '../SystemRole/model.js'
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      rules: {
        tcJsmc: [
          Validator.required('请输入角色名称'),
          Validator.length(1,24)
        ],
        tcBz: [
          Validator.length(1,24)
        ],
        idArrs: [
          Validator.required('请选择菜单'),
        ]
      },
      formData: {
        idArrs: [],
      },
      menu: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  methods: {
    $init (options) {
      this.setMenu()
    },
    setMenu () {
      const menu = JSON.parse(window.sessionStorage.menuIds)
      const eachMenu = list => {
        list.forEach(item => {
          item.selected = false
          item.children && eachMenu(item.children)
        })
      }
      eachMenu(menu)
      this.menu = menu
    },
    async _ButtonClick () {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.addRole()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    _CheckChange (node, data, value) {
      // 遍历父级节点
      const setParentCheckStatus = node => {
        if (node.level !== 0) {
          node.data.selected = value
          setParentCheckStatus(node.parent)
        }
      }
      
      // 遍历子节点
      const eachChild = node => {
        node.childNodes.forEach(item => {
          item.data.selected = value
          eachChild(item)
        })
      }

      node.data.selected = value
      value && setParentCheckStatus(node.parent)
      eachChild(node)

      const selected = []
      const eachMenu = list => {
        list.forEach(item => {
          item.selected && selected.push(item)
          item.children && eachMenu(item.children)
        })
      }
      eachMenu(this.menu)
      this.formData.idArrs = selected.map(item => item.tcCdid)
    },
    async addRole () {
      const result = await Model.saveDataRoleItem({
        rows: 100,
        pageNum: 1,
        requestData: {
          tcJsmc: this.formData.tcJsmc,
          tcBz: this.formData.tcBz,
          tnJsid: this.formData.tnJsid,
          tcCdid: this.formData.idArrs
        }
      })
      if (result.state === '1') {
        this.$message({
          message: '添加角色成功',
          duration: 1000,
          onClose: () => {
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>
