<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" />
    </div>

    <!-- 数据表格 -->
    <DataGridDaily v-if="this.query.tnRwlx === 0" :canEdit="canEdit" :headerData='list' :data="dailyData" @dblclick="_DataGridDblClick"></DataGridDaily>
    <DataGrid v-if="this.query.tnRwlx === 1" :canEdit="canEdit" :headerData='list' :data="tableData"></DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Moment from 'moment'
import Model from './model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import DataGridDaily from './components/DataGridDaily.vue'
export default {
  name: 'InfoReportCount',
  mixins: [
    Mixin.init,
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
    DataGridDaily
  },
  data () {
    return {
      list: [],
      selection: [],
      query: {},
      currentOrg: {},
      canEdit: false,
      tableData: [],
      dailyData: []
    }
  },
  methods: {
    $init () {
      // this.getTemplateList() 
      this.getTaskList()
    },
    // 双击进入日常任务详情
    _DataGridDblClick (row) {
      this.$router.push({
        path:'/info/report/count/dailyDetail',
        query: {
          tnRwpc:row.tnRwpc,
          tcDwdm:row.tcDwdm,
          tcMbid:this.query.tcMbid,
          tnRwmc:this.query.tnRwmc
        }
      })
    },
    // 查询
    _DataFilterQuery (query) {
      this.query = query
      if(this.query.tnRwlx === 1){
        this.getTemplateTj()
      }
      if(this.query.tnRwlx === 0){
        this.getDailyTemplateTj()
      }
    },
    // 获取非日常任务表格数据
    async getTemplateTj () {
      this.tableData = []
      const result = await Model.getTemplateTj({
        isQuery: 1,
        cdId: '0004030305',
        requestData: {
          tnBbtoid: this.query.tnBbmc,
          tnRwid: this.query.tnRwmc
        }
      })
      this.getTableHead(this.query.tcMbid, this.query.tnRwmc)
      if(result.data && result.data.length !== 0) {
        const Obj = this.arrayObject(result.data, 'tcTbdwdm')
        const ObjKey = Object.keys(Obj)
        const typeLength =  Object.keys(Obj).length
        for(let i=0;i<typeLength;i++) {
          this.tableData.push(Obj[ObjKey[i]])
        }
      }
    },
    // 获取日常任务表格数据
    async getDailyTemplateTj () {
      this.tableData = []
      const result = await Model._getDailyTemplateTj({
        isQuery: 1,
        cdId: '0004030305',
        requestData: {
          tnRwpc: this.query.tnRwpc
        }
      })
      if(result.data && result.data.length !== 0) {
        this.dailyData = result.data
      }
    },
    // 对象数组分组
    arrayObject(objectArray,key) {
      var newObj = {}; 
      objectArray.forEach(function (obj) { 
        var array = newObj[obj[key]] || []; 
        array.push(obj);
         newObj[obj[key]] = array; 
      }); 
      return newObj;
    },
    // 加载列表头部
    async getTableHead(tnBbtoid, tnRwid) {
      this.list = []
      const result = await Model.getTableHeader({
        tcZdybbid: tnBbtoid
      })
      this.list = result.data.xxglZdybbtiDto
      this._setListOrder(this.list)
      // 加载表格主体
      this.tableData = this.tableData.map(arr => {
        let obj = {}
        arr.forEach(item => {
          if(item.tnSzzxsj||item.tnSzzxsj===0){
            value=item.tnSzzxsj
          }
          if(item.tcZfclxsj||item.tcZfclxsj===0){
            value=item.tcZfclxsj
          }
          if(item.tnFdxsj||item.tnFdxsj===0){
            value=item.tnFdxsj
          }
          let value = item.tcZfclxsj || item.tnSzzxsj || item.tnFdxsj
          if (typeof item.tcZfclxsj === 'string') {
            let newArr = item.tcZfclxsj.split(',')
            // newArr = newArr.filter((item,index) => {
            //   return index%2 !== 0
            // })
            // value = newArr.toString()
          }
          obj[item.tnBbtiid] = value
          obj['tcDwmc'] = item.tcDwmc
        })
        return obj
      })
    },
    _setListOrder (list) {
      let resulData = []
      list.forEach((item, index) => {
        item.rowId = index
        item.canUse = !!(item.tnSfmj && item.tcLrfs === '0' && (item.tnSjlx === 0 || item.tnSjlx === 1))
        item.tcBblsz = item.tcBblsz && item.tcBblsz.replace(/加/g, '+')
        resulData.push(item)
        for (let i = 0; i < item.zdybbtiList.length; i++) {
          let ceil = item.zdybbtiList[i]
          ceil.pId = index
          ceil.tcBblsz = ceil.tcBblsz && ceil.tcBblsz.replace(/加/g, '+')
          ceil.canUse = !!(ceil.tnSfmj && ceil.tcLrfs === '0' && (ceil.tnSjlx === 0 || ceil.tnSjlx === 1))
          resulData.push(ceil)
        }
      })
      resulData.forEach((item, index) => {
        item.tnLxh = String.fromCharCode(65 + index)
      })
      resulData.filter(item => item.rowId)
      list.forEach(item => {
        item.zdybbtiList = resulData.filter(ceil => {
          return item.rowId === ceil.pId
        })
      })
    },
    // 报表下拉列表
    // async getTemplateList() {
    //   const result = await Model.getTemplateList({
    //     isQuery: 1,
    //     cdId: '0004030305',
    //     requestData: {}
    //   })
    //   if(result.data) {
    //     this.query.tnBbmc = result.data[0].tcZdybbid
    //     // 任务下拉
    //     this.getTaskList()
    //   }
    // },
    // 任务下拉列表
    async getTaskList() {
      const result = await Model.getTaskList({
        isQuery: 1,
        cdId: '0004030305',
        requestData: {
          tnLx: 1
        }
      })
      if(result.data) {
        this.query.tnRwmc = result.data[0].tnRwid
        // this.getTemplateTj()
      }
    }
  },
  // activated () {
  //   this.$init()
  // }
}
</script>
