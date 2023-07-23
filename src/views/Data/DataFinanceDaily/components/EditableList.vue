<template>
    <div class="common-editable">
        <el-table stripe border height="100%" :data="list" size="mini" class="grid-table" header-cell-class-name="grid-table-hd" @selection-change="_TableSelectionChange">
            <el-table-column type="selection" fixed></el-table-column>       
            
            <el-table-column prop="tnXxxsjlx" label="营业状态" align="center" width="300px">
                <el-select slot-scope="scope" v-model="scope.row['tnXxxsjlx']" placeholder>
                    <el-option v-for="option in option" :value="option.tcSjubm" :key="option.tcSjubm" :label="option.tcSjnr"></el-option>
                </el-select>
            </el-table-column>
            <el-table-column label="详情" prop="tnXxxjtnr" align="center">
                <el-input type="textarea" slot-scope="scope" v-model="scope.row['tnXxxjtnr']" />
            </el-table-column>

            <el-table-column label="操作" width="140px" fixed="right" align="center">
                <template slot-scope="scope">
                    <button class="grid-row-control" @click="_ButtonRowDeleteClick(scope.$index, scope)">
                        <CustomIcon name="delete"/>
                    </button>
                    <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'down')" :disabled="scope.$index === 0">
                        <CustomIcon name="arrow-down"/>
                    </button>
                    <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'up')" :disabled="scope.$index === list.length -1">
                        <CustomIcon name="arrow-up"/>
                    </button>
                </template>
            </el-table-column>             
        </el-table>    
    </div>
</template>

<script>
// 共用模块
import Mixin from '@mixins'

export default {
  mixins: [
    Mixin.init,
  ],        
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
      return{
        dict: ['031103'],          
        option: {},
        delList: []
      }
  },
  methods: {
        $init(options) {
            this.option = options['031103']
            this.option.splice(-1,1)            
        },    
        _TableSelectionChange (selection) {
        this.$emit('selection-change', selection)
        },     

        // 操作-删除
        _ButtonRowDeleteClick(index) {
            this.$confirm('是否删除本行?').then(() => {
                this.delList.push(this.list.splice(index, 1)[0].tnRcaqjcszid)
                this.$emit('del',this.delList)
            }).catch(() => {})
        },
        // 操作-上下移动
        _ButtonRowOrderClick(index, type) {
            const row = this.list[index]   // 保存该项
            this.list.splice(index, 1)  // 删除该项
            this.list.splice(type === 'down' ? index -1 : index + 1, 0, row)  // 按钮类型 'down'为向上！！
        }
  },

}
</script>

<style scoped>
    >>>.el-input__icon {
        line-height: 0px;
    }
</style>


