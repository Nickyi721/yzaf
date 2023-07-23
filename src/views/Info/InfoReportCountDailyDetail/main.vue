<template>
  <CustomView :location="[{ text: '统计报表'}]">
    <DataGrid :canEdit="canEdit" :headerData='list' :info="tableData"></DataGrid> 
  </CustomView>  
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Moment from 'moment'
import Model from './model.js'

// 页面组件
import DataGrid from './components/DataGrid.vue'
export default {
  mixins: [
    Mixin.init,
  ],
  components: {
    DataGrid
  },
  data () {
    return {
      list: [],
      tableData: [],
      infoData: [],
      canEdit: false,
      query: {}
    }
  },
  methods: {
    $init () {
      this.getTemplateTjRcrw()
    },
    async getTemplateTjRcrw () {
      this.tableData = []
      const result = await Model._getTemplateTjRcrw({
        isQuery: 1,
        cdId:'0004030305',
        requestData: {
          tnRwpc: this.$route.query.tnRwpc,
          tcTbdwdm: this.$route.query.tcDwdm
        }
      })
      this.getTableHead(this.$route.query.tcMbid, this.$route.query.tnRwmc)      
      if(result.data && result.data.length !== 0) {
        const Obj = this.arrayObject(result.data, 'rwsj')
        const ObjKey = Object.keys(Obj)
        const typeLength =  Object.keys(Obj).length
        for(let i=0;i<typeLength;i++) {
          this.tableData.push(Obj[ObjKey[i]])
        }
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
        let value='' 
        arr.forEach(item => {
          let value = item.tnSzzxsj
          if (typeof item.tcZfclxsj === 'string') {
            let newArr = item.tcZfclxsj.split(',')
            newArr = newArr.filter((item,index) => {
              return index%2 !== 0
            })
            value = newArr.toString()
          }
          obj[item.tnHh] = value
          obj['rwsj'] = item.rwsj
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
  }
}
</script>
