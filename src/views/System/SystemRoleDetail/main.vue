<template>
  <CustomView :location="[{ text: '角色详情' }]">
    <el-form :model="role" label-position="top" :rules="rules"  class="common-form">
    <el-form-item label="角色名称" prop="tcJsmc">
      <el-input v-model="role['tcJsmc']" size="mini" placeholder="请输入角色名称" maxlength="24"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="tcBz">
     <el-input  type="textarea" v-model="role['tcBz']" size="mini" rows="3" placeholder="请输入备注" maxlength="24"></el-input>
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
      <el-button type="primary" size="mini" @click="_ButtonClick('commit')">确定</el-button>
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
      rules:{
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
      role: {
        idArrs: []
      },
      menu:[],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  methods: {
    $init (options) {
      this.setMenu()
      this.getRoleDetail()
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
    // 获取列表数据
    async getRoleDetail () {
      this.roleId = this.$route.query.roleId
      const result = await Model.getRoleDetail(this.roleId)
      if (result.data) {
        this.role = result.data
        this.$set(this.role, 'idArrs', result.data.tcCdidList.map(item => item.tcCdid))

        const eachMenu = list => {
          list.forEach(item => {
            item.selected = this.role.idArrs.findIndex(id => id === item.tcCdid) >= 0
            item.children && eachMenu(item.children)
          })
        }
        
        eachMenu(this.menu)
      }
    },
    async _ButtonClick (type) {
      const result = await Model.updateRole({
        rows: 100,
        pageNum: 1,
        requestData: {
          tcJsmc: this.role.tcJsmc,
           tcBz:this.role.tcBz,
           tnJsid:this.role.tnJsid,
           tcCdid:this.role.idArrs
        }
      })
      if(result.msg=='处理成功'){
        this.$msgbox({
          message: '保存成功！',
          type: 'warning'
        })
      }
    },
    reset () {
      this.role = {
        tcBz: 1
      }
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
      this.role.idArrs = selected.map(item => item.tcCdid)
    },
  }
}
</script>
