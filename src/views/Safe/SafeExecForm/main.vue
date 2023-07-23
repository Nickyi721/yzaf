<template>
    <CustomView>    
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter :jhztTypes="jhztTypes" :jhtbTypes='jhtbTypes' :jhlxs="jhlxs" ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <!-- <JsonExcel :data="exportList" :fields="exportFields" name="filename.xls">导出</JsonExcel> -->
        <!-- <CustomButton icon="export" text="导出" @click="_ExportClick"/> -->
        <!-- <CustomButton icon="add" text="新增" @click="_ButtonClick('add')"/> -->
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import Moment from 'moment'
// import ExportToExcel from "@commons/exportToExcel.js"

export default {
  name: 'SafeExecForm',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
  },
  data () {
    return {
      jhztTypes: [
        {tcSjubm:'',tcSjnr:'全部'},
        {tcSjubm:'0',tcSjnr:'进行中'},
        {tcSjubm:'1',tcSjnr:'完结'},
        {tcSjubm:'2',tcSjnr:'无效'}
      ],
      jhtbTypes: [
        {tcSjubm:'',tcSjnr:'全部'},
        {tcSjubm:'0',tcSjnr:'未填'},
        {tcSjubm:'1',tcSjnr:'已填'},
      ],
      jhlxs: [
        {tcSjubm:'0',tcSjnr:'专项'},
        {tcSjubm:'1',tcSjnr:'例项'}
      ],
      // 查询条件
      query: {
        tnJhzt: '0',
        tnJhlx: '0',
        tnJhztMc:'',
        tcJhmc:'',
        startTime:'',
        endTime:'',
        time:'',
      },
      // 列表
      list: [],
      isFirstEnter: true,
      // exportList: [],
      // exportFields: {},
      // downloadList: [],
      // fileName: '安全检查计划',
      // config: {
      //   _this: this
      // },
      // title: [],
    }
  },
  methods: {
    $init(){
      this.getListData()
    },
    // 事件-条件查询
    _DataFilterQuery (params) {
      this.query = params
      this.getListData()
    },
    // 事件-双击表格行列
    _DataGridDblClick (row) {
      this.currentRow = row
      const now = Moment(Date.now()).format('YYYY-MM-DD')
      if(now > row.tcJhjzsj && row.tbzt !== '1'){
        this.$alert(`当前计划已过期，不能进行录入操作！！！`)
      }else{
        this.$router.push({ path: '/safe/exec/form/commit',query:{row:JSON.stringify(row)}})
      }
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getListData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    // _ExportClick() {
    //   let exportList = []
    //   let thList = document.getElementsByTagName('thead')[0].childNodes[0].childNodes //表头
    //   let idx = [] //用于表头和表体一一对应
    //   thList.forEach((v, j) => {
    //     let text = v.innerText
    //     if(!!text && text!='#') {
    //       this.title.push(v.innerText)
    //       idx.push(j)
    //     }
    //   })
    //   let trList = document.getElementsByTagName('tbody')[0].childNodes  //tr
    //   trList.forEach((v, j) => {
    //     if(j < trList.length-1){
    //       let temp = {}
    //       let tdList = v.childNodes
    //       tdList.forEach((a, i) => {
    //         let text = a.innerText
    //         idx.forEach(arr => {
    //           if(i=== arr) {
    //             let key = thList[arr].innerText
    //             temp[key] = text
    //           }
    //         })
    //       })
    //       exportList.push(temp)
    //     }
    //   })
    //   // this.list.forEach((item, i) => {
    //   //   const keys = Object.keys(this.titleAlias)
    //   //   let tempObj = {}
    //   //   keys.forEach((v, j)=> {
    //   //     if(item.hasOwnProperty(v)){
    //   //       const prop = Object.getOwnPropertyDescriptor(item, v)
    //   //       Object.defineProperty(tempObj, this.titleAlias[v], prop)
    //   //       if(v === 'tnJhzt'){
    //   //         if(item[v] === 0) {
    //   //           Reflect.set(tempObj, this.titleAlias[v], '进行中')
    //   //         }
    //   //         if(item[v] === 1) {
    //   //           Reflect.set(tempObj, this.titleAlias[v], '完结')
    //   //         }
    //   //         if(item[v] === 2) {
    //   //           Reflect.set(tempObj, this.titleAlias[v], '无效')
    //   //         }
    //   //       }
    //   //       if(v === 'tbzt'){
    //   //         if(item[v] == 99 || item[v] == 0) {
    //   //           Reflect.set(tempObj, this.titleAlias[v], '未填')
    //   //         }
    //   //         if(item[v] == 1) {
    //   //           Reflect.set(tempObj, this.titleAlias[v], '已填')
    //   //         }
    //   //       }
    //   //     }
    //   //   })
    //   //   exportList.push(tempObj)
    //   // })
    //   if (this.downloadList.includes(this.fileName)) {
    //     if (!window.confirm("您刚刚已经下载过改文件了哦，需要重新下载吗？")){
    //       return false;
    //     }
    //   }
    //   var isrepeat = true;
    //   for(let key in exportList[0]){
    //     if(exportList[0][key] !== key){
    //       isrepeat = false;
    //     }
    //   }
    //   if(isrepeat){
    //     exportList.shift()
    //   }
    //   ExportToExcel(exportList, this.config);
    //   // 把已下载的表名存入已下载列表中
    //   this.downloadList.push(this.fileName);
    // },
    // 获取列表数据
    async getListData () {
      const result = await Model.getListData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004060201', //菜单ID
        requestData: this.query
      })
      if (result && result.data && result.data.list) {
        this.list = result.data.list
        this.list.forEach(el => {
          if(el.tdCjsj) {
            el.tdCjsj = Moment(el.tdCjsj).format('YYYY-MM-DD')
          }
          if(el.yjcrybList){
            el.tcYjcrymc = el.yjcrybList.map(el=>el.tcYjcrymc).join(',')
            el.count = el.yjcrybList.length
          }
        })
        this.pageTotal = result.data.total
      }
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getListData()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
