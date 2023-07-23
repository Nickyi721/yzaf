<template>
  <CustomView :location="[{ text: '新增信息' }]">
    <el-form ref="form" :model="formData" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="信息标题" prop="tcXxbt">
        <el-input v-model="formData['tcXxbt']" size="mini" style="width:300px" placeholder="请输入信息标题"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="tcLx">
        <el-select v-model="formData['tcLx']" placeholder="请选择信息类型" size="mini" style="width:300px">
          <el-option v-for="infoType in infoTypes" :key="infoType.tcSjubm" :label="infoType.tcSjnr" :value="infoType.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接收单位" prop="tcJsdwmcxs">
        <el-input v-model="formData['tcJsdwmcxs']" size="mini" style="width:300px" type="textarea" :rows="3" :readonly="true"></el-input>
        <div class="choose">
          <div>
            <el-button size="mini" type="primary" @click="_DwClick('Jsdw','receiveTree')">选择单位</el-button>
            <el-button size="mini" type="primary" @click="_QzClick('Jsdw')">选择群组</el-button>
          </div>
          <div>
            <span>发送短消息：</span>
            <el-checkbox v-model="formData['sfdxx']" :key="value" :label="label" name="type"></el-checkbox>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="抄送单位" prop="tcCsdwmcxs">
        <!-- <el-input v-model="formData['tcCsdwmcxs']" size="mini" style="width:300px" :readonly="true" @focus="formChooseHandle('csdw')"></el-input> -->
        <el-input v-model="formData['tcCsdwmcxs']" size="mini" style="width:300px" type="textarea" :rows="3" :readonly="true"></el-input>
        <div class="choose">
          <div>
            <el-button size="mini" type="primary" @click="_DwClick('Csdw','copyTree')">选择单位</el-button>
            <el-button size="mini" type="primary" @click="_QzClick('Csdw')">选择群组</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="是否置顶" prop="tnYxj">
        <el-checkbox v-model="formData['tnYxj']" :key="value" :label="label" name="type"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否需要回复" prop="tnSfhf">
        <el-checkbox v-model="formData['tnSfhf']" :key="value" :label="label" name="type"></el-checkbox>
      </el-form-item>
      <el-form-item label="正文" prop="tcZw">
        <el-input v-model="formData['tcZw']" size="mini" type="textarea" :rows="5" placeholder="请输入正文" maxlength="300"></el-input>
      </el-form-item>
      <el-form-item label="附件" prop="file">
        <CommonFileUpload
          :list="formData['xtFjList']"
          :limit='200'
          @uploadFile='(param) => _requestFile(param, formData["tnXxid"].toString())'
          >
        </CommonFileUpload>
        <CommonFileDownload
          :list="formData['xtFjList']"
          :id='formData["tnXxid"]'
          @remove='_onRemove'
          >
        </CommonFileDownload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" v-if="formData.tcLx!='04010101'" @click="_SaveButtonClick()">保存</el-button>
        <el-button type="primary" size="mini" @click="_SubmitButtonClick()">提交</el-button>
      </el-form-item>
    </el-form>
    <!-- <div style="margin-left:60px">
      <CommonFileUpload
        :list="formData['xtFjList']"
        :limit='200'
        @uploadFile='(param) => _requestFile(param, formData["tnXxid"].toString())'
        >
      </CommonFileUpload>
      <CommonFileDownload style="margin-top:10px"
        :list="formData['xtFjList']"
        :id='formData["tnXxid"]'
        :picVisible="picVisible"
        @remove='_onRemove'
        >
      </CommonFileDownload>
    </div>
    <div style="margin:60px 0 10px 60px">
      <el-button type="primary" size="mini" v-if="formData.tcLx!='04010101'" @click="_SaveButtonClick()">保存</el-button>
      <el-button type="primary" size="mini" @click="_SubmitButtonClick()">提交</el-button>
    </div> -->
    <CustomDialog width="700px" top="10%" :visible="dialogVisible" @close="closeHandle">
      <Group ref="group" v-if="treeOrgType==='group'" :selectedIds="groupSelectedIds" />
      <CommonMultiSelect ref="receiveTree" style="height:400px" v-show="treeOrgType==='receiveTree'" fnCode="000403" :requestData='receiveTreeRequestData' />
      <CommonMultiSelect ref="copyTree" style="height:400px" v-show="treeOrgType==='copyTree'" fnCode="000403" :requestData='copyTreeRequestData' />
      <div class="ctrl">
        <el-button type="primary" size="small" @click="clickHandle()">确定</el-button>
      </div>
    </CustomDialog>
  </CustomView>
</template>

<script>
import Group from '../Group/main.vue'
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'
import CommonModel from '@commons/model.js'

