<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      ref="table"
      stripe
      border
      :data="tableList"
      size="mini"
      height="100%"
      class="grid-table"
      header-cell-class-name="table-hd" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="群组名称" prop="tcQzmc" width="150px"></el-table-column>
      <el-table-column label="群组说明" prop="tcQzsm" ></el-table-column>
      <el-table-column label="单位名称" prop="tcDwmc" min-width="150px"></el-table-column>
    </el-table>
    <div class="grid-page" ref="page" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Grid,Mixin.init],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    selectedIds:{
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rowClickStyle: true,
      selection: [],
      tableList:[]
    }
  },
  methods: {
    $init(options) {
    },
    clearSelection(){
      if(this.$refs.table){
        this.$refs.table.clearSelection()
      }
    },
    changeSelection(){
      this.clearSelection()
      let selections = []
      this.tableList.forEach(el=>
        this.selectedIds.forEach(id => {
          if(el.tnQzglid.toString()===id){
            selections.push(el)
          }
        })
      )
      let unselections = this.tableList.filter(el=>{
        if(!selections.includes(el))
          return el
      })
      selections.forEach(lt=>{
        this.$nextTick(()=>{
          this.$refs.table.toggleRowSelection(lt,true)
        })
      })
      unselections.forEach(lt=>{
        this.$nextTick(()=>{
          this.$refs.table.toggleRowSelection(lt,false)
        })
      })
    }
  },
  watch:{
    selectedIds: {
      immediate:true,
      handler () {
        this.changeSelection()
      },
      deep: true
    },
    list: {
      immediate:true,
      handler (val){        
        this.tableList = val
        this.changeSelection()
      },
      deep: true
    }
  }
}
</script>

<style lang="css">
</style>
