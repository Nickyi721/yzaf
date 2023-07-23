<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table ref="table" border class="grid-table" header-cell-class-name="table-hd" height="100%" stripe size="mini" :data="list" :row-class-name="$listeners.dblClick ? 'click-row' : ''" :span-method="_objectSpanMethod">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="tcJcfs" label="检查方式" width="150px"></el-table-column>
        <el-table-column prop="tcJcqy" label="检查区域" width="80px"></el-table-column>
        <el-table-column prop="tcJcnr" label="检查内容"></el-table-column>
        <el-table-column prop="tcSfxcjc" label="现场检查(是/否）">
          <template slot-scope="scope">
            <p v-if="scope.row.tcSfxcjc=='1'">现场检查</p>
            <p v-if="scope.row.tcSfxcjc=='2'">非现场检查</p>
          </template>
        </el-table-column>
        <el-table-column  label="检查结果"  min-width="300px">
          <template slot-scope="scope">
            <div>
              <div v-for="(yhct, index) in scope.row.yhctList" :key="index">
                <el-checkbox v-model="yhct.select" @change="(val) => _checkboxChange(val, scope.row.tnAqjczjid.toString(), yhct.tnYhctid.toString())" :disabled="disabled"></el-checkbox>
                <span>{{index+1}}、{{yhct.tcCtnr}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="list" label="附件"  min-width="100px">
            <template slot-scope="scope">
              <CommonFileDownload :list="scope.row.xtFjList" :disabled='true'></CommonFileDownload>
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
  mixins: [Mixin.Grid,Mixin.init],
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
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      spanArr: [],
      pos: 0,
      disabled: true
    }
  },
  methods: {
    _checkboxChange(val, tnAqjczjid, yhctId){
      if(val){
        this.list.aqjcAqjctiDto.forEach(el=>{
          if(tnAqjczjid === el.tnAqjczjid){
            el.yhctList.push({tnYhctid:yhctId})
          }
        })
      }
      else{
        this.list.aqjcAqjctiDto.forEach(ele=>{
          if(ele.tnAqjczjid === tnAqjczjid){
            ele.yhctList.filter(yhct=>{
              return yhct.tnYhctid!==yhctId
            })
          }
        })
      }
    },
    _objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    setColRowSpan(){
      const data = this.list
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].tcJcfs === data[i - 1].tcJcfs) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
  },
  watch:{
    list:{
      handler(val){
        this.setColRowSpan()
      }
    }
  }
}
</script>

<style lang="css">
</style>
