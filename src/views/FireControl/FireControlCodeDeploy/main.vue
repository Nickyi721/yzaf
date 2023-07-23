<template>
  <CustomView>
     <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" :xl='xl' :sfyx='sfyx'/> <!--这里需要改变-->
      <CustomToolbar>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
        <!-- <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/> -->
        <CustomButton icon="download" text="下载" @click="_DonwloadQrCodeZip"/>
      </CustomToolbar>
    </div>

    <CustomDialog :title='title' width='300px' :visible="dlgVisible" @close="dlgVisible = false">
      <img id='qrcode' :src='src' alt="">
      <div class="dialog-button">
        <el-button type="primary" size="mini" @click="_generate('download', id)">下载</el-button>
      </div>
    </CustomDialog>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange" @generateQrcode="(val) => _generate('show', val)" :dlgVisible="dlgVisible" @handleQrcode='_handleQrcode'>
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>
</<style scoped>
.dialog-button{
  margin: -25px 0 10px 120px
}
</style>


<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import request from '@commons/request.js'
import CommonModel from '@commons/model.js'
import config from '@commons/config.js'
import Moment from 'moment'

// 页面组件
import DataGrid from './components/DataGrid'
import DataFilter from './components/DataFilter'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataGrid,
    DataFilter
  },
  data () {
    return {
      dlgVisible: false,
      query: {},
      selection: [],
      // 数据列表
      list: [],
      xl: [],
      sfyx: [],
      src: '',
      title: '',
      id: '',
      tnSfyx: {
        wqy: 10030401, //未启用
        qy: 10030402, //启用
        ty: 10030403, //停用
      },
    }
  },
  methods: {
    $init(){
      this.getQrcodeList()
    },
    //数据选择
    _DataGridSelectionChange(selection){
      this.selection = selection
    },
    //点击查询按钮
    _DataFilterQuery(query) {
      this.query = query
      this.getQrcodeList()
    },
    _DonwloadQrCodeZip() {
      if (!this.selection.length) {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }else{
        if(this.selection.find(el => el.tnSfyx!=this.tnSfyx.qy)){
          this.$msgbox({
            message: '存在未生成或者停用状态数据，请重新选择！',
            type: 'warning'
          })
        }else{
          window.location.href = `${config.host + config.api}/qrcode/loadQrCodeItemsZip?tnEwmids=${this.selection.map(el => el.tnEwmid).join(',')}&tnSfyx=${this.tnSfyx.qy}`
        }
      }
    },
    
    // 事件-点击删除按钮
    _ButtonDeleteClick() {
      if (this.selection.length) {
        this.$confirm('确认删除当前选择数据吗？').then(() => {
          this.deleteQrCodeItem()
        }).catch(err => {})
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    // 事件-点击新增按钮
    _ButtonAddClick() {
      this.$router.push({
        name: 'fireControlCodeDeployAdd',
        params: {tnEwmid: -1, type: 'add'}
      })
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({name: 'fireControlCodeDeployAdd', params: {tnEwmid: row.tnEwmid, type: 'update'}});
    },
    _handleQrcode(val, id, dlbm) {
      this.handleQrCodeItem(val, id, dlbm)
    },
    //生成二维码
    _generate(type, id) {
      this.id = id.tnEwmid || id
      if(type !== 'download'){
        this.src = `${config.host + config.api}/qrcode/loadQrCodeItem?tnEwmid=${id.tnEwmid}&showOrLoad=${type}&tnSfyx=${this.tnSfyx.qy}`
        this.title = id.tnSfyx === this.tnSfyx.wqy ? '生成二维码' : '查看二维码'
        this.list[this.list.findIndex(el => el.tnEwmid === id.tnEwmid)].tnSfyx = this.tnSfyx.qy
        this.dlgVisible = true
      }else{
        window.location.href = `${config.host + config.api}/qrcode/loadQrCodeItem?tnEwmid=${this.id}&showOrLoad=${type}`
      }
    },
    // 事件-改变每页数量
    _PageRowsChange(num) {
      this.pageRows = num
      this.pageNum = 1;
      this.getQrcodeList();
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this.getQrcodeList();
    },
    // 获取二维码列表
    async getQrcodeList(){
      if(this.query.time){
        this.query.tdCjsjStr = `${this.query.time[0]}~${this.query.time[1]}`
      }else{
        this.query.tdCjsjStr = ''
      }
      const result = await Model.getQrcodeList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'00040803', //菜单ID
        requestData: {
          ...this.query,
          tcDwbm: JSON.parse(window.sessionStorage.getItem('user')).tcDwdm
        }
      })
      if (result.state==="1") {
        this.list = result.data
        this.list.forEach(el => {
          el.tdCjsj = Moment(el.tdCjsj).format('YYYY-MM-DD')
        })
        this.pageTotal = result.total
      }
    },
    // 删除二维码列表
    async deleteQrCodeItem () {
      const result = await Model.deleteQrCodeItem({
        isQuery:0,  //是否是查询类 0-否 1-是
	      cdId:'00040803', //菜单ID
        requestData: {
          tnEwmids: this.selection.map(item => item.tnEwmid).join(',')
        }
      })
      if (result.state==="1") {
        this.$message({
          message: '删除成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.getQrcodeList()
      }
    },
    //停用、启用二维码
    async handleQrCodeItem (val, id, dlbm) {
      const result = await Model.refreshQrCodeStatusItem({
        isQuery:0,  //是否是查询类 0-否 1-是
        cdId:'00040803', //菜单ID
        requestData: {
          tcEwmDlbm: dlbm,
          tnEwmid: id,
          tnSfyx: val
        }
      })
      if (result.state==="1") {
        this.$message({
          message: '操作成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.list[this.list.findIndex(el => el.tnEwmid === id)].tnSfyx = val === this.tnSfyx.qy ? this.tnSfyx.qy : this.tnSfyx.ty
      }
      else{
        this.list[this.list.findIndex(el => el.tnEwmid === id)].tnSfyx = this.tnSfyx.ty
      }
    },
  },
}
</script>
