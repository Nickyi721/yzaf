<template >
  <div
    class="common-grid"
    ref="container"
    :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}"
  >
    <el-table
      class="grid-table"
      header-cell-class-name="table-hd"
      stripe
      :border="border"
      highlight-current-row
      size="mini"
      height="100%"
      :data="list"
      :row-class-name="rowClickStyle ? 'click-row' : ''"
      @selection-change="_TableSelectionChange"
      @row-dblclick="_TableDblClick"
    >
      <el-table-column type="index"></el-table-column>

      <el-table-column
        v-for="(col, index) in config"
        v-if="col.tnXxxlrfs !== 0 && col.tnXxxlrfs !== 6"
        align="center"
        :key="index"
        :label="col.tcXxxmc"
        :prop="col.tnXfaqjbxxszid.toString()"
        :min-width="260 + 'px'"
      >
        <template slot-scope="scope">
          <el-button
            v-if="col.tcMxlx"
            size="mini"
            type="primary"
            @click.stop="_ViewDetail(col, scope.row)"
          >查看明细</el-button>
          <p v-else>{{ scope.row[col.tnXfaqjbxxszid.toString()] }}</p>
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
  watch: {
    config(val) {}
  },
  data() {
    return {
      rowClickStyle: true
    };
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    config: {
      type: Array,
      default: () => []
    },
    currentOrg: {
      type: Object,
      default: () => []
    },
    detailType: {
      type: String,
      default: ""
    },
    currentType: {
      type: String,
      default: ""
    },
    detailTypeText: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    currentTypeText() {
      let str;
      if (this.currentType === "030106") {
        str = "运钞车数量";
      } else if (this.currentType === "030107") {
        str = "枪支数量";
      }
      return str;
    }
  },
  methods: {
    _ViewDetail(col, row) {
      this.$router.push({
        path: "/firecontrol/info/list",
        query: {
          detailType: col.tcMxlx,
          detailTypeText: col.tcXxxmc,
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
          tnYwpc: row.tnYwpc,
          view: this.disabled,
          tipName: col.tcXxxmc
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.grid-detail {
  display: block;
  height: 100%;
  text-align: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
