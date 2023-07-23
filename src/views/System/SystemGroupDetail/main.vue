<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增工作组' : '工作组详情' }]">
    <el-form ref="form" :model="group" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="工作组类型" prop="tcLx">
        <el-select v-model="group['tcLx']" placeholder="请选择工作组类型" size="mini" :disabled="isEditable" @change="_selectChange">
          <el-option v-for="option in options['groupType']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作组名称" prop="tcJczmc">
        <el-input v-model="group['tcJczmc']" size="mini" placeholder="请输入数据内容" :disabled="isEditable"></el-input>
      </el-form-item>

      <el-form-item label="有效时间" prop="range">
        <el-date-picker v-model="group['range']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="isEditable"></el-date-picker>
      </el-form-item>

      <el-form-item label="组长" prop="tcZzid">
        <!-- <input type="text" readonly class="common-form-dlg-btn" @click="_ButtonLeaderClick" v-model="group.tcZzmc" placeholder="请选择组长"> -->
        <el-button ref="leader" class="common-form-dlg-btn" @click="_ButtonLeaderClick" :disabled="isEditable">{{group.tcZzid ? group.tcZzmc : '请选择组长'}}</el-button>
      </el-form-item>

      <el-form-item label="计分员" prop="tcJfy"  v-if="group['tcLx']!=='00050302'">
        <el-button ref="counter" class="common-form-dlg-btn" @click="_ButtonCounterClick" :disabled="isEditable">{{group.tcJfy ? group.tcJfymc : '请选择计分员'}}</el-button>
      </el-form-item>

      <el-form-item label="成员" prop="tcYhXs">
        <el-input v-model="group['tcYhXs']" size="mini" style="width:350px" type="textarea" :rows="3" :readonly="true" :disabled="isEditable"></el-input>
        <el-button size="mini" @click="_ButtonMemberClick" style='color: #3a8ee6;margin-left:10px;color:#006a45;border:1px solid #006a45' :disabled="isEditable">请选择成员</el-button>
        <!-- <button class="common-form-dlg-btn" @click="_ButtonMemberClick">{{(group.tcYh && group.tcYh.length) ? group.tcYh.map(member => member.tcMc).join(',') : '请选择成员'}}</button> -->
      </el-form-item>

      <el-form-item label="机构">
        <CommonMultiSelect class="form-tree" ref="commonTree" :fnCode="fnCode" :apiUrl='treeApi' :requestData='treeRequestData' :disabled="isEditable"/>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" :rows="5" v-model="group['tcBz']" size="mini" placeholder="请输入备注" :disabled="isEditable"></el-input>
      </el-form-item>

      <el-form-item label="工作组角色" prop="tnGzzjsid">
        <el-select v-model="group['tnGzzjsid']" placeholder="请选择工作组角色" size="mini" :disabled="isEditable">
          <el-option v-for="option in options['roles']" :key="option.tnJsid" :label="option.tcJsmc" :value="option.tnJsid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组长角色" prop="tnZzjsid">
        <el-select v-model="group['tnZzjsid']" placeholder="请选择组长角色" size="mini" :disabled="isEditable">
          <el-option v-for="option in options['roles']" :key="option.tnJsid" :label="option.tcJsmc" :value="option.tnJsid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick" :disabled="isEditable">保存</el-button>
      </el-form-item>
    </el-form>

    <CustomDialog title="选择用户" width="90%" top="40px" :visible="dialogVisible" @close="dialogVisible = false">
      <ChooseUser :multi="dlgMulti" :checked="group.tcYh" @choose="_ChooseUserChange" :dialogType="dialogType"/>
    </CustomDialog>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import RoleModel from '../SystemRole/model.js'
import Validator from '@commons/validator.js'

import ChooseUser from './components/ChooseUser.vue'

