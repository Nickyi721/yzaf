<template>
  <CustomView :location="[{ text: '信息详情' }]">
    <el-form ref="form" :model="formData" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="信息标题" prop="tcXxbt">
        <el-input v-model="formData['tcXxbt']" :disabled="disabled" size="mini" style="width:300px" placeholder="请输入信息标题"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="tcLx">
        <el-select v-model="formData['tcLx']" :disabled="disabled" placeholder="请选择信息类型" size="mini" style="width:300px">
          <el-option v-for="infoType in infoTypes" :key="infoType.tcSjubm" :label="infoType.tcSjnr" :value="infoType.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接收单位" prop="tcJsdwmcxs">
        <el-input v-model="formData['tcJsdwmcxs']" size="mini" style="width:300px" type="textarea" :rows="3" :disabled="disabled" :readonly="true"></el-input>

        <div class="choose">
          <div>
            <el-button size="mini" @click="_DwClick('Jsdw','receiveTree')" :disabled="disabled">选择单位</el-button>
            <el-button size="mini" @click="_QzClick('Jsdw')" :disabled="disabled">选择群组</el-button>
          </div>
          <div>
            <span>发送短消息：</span>
            <el-checkbox v-model="formData['sfdxx']" :disabled="disabled" :key="value" :label="label" name="type"></el-checkbox>
          </div>
        </div>

      </el-form-item>
      <el-form-item label="抄送单位" prop="tcCsdwmcxs">
        <el-input v-model="formData['tcCsdwmcxs']" size="mini" style="width:300px" type="textarea" :rows="3" :disabled="disabled" :readonly="true"></el-input>

        <div class="choose">
          <div>
            <el-button size="mini" @click="_DwClick('Csdw','copyTree')" :disabled="disabled">选择单位</el-button>
            <el-button size="mini" @click="_QzClick('Csdw')" :disabled="disabled">选择群组</el-button>
          </div>
        </div>

      </el-form-item>
      <el-form-item label="是否置顶" prop="tnYxj">
        <el-checkbox v-model="formData['tnYxj']" :key="value" :label="label" name="type"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否需要回复" prop="tnSfhf">
        <el-checkbox v-model="formData['tnSfhf']" :key="value" :label="label" name="type"></el-checkbox>
      </el-form-item>
      <el-form-item ref='test' label="正文" prop="tcZw">
        <el-input v-model="formData['tcZw']" :disabled="disabled" size="mini" type="textarea" :rows="5" placeholder="请输入正文"></el-input>
      </el-form-item>
    </el-form>
    <div class='file-operation' style='margin-left:60px;height:150px'>
      <span style="line-height: 24px;color: #09B55F;font-size:14px">附件</span>
      <CommonFileUpload style='margin:5px 0 20px 0'
        :list="formData['xtFjList']" 
        v-if='!disabled'
        :limit='200'
        @uploadFile='(param) => _requestFile(param, formData["tnXxid"].toString())' 
        >
      </CommonFileUpload>
      <CommonFileDownload 
        :list="formData['xtFjList']" 
        :id='formData["tnXxid"]' 
        :disabled='disabled' 
        @remove='_onRemove'
        >
      </CommonFileDownload>
    </div>
    <div class='operation' style='margin-left:60px; height: 40px'>
      <el-button type="primary" size="mini" v-if="!(formData.tcSpzt==='000602'||formData.tcLx==='04010101')" @click="_SaveButtonClick()">保存</el-button>
      <el-button type="primary" size="mini" @click="_SubmitButtonClick()" v-if="formData.tcSpzt!='000602'">提交</el-button>
    </div>
    <CustomDialog width="700px" top="10%" height="500px"  :visible="dialogVisible" @close="closeHandle">
      <Group ref="group" v-if="treeOrgType==='group'" :selectedIds="groupSelectedIds" />
      <CommonMultiSelect ref="receiveTree" style="height:420px" v-show="treeOrgType==='receiveTree'" fnCode="000403" :requestData='receiveTreeRequestData' />
      <CommonMultiSelect ref="copyTree" style="height:420px" v-show="treeOrgType==='copyTree'" fnCode="000403" :requestData='copyTreeRequestData' />
      <div class="ctrl">
        <el-button type="primary" size="small" @click="clickHandle()">确定</el-button>
      </div>
    </CustomDialog>
    <CustomDialog title='图片内容' :visible="picVisible" @close="closeHandle">
      <img :src="src" style="height:300px;">
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
  mixins: [
    Mixin.page,
    Mixin.init
  ],
  data () {
    return {
      receiveTreeRequestData: {
        name: 'tnQzglid',
        tnLx: 1,
        id: this.$route.params.tnXxid
      },
      copyTreeRequestData: {
        name: 'tnQzglid',
        tnLx: 2,
        id: this.$route.params.tnXxid
      },
      rules: {
        tcXxbt: [
          Validator.required('请输入信息标题'),
          Validator.length(1, 100)
        ],
        tcLx: [
          Validator.required('请选择信息类型')
        ],
        tcJsdwmcxs: [
          Validator.required('请选择接收单位')
        ],
        tcZw: [
          Validator.required('请填写正文')
        ]
      },
      formData: {
        tnSfhf: '', //是否回复
        tnXxid: '', // 消息id
        tcXxbt: '', // 标题
        tcLx: '', // 消息类型
        tcLxmc: '', // 消息类型名称
        tnYxj: '', // 优先级
        tcSpzt: '', // 审批状态
        tcSpztmc: '', // 审批状态名称
        tcXxzt: '', // 信息状态
        tcXxztmc: '', // 信息状态名称
        jsdwmc: '', // 接收群组转单位名称
        jsdwlx: '', // 接收单位类型
        csdwmc: '', // 抄送群组转单位名称
        csdwlx: '', // 抄送单位类型
        sfdxx: '', // 短消息
        tcZw: '', // 正文
        tcJsdwmc: [], // 提交后台使用
        tcJsdwIds: [], // 提交后台使用
        tcCsdwmc: [], // 提交后台使用
        tcCsdwIds: [], // 提交后台使用
        tcJsdwmcxs: '', // 群组显示名称
        tcCsdwmcxs: '', // 群组显示名称
        jsdwList: [], // 接收单位
        csdwList: [], // 抄送单位
        xtFjList: []
        // JsdwGroupToOrgIds:[],
        // CsdwGroupToOrgIds:[]
      },
      infoTypes: [],
      value: '',
      label: '是',
      dialogVisible: false,
      disabled: false,
      type: '', // 区分接收、抄送单位
      treeOrgType: '', // 区分单位树、群组列表显示
      groupSelectedIds: [],
      treeSelectedIds: [],
      src: '',
      picVisible: false,
      isActive: false
    }
  },
  methods: {
    $init (options) {
      this.getInfoTypes()
      this.getDetail()
      const tcSpztmc = window.localStorage.getItem('tcSpztmc')
      if (tcSpztmc === '已审批') { this.disabled = true }
      if (this.disabled == true) {
        this.isActive = true
      }
    },
    _DwClick (type, name) {
      this.dialogVisible = true
      if (type === 'Jsdw') {
        this.treeOrgType = 'receiveTree'
      } else {
        this.treeOrgType = 'copyTree'
      }
      this.type = type
      this.treeSelectedIds = this.formData['tc' + type + 'Ids']
      // this.treeSelectedIds = this.formData[type + "GroupToOrgIds"]
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
          this.updateData(1)
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
          this.updateData(2)
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    _fileSubmit (file) {

    },
    _handleChange () {

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
            strArr.push(`${item.tcDwmc}及下一级单位`)
          } else {
            strArr.push(`${item.tcDwmc}下一级单位`)
            // str += `${item.name}下一级单位`
          }
        } else if (item.mode === 2) {
          if (item.selected) {
            strArr.push(`${item.tcDwmc}及所有子单位`)
            // str += `${item.name}及所有子单位`
          } else {
            strArr.push(`${item.tcDwmc}所有子单位`)
            // str += `${item.name}所有子单位`
          }
        } else if (item.selected && !item.mode) {
          strArr.push(`${item.tcDwmc}`)
        }
      })
      return strArr
    },
    // 单位树checkbox修改
    _OrgTreeCheckChanged (name) {
      const nodes = this.getReceiveTreeValue(name)
      if (this.type == 'Jsdw') {
        this.formData.tcJsdwIds = []
        this.formData.jsdwList = nodes
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
        this.formData.tcJsdwmc = strArr
        this.formData.tcJsdwmcxs = strArr.join('\n')
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
      form.append('isVideo', 0),//0否1是
      this.uploadFile(form, fileObj.name, fileObj.uid)
    },
    _onRemove (attachment) {
      this.$confirm('确认删除当前附件？').then(() => {
        //移除文件显示列表数据
        this.formData.xtFjList = this.formData.xtFjList.filter(ele => ele.uid != attachment.uid)
      }).catch(err => {})
    },
    async getInfoTypes () {
      const result = await Model.getInfoTypes({
        isQuery: 1, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        requestData: ''
      })
      this.infoTypes = result.data
    },
    async updateData (flag) {
      this.formData.tnXxid = this.$route.params.tnXxid
      this.formData.sfdxx = this.formData.sfdxx ? 1 : 0
      this.formData.tnYxj = this.formData.tnYxj ? 4 : 0
      this.formData.tnSfhf = this.formData.tnSfhf ? 1 : 0
      let obj = this.infoTypes.find(item => {
        return item.tcSjubm === this.formData.tcLx
      })
      this.formData.tcLxmc = obj.tcSjnr
      this.formData.flag = flag
      const result = await Model.updateData({
        isQuery: 0, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        cdMc: '发布信息',
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
        this.$router.push({ path: '/info/news/publish/' })
      } 
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
          tcYwjmc: result.data.split(",")[0],
          url: "",
          tcXwjmc: result.data.split(",")[1],
          tcWjmc: result.data,
          uid: uid
        })
      } else {
        this.formData.xtFjList = this.formData.xtFjList.filter(el => {
          return el.name != name
        })
      }
    },
    async getDetail () {
      const result = await Model.getDetail({
        isQuery: 1, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        cdMc: '发布信息',
        requestData: {
          tnXxid: this.$route.params.tnXxid
        }
      })
      if (result.data) {
        const data = result.data[0]
        // dwlx：0单位，1群组
        // 抄送单位处理
        // 如果群组id不为空，csdw为群组id传入子组件
        if (data.csQzglid != undefined && data.csQzglid.length > 0) {
          this.formData.csdwlx = 1// 为群组
          this.formData.tcCsdwIds = data.csQzglid.split(',')
          this.formData.tcCsdwmc = data.csQzglMc.split(',')
          this.formData.tcCsdwmcxs = this.formData.tcCsdwmc.join('\n')
        }
        // 群组id为空，csdw为单位id传入子组件
        // tnlx:1发送、2抄送
        else {
          this.formData.csdwlx = 0// 为单位
          data.xxglXxgldwpzDto.forEach((item) => {
            if (item.tnLx === 7) {
              item.mode = item.tnXjxzbz
              item.selected = !item.tnBjxzbz
              this.formData.csdwList.push(item)
            }
          })
          this.formData.tcCsdwmc = this.getValueStrArr(this.formData.csdwList)
          this.formData.tcCsdwmcxs = this.formData.tcCsdwmc.join('\n')
          // this.formData.CsdwGroupToOrgIds = this.formData.tcCsdwIds
        }
        // dwlx：0单位，1群组
        // 接收单位处理
        // 如果群组id为空，jsdw为群组id传入子组件
        if (data.jsQzglid != undefined && data.jsQzglid.length > 0) {
          this.formData.jsdwlx = 1
          this.formData.tcJsdwIds = data.jsQzglid.split(',')
          this.formData.tcJsdwmc = data.jsQzglMc.split(',')

          this.formData.tcJsdwmcxs = this.formData.tcJsdwmc.join('\r\n')
          // this.formData.JsdwGroupToOrgIds = data.xxglXxgldwpzDto.filter(item=>{
          //   return item.tnLx=="1"
          // }).map(item=>{
          //   return item.tcDwdm
          // })
        }
        // 群组id为空，jsdw为单位id传入子组件
        // tnlx:1发送、2抄送
        else {
          this.formData.jsdwlx = 0
          this.formData.tcJsdwIds = []
          data.xxglXxgldwpzDto.forEach((item) => {
            if (item.tnLx === 6) {
              item.mode = item.tnXjxzbz
              item.selected = !item.tnBjxzbz
              this.formData.jsdwList.push(item)
            }
          })
          this.formData.tcJsdwmc = this.getValueStrArr(this.formData.jsdwList)
          this.formData.tcJsdwmcxs = this.formData.tcJsdwmc.join('\n')
          // this.formData.JsdwGroupToOrgIds = this.formData.tcJsdwIds
        }
        this.formData.tcZw = data.tcZw
        this.formData.tcXxbt = data.tcXxbt
        this.formData.tcLx = data.tcLx
        /* if (this.formData.tcCsdwmcxs.length == 0) { this.formData.tcCsdwmcxs = this.formData.tcCsdwmc.join('\r\n') }
        if (this.formData.tcJsdwmcxs.length == 0) { this.formData.tcJsdwmcxs = this.formData.tcJsdwmc.join('\r\n') } */
        this.formData.sfdxx = this.$route.params.sfdxx == 1
        this.formData.tnYxj = this.$route.params.tnYxj == 4
        this.formData.tnSfhf = this.$route.params.tnSfhf == 1
        this.formData.tcSpzt = this.$route.params.tcSpzt
        this.formData.xtFjList = data.xtFjList
      }
    },
    async addData () {
      this.formData.sfdxx = this.formData.sfdxx ? 1 : 0
      let obj = this.infoTypes.find(item => {
        return item.tcSjubm === this.formData.tcLx
      })
      this.formData.tcLxmc = obj.tcSjnr
    },
    // 去除重复
    distinct (data) {
      let result = []
      let i
      let j
      let len = data.length
      for (i = 0; i < len; i++) {
        for (j = i + 1; j < len; j++) {
          if (data[i] === data[j]) {
            j = ++i
          }
        }
        result.push(data[i])
      }
      return result
    }
  },
  mounted () {

    // let oBox = this.$refs.test.cloneNode(true)
    // let target = this.$refs['test-wrap']
    // target.appendChild(oBox)
  }
}
</script>

<style lang="scss" scoped>
.ctrl {
  text-align: right;
}
.el-dialog {
  height: 419px;
}
/deep/ .el-dialog__body {
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
  > div {
    margin-bottom: 10px;
  }
  span {
    padding-right: 5px;
  }
}
.disabledStyle,
.disabledStyle:hover {
  color: #c0c4cc;
  cursor: default;
  pointer-events: none;
}
.checkBox {
  /deep/ &.is-checked {
    .el-checkbox__inner {
      background: #e4e7ed !important;
      border-color: #c0c4cc !important;
    }
    .el-checkbox__label {
      color: #c0c4cc !important;
    }
  }
}
</style>
