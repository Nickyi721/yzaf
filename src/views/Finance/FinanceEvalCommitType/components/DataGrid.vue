<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
      <el-table 
        ref="table"
        stripe 
        :border="border" highlight-current-row 
        :data="list" 
        size="mini" 
        class="grid-table" 
        header-cell-class-name="table-hd" 
        :row-class-name="rowClickStyle ? 'click-row' : ''" 
        @selection-change="_TableSelectionChange" 
        >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="tcSjnr" label="评分表名称">
          
        </el-table-column>
      </el-table>
      <div class="grid-page" ref="page" v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
</template>

<script>
import Mixin from '@mixins'
export default {
  mixins: [Mixin.Grid],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    selectedIds:{
      type: Array
    }
  },
  data (){
    return{
      rowClickStyle:true
    }
  },
  methods: {
    clearSelection(){
      this.$refs.table.clearSelection()
    },
    changeSelection() {
      this.clearSelection()
      let selections = []
      this.list.forEach(el => {
        this.selectedIds.map(item => item.tcXxxlx).forEach(id => {
          if(el.tcSjubm === id){
            selections.push(el)
          }
        })
      })   
      selections.forEach(lt=>{
        this.$nextTick(()=>{
          this.$refs.table.toggleRowSelection(lt,true)
        })
      })
    },
  },
  mounted () {
    this.changeSelection()
  },
  watch:{
    selectedIds: {
      handler () {
        this.changeSelection()
      },
      deep: true
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
