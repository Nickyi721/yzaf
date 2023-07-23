<template>
  <el-dialog title="查看设备" class="dialog" width="90%" :visible.sync="visible">
    <div class="common-grid" ref="container">
      <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @row-dblclick="_TableDblClick">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="是否故障" prop="tnSfgz">
          <template slot-scope="scope">
          {{scope.row.tnSfgz==1?'有故障':'无故障'}}
          </template>
        </el-table-column>
        <el-table-column v-if="detailType" width="100px">
          <el-button size="mini" slot-scope="scope" @click.stop="_ViewDetail(scope.row)">查看明细</el-button>
        </el-table-column>
        <el-table-column v-for="(col, index) in config[currentType]" :key="index" :label="col.tcXxxmc" :prop="col.tnAfabszid.toString()" :min-width="300 + 'px'"></el-table-column>
        <el-table-column v-if="currentTypeText" :label="currentTypeText">
          <template slot-scope="scope">
            {{scope.row['-10000']}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import Mixin from '@mixins'
import Model from '../../model'
export default {
  mixins: [Mixin.Grid],
  data () {
    return {
      rowClickStyle: true,
      visible: false,
      tnYwpc: '',
      list: [],
      config: [],
      currentOrg: {},
      org: {},
      detailType: null,
      currentType: null,
      detailTypeText: null
    }
  },
  watch: {
    config (val) {
      console.log(val)
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
    _TableDblClick (row) {
      console.log(row)
      this.$emit('row-dblclick', { tnYwpc: row.tnYwpc, ...this.org })
      this.visible = false
    },
    init ({ currentType, currentOrg, detailType, detailTypeText, tnYwpc }) {
      this.visible = true
      this.currentType = currentType
      this.currentOrg = currentOrg
      this.detailType = detailType
      this.detailTypeText = detailTypeText
      this.tnYwpc = tnYwpc
      this.getEquipData()
    },

    processData (listData) {
      const data = {}
      listData.forEach(item => {
        data[item.tnYwpc] = data[item.tnYwpc] || []
        data[item.tnYwpc].push(item)
      })
      return Object.keys(data)
        .map(key => data[key])
        .sort((a, b) => b.tnYwpc - a.tnYwpc)
        .map(fields => {
          const data = {}
          fields.forEach(item => {
            let value
            if (typeof item.tcZfclxsj !== 'undefined') {
              value = item.tcZfclxsj
            }
            if (typeof item.tnSzzxsj !== 'undefined') {
              value = item.tnSzzxsj
            }
            if (typeof item.tnFdxsj !== 'undefined') {
              value = item.tnFdxsj
            }
            data[item.tnAfabszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          data.tnSfgz = fields[0].tnSfgz
          return data
        })
    },
    async getEquipData () {
      const { tnYwpc } = this
      const params = {
        tnDllx: 0,
        tcXxxlx: this.currentType,
        tcSsdwdm: this.currentOrg.id
      }
      if (tnYwpc) {
        params.tnYwpc = tnYwpc
      }
      const result = await Model.getEquipData(params)
      if (result.data) {
        this.list = this.processData(result.data.dataList)
        console.log(this.list)
        if (this.tnYwpc) {
          this.list = this.list.filter(item => item.tnYwpc == this.tnYwpc)
        }
        this.org = {
          orgId: result.data.dataList[0].tcSsdwdm,
          orgName: result.data.dataList[0].tcSsdwmc
        }
      }
    },
    async getEquipConfig () {
      const result = await Model.getEquipConfig()
      if (result.data) {
        this.config = result.data
      }
    },
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
  },
  created () {
    this.getEquipConfig()
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog {
  .el-dialog__body {
    height: 500px;
  }
}
</style>
