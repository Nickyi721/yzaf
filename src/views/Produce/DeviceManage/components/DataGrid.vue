<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="创建单位" prop="tcCjdwmc" min-width="150px"></el-table-column>
      <el-table-column label="设备类型" prop="tcXxxlxmc" min-width="150px"></el-table-column>
      <el-table-column label="创建人" prop="tcCjrmc" width="150px"></el-table-column>
      <el-table-column label="创建时间" prop="tdCjsj" width="150px"></el-table-column>
      <el-table-column label="备注" prop="tcBz" width="150px"></el-table-column>
      <el-table-column label="操作" prop="tnSbzt" width="150px">
        <template slot-scope="scope">
          <!-- 1：启用 0：停用 -->
          <el-switch 
            v-model="scope.row.tnSbzt"
            active-text="启用"
            :active-value=1
            inactive-text="停用"
            :inactive-value=0
            @change=" (val) => _SwitchChange(val, scope.row.tnSbsslrtoid)"
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
import Mixin from "@mixins";

export default {
  mixins: [Mixin.Grid],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rowClickStyle: true
    };
  },
  methods: {
    _SwitchChange(val, id) {
      this.$emit("switchChange", val, id);
    }
  }
};
</script>