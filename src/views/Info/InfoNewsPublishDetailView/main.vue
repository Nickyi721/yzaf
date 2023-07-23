<template>
  <CustomView :location="[{ text: '信息详情' }]">
    <div slot="top">
      <div class="common-info">
        <div class="common-info-unit">
          <span class="common-info-label">信息标题：</span>
          <span class="common-info-content">{{formData['tcXxbt']}}</span>
        </div>
        <div class="common-info-unit">
          <span class="common-info-label">信息类型：</span>
          <span class="common-info-content">{{formData['tcLxmc']}}</span>
          <span class="common-info-label">是否置顶：</span>
          <el-checkbox v-model="formData['tnYxj']" :disabled="disabled" :label="label" name="type"></el-checkbox>
          <span class="common-info-label">发送短消息：</span>
          <el-checkbox v-model="formData['sfdxx']" :disabled="disabled" :label="label" name="type"></el-checkbox>
        </div>
        <div class="common-info-unit">
          <span class="common-info-label">抄送单位：</span>
          <span class="common-info-content">{{formData['tcCsdwmcxs']}}</span>
        </div>
        <div class="common-info-unit">
          <span class="common-info-label">已回复单位数量：</span>
          <span class="common-info-content">{{this.$route.params.yhfNum}}</span>
          <span class="common-info-label">未回复单位数量：</span>
          <span class="common-info-content">{{this.$route.params.whfNum}}</span>
        </div>
        <div class="common-info-unit">
          <span class="common-info-label">正文：</span>
          <span class="common-info-content">{{formData['tcZw']}}</span>
        </div>
        <div class="common-info-unit">
          <span class="common-info-label">附件：</span>
          <CommonFileDownload 
            :list="formData['xtFjList']" 
            :id='formData["tnXxid"]' 
            :disabled='disabled' 
            >
          </CommonFileDownload>
        </div>
        <div>
          <el-input v-model="query['tcDwmc']" size="mini" placeholder="请输入单位名称" style="width:300px; margin-right:10px"></el-input>
          <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
        </div>
      </div>
    </div>
    <DataGrid :list="responseList" @dblclick="_DataGridDblClick" :tcLx='tcLx'>
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange" />
    </DataGrid>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'
import CommonModel from '@commons/model.js'
import DataGrid from './components/DataGrid.vue'

export default {
  mixins: [
    Mixin.page,
    Mixin.init
  ],
  components: {
    DataGrid
  },
  data () {
    return {
      responseList: [],
      query: {
        tcDwmc: ''
      },
      formData: {
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
      },
      value: '',
      label: '是',
      dialogVisible: false,
      disabled: true,
      src: '',
      picVisible: false,
      rowClickStyle: true,
      tcLx: ''
    }
  },
  methods: {
    $init (options) {
      this.tcLx = this.$route.params.tcLx
      this.getDetail()
      this.getResponseDetail()
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getResponseDetail()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getResponseDetail()
    },
    closeHandle () {
      this.$nextTick(() => {
        this.dialogVisible = false
      })
    },
    
    _DataGridDblClick(row) {
      // if(row.yhfNum){
        this.$router.push({ name: 'infoNewsPublishDetailUser', params:{tnXxfsid: row.tnXxfsid, tcDwdm: row.tcDwdm, tnXxid: this.$route.params.tnXxid}})
      // }
    },
    _ButtonClick () {
      this.getResponseDetail()
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
    
    async getResponseDetail () {
      const result = await Model.getResponseDetail({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        cdMc: '发布信息',
        requestData: {
          tnXxid: this.$route.params.tnXxid,
          tcDwmc: this.query.tcDwmc
        }
      })
      if (result.data){
        this.responseList = result.data.list
        this.pageTotal = result.total
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
        }
        // dwlx：0单位，1群组
        // 接收单位处理
        // 如果群组id为空，jsdw为群组id传入子组件
        if (data.jsQzglid != undefined && data.jsQzglid.length > 0) {
          this.formData.jsdwlx = 1
          this.formData.tcJsdwIds = data.jsQzglid.split(',')
          this.formData.tcJsdwmc = data.jsQzglMc.split(',')
          this.formData.tcJsdwmcxs = this.formData.tcJsdwmc.join('\r\n')
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
        }
        this.formData.tcZw = data.tcZw
        this.formData.tcXxbt = data.tcXxbt
        this.formData.sfdxx = this.$route.params.sfdxx == 1
        this.formData.tnYxj = this.$route.params.tnYxj == 4
        this.formData.tcLxmc = data.tcLxmc
        this.formData.xtFjList = data.xtFjList
      }
    }
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
