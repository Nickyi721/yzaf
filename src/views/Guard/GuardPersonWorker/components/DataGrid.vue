<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="所属安保机构" prop="tcAbjgmc" min-width="150px"></el-table-column>
      <el-table-column label="姓名" prop="tcXm" width="150px"></el-table-column>
      <el-table-column label="性别" prop="tcXb" width="80px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcXb=="05030101"'>男</p>
          <p v-else-if='scope.row.tcXb=="05030102"'>女</p>
        </template>
      </el-table-column>
      <el-table-column label="工作岗位" prop="tcGzgw" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcGzgw=="05030601"'>保安员</p>
          <p v-else-if='scope.row.tcGzgw=="05030602"'>枪管员</p>
          <p v-else-if='scope.row.tcGzgw=="0503063"'>守库人员</p>
          <p v-else-if='scope.row.tcGzgw=="05030604"'>押运人员</p>
          <p v-else-if='scope.row.tcGzgw=="05030605"'>消防控制室值守人员</p>
          <p v-else-if='scope.row.tcGzgw=="05030606"'>监控中心工作人员</p>
        </template>
      </el-table-column>
      <el-table-column label="开始安保工作时间" prop="tdRzsj" width="150px"></el-table-column>
      <el-table-column label="文化程度" prop="tcWhcd" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcWhcd=="05030401"'>研究生以上</p>
          <p v-else-if='scope.row.tcWhcd=="05030402"'>大学本科</p>
          <p v-else-if='scope.row.tcWhcd=="05030403"'>大学专科</p>
          <p v-else-if='scope.row.tcWhcd=="05030404"'>中专</p>
          <p v-else-if='scope.row.tcWhcd=="05030405"'>高中</p>
          <p v-else-if='scope.row.tcWhcd=="05030406"'>初中</p>
           <p v-else-if='scope.row.tcWhcd=="05030407"'>其他</p>
        </template>
      </el-table-column>
      <el-table-column label="用工性质" prop="tcYgxz" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcYgxz=="05030701"'>合同工</p>
          <p v-else-if='scope.row.tcYgxz=="05030702"'>聘用工</p>
          <p v-else-if='scope.row.tcYgxz=="05030703"'>劳务工</p>
        </template>
      </el-table-column>
      <el-table-column label="保安员证" prop="tcBayz" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcBayz=="0"'>有</p>
          <p v-else-if='scope.row.tcBayz=="1"'>无</p>
        </template>
      </el-table-column>
      <el-table-column label="持枪证" prop="tcCqz" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcCqz=="0"'>有</p>
          <p v-else-if='scope.row.tcCqz=="1"'>无</p>
        </template>
      </el-table-column>
      <el-table-column label="消防专业职业资质证书" prop="tcXfzs" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcXfzs=="0"'>有</p>
          <p v-else-if='scope.row.tcXfzs=="1"'>无</p>
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
      default: [() => []]
     
    }
  },
  data () {
    return{
      rowClickStyle:true
    }
  }
}
</script>