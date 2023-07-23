<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="所属安保机构" prop="tcAbjgmc" min-width="200px"></el-table-column>
      <el-table-column label="姓名" prop="tcXm" width="150px"></el-table-column>
      <el-table-column label="性别" prop="tcXb" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcXb=="0"'>男</p>
          <p v-else-if='scope.row.tcXb=="1"'>女</p>
        </template>
      </el-table-column>
      <el-table-column label="职务" prop="tcZw" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcZw=="05020201"'>总经理</p>
          <p v-else-if='scope.row.tcZw=="05020202"'>副总经理</p>
          <p v-else-if='scope.row.tcZw=="05020203"'>资深业务经理</p>
          <p v-else-if='scope.row.tcZw=="05020204"'>高级业务经理</p>
          <p v-else-if='scope.row.tcZw=="05020205"'>业务经理</p>
          <p v-else-if='scope.row.tcZw=="05020206"'>科级管理人员</p>
          <p v-else-if='scope.row.tcZw=="05020207"'>一般管理人员</p>
        </template>
      </el-table-column>
      <el-table-column label="出生年月" prop="tdCsny" width="150px"></el-table-column>
      <el-table-column label="开始工作时间" prop="tdCjgzsj" width="150px"></el-table-column>
      <el-table-column label="政治面貌" prop="tcZzmm" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcZzmm=="05020601"'>党员</p>
          <p v-else-if='scope.row.tcZzmm=="05020602"'>群众</p>
          <p v-else-if='scope.row.tcZzmm=="05020603"'>其他</p>
        </template>
      </el-table-column>
      <el-table-column label="文化程度" prop="tcWhcd" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcWhcd=="05020301"'>研究生以上</p>
          <p v-else-if='scope.row.tcWhcd=="05020302"'>大学本科</p>
          <p v-else-if='scope.row.tcWhcd=="05020303"'>大学专科</p>
          <p v-else-if='scope.row.tcWhcd=="05020304"'>中专</p>
          <p v-else-if='scope.row.tcWhcd=="05020305"'>高中</p>
          <p v-else-if='scope.row.tcWhcd=="05020306"'>初中</p>
          <p v-else-if='scope.row.tcWhcd=="05020306"'>其他</p>
        </template>
      </el-table-column>
      <el-table-column label="专兼职" prop="tcZjz" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcZjz=="05020401"'>专职</p>
          <p v-else-if='scope.row.tcZjz=="05020402"'>兼职</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="tcZt" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tcZt=="05020501"'>现职</p>
          <p v-else-if='scope.row.tcZt=="05020502"'>交流</p>
          <p v-else-if='scope.row.tcZt=="05020503"'>二线</p>
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
  data (){
    return{
      rowClickStyle:true
    }
  }
}
</script>