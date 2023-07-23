<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      stripe
      :border="border" highlight-current-row
      :data="list"
      size="mini"
      height="100%"
      class="grid-table"
      header-cell-class-name="table-hd" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="信息标题" prop="tcXxbt"></el-table-column>
      <el-table-column label="案件类型" prop="tcXxlxmc"></el-table-column>
      <el-table-column label="案发单位" prop="tcSbdwmc"></el-table-column>
      <el-table-column label="案发部位" prop="tcAfbwmc"></el-table-column>
      <el-table-column label="案发部位所属" prop="tcAfbwssmc"></el-table-column>
      <el-table-column label="事件状态" prop="tnSjztmc">
        <template slot-scope="scope">
          <div>
          <p v-if="scope.row.tnSjzt=='04020401'">
              <span style="color:#FF5E0F">初报</span>
          </p>
           <p v-if="scope.row.tnSjzt=='04020402'">
              <span style="color:#FFBC00">续报</span>
          </p>
           <p v-if="scope.row.tnSjzt=='04020403'">
              <span style="color:#17AF49">完结</span>
          </p>
          <p v-if="scope.row.tnSjzt=='04020404'">
               <span style="color:#FF5549">重新填报</span>
          </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="案发时间" prop="tdAfrq"></el-table-column>
      <el-table-column label="上报时间" prop="tdSbsj"></el-table-column>
      <el-table-column label="发布单位" prop="tcDwmc"></el-table-column>
      <el-table-column label="过往事件" prop="tnGwsjmc"></el-table-column>
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
  data () {
    return {
      rowClickStyle: true,
      selection: [],
    }
  },
}
</script>

<style lang="css">
</style>
