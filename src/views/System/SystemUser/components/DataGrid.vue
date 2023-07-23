<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" 
        :border="border" 
        highlight-current-row 
        header-cell-class-name="table-hd" 
        stripe 
        size="mini" 
        height="100%" 
        :data="list" 
        :row-class-name="rowClickStyle ? 'click-row' : ''" 
        @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column label="用户账户" prop="tcYhzh" width="150px"></el-table-column>
      <el-table-column label="用户名称" prop="tcYhmc" width="150px"></el-table-column>
      <el-table-column label="所属单位" prop="tcDwmc" min-width="200px"></el-table-column>
      <el-table-column label="用户角色" prop="role" width="200px"></el-table-column>
      <el-table-column label="创建时间" prop="tdCjsj" width="150px"></el-table-column>
      <el-table-column label="创建人" prop="tcCjr" width="150px"></el-table-column>
      <el-table-column label="状态" fixed="right" width="150px">
        <template slot-scope="scope">
          <el-switch 
            v-model="scope.row.tnZt"
            active-text="启用"
            :active-value=0
            inactive-text="停用"
            :inactive-value=1
            @change=" (val) => _SwitchChange(val, scope.row.tnYhid)"
          >
          </el-switch>
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
    },
  },
  data () {
    return{
      rowClickStyle:true
    }
  },
  methods: {
    _SwitchChange(val, tnYhid) {
      this.$emit('switch-change', val, tnYhid)
    }
  }
}
</script>