<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="信息标题" prop="tcXxbt" min-width="200px"></el-table-column>
      <el-table-column label="信息类型" prop="tcLxmc" width="200px"></el-table-column>
      <el-table-column label="发布单位" prop="tcDwmc" width="200px"></el-table-column>
      <el-table-column label="发布时间" prop="tdFbsj" width="150px"></el-table-column>
      <el-table-column label="创建人" prop="tcCjrmc" width="100px"></el-table-column>
      <el-table-column label="审批人" prop="tcSprmc" width="100px"></el-table-column>
      <el-table-column label="信息状态" prop="tnDqbz" width="100px">
        <template slot-scope="scope">                   
         <p v-if="scope.row.tnDqbz">
              <span class="g_green"></span>已阅
          </p>
          <p v-else-if="!scope.row.tnDqbz">
              <span class="g_orange"></span>待阅
          </p>        
        </template>
      </el-table-column>
      <el-table-column label="办理状态" prop="tnBlbz" width="100px">
        <template slot-scope="scope">                   
         <p v-if="scope.row.tnBlbz">
            <span class="g_orange_b"></span>已办
          </p>
          <p v-else-if="scope.row.tnBlbz===0">
            <span class="g_green_b"></span>待办
          </p>        
        </template>
      </el-table-column>
      <el-table-column label="是否需要回复" prop="tnSfhf" width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnSfhf">
              是
          </p>
          <p v-else-if="!scope.row.tnSfhf">
              否
          </p>
        </template>
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
    }
  },
  data (){
    return{
      rowClickStyle:true
    }
  }
}
</script>