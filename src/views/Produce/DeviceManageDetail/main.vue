<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增安全生产设备' : '安全生产设备详情' }]">
    <CustomButton v-if="$route.query.type === 'detail'" style="position:absolute;top:15px;right:62px" icon="export" text="导出" @click="_ButtonExportClick"/>
    <el-form :model="bindData" label-position="top" class="common-form" ref="form" :rules="rules">
      <el-form-item>
        <h2>{{$route.query.tcDwmc || bindData.tcDwmc}}</h2>
      </el-form-item>
      <el-form-item label="备注" prop="tcBz">
        <el-input v-model="bindData['tcBz']" size="mini" type="textarea" placeholder="请输入备注信息" :rows="6" :disabled="$route.query.type === 'detail' && !!!bindData.tnSbzt"></el-input>
      </el-form-item>
      <el-form-item>
        <el-tabs v-model="activeTab" @tab-click="_TabClick" >
          <el-tab-pane :label="tab.tcSjnr" v-for="tab in equipType" :key="tab.tcSjubm" :name="tab.tcSjubm" :disabled="disabled"></el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item>
        <ConfigItem v-for="(config, index) in bindData.aqscSbsslrtiList" :key = "index" :config="config || {}" :disabled="$route.query.type === 'detail' && !!!bindData.tnSbzt" @viewItmeDetail="viewItmeDetail"/>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="_saveClick" v-if="$route.query.type === 'add' || !!bindData.tnSbzt">保存</el-button>
      </el-form-item>
    </el-form>
    <CustomDialog title="关联详情" width="90%" top="40px" :visible="dialogVisible" @close="dialogVisible = false">
      <DataGrid style="height: 500px" :config="gridConfig" :list="list" :disabled="disabled"/>
    </CustomDialog>
  </CustomView>
</template>

<style lang="scss" scoped>
.common-form{
  padding: 0 0;
  margin: 40px 60px;
}
</style>


