<template >
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange" @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="是否故障" prop="tnSfgz">
        <template slot-scope="scope">
          {{scope.row.tnSfgz==1?'有故障':'无故障'}}
        </template>
      </el-table-column>
      <el-table-column v-if="detailType" width="100px">
        <el-button size="mini" type="primary" slot-scope="scope" @click.stop="_ViewDetail(scope.row)">查看明细</el-button>
      </el-table-column>
      <el-table-column v-for="(col, index) in config" :key="index" :label="col.tcXxxmc" :prop="col.tnAfabszid.toString()" :min-width="300 + 'px'"></el-table-column>
      <el-table-column v-if="currentTypeText" :label="currentTypeText">
        <template slot-scope="scope">
          {{scope.row['-10000']}}
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
  watch: {
    config (val) {

    }
  },
  data () {
    return {
      rowClickStyle: true
    }
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
      default: ''
    },
    currentType: {
      type: String,
      default: ''
    },
    detailTypeText: {
      type: String,
      default: ''
    }
  },
  computed: {
    currentTypeText () {
      let str
      if (this.currentType === '030106') {
        str = '运钞车数量'
      } else if (this.currentType === '030107') {
        str = '枪支数量'
      }
      return str
    }
  },
  methods: {
    _ViewDetail (row) {
      this.$router.push({
        path: '/finance/equip/list',
        query: {
          detailType: this.detailType,
          detailTypeText: this.detailTypeText,
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
          tnYwpc: row.tnYwpc
          // tnYwpc: row.tnYwpc,
        }
      })
    }
  }
}
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