export default {
  mixins: [
    Mixin.init
  ],
  components: {
    ChooseUser
  },
  data () {
    return {
      treeApi: '',
      treeRequestData: {
        // name: 'tnGzzszbid',
        // id: this.$route.query.groupId || '0'
      },
      // 数据字典编码索引-工作组类型
      dict: ['000503'],
      fnCode: "000405",
      // 选项
      options: {},
      // 验证
      rules: {
        tcLx: [Validator.required('请选择工作组类型')],
        tcJczmc: [Validator.required('请输入工作组名称')],
        range: [Validator.required('请选择时间范围')],
        tcZzid: [Validator.required('请选择组长')],
        tcJfy: [Validator.required('请选择计分员')],
        tcYhXs: [Validator.required('请选择组员')],
        tcDw: [Validator.required('请选择机构')],
        tnGzzjsid: [Validator.required('请选择工作组角色')],
        tnZzjsid: [Validator.required('请选择组长角色')]
      },
      // 工作组
      group: {},

      dialogVisible: false,
      // 多选用户模式
      dlgMulti: false,
      checkedUser: [],
      dialogType: '',
      isEditable: false
    }
  },
  methods: {
    // 初始化
    $init (options) {
      this.isEditable = this.$route.query.isEditable ==='1'? true: false
      // 设置类型选项
      this.options.groupType = options['000503']
      this.$forceUpdate()
      // 设置角色选项
      this.getRoleList()
      // 修改模式
      if (this.$route.query.type === 'update') {
        this.getGroupData()
      }
    },
    // 事件-保存按钮点击
    _ButtonSaveClick () {
      if (this.$refs.commonTree.isLoading) {
        this.$msgbox({
          message: `正在加载数据请稍后！`,
          type: 'warning'
        })
        return
      }
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.group.dwpzList = this._OrgTreeCheckChange()
          if (!this.group.dwpzList.length) {
            this.$msgbox({
              message: `请选择单位`,
              type: 'warning'
            })
            return
          }
          if (this.$route.query.type === 'add') {
            this.addGroup()
          } else {
            this.updateGroup()
          }
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 事件-选择机构
    _OrgTreeCheckChange (node, check) {
      /*  const list = this.$refs.orgTree.$refs.tree.getCheckedNodes()
       this.group.tcDw = list.map(org => ({
         tcBm: org.id,
         tcMc: org.name
       }))
       if (list && list.length) {
         this.$refs.form.clearValidate(['tcDw'])
       } */
      let data = this.$refs.commonTree.getCheckedNodes()
      let newData = data.map(item => {
        const { xjxz, id, bjxz, name } = item
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
    _ButtonLeaderClick () {
      this.dialogVisible = true
      this.dialogType = 'leader'
      this.dlgMulti = false
      this.$forceUpdate()
    },
    _ButtonCounterClick () {
      this.dialogVisible = true
      this.dialogType = 'counter'
      this.dlgMulti = false
      this.$forceUpdate()
    },
    _ButtonMemberClick () {
      this.dialogVisible = true
      this.dialogType = 'member'
      this.dlgMulti = true
      this.$forceUpdate()
    },
    _selectChange (val) {
      this.treeApi = 'workGroup/getGzzTreeByAsync',
      this.treeRequestData = {
        name: 'tnGzzszbid',
        id: this.$route.query.groupId || '0'
      }
      if(val === '00050301'){
        this.fnCode = "000405"
      }
      if(val === '00050302'){
        this.fnCode = "000406"
      }
      // console.log(this.treeApi)
      this.$nextTick(()=>{
        this.$refs.commonTree.refresh()
      })
    },
    // 事件-选择用户
    _ChooseUserChange (selection) {
      this.dialogVisible = false
      switch (this.dialogType) {
        case 'leader':
          this.group.tcZzid = selection[0].tnYhid
          this.group.tcZzmc = selection[0].tcYhmc
          this.$forceUpdate()
          this.$refs.form.clearValidate(['tcZzid'])
          break
        case 'counter':
          this.group.tcJfy = selection[0].tnYhid
          this.group.tcJfymc = selection[0].tcYhmc
          this.$refs.form.clearValidate(['tcJfy'])
          break
        case 'member':
          this.group.tcYh = selection.map(member => ({
            tcBm: member.tcBm || member.tnYhid,
            tcMc: member.tcMc || member.tcYhmc
          }))
          this.group.tcYhXs = this.group.tcYh.map(el => el.tcMc).join(',')
          this.$refs.form.clearValidate(['tcYhXs'])
          break
      }
    },
    // 获取角色列表
    async getRoleList () {
      const result = await RoleModel.getDataRoleList({
        pageNum: 1,
        rows: 20,
        requestData: {}
      })
      if (result.data) {
        this.options.roles = result.data
      }
    },
    async getGroupData () {
      const result = await Model.getGroup({
        tnGzzszbid: this.$route.query.groupId
      })
      if (result.data) {
        this.group = result.data[0]
        this.group.range = [this.group.tcYxkssj, this.group.tcYxjssj]

        const members = this.group.workGroupFz.filter(item => item.tnLx === 0)//成员
        const orgs = this.group.workGroupFz.filter(item => item.tnLx === 1)//单位

        this.group.tcYh = members.map(member => ({
          tcBm: member.tcBm,
          tcMc: member.tcMc
        }))

        this.group.tcYhXs = this.group.tcYh.map(el=>el.tcMc).join(',')

        this.group.tcDw = orgs.map(org => ({
          tcBm: org.tcBm,
          tcMc: org.tcMc
        }))
        this._selectChange(this.group.tcLx)
      }
    },
    async addGroup () {
      // 日期范围
      this.group.tcYxkssj = this.group.range[0]
      this.group.tcYxjssj = this.group.range[1]
      const result = await Model.addGroup(this.group)
      if (result.state === '1') {
        this.$message({
          message: '添加工作组成功',
          duration: 1000,
          onClose: () => {
            this.$router.go(-1)
          }
        })
      }
    },
    async updateGroup () {
      const result = await Model.updateGroup(this.group)
      if (result.state === '1') {
        this.$message({
          message: '修改工作组成功',
          duration: 1000
        })
        this.$router.push('/system/group')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