<script>
import Mixin from '@mixins'
import Model from './model.js'
import ConfigItem from './components/ConfigItem.vue'
import DataGrid from './components/DataGrid.vue'
import CommonModel from '@commons/model.js'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    ConfigItem,
    DataGrid,
  },
  data () {
    return {
      rules: {
        tcBz:[
          Validator.required('请输入备注信息'),
          Validator.length(1, 60)
        ],
        
      },
      dict: ['1103'],
      equipType: [],
      bindData: {
        aqscSbsslrtiList: []
      },
      activeTab: '110305',
      activeTabText: '安全生产设备',
      disabled: false,
      dialogVisible: false,
      list: [],
      gridConfig: [],
    }
  },
  methods: {
    async $init(options) {
      if(options){
        this.equipType = options['1103']
      }
      this.bindData = {
        tcSsdwbm: this.$route.query.tcDwbm,
        tcSsdwmc: this.$route.query.tcDwmc,
        tcXxxlxbm: this.activeTab,
        tcXxxlxmc: this.activeTabText,
        tcBz: '',
        aqscSbsslrtiList: []
      }
      if(this.$route.query.type === 'detail'){
        await this.getActiveTab()
      }
      await this.getConfig()
      if(this.$route.query.type === 'detail'){
        await this.getDetail()
      }
    },
    // 事件 - 选项卡切换
    _TabClick () {
      this.activeTabText = this.equipType.find(el => el.tcSjubm === this.activeTab.toString()).tcSjnr
      this.bindData.aqscSbsslrtiList = []
      this.bindData.tcXxxlxbm = this.activeTab
      this.bindData.tcXxxlxmc = this.activeTabText
      this.getConfig()
    },
    _saveClick () {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          if(!this.bindData.aqscSbsslrtiList || this.bindData.aqscSbsslrtiList.findIndex(el => el.tnSfpb === undefined) !== -1){
            this.$alert(`尚有配置项未填写，或者配置表内容为空，请返回后再次操作！`)
          }else{
            this.updateData()
          }
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    //查看关联词设备
    viewItmeDetail(info){
      this.$router.push({path: '/firecontrol/info/detail', query:{
        type: 'update',
        orgId: JSON.parse(window.sessionStorage.user).tcDwdm,
        orgName: JSON.parse(window.sessionStorage.user).tcDwmc,
        equipType: info.tcMxlx,
        equipTypeText: info.tcMxmc,
        equipOrder: info.tnYwpc,
        detailType: '',
        detailTypeText: '',
        view: true,
      }})
      // this.dialogVisible = true
      // this.getEquipConfig(id)
    },
    //勾选是否配备
    radioClick(val, id){
      let index = this.bindData.aqscSbsslrtiList.findIndex(el => el.tnSbssnrpzid === id)
      if(index !== -1){
        this.bindData.aqscSbsslrtiList[index].tnSfpb = val
      }
      else{
        this.bindData.aqscSbsslrtiList.push({tnSfpb: val, tnSbssnrpzid: id})
      }
    },
    _ButtonExportClick() {
      this.exportTable()
    },
    async exportTable() {
      const result = await Model.exportTable({
        isQuery:0,  //是否是查询类 0-否 1-是
        requestData: {
          tcXxxlxbm: this.activeTab,
          tnSbsslrtoid: this.$route.query.tnSbsslrtoid
        }
      })
      if(result){
        this.$message({
          message: '导出成功',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        const content = result
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `安全生产设备.xls`
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }
    },
    //获取tab选项卡
    async getConfig() {
      const result = await Model.getConfig({
        rows: 40,
        pageNum: 1,
        isQuery: 1,  //是否是查询类 0-否 1-是
        requestData: {
          tcXxxlxbm: this.activeTab
        }
      })
      if(result){
        this.bindData.aqscSbsslrtiList = result.data
      }
    },
    async getEquipConfig (id) {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx: id
      })
      if (result.data) {
        this.gridConfig = result.data
        this.$forceUpdate()
        this.getEquipData(id)
      }
    },
    // 获取列表
    async getEquipData (id) {
      const result = await Model.getXfxxList({
        requestData: {
          tcXxxlx: id,
          // tcSsdwdm: this.$route.query.orgId,
          tnDyywpc: ''//鬼晓得是什么
        }
      })
      if (result.data) {
        this.list = this.processData(result.data)
        this.$forceUpdate()
      }
    },
    processData (listData) {
      const data = {}
      listData.forEach(item => {
        data[item.tnYwpc] = data[item.tnYwpc] || []
        data[item.tnYwpc].push(item)
      })
      return Object.keys(data)
        .map(key => data[key])
        .sort((a, b) => b.tnYwpc - a.tnYwpc)
        .map(fields => {
          const data = {}
          fields.forEach(item => {
            let value
            if (typeof item.tcZfclxsj !== 'undefined') {
              value = item.tcZfclxsj
            }
            if (typeof item.tnSzzxsj !== 'undefined') {
              value = item.tnSzzxsj
            }
            if (typeof item.tnFdxsj !== 'undefined') {
              value = item.tnFdxsj
            }
            data[item.tnXfaqjbxxszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          return data
        })
    },
    //更新数据
    async updateData(){
      let result = this.$route.query.type === 'detail'
      ? await Model.updateData({
        isQuery:0,  //是否是查询类 0-否 1-是
        requestData: this.bindData
      })
      : await Model.insertData({
        isQuery:0,  //是否是查询类 0-否 1-是
        requestData: this.bindData
      })
      if (result.state==="1") {
        this.$message({
          message: result.msg,
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({path: '/produce/device/manage'})
      }
    },
    
    //获取详情
    async getDetail(){
      const result = await Model.getDetail({
        isQuery:1,  //是否是查询类 0-否 1-是
        requestData: {
          tnSbsslrtoid: this.$route.query.tnSbsslrtoid
        }
      })
      if(result.state === '1'){
        this.disabled = true
        let tempList = this.bindData.aqscSbsslrtiList.slice()
        this.bindData = result.data
        tempList.forEach(el => {
          this.bindData.aqscSbsslrtiList.forEach(el2 => {
            if(el.tnSbssnrpzid === el2.tnSbssnrpzid){
              el.tnSfpb = el2.tnSfpb
            }
          })
        })
        this.$nextTick(() => {
          this.bindData.aqscSbsslrtiList = [...tempList]
        })
      }
    },
    async getActiveTab(){
      const result = await Model.getDetail({
        isQuery:1,  //是否是查询类 0-否 1-是
        requestData: {
          tnSbsslrtoid: this.$route.query.tnSbsslrtoid
        }
      })
      if(result.data && result.state === '1'){
        this.activeTab = result.data.tcXxxlxbm
        this.activeTabText = result.data.tcXxxlxmc
      }
    },
  }
}
</script>
