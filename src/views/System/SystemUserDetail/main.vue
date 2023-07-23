<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增用户' : '用户详情' }]">
    <el-form ref="form" :model="user" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="用户帐户" prop="tcYhzh">
        <el-input v-model="user['tcYhzh']" size="mini" placeholder="用户帐户" maxlength="24" :disabled="$route.query.type === 'update'"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="tcYhmc">
        <el-input v-model="user['tcYhmc']" size="mini" placeholder="用户名称"  maxlength="24" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-show="this.$route.query.type === 'update'">
        <el-button type="primary" size="mini" @click="_ButtonResetPsd">重置密码</el-button>
      </el-form-item>
      <el-form-item label="联系电话" prop="tcLxdh">
        <el-input v-model="user['tcLxdh']" size="mini" placeholder="联系电话"  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="tcYx">
        <el-input v-model="user['tcYx']" size="mini" placeholder="邮箱"  maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="版块" prop="tcBkbm">
        <el-checkbox-group v-model="user['tcBkbm']">
          <el-checkbox v-for="option in plates" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="已选角色" prop="tnJsid">
        <el-transfer class="common-form-box" :props="transferProps" v-model="user['tnJsid']" :data="roles" :titles="['未分配角色', '已分配角色']"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView> 
</template>

<style lang="scss" scoped>
/deep/ .el-transfer__buttons{
          button:nth-child(1){
            background:#EEE !important;
            border-color:#EEE !important;
          }
}
</style>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import RoleModel from '../SystemRole/model.js'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      rules: {
        tcYhzh: [
          Validator.required('请输入用户帐户'),
          Validator.length(1, 24),
        ],
        tcYhmc: [
          Validator.required('请输入用户名称'),
          Validator.length(1, 24),
        ],
        tcLxdh:[
          Validator.required('请输入固话或者手机号，固话格式为0000-00000000'),
          Validator.length(1, 13),
          Validator.isFixedPhoneNumber()
        ],
        tcYx:[
          Validator.length(1, 24),
        ],
        tcBkbm: [
          Validator.required('请选择版块')
        ],
        tnJsid: [
          Validator.required('请选择角色')
        ],
      },
      transferProps: {
        key: 'tnJsid',
        label: 'tcJsmc',
      },
      plates: [],
      user: {
        tcBkbm: [],
      },
      roles: [],
    }
  },
  methods: {
    // 初始化
    $init () {
      if (this.$route.query.type === 'update') {
        this.getUserData()
      } else {
        this.user.tcDwdm = this.$route.query.orgCode
        this.user.tcDwmc = this.$route.query.orgName
      }
      this.getRoleList()
      this.getPlateList()
    },
    // 事件-保存按钮点击
    _ButtonSaveClick () {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          if (this.$route.query.type === 'add') {
            this.addUserData()
          } else {
            this.updateUserdata()        
          }
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 获取用户所属版块列表
    getPlateList () {
      this.plates = JSON.parse(window.sessionStorage.boardIds)     
    },
    // 获取角色列表
    async getRoleList () {
      const result = await RoleModel.getDataRoleList({
        pageNum: 1,
        rows: 20,
        requestData: {}
      })
      if (result.data) {
        this.roles = result.data
        this.$nextTick(() => {
          this.$refs.form.clearValidate(['tnJsid'])
        })
      }
    },
    // 根据用户id获取用户数据
    async getUserData () {
      const result = await Model.getUserDetail({
        tnYhid: parseInt(this.$route.query.userId, 10),
      })
      if (result.data) {
        const user = result.data
        user.tcBkbm = user.tcBkbmList.map(item => item.tcBkbm)
        user.tnJsid = user.tnJsidList.map(item => item.tnJsid)

        this.user = user
      }
    },
    // 新增用户数据
    async addUserData () {
      const result = await Model.addUser(this.user)
      if (result.state === '1') {
        this.$message({
          message: '添加用户成功',
          duration: 1000,
          onClose: () => {
            this.$router.go(-1)
          }
        })
      }
    },
    // 修改用户数据
    async updateUserdata () {
      const result = await Model.updateUser(this.user)
      if (result.state === '1') {
        this.$message({
          message: '修改用户成功',
          duration: 1000,
        })
      }
    },

     //事件-重置密码点击
    async _ButtonResetPsd () {
      const result = await Model.ButtonResetPsd({ 
          tnYhid:this.$route.query.userId,
          tcYhzh:this.$route.query.userZh
            })
      if (result.state === '1') {
        this.$message({
           message: '重置密码成功'
        })
          }
      }
  }
}
</script>
