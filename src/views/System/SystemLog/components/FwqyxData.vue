<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="服务器运行情况表id" prop="tnFwqyxqkid" width="200px"></el-table-column>
      <el-table-column label="IP" prop="tcIp" width="300px"></el-table-column>
      <el-table-column label="端口" prop="tcPort" width="100px"></el-table-column>
      <el-table-column label="测试时间" prop="tdCssj" min-width="250px"></el-table-column>
      <el-table-column label="是否连通" prop="tnSflt" width="150px">
        <template slot-scope="scope">
          {{scope.row.tnSflt==1?'是':'否'}}
        </template>                
      </el-table-column>
      <el-table-column label="类型" prop="tnLx" width="200px">
        <template slot-scope="scope">
          {{scope.row.tnLx | tnLxFilter}}
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
  filters: {
    tnLxFilter(item) {
        if(item == '1'){
            return 'SLB'
        }
        if(item == '2'){
            return 'PC后台服务'
        }
        if(item == '3'){
            return 'PC后台nginx'
        }
        if(item == '4'){
            return 'APP后台服务'
        }
        if(item == '5'){
            return 'APP后台服务nginx'
        }
        if(item == '6'){
            return 'APP-PC后台服务'
        }
    }    
  },
  data () {
    return{
      rowClickStyle:true
    }
  }
}
</script>