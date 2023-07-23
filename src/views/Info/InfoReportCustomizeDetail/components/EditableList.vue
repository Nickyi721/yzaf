<template>
  <div class="common-editable">
    <el-table default-expand-all stripe border height="100%" :data="list" size="mini" class="grid-table" header-cell-class-name="grid-table-hd" @selection-change="_TableSelectionChange">
      <el-table-column type="expand" width="40px">
        <template slot-scope="props">
          <el-table v-if="props.row['zdybbtiList'].length" row-class-name="child-table" border size="mini" :data="props.row.zdybbtiList" :show-header="childShowHeader">
            <el-table-column prop="tnLxh" label="列序号" width="60px" align="center">
              <template slot-scope="scope">
                <el-badge class="badge" type="primary" :is-dot="scope.row['canUse']">{{scope.row['tnLxh']}}</el-badge>
              </template>
            </el-table-column>
            <el-table-column prop="tcLmc" label="报表列名称" width="300px">
              <el-input type="text" slot-scope="scope" v-model="scope.row['tcLmc']" placeholder="输入报表列名称" size="mini" maxlength="50"/>
            </el-table-column>
            <el-table-column prop="tnSftj" label="统计" width="200px" align="center">
              <el-select slot-scope="scope" v-model="scope.row['tnSftj']" size="mini" :disabled="scope.row['tnSfmj']!==1">
                <!-- <el-option v-for="(option,index) in options['tnSftj']" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option> -->
                <el-option v-for="(option,index) in options['tnSftj'].filter(option=>{
              switch(scope.row['tnSjlx']){
                case 0:
                  return option
                break;
                case 1:
                  return option
                case 2:
                  return option.tcSjubm===1
                break;
                default:
                return options;
              }
            })" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option>
              </el-select>
            </el-table-column>
            <el-table-column prop="tcLrfs" label="录入方式" width="200px" align="center">
              <el-select slot-scope="scope" v-model="scope.row['tcLrfs']" size="mini" @change="tcLrfsChange(scope.$index,props.$index)">
                <el-option v-for="(option,index) in options['tcLrfs']" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option>
              </el-select>
            </el-table-column>
            <el-table-column prop="tnSjlx" label="数据类型" width="200px" align="center">
              <el-select slot-scope="scope" v-model="scope.row['tnSjlx']" size="mini" @change="tnSjlxChange(scope.$index,props.$index)">
                <el-option v-for="(option,index) in options['tnSjlxData'].filter(option=>{
              switch(scope.row['tcLrfs']){
                case '0':
                  return option
                break;
                case '1':
                  return option.tcSjubm===2
                case '2':
                  return option.tcSjubm===1
                break;
                default:
                return options;
              }
            })" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option>
              </el-select>
            </el-table-column>
            <el-table-column prop="tcBblsz" label="报表列设置" width="200px">
              <el-input type="text" slot-scope="scope" v-model="scope.row['tcBblsz']" :disabled="scope.row['tcLrfs']!='2'" placeholder="输入报表列设置" size="mini" @input="formatComputed(scope.$index,props.$index)" onkeyup="value=value.replace(/[^A-Za-z0-9+-/*()]+$/,'')" />
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <button class="grid-row-control" @click="_ButtonRowDeleteClick(scope.$index, props.$index)">
                    <CustomIcon name="delete" />
                  </button>
                  <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'down',props.$index)" :disabled="scope.$index === 0">
                    <CustomIcon name="arrow-down" />
                  </button>
                  <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'up',props.$index)" :disabled="scope.$index === list.length -1">
                    <CustomIcon name="arrow-up" />
                  </button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection"  ></el-table-column> -->
      <el-table-column prop="tnLxh" label="列序号" width="60px" align="center">
        <template slot-scope="scope">
          <el-badge class="badge" type="primary" :is-dot="scope.row['canUse']">{{scope.row['tnLxh']}}</el-badge>
        </template>
      </el-table-column>
      <el-table-column prop="tcLmc" label="报表列名称" width="300px" align="center">
        <el-input type="text" slot-scope="scope" v-model="scope.row['tcLmc']" placeholder="输入报表列名称" size="mini"  maxlength="50"/>
      </el-table-column>
      <el-table-column prop="tnSftj" label="统计" width="200px" align="center">
        <el-select slot-scope="scope" v-model="scope.row['tnSftj']" size="mini" :disabled="scope.row['tnSfmj']!==1">
          <!-- <el-option v-for="(option,index) in options['tnSftj']" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option> -->
          <el-option v-for="(option,index) in options['tnSftj'].filter(option=>{
              switch(scope.row['tnSjlx']){
                case 0:
                  return option
                break;
                case 1:
                  return option
                case 2:
                  return option.tcSjubm===1
                break;
                default:
                return options;
              }
            })" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option>
        </el-select>
      </el-table-column>
      <el-table-column prop="tcLrfs" label="录入方式" width="200px" align="center">
        <el-select slot-scope="scope" v-model="scope.row['tcLrfs']" :disabled="scope.row['tnSfmj']===0" @change="tcLrfsChange(scope.$index)" size="mini">
          <el-option v-for="(option,index) in options['tcLrfs']" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option>
        </el-select>
      </el-table-column>
      <el-table-column prop="tnSjlx" label="数据类型" width="200px" align="center">
        <el-select slot-scope="scope" v-model="scope.row['tnSjlx']" :disabled="scope.row['tnSfmj']===0" size="mini" @change="tnSjlxChange(scope.$index)">
          <el-option v-for="(option,index) in options['tnSjlxData'].filter(option=>{
              switch(scope.row['tcLrfs']){
                case '0':
                  return option
                break;
                case '1':
                  return option.tcSjubm===2
                case '2':
                  return option.tcSjubm===1
                break;
                default:
                return options;
              }
            })" :value="option.tcSjubm" :key="index" :label="option.tcSjnr"></el-option>
        </el-select>
      </el-table-column>
      <el-table-column prop="tcBblsz" label="报表列设置" width="200px" align="center">
        <el-input type="text" slot-scope="scope" v-model="scope.row['tcBblsz']" :disabled="!(scope.row['tnSfmj']===1&&scope.row['tcLrfs']==='2')" placeholder="输入报表列设置" size="mini" @input="formatComputed(scope.$index)" onkeyup="value=value.replace(/[^A-Za-z0-9+-/*()]+$/,'')" />
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180px" align="center">
        <template slot-scope="scope">
          <div>
            <button class="grid-row-control" @click="_ButtonRowDeleteClick(scope.$index)">
              <CustomIcon name="delete" />
            </button>
            <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'down')" :disabled="scope.$index === 0">
              <CustomIcon name="arrow-down" />
            </button>
            <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'up')" :disabled="scope.$index === list.length -1">
              <CustomIcon name="arrow-up" />
            </button>
            <button class="grid-row-control" @click="_ButtonRowAddClick(scope.$index)">
              <CustomIcon name="add" />
            </button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import _ from 'lodash'
