<template>
  <CustomView>
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000408" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
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
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange" @generateQrcode="(val) => _generate('show', val)" :dlgVisible="dlgVisible">
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
      src: '',
      title: '',
      id: '',
      currentOrg: '',
      tnSfyx: {
        wqy: 10030401, //未启用
        qy: 10030402, //启用
        ty: 10030403, //停用
      }
    }
  },
  methods: {
    $init(){
      //this.getQrcodeList()
    },
    _OrgTreeClick (node) {
      /*  原来的写法，浅拷贝，后续修改了对象的属性，会导致错误
        this.currentOrg = node
      */
      this.currentOrg = JSON.parse(JSON.stringify(node))
      if(this.currentOrg.type == 1){
        this.getQrcodeList()
      }
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
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
        if(this.selection.find(el => el.tnSfyx != this.tnSfyx.qy)){
          this.$msgbox({
            message: '存在未生成或者停用状态数据，请重新选择！',
            type: 'warning'
          })
        }else{
          window.location.href = `${config.host + config.api}/qrcode/loadQrCodeItemsZip?tnEwmids=${this.selection.map(el => el.tnEwmid).join(',')}&tnSfyx=${this.tnSfyx.qy}`
        }
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
      this.$router.push({name: 'fireControlCodeDeployAdd', params: {tnEwmid: row.tnEwmid, type: 'view'}});
    },

    //生成二维码
    _generate(type, id) {
      this.id = id.tnEwmid || id
      if(type !== 'download'){
        this.src = `${config.host + config.api}/qrcode/loadQrCodeItem?tnEwmid=${id.tnEwmid}&showOrLoad=${type}&tnSfyx=${this.tnSfyx.qy}`
        this.title = id.tnSfyx == this.tnSfyx.wqy ? '生成二维码' : '查看二维码'
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
          tcDwbm: this.currentOrg.id,
          tnSfyx: this.tnSfyx.qy
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
  },
}
</script>

