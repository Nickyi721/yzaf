<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增生产配置词条' : '生产配置词条详情' }]">
    <el-form :model="bindData" label-position="top" class="common-form" ref="form" :rules="rules">
      <el-form-item label="设备名称" prop="tcSbmc">
        <el-input v-model="bindData['tcSbmc']" size="mini" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="tcXxxlxbm">
        <el-select v-model="bindData['tcXxxlxbm']" placeholder="请选择设备类型" size="mini"  @change="(val) => _selectChange(val, 1, 1)">
          <el-option v-for="opt in options['1103']" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="场所或车辆" prop="tcEwmdlbm">
        <el-select v-model="bindData['tcEwmdlbm']" placeholder="请选择场所或车辆" size="mini"  @change="(val) => _selectChange(val, 2, 1)">
          <el-option v-for="opt in opt1" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安全生产设备类型或车辆类型" prop="tcEwmxlbm">
        <el-select v-model="bindData['tcEwmxlbm']" placeholder="请选择安全生产设备类型或车辆类型" size="mini">
          <el-option v-for="opt in opt2" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安装区域" prop="tcAzqy">
        <el-input v-model="bindData['tcAzqy']" size="mini" placeholder="请输入安装区域"></el-input>
      </el-form-item>
      <el-form-item label="是否必配" prop="tcPbztbm">
        <el-select v-model="bindData['tcPbztbm']" placeholder="请选择是否必配" size="mini">
          <el-option v-for="opt in options['0001']" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否关联消防设备" prop="tnSfgjxfxxszb">
        <el-radio-group v-model="bindData['tnSfgjxfxxszb']">
          <el-radio v-for="option in tnSfgl" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消防设备信息" prop="tnXfxxxId" v-if="bindData['tnSfgjxfxxszb']">
        <el-select class='item-select' v-model="bindData.aqscSbssgjList[0].tcGjid" @change="val => _optionChange(val)" size='mini'>
          <el-option v-for="opt in relatedOptions" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
        </el-select>
        <el-button type="primary" size="mini" v-if="history.length>1" @click="_goBackward">返回</el-button>
      </el-form-item>
      <el-form-item v-if="bindData['tnSfgjxfxxszb']">
        <div v-if="!!bindData.aqscSbssgjList[0].tcGjid" class="common-grid" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
          <el-table ref="table" class="grid-table" header-cell-class-name="table-hd" stripe  highlight-current-row size="mini" height="500px" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_tableSelectionChange" @row-dblclick="_tableDblClick">
            <el-table-column type="selection"></el-table-column>
            <el-table-column v-for="(col, index) in gridConfig" v-if="col.tnXxxlrfs !== 0 && col.tnXxxlrfs !== 6" align="center" :key="index" :label="col.tcXxxmc" :prop="col.tnXfaqjbxxszid.toString()" :min-width="260 + 'px'">
              <template slot-scope="scope">
                <el-button v-if="col.tcMxlx" size="mini" @click.stop="_viewDetail(col, scope.row)">查看明细</el-button>
                <span>{{ scope.row[col.tnXfaqjbxxszid.toString()] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="grid-page" ref="page" v-if="$slots.default">
            <slot></slot>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="_saveClick">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<style lang="scss" scoped>
.item-select{
  margin: 0 10px 0 0
}
</style>


<script>
import Mixin from '@mixins'
import Model from './model.js'
import CommonModel from '@commons/model.js'
import Validator from '@commons/validator.js'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      rules: {
        tcSbmc:[
          Validator.required('请输入设备名称'),
          Validator.length(1, 200)
        ],
        tcXxxlxbm:[
          Validator.required('请选择设备类型')
        ],
        tcEwmdlbm:[
          Validator.required('请选择场所或车辆')
        ],
        tcEwmxlbm:[
          Validator.required('请选择安全生产设备类型或车辆类型')
        ],
        tcAzqy:[
          Validator.required('请输入安装区域'),
          Validator.length(1, 200)
        ],
        tcPbztbm:[
          Validator.required('请选择是否必配'),
        ],
        tnSfgjxfxxszb: [
          Validator.required('请选择是否关联安防设备'),
        ]
      },
      rowClickStyle:true,
      bindData:{
        tcXxxlxbm: '',
        tcEwmdlbm: '',
        tcEwmxlbm: '',
        tcPbztbm: '',
        tnSfgjxfxxszb: '',
        tnXfxxxId: '',
        aqscSbssgjList:[{tcGjid: '', tcGjmc: '', tnXh: 0}],
        tnXssx: 1,
      },
      dict: ['1103', '0001'],
      options: {},
      opt1:[],
      opt2:[],
      opt3:[],
      relatedOptions: [],//关联项
      tnSfgl: [
        {tcSjnr: '关联', tcSjubm: 1},
        {tcSjnr: '不关联', tcSjubm: 0}
      ],
      list: [],
      gridConfig: [],
      history: [],//历史记录
      selection: [],
      checked: [],
    }
  },
  methods: {
    $init(options) {
      if(options){
        this.options = options
      }
      this.getRelatedOptions()
      if(this.$route.query.type === 'detail'){
        this.bindData.tnSbssnrpzid = this.$route.query.tnSbssnrpzid
        this.getDetail()
      }
    },
    //回显挂接关联消防设备具体项
    checkSelected() {
      this.list.forEach(item => {
        this.checked.forEach(selected => {
          if(selected === item.tnYwpc){
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(item, true)
            }) 
          }
        })
        const idx = this.checked.findIndex(selected => item.tnYwpc === item.tnYhid)
        if (idx >= 0) {
          this.$nextTick(() => {
            this.$refs.table.toggleRowSelection(item, true)
          })
        }
      })
    },
    //保存按钮
    _saveClick () {
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          let index = this.bindData.aqscSbssgjList.length - 1
          if(this.bindData.tnSfgjxfxxszb && !!!this.bindData.aqscSbssgjList[index].tnYwpc) {
            this.$alert(`请关联消防设备信息`)
            return
          }
          this.addData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    //消防设备大项选择修改
    _selectChange (val, order, type){
      this.getOptions(val, order, type)
    },
    //关联消防信息选项修改
    _optionChange(tcMxlx) {
      this.history = []
      let tcSsdwdm = JSON.parse(window.sessionStorage.user).tcDwdm
      let index = this.relatedOptions.findIndex(el => el.tcSjubm === tcMxlx)
      let tcGjmc = this.relatedOptions[index].tcSjnr
      this.bindData.aqscSbssgjList[0].tcGjmc = tcGjmc
      this.bindData.aqscSbssgjList[0].tcMxlx = this.bindData.aqscSbssgjList[0].tcGjid
      this.bindData.aqscSbssgjList[0].tcMxmc = this.bindData.aqscSbssgjList[0].tcGjmc
      let obj = JSON.stringify(this.bindData.aqscSbssgjList[0])
      this.history = [JSON.parse(obj)]
      this.getEquipConfig(tcMxlx, tcSsdwdm)
    },
    //选择关联项
    _tableSelectionChange(selection){
      this.selection = selection
      let index = this.bindData.aqscSbssgjList.length - 1
      this.bindData.aqscSbssgjList[index].tnYwpc = selection[0].tnYwpc
    },
    _tableDblClick() {

    },
    //点击明细项
    _viewDetail(col, row){
      let temp = {
        tcGjid: this.bindData.aqscSbssgjList[0].tcGjid,
        tcGjmc: this.bindData.aqscSbssgjList[0].tcGjmc,
        tcMxlx: col.tcMxlx,
        tcMxmc: col.tcXxxmc,
        tnDyywpc: row.tnYwpc,
        tnXh: this.bindData.aqscSbssgjList.length,
      }
      this.bindData.aqscSbssgjList.push(temp)
      this.history.push(temp)
      this.getEquipConfig(col.tcMxlx, undefined, row.tnYwpc)
    },
    //返回按钮
    _goBackward() {
      this.history.pop()
      this.bindData.aqscSbssgjList.pop()
      let lastStep = this.history[this.history.length-1]
      this.getEquipConfig(lastStep.tcMxlx, undefined, lastStep.tnDyywpc)
    },
    //获取关联信息项
    async getRelatedOptions(){
      const result = await Model.getRelatedOptions()
      if (result.data) {
        this.relatedOptions = result.data
      }
    },
    //获取表头
    async getEquipConfig (tcXxxlx, tcSsdwdm, tnDyywpc) {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx
      })
      if (result.data) {
        this.gridConfig = result.data
        this.$forceUpdate()
        await this.getEquipData(tcXxxlx, tcSsdwdm, tnDyywpc)
      }
    },
    // 获取列表
    async getEquipData (tcXxxlx, tcSsdwdm, tnDyywpc) {
      const result = await Model.getXfxxList({
        requestData: {
          tcXxxlx,
          tcSsdwdm,
          tnDyywpc,
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
    //获取下拉框选项
    async getOptions(val, order, type){
      const result = await CommonModel.getDictData([val])
      if(order === 1){
        this.opt1 = result.data[val]
        if(type === 1){
          this.$nextTick(() => {
            this.bindData['tcEwmdlbm'] = ''
            this.bindData['tcEwmxlbm'] = ''
            this.opt2 = []
          })
        }
      }
      if(order === 2){
        this.opt2 = result.data[val]
        if(type === 1){
          this.$nextTick(() => {
            this.bindData['tcEwmxlbm'] = ''
          })
        }
      }
    },
    //新增数据
    async addData(){
      this.bindData.tcXxxlxmc = this.options['1103'].find(item => item.tcSjubm === this.bindData.tcXxxlxbm.toString()).tcSjnr
      this.bindData.tcEwmdlmc = this.opt1.find(item => item.tcSjubm === this.bindData.tcEwmdlbm.toString()).tcSjnr
      this.bindData.tcEwmxlmc = this.opt2.find(item => item.tcSjubm === this.bindData.tcEwmxlbm.toString()).tcSjnr
      this.bindData.tcPbztmc = this.options['0001'].find(item => item.tcSjubm === this.bindData.tcPbztbm.toString()).tcSjnr
      this.bindData.aqscSbssgjList = this.bindData.aqscSbssgjList.filter(el => !!el.tcGjid)
      const result = this.$route.query.type === 'add'
        ? await Model.addData({
          isQuery:0,  //是否是查询类 0-否 1-是
          requestData: this.bindData
        })
        : await Model.updateData({
          isQuery:0,  //是否是查询类 0-否 1-是
          requestData: this.bindData
        })
      if (result.state === "1") {
        this.$message({
          message: result.msg,
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({path: '/data/safe-prod'})
      }
    },
    //获取详情
    async getDetail(){
      const result = await Model.getDetail({
        isQuery:1,  //是否是查询类 0-否 1-是
        requestData: {
          tnSbssnrpzid: this.$route.query.tnSbssnrpzid
        }
      })
      if(result.state === '1'){
        this._selectChange(result.data.tcXxxlxbm, 1, 2)
        this._selectChange(result.data.tcEwmdlbm, 2, 2)
        this.bindData = JSON.parse(JSON.stringify(result.data))
        this.bindData.aqscSbssgjList = this.bindData.aqscSbssgjList.sort((a,b) => a.tnXh - b.tnXh)
        let gjList = this.bindData.aqscSbssgjList
        let length = gjList && gjList.length
        this.history = JSON.parse(JSON.stringify(gjList))//获取详情后可以返回选择
        if(length){
          let tcMxlx = gjList[length-1].tcMxlx
          let tnDyywpc = gjList[length-1].tnDyywpc
          await this.getEquipConfig(tcMxlx, undefined, tnDyywpc)//获取挂接列表表头、列表信息项
          this.checked = [gjList[length-1].tnYwpc]//关联具体选择项
        }else{
          this.bindData.aqscSbssgjList = [{tcGjid: '', tnXh: 0}]//绑定一条空数据，否则报错
        }
        this.$forceUpdate()
      }
    },
  },
  watch: {
    relatedOptions: {
      deep: true,
      handler(val) {
        this.$forceUpdate()
      }
    },
    selection: {
      deep : true,
      handler(val){
        if(val.length > 1){
          this.$alert(`只能挂接一条信息，请重新选择！`)
          this.$refs.table.toggleRowSelection(this.selection[1], false)
        }
      }
    }, 
    checked: {
      deep: true,
      handler(val){
        this.checkSelected()
      }
    }
  }
}
</script>