import Mixin from '../mixins'
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    delIds: {
      type: Array,
      default: () => []
    }
  },
  mixins: [
    Mixin
  ],
  data () {
    return {
      childShowHeader: false,
      maxStrLength: 50,
      options: {
        tnSftj: [{ tcSjubm: 0, tcSjnr: '是' }, { tcSjubm: 1, tcSjnr: '否' }],
        tnSjlxData: [
          { tcSjubm: 0, tcSjnr: '整数' },
          { tcSjubm: 1, tcSjnr: '浮点' },
          { tcSjubm: 2, tcSjnr: '字符串' }
        ],
        tcLrfs: [
          { tcSjubm: '0', tcSjnr: '用户输入' },
          { tcSjubm: '1', tcSjnr: '单位树选择' },
          { tcSjubm: '2', tcSjnr: '计算公式' }
          //  { tcSjubm: 3, tcSjnr: '自定义集合' }
        ]
      }
    }
  },
  methods: {
    formatName (index, pIndex) {
      if (_.isNumber(pIndex)) {
        let row = this.list[pIndex].zdybbtiList[index]
        if (row.tcLmc.length > this.maxStrLength) {
          this.$msgbox({
            message: `报表列名称最大长度为${this.maxStrLength}`,
            type: 'warning'
          })
          row.tcLmc = row.tcLmc.substr(0, this.maxStrLength)
        }
      } else {
        /* 清空列设置  数据类型 */
        let row = this.list[index]
        if (row.tcLmc.length > this.maxStrLength) {
          this.$msgbox({
            message: `报表列名称最大长度为${this.maxStrLength}`,
            type: 'warning'
          })
          row.tcLmc = row.tcLmc.substr(0, this.maxStrLength)
        }
      }
    },
    formatComputed: function (index, pIndex) {
      if (_.isNumber(pIndex)) {
        let row = this.list[pIndex].zdybbtiList[index]
        let value = row.tcBblsz.toUpperCase()
        /*  if (!(/^[0-9A-Z+-/*]+$/.test(value))) {
           alert(1)
         } */
        row.tcBblsz = value
      } else {
        /* 清空列设置  数据类型 */
        let row = this.list[index]
        let value = row.tcBblsz.toUpperCase()
        /* if (!(/^[0-9A-Z+-/*]+$/.test(value))) {
          alert(1)
        } */
        row.tcBblsz = value
      }
    },
    // 类型切换
    tnSjlxChange (index, pIndex) {
      if (_.isNumber(pIndex)) {
        let row = this.list[pIndex].zdybbtiList[index]
        if (row.tnSjlx === 2) {
          row.tnSftj = 1
        }
      } else {
        /* 清空列设置  数据类型 */
        let row = this.list[index]
        if (row.tnSjlx === 2) {
          row.tnSftj = 1
        }
      }
      this._setListOrder(this.list)
    },
    // 类型切换
    tcLrfsChange (index, pIndex) {
      if (_.isNumber(pIndex)) {
        let row = this.list[pIndex].zdybbtiList[index]
        row.tcBblsz = ''
        row.tnSjlx = ''
      } else {
        /* 清空列设置  数据类型 */
        this.list[index].tcBblsz = ''
        this.list[index].tnSjlx = ''
      }
      this._setListOrder(this.list)
    },
    // 判断是否末级
    isTnSfmj (index) {
      if (this.list[index].zdybbtiList.length === 0) {
        this.list[index].tnSfmj = 1
      } else {
        this.list[index].tnSfmj = 0
      }
    },
    // 事件 - 选中行变动
    _TableSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    // 事件 - 删除行
    _ButtonRowDeleteClick (index, pIndex) {
      this.$confirm('是否删除本行?').then(() => {
        if (_.isNumber(pIndex)) {
          /* delIds */
          const row = this.list[pIndex]
          const delId = row.zdybbtiList[index].tnZdybbtid
          if (delId) {
            this.delIds.push(delId)
          }
          /* delIds */
          row.zdybbtiList.splice(index, 1)
          this.isTnSfmj(index)
        } else {
          /* delIds */
          const row = this.list[index]
          if (row.tnZdybbtid) {
            this.delIds.push(row.tnZdybbtid)
            row.zdybbtiList.forEach(item => {
              if (item.tnZdybbtid) {
                this.delIds.push(item.tnZdybbtid)
              }
            })
          }
          /* delIds */
          this.list.splice(index, 1)
          this._setListOrder(this.list)
        }
      }).catch(() => { })
    },
    // 事件 - 调整顺序
    _ButtonRowOrderClick (index, type, pIndex) {
      if (_.isNumber(pIndex)) {
        const row = this.list[pIndex].zdybbtiList[index]
        this.list[pIndex].zdybbtiList.splice(index, 1)
        this.list[pIndex].zdybbtiList.splice(type === 'down' ? index - 1 : index + 1, 0, row)
      } else {
        const row = this.list[index]
        this.list.splice(index, 1)
        this.list.splice(type === 'down' ? index - 1 : index + 1, 0, row)
      }
      this._setListOrder(this.list)
    },
    _ButtonRowAddClick (index) {
      if (this._maxLength(this.list)) {
        this.$msgbox({
          message: '报表列最大为26',
          type: 'warning'
        })
        return false
      }
      let child = this.list[index]
      //  const num = Math.max.apply(null, child.zdybbtiList.map(row => row.tnLbh))
      child.zdybbtiList.push({
        // tnLbh: child.zdybbtiList.length ? num + 1 : 0, // 序号
        tcLmc: '', //  名称
        tnSfmj: 1, // 是否末级
        tnSftj: 0, // 统计
        tnSjlx: '', // 数据类型
        tcBblsz: '', // 列设置
        tcLrfs: '' // 录入方式
      })
      this.isTnSfmj(index)
      this._setListOrder(this.list)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 12px;
  padding: 10px;
}
.common-editable {
  /deep/.el-table__expanded-cell {
    padding-top: 0;
    padding-bottom: 0;
    padding: 0 40px;
    > .el-table {
      margin: 8px auto;
    }
  }
  /deep/ {
    .badge {
      .el-badge__content {
        top: 5px;
        right: 0;
      }
    }
    .el-table__expanded-cell {
      background: #eee !important;
    }
    .cell {
      input,
      select,
      button {
        &:disabled {
          opacity: 0.5;
          background: #eee;
        }
      }
    }
  }
}
</style>
