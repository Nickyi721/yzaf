<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="add" text="确定选择" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>    
    <!-- 数据表格 -->
    <DataGrid ref='dangerList' :list="list" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "../model.js";

import DataFilter from './DataFilter.vue'
import DataGrid from './DataGrid.vue'

export default {
  mixins: [Mixin.init,Mixin.page],
  components:{
      DataFilter,
      DataGrid
  },
  data() {
    return {
      list: [],
      bindData: {},
      selection: [],
      selected: []
    };
  },
  methods: {
    $init() {
      this.getListData()      
    },
    // 点击查询按钮
    _DataFilterQuery(query) {
        this.bindData = query
        this.getListData()
    },
    _DataGridSelectionChange(selection) {
        this.selection = selection
    },
    _ButtonAddClick() {
        if(this.selection.length){
            this.$confirm('是否选择所选数据').then(()=>{
                this.$emit('selected', this.selection)
            }).catch(err=>{})
        }else{
            this.$msgbox({
                type:'warning',
                message:'请选择数据'
            })
        }
    },
    // 事件-改变每页的数量
    _PageRowsChange(num) {
      this.pageRows = num
      this.pageNum = 1
      this.selection = []
      this.selected = []
      this.getListData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.selection = []
      this.selected = []      
      this.getListData()
    },    
    async getListData() {
      const result = await Model.getListData({
        rows: this.pageRows,
        pageNum: this.pageNum,          
        isQuery: 1,
        cdId: "00040802",
        requestData: {
            tcXm: this.bindData.tcXm
        }
      });
      if (result) {
        this.list = result.data.list;
        this.pageTotal = result.total
      }
    },
    reset() {
      this.$refs.dangerList.clearSelect()
    },    
  }
};
</script>

<style>

</style>

