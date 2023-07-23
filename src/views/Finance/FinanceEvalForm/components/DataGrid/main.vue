<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table 
      stripe 
      :border="border" highlight-current-row 
      :data="list" 
      size="mini" 
      class="grid-table" 
      header-cell-class-name="table-hd" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="评分表名称">
        <div slot-scope="scope" class="common-grid-cell-between">
          <span>{{scope.row.tcXxxlxmc}}</span>
          <span v-if="scope.row.tnPgztid === 1">
            <span class="eval-item"><CustomIcon name="done"/>
            <p v-if="scope.row.tcPgztmc==='未评估'">
              <span class="g_orange"></span>未评估
            </p>
            <p v-if="scope.row.tcPgztmc==='已评估'">
                <span class="g_green"></span>已评估
            </p></span>
            <span class="eval-item">满分：{{scope.row.tnPgzf}}</span>
            <span class="eval-item">得分：{{scope.row.tnPgdf}}</span>
            <span class="eval-item">扣分：{{scope.row.tnPgkf}}</span>
          </span>
          <span v-if="scope.row.tnPgztid !== 1">
            <span class="eval-item"><CustomIcon name="done"/>
            <p v-if="scope.row.tcPgztmc==='未评估'">
              <span class="g_orange"></span>未评估
            </p>
            <p v-if="scope.row.tcPgztmc==='已评估'">
                <span class="g_green"></span>已评估
            </p>
           
            </span>
            <span class="eval-item">满分：{{scope.row.tnPgzf}}</span>
          </span>
        </div>
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
  },
  data (){
    return{
      rowClickStyle:true
    }
  },
  watch: {
    
  }
}
</script>

<style lang="scss" scoped>
  .eval-item {
    display: inline-block;
    width: 70px;
  }
</style>
