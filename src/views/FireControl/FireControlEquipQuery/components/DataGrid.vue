<template >
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange" @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
       <el-table-column label="功能检查"  width="100px">
        <el-button size="mini" v-if="scope.row.tcGnjcxxxlx" slot-scope="scope" @click.stop="_ViewDetail(scope.row)">功能检查 
        </el-button>      
      </el-table-column>
      <el-table-column  label="" prop="tnGnjcwxzt" width="100px" >
         <template slot-scope="scope" v-if="scope.row.tcGnjcxxxlx">
          <p v-if="scope.row.tnGnjcwxzt===0">
              未提交
          </p>
          <p v-else-if="scope.row.tnGnjcwxzt===1">
              已提交
          </p>
          <p v-else-if="scope.row.tnGnjcwxzt===2">
              正常
          </p>         
        </template>
      </el-table-column>

      <el-table-column  label="二维码名称" prop="tcEwmmc"  :min-width="300 + 'px'"></el-table-column>
      <el-table-column  label="维修状态" prop="tnWxzt"  :min-width="300 + 'px'">
        <template slot-scope="scope">
          <p v-if="scope.row.tnWxzt===0">
              未提交
          </p>
          <p v-else-if="scope.row.tnWxzt===1">
              已提交
          </p>
          <p v-else-if="scope.row.tnWxzt===2">
              正常
          </p>         
        </template>
      </el-table-column>
      <el-table-column  label="检查人" prop="tcCjrmc"  :min-width="150 + 'px'"></el-table-column>
      <el-table-column  label="创建时间" prop="tdCjsj"  :min-width="200 + 'px'"></el-table-column>      <el-table-column v-for="(col, index) in config" :key="index" :label="col.tcXxxmc" :prop="col.tnRcxjjbxxszid.toString()" :width="col.tnLk+'px'" :min-width="300 + 'px'"></el-table-column>
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
  data (){
    return{
      rowClickStyle:true
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
        path: '/firecontrol/equip/querydetail',
        query: {
          type: 'update',
          detailType: this.detailType,
          detailTypeText: this.detailTypeText,
          equipTypeText: this.currentTypeText||'',
          equipType: row.tcGnjcxxxlx,
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
          equipOrder: row.tnGnjcywpc,
          tnWxzt:row.tnGnjcwxzt,
          tnDyywpc:row.tnYwpc,
          curType: 'funcTest',
          sfDcjj: row[16],
          tnYwpc: row.tnYwpc
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
