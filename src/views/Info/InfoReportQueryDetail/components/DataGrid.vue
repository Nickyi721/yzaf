<template>
  <el-table show-summary :summary-method='getSummaries' size="mini" sum-text='统计' :data="data" height="100%" class="table" @selection-change="_TableSelectionChange">
    <el-table-column type="index" width="48" align="center"></el-table-column>
    <el-table-column v-for="(item,index) in headerData" :key="index" :prop="item.tnZdybbtid.toString()" align="center" min-width="150">
      <div slot="header">
        <span>{{item.tnLxh}}-{{item.tcLmc}}</span>
        <!-- <span>-{{item.tnSftj}}</span> -->
      </div>
      <div v-show="!item.zdybbtiList.length" slot-scope="scope">
        <component :is='componentsList[item.tcLrfs]' class="input" v-model="scope.row[item.tnZdybbtid]" :disabled="!canEdit" size="mini" :type="[0,1].indexOf(item.tnSjlx)>-1?'number':'text'" :suffix-icon="item.tcLrfs==='1'?'el-icon-d-caret':''" :placeholder="item.tnSjlx | placeholder(item)" @input="computeValue(scope.row,item)" />
      </div>
      <el-table-column v-for="(ceil,i) in item.zdybbtiList" :key="i" align="center" min-width="150" :prop="ceil.tnZdybbtid.toString()">
        <div slot="header">
          <span>{{ceil.tnLxh}}-{{ceil.tcLmc}}</span>
          <!-- <span>-{{ceil.tnSftj}}</span> -->
        </div>
        <div slot-scope="scope">
          <component :is='componentsList[ceil.tcLrfs]' class="input" v-model="scope.row[ceil.tnZdybbtid]" :disabled="!canEdit" size="mini" :type="[0,1].indexOf(ceil.tnSjlx)>-1?'number':'text'" :suffix-icon="item.tcLrfs==='1'?'el-icon-d-caret':''" :placeholder="ceil.tnSjlx | placeholder(ceil)" @input="computeValue(scope.row,ceil)" />
        </div>
      </el-table-column>
    </el-table-column>
  </el-table>

</template>

<script>
import Mixin from '@mixins'
import math from 'mathjs'
import TreeInput from './TreeInput.vue'
export default {
  mixins: [Mixin.Grid],
  data () {
    return {
      componentsList: {
        '0': 'el-input',
        '1': 'tree-input',
        '2': 'el-input'
      },
      //  dialogVisible: false,
      activeIndex: 0,
      activeTnZdybbtid: null,
      selectTree: null
    }
  },
  components: {
    'tree-input': TreeInput
  },
  computed: {
    computedData () {
      let result = []
      if (this.headerData.length) {
        this.headerData.forEach(item => {
          if (item.tcLrfs === '2') {
            result.push(item)
          }
          let arr = item.zdybbtiList.filter(ceil => ceil.tcLrfs === '2')
          result = [...result, ...arr]
        })
      }
      return result
    }
  },
  props: {
    headerData: {
      type: Array,
      default: () => []
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    placeholder: function (value, item) {
      if (item.tcLrfs === '1') {
        return '单位树选择'
      }
      if (item.tcLrfs === '2') {
        return item.tcBblsz
      }
      if (item.tnSjlx === 0) {
        return '请输入整数'
      } else if (item.tnSjlx === 1) {
        return '请输入浮点'
      } else if (item.tnSjlx === 2) {
        return '请输入字符串'
      }
    }
  },
  methods: {
    getTnSftj (id) {
      let result = 0
      this.headerData.forEach(item => {
        if (item.tnZdybbtid == id) {
          result = item.tnSftj
        }
        for (let i = 0; i < item.zdybbtiList.length; i++) {
          let ceil = item.zdybbtiList[i]
          if (ceil.tnZdybbtid == id) {
            result = ceil.tnSftj
            break
          }
        }
      })
      return result
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '统计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value)) && this.getTnSftj(column.property) === 0) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    inputBlur (item, index) {
      
    },
    inputFocus (item, index) {
      if (item.tcLrfs === '1') {
        // this.dialogVisible = true
        // this.activeIndex = index
        // this.activeTnZdybbtid = item.tnZdybbtid
      }
    },
    _OrgTreeClick (node) {
      this.selectTree = node
    },
    dialogEntry () {
      //  this.data[this.activeIndex][this.activeTnZdybbtid] = this.selectTree.id
      const { id, name } = this.selectTree
      this.$set(this.data[this.activeIndex], this.activeTnZdybbtid, {
        id,
        name
      })
      this.dialogVisible = false
    },
    getTnZdybbtid (code) {
      let newCode = ''
      this.headerData.forEach(item => {
        if (item.tnLxh === code) {
          newCode = item.tnZdybbtid
        }
        for (let i = 0; i < item.zdybbtiList.length; i++) {
          let ceil = item.zdybbtiList[i]
          if (ceil.tnLxh === code) {
            newCode = ceil.tnZdybbtid
            break
          }
        }
      })
      return newCode
    },
    computeValue (row, item) {
      let value = row[item.tnZdybbtid]
      switch (item.tnSjlx) {
        case 0:
          row[item.tnZdybbtid] = parseInt(value)
          break
        case 1:
          row[item.tnZdybbtid] = parseFloat(value)
          try {
            if (value.split('.')[1].length > 2) {
              row[item.tnZdybbtid] = Math.floor(row[item.tnZdybbtid] * 100) / 100
            }
          } catch (err) {

          }
          break
        case 2:
          row[item.tnZdybbtid] = value.replace(/,/g, '')
          break
      }
      this.computedData.forEach((item, index) => {
        //  row[item.tnZdybbtid] = 99
        let arr = item.tcBblsz.split('')
        for (let i = 0; i < arr.length; i++) {
          if (this.getTnZdybbtid(arr[i])) {
            arr[i] = parseFloat(row[this.getTnZdybbtid(arr[i])])
          }
        }
        row[item.tnZdybbtid] = math.eval(arr.join('')).toFixed(2)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  /deep/ {
    .cell,
    .cell > div {
      text-overflow: inherit !important;
      white-space: normal !important;
      line-height: 20px !important;
    }
  }
  /deep/{
    .el-input.is-disabled .el-input__inner{
      background: none;
      border: 0;
      color: #333;
    }
  }
  /deep/.input {
    input {
      text-align: center;
      &[readonly] {
        background: #f1f1f1;
      }
    }
  }
}
</style>
