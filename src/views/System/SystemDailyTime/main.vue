<template>
    <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000405" module="normal" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <!-- <DataFilter ref="dataFilter" @query="_DataFilterQuery"/> -->
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton icon="add" text="设置检查时间" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @selection-change="_DataGridSelectionChange" @dblclick="_DataGridDbclick">
      <!-- <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/> -->
    </DataGrid>

    <CustomDialog
      top="20vh"
      :title='isChange === false?"检查时间设置":"修改设置时间"'
      :visible="dlgAddVisble"
      @close="_DlgClose"
      @open="_DlgAddOpen"
    >
      <TimeSet ref="timeset" style="height: 250px" :row="rowData" @query="TimeSet"/>
    </CustomDialog>
  </CustomView>
</template>

<script>
//共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import TimeSet from './components/TimeSet.vue'

export default {
    name: 'FinanceDailySafety',
    mixins: [
        Mixin.init, 
        Mixin.page,
    ],
    components: {
        DataFilter,
        DataGrid,
        TimeSet        
    },        
    data() {
        return{
            currentOrg:{},   
            list: [],
            query: {},
            dlgAddVisble: false,
            selection: [],
            rowData:{},
            deleteList: [],   // 删除数组
            tcSsdwbm: '',   //单位编码
            tcSsdwmc: '',    //单位名称
            search: [],     //查询条件
            startTimeArr: [],
            endTimeArr: [],
            isChange: false
        }
    },
    methods: {
        $init() {
          this.getSetTime()
        },
        // 点击树
        _OrgTreeClick(node) {
          this.currentOrg = node
          this.tcSsdwbm = node.id
          this.tcSsdwmc = node.name
          this.startTimeArr = []
          this.endTimeArr = []
          this.getSetTime()       
        },
        // 加载树
        _OrgTreeLoaded(node) {
          this.currentOrg = node
          this.tcSsdwbm = node.id
          this.tcSsdwmc = node.name
          this.getSetTime(this.tcSsdwbm)       
        },
        // 查询条件
        _DataFilterQuery(search) {
          this.search = search
          this.search.tcSsdwbm = this.tcSsdwbm
          this.search.tcSsdwmc = this.tcSsdwmc
          this.getFilterSetTime()
        },
        _ButtonAddClick() {
          this.dlgAddVisble = true
        },
        _ButtonDeleteClick() {
          if (this.selection.length) {
                this.$confirm('是否删除选中行?').then(() => {
                  this.deleteTimeSet()
                }).catch(() => {})
              } else {
                this.$alert('请选择数据').catch(() => {})
              }          
        },
        _DataGridSelectionChange(selection) {
          this.selection = selection
          this.deleteList = this.selection.map(item => item.tnRcaqjcsjpzid)
        },
        _DlgAddOpen() {

        },
        _DlgClose() {
          this.$refs.timeset.clearSet()
          this.dlgAddVisble = false
          this.isChange = false
        },
        // 保存时间设置
        TimeSet(query) {
          this.query = query
          // this.startTimeArr.push(query.tdKssj)
          // this.endTimeArr.push(query.tdJssj)
          if(this.endTimeArr){
            for(let i=0;i<this.endTimeArr.length;i++){
              if(query.tdKssj <= this.endTimeArr[i] && query.tdJssj >= this.startTimeArr[i]){
                this.$message({
                  showClose: true,
                  message: '时间设置不能有交集',
                  type: 'warning'
                });              
                // this.startTimeArr.pop()
                // this.endTimeArr.pop()
                return
              }
            }            
          }

          this.query.tcSsdwbm = this.tcSsdwbm
          this.query.tcSsdwmc = this.tcSsdwmc
          this.saveTimeSet()
        },
        // 双击表格修改时间
        _DataGridDbclick(row) {
          // console.log(this.list.filter(item=>item.tnRcaqjcsjpzid!=row.tnRcaqjcsjpzid).map(item=>item.tdJssj))
          this.endTimeArr = this.list.filter(item=>item.tnRcaqjcsjpzid!=row.tnRcaqjcsjpzid).map(item=>item.tdJssj)
          this.startTimeArr = this.list.filter(item=>item.tnRcaqjcsjpzid!=row.tnRcaqjcsjpzid).map(item=>item.tdKssj)
          this.dlgAddVisble = true
          this.rowData = row
          this.isChange = true
          this.$nextTick(()=>{
            this.$refs.timeset.updata()
          })
        },

        // 查询设置时间
        async getSetTime(tcSsdwbm) {
          const result = await Model.getSetTime({
            isQuery: 1,  //是否是查询类 0-否 1-是
            cdId:'00040207', //菜单ID
            requestData: {
              tcSsdwbm: this.tcSsdwbm
            }
          })          
          if(result.data){
            this.list = result.data
            let start = []
            let end = []
            this.list.forEach(item => {
              start.push(item.tdKssj)
              end.push(item.tdJssj)
            })
            for(let i=0;i<start.length;i++){
              if(this.startTimeArr.indexOf(start[i]) == -1){
                this.startTimeArr.push(start[i])
              }
            }
            for(let i=0;i<end.length;i++){
              if(this.endTimeArr.indexOf(end[i]) == -1){
                this.endTimeArr.push(end[i])
              }
            }
          }
        },
        // 条件查询
        async getFilterSetTime(tcSsdwbm) {
          const result = await Model.getSetTime({
            isQuery: 1,  //是否是查询类 0-否 1-是
            cdId:'00040207', //菜单ID
            requestData: this.search
          })          
          if(result.data){
            this.list = result.data
          }
        },        
        // 保存设置时间
        async saveTimeSet() {
          const result = await Model.saveTimeSet({
            isQuery: 0,  //是否是查询类 0-否 1-是
            cdId:'00040207', //菜单ID
            requestData: {
              update:[this.query]
            }
          })
          if(result.state === '1'){
            this.$msgbox({
              message: '保存成功',
              type: 'success',
              duration: 1000,
              showClose: true,
            })
          }
          this.dlgAddVisble = false
          this.getSetTime()
        },
        // 删除时间设置
        async deleteTimeSet() {
          const result = await Model.deleteTimeSet({
            isQuery: 0,  //是否是查询类 0-否 1-是
            cdId:'00040207', //菜单ID
            requestData: {
              deletelist:this.deleteList
            }
          })
          if(result.state === '1'){
            this.$msgbox({
              message: '删除成功',
              type: 'success',
              duration: 1000,
              showClose: true,
            })
            this.startTimeArr = []            
            this.endTimeArr = []
            this.getSetTime()            
          }
        },        
    }
}
</script>