export default {
  components: { Group },

  mixins: [Mixin.page, Mixin.init],
  data () {
    return {
      receiveTreeRequestData: {
        name: 'tnQzglid',
        tnLx: 1,
        id: '0'
      },
      copyTreeRequestData: {
        name: 'tnQzglid',
        tnLx: 2,
        id: '0'
      },
      rules: {
        tcXxbt: [
          Validator.required('请输入信息标题'),
          Validator.length(1, 60)
        ],
        tcLx: [Validator.required('请选择信息类型')],
        tcJsdwmcxs: [Validator.required('请选择接收单位')],
        tcZw: [Validator.required('请填写正文'), Validator.length(1, 300)]
      },
      formData: {
        tnSfhf: '', // 是否回复
        tnXxid: '', // 消息id
        tcXxbt: '', // 标题
        tcLx: '', // 消息类型
        tcLxmc: '', // 消息类型名称
        tnYxj: '', // 优先级
        tcSpzt: '', // 审批状态
        tcSpztmc: '', // 审批状态名称
        tcXxzt: '', // 信息状态
        tcXxztmc: '', // 信息状态名称
        jsdwlx: '', // 接收单位类型
        csdwlx: '', // 抄送单位类型
        sfdxx: '', // 短消息
        tcZw: '', // 正文
        tcJsdwmc: [], // 提交后台使用
        tcJsdwmcxs: '', // 展示使用
        tcJsdwIds: [], // 提交后台使用
        tcCsdwmc: [], // 提交后台使用
        tcCsdwmcxs: '', // 展示使用
        tcCsdwIds: [], // 提交后台使用
        jsdwList: [], // 接收单位
        csdwList: [], // 抄送单位
        xtFjList: []
      },
      infoTypes: [],
      value: '',
      label: '是',
      dialogVisible: false, // 选择对话框显示
      type: '', // 区分接收、抄送单位
      treeOrgType: '', // 区分单位树、群组列表显示
      groupSelectedIds: [],
      treeSelectedIds: [],
      src: '',
      picVisible: true
    }
  },
  methods: {
    $init (options) {
      this.getInfoTypes()
    },
    _DwClick (type, name) {
      // if (this.$refs[name] != undefined) this.$refs[name].reset()
      this.dialogVisible = true
      if (type === 'Jsdw') {
        this.treeOrgType = 'receiveTree'
      } else {
        this.treeOrgType = 'copyTree'
      }
      this.type = type
      this.treeSelectedIds = this.formData['tc' + type + 'Ids']
    },
    _QzClick (type) {
      this.dialogVisible = true
      this.treeOrgType = 'group'
      this.type = type
      this.groupSelectedIds = this.formData['tc' + type + 'Ids']
    },
    closeHandle () {
      this.$nextTick(() => {
        this.dialogVisible = false
      })
    },
    getReceiveTreeValue (refName) {
      let data = this.$refs[refName].getCheckedNodes()
      let newData = data.map(item => {
        const { xjxz, id, bjxz, name } = item
        if (xjxz && xjxz !== 3) {
          return {
            mode: xjxz,
            tcDwdm: id,
            tcDwmc: name,
            name,
            selected: !!bjxz
          }
        } else {
          return {
            tcDwdm: id,
            tcDwmc: name,
            name,
            selected: !!bjxz
          }
        }
      })
      return newData
    },
    clickHandle () {
      if (this.treeOrgType === 'receiveTree' || this.treeOrgType === 'copyTree') {
        if (this.type == 'Jsdw') {
          // 接收单位类型为单位
          this.formData.jsdwlx = '0'
          this._OrgTreeCheckChanged('receiveTree')
        }
        if (this.type == 'Csdw') {
          // 抄送单位类型为单位
          this.formData.csdwlx = '0'
          this._OrgTreeCheckChanged('copyTree')
        }
        this.dialogVisible = false
      }
      if (this.treeOrgType == 'group') {
        if (this.type == 'Jsdw') {
          // 接收单位类型为单位
          this.formData.jsdwlx = '1'
          this._selectionChange('Jsdw')
        }
        if (this.type == 'Csdw') {
          // 抄送单位类型为单位
          this.formData.csdwlx = '1'
          this._selectionChange('Csdw')
        }
        this.dialogVisible = false
      }
    },

    _SaveButtonClick () {
      this.formData.tcSpzt = '000604'
      this.formData.tcSpztmc = '草稿'
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.addData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },

    _SubmitButtonClick () {
      if (this.formData.tcLx === '04010101') {
        this.formData.tcSpzt = '000601'
        this.formData.tcSpztmc = '未审批'
      } else {
        this.formData.tcSpzt = '000602'
        this.formData.tcSpztmc = '已审批'
      }
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.addData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 群组checkbox修改
    _selectionChange (type) {
      let data = this.$refs.group.getCheckedNodes()
      if (type == 'Jsdw') {
        this.formData.tcJsdwIds = data.map(dt => {
          return dt.tnQzglid.toString()
        })
        this.formData.tcJsdwmc = data.map(dt => {
          return dt.tcQzmc
        })
        this.formData.tcJsdwmcxs = data.map(dt => {
          return dt.tcQzmc
        }).join('\n')
      }
      if (type == 'Csdw') {
        this.formData.tcCsdwIds = data.map(dt => {
          return dt.tnQzglid.toString()
        })
        this.formData.tcCsdwmc = data.map(dt => {
          return dt.tcQzmc
        })
        this.formData.tcCsdwmcxs = data.map(dt => {
          return dt.tcQzmc
        }).join('\n')
      }
    },
    getValueStrArr (nodes) {
      let strArr = []
      nodes.forEach(item => {
        if (item.mode === 1) {
          if (item.selected) {
            strArr.push(`${item.name}及下一级单位`)
          } else {
            strArr.push(`${item.name}下一级单位`)
            // str += `${item.name}下一级单位`
          }
        } else if (item.mode === 2) {
          if (item.selected) {
            strArr.push(`${item.name}及所有子单位`)
            // str += `${item.name}及所有子单位`
          } else {
            strArr.push(`${item.name}所有子单位`)
            // str += `${item.name}所有子单位`
          }
        } else if (item.selected && !item.mode) {
          strArr.push(`${item.name}`)
        }
      })
      return strArr
    },
    // 单位树checkbox修改
    _OrgTreeCheckChanged (name) {
      //  const nodes = list
      const nodes = this.getReceiveTreeValue(name)
      if (this.type == 'Jsdw') {
        this.formData.tcJsdwIds = []
        this.formData.jsdwList = nodes
        this.formData.tcJsdwmc = this.getValueStrArr(nodes)
        this.formData.tcJsdwmcxs = this.formData.tcJsdwmc.join('\n')
      }
      if (this.type == 'Csdw') {
        this.formData.tcCsdwIds = []
        this.formData.csdwList = nodes
        this.formData.tcCsdwmc = this.getValueStrArr(nodes)
        this.formData.tcCsdwmcxs = this.formData.tcCsdwmc.join('\n')
      }
    },
    _requestFile (param) {
      var fileObj = param.file
      this.file = fileObj
      var form = new FormData() // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId', window.sessionStorage.sessionId)
      form.append('lylx', 0)
      form.append('cdId', '0004060201')
      form.append('isQuery', 0)
      form.append('isVideo', 0)
      this.uploadFile(form, fileObj.name, fileObj.uid)
    },
    _onRemove (attachment) {
      this.$confirm('确认删除当前附件？').then(() => {
        // 移除文件显示列表数据
        this.formData.xtFjList = this.formData.xtFjList.filter(ele => ele.uid != attachment.uid)
        this.picVisible = false
      }).catch(err => {})
    },
    async uploadFile (data, name, uid) {
      const result = await CommonModel.uploadFile(data)
      if (result.state === '1') {
        this.$message({
          message: '上传成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle'
        })
        this.formData.xtFjList.push({
          name: name,
          tcYwjmc: result.data.split(',')[0],
          url: '',
          tcXwjmc: result.data.split(',')[1],
          tcWjmc: result.data,
          uid: uid
        })
        this.$forceUpdate()
      } else {
        this.formData.xtFjList = this.formData.xtFjList.filter(el => {
          return el.name != name
        })
      }
    },

    async getInfoTypes () {
      const result = await Model.getInfoTypes({
        isQuery: 1, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        requestData: ''
      })
      this.infoTypes = result.data
    },
    async addData () {
      this.formData.sfdxx = this.formData.sfdxx ? 1 : 0
      this.formData.tnYxj = this.formData.tnYxj ? 4 : 0
      this.formData.tnSfhf = this.formData.tnSfhf ? 1 : 0
      let obj = this.infoTypes.find(item => {
        return item.tcSjubm === this.formData.tcLx
      })
      this.formData.tcLxmc = obj.tcSjnr
      const result = await Model.addData({
        isQuery: 0, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        cdMc: '发布信息',
        requestData: this.formData
      })
      if (result.state === '1') {
        this.$message({
          message: '新增成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle'
        })
        this.$router.push({ path: '/info/news/publish/' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.el-dialog {
  height: 419px;
}
/deep/ .el-dialog__body {
  //@at-rootheight: 400px;
  .ctrl {
    text-align: right;
    padding: 10px;
  }
  /deep/ .custom-view {
    height: 358px !important;
  }
}
.common-tree {
  line-height: 30px;
  /*  height: 338px;
  padding-bottom: 20px; */
}
/deep/ .el-tree {
  width: 100%;
}
/deep/ .choose {
  position: absolute;
  top: 0px;
  left: 310px;
  font-size: 14px;
  line-height: 100%;
  >div{
    margin-bottom: 10px;
  }
  span {
    padding-right: 5px;
  }
}

</style>
