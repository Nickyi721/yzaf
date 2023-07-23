<template lang="html">
  <div class="common-editable">
    <el-table stripe border height="100%" :data="list" size="mini" class="grid-table" header-cell-class-name="grid-table-hd">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="tcJcfs" label="检查方式" width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row['tcJcfs']" :disabled='isEditable'></el-input>
        </template>
        <!-- <select slot-scope="scope" v-model="scope.row['tcFsid']" @change="e => _SelectTypeChange(e, scope.row)">
          <option v-for="option in options" :value="option.tcSjubm">{{option.tcSjnr}}</option>
        </select> -->
      </el-table-column>
      <el-table-column prop="tcJcqy" label="检查区域">
        <template slot-scope="scope">
          <el-input v-model="scope.row.tcJcqy" :disabled='isEditable'></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="tcJcnr" label="检查内容">
        <template slot-scope="scope">
          <el-input v-model="scope.row.tcJcnr" :disabled='isEditable'></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="tcSfxcjc" label="现场检查(是/否)">
        <select slot-scope="scope" v-model="scope.row['tcSfxcjc']" :disabled='isEditable'>
          <option v-for="option in options" :value="option.id">{{option.label}}</option>
        </select>
      </el-table-column>
      <el-table-column prop="yhctList" label="检查结果">
        <template slot-scope="scope">
          <el-button v-if="type=='add'" size="mini" @click="_changeClick(scope.row.tcJcbxh)">添加</el-button>
          <p v-for="(yhct, index) in scope.row.yhctList">{{index+1}}、{{yhct.tcCtnr}}
            <span v-if="!isEditable" style="cursor:pointer" @click="_removeYhct(scope.$index, yhct)" label="移除">&nbsp;&nbsp;x</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column v-if="type=='add'" label="操作" width="60px" fixed="right">
        <template slot-scope="scope">
          <button class="grid-row-control" @click="_ButtonRowDeleteClick(scope.$index, scope)">
            <CustomIcon name="delete"/>
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [
    Mixin.init,
  ],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String
    }
  },
  watch: {
    list () {
      this.list.forEach(item => {
        this.options[0] = this.options[0] || {}
        // item.tcFsid = item.tcFsid || this.options[0].tcSjubm
        // item.tcFs = item.tcFs || this.options[0].tcSjnr
      })
      // this.$forceUpdate()
    },
  },
  data () {
    return {
      dict: ['0001'],
      options: [{id:'1',label:'是'},{id:'2',label:'否'}],
      isEditable: false
    }
  },
  methods: {
    $init(options) {
      this.isEditable = this.type==='add'?false:true
      // this.options = options['0001'] || []
    },
    // 事件 - 检查方式改变
    // _SelectTypeChange (e, row) {
    //   row.tcFs = this.options.filter(option => option.tcSjubm === row.tcFsid)[0].tcSjnr
    // },
    // 事件 - 选中行变动
    // _TableSelectionChange (selection) {
    //   this.$emit('selection-change', selection)
    // },
    // 事件 - 删除行
    _ButtonRowDeleteClick (index) {
      this.$confirm('是否删除本行?').then(() => {
        this.list.splice(index, 1)
      }).catch(() => {})
      this.$emit('rowDelete', this.list)
    },
    // 事件 - 调整顺序
    // _ButtonRowOrderClick (index, type) {
    //   const row = this.list[index]
    //   this.list.splice(index, 1)
    //   this.list.splice(type === 'down' ? index -1 : index + 1, 0, row)
    // },
    _changeClick(index){
      this.$emit("alterYhct", index)
    },
    _removeYhct(index, yhct){
      this.list[index].yhctList = this.list[index].yhctList.filter(el => {
        return el.tnYhctid != yhct.tnYhctid
      })
    }
  },
 
}
</script>

<style lang="scss">
  .editable-list{
    height: 100%;
    position: relative;

    .editable-list-body{
      height: 100%;

      .editable-list-table{
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04)!important;

        .editable-list-row-control{
          i{
            font-size: 14px;
          }
        }

        .el-table__header-wrapper{
          box-shadow: 0px 2px 6px rgba(0,0,0,0.05);
          z-index: 2000;
          // position: relative;
        }
        .editable-list-table-hd{
          color: #666;
          background: #f7f7f7;
        }
      }
    }


  }
</style>
