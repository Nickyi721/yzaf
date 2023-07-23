<template>
  <CustomView style="height:500px">
    <!-- 数据表格 -->
    <CommonOrgTree slot="side" ref="commonTree" show-checkbox check-strictly content fnCode="000403" :check-list="treeSelectedIds" @check-change="_OrgTreeCheckChanged"/>
    <DataGrid ref='table' :list="list" :selectedIds='selectedIds' @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange" @/>
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataGrid from './components/DataGrid.vue'

export default {
  mixins: [
    Mixin.page,
    Mixin.init, 
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      list: [],
      selection:[],
      currentRow:'',
      Dwdm:[],
      Dwmc:[]
    }
  },
  props:['selectedIds','treeSelectedIds'],
  methods: {
    // 页面初始化
    $init(options) {
      this.getListData()
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
    queryHandle (bindData) {

    },
    controlHandle (type, payload) {

    },
    // clearGrandChildSelection(){      
    //   this.$refs.table.clearSelection()
    //   this.$refs.commonTree.clearSelection()
    // },
    //表格勾选事件
    _DataGridSelectionChange (selection) {
      if(this.Dwdm.length>0){
        let _this = this
        this.$refs.table.clearSelection()
        this.$message({
          // message:result.msg + ", 正在为您跳转!",
          message:"已选择单位信息，不能同时选择群组",
          type:"success",
          duration:500,
          customClass: "middle",
        })
      }
      else{
        this.selection = selection
        this.$emit("selection-change",this.selection)
      }
    },
    // 勾选事件
    _OrgTreeCheckChanged(data,check){
      
      if(this.selection.length>0){
        let _this = this
        _this.$refs.commonTree.clearSelection()
        this.$message({
          // message:result.msg + ", 正在为您跳转!",
          message:"已选择群组，不能同时选择单位信息",
          type:"success",
          duration:500,
          customClass: "middle",
        })
      }else{
        
        if(check){
          this.Dwdm.push(data.id)
          this.Dwmc.push(data.name)
        }
        else{
          for(let i=0;i<=this.Dwdm.length;i++){
            if(this.Dwdm[i]===data.id){
              this.Dwdm.splice(i,1)
            }
          }
          for(let i=0;i<=this.Dwmc.length;i++){
            if(this.Dwmc[i]===data.name){
              this.Dwmc.splice(i,1)
            }
          }
        }
        this.$emit("tree-selection-change",this.Dwdm,this.Dwmc)
      }
    },
    async getListData () {
      const result = await Model.getListData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'00040301', //菜单ID
        requestData: {
        }
      })
      if (result) {
        this.list = result.data
        this.pageTotal = result.total
      }
    },
  }
}
</script>
