<template>
  <CustomView class="custom-view" :location="[{ text: '报表任务预览'}]">
    <!-- <template slot="view-title-right">
      <el-button style="float:right" type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
    </template> -->
    <!-- <CustomToolbar>
      <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
      <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
    </CustomToolbar> -->
    <DataGrid :headerData='list' :data="tableData" canEdit @selection-change="selectionChange"></DataGrid>
  </CustomView>
</template>

<script>
// import queryConfig from './config'
import Model from './model'
import Mixin from '../InfoReportCustomizeDetail/mixins'
import DataGrid from './components/DataGrid.vue'
export default {
  components: {
    DataGrid
  },
  mixins: [
    Mixin
  ],
  data () {
    return {
      selection: [],
      formData: {},
      tableData: [{}],
      list: []
    }
  },
  computed: {
    getSfmjLength () {
      let result = []
      this.list.forEach(item => {
        if (item.tnSfmj === 1) {
          result.push(item)
        }
        let arr = item.zdybbtiList.filter(ceil => ceil.tnSfmj === 1)
        result = [...result, ...arr]
      })
      return result.length
    }
  },
  methods: {
    async $init () {
      const { tcZdybbid } = this.$route.query
      const result = await Model.getTableHeader({
        tcZdybbid: tcZdybbid
      })
      this.list = result.data.xxglZdybbtiDto
      this._setListOrder(this.list)
    },
    selectionChange (selection, i) {
      this.selection = selection
    },
    _ButtonDeleteClick () {
      if (this.selection.length > 0) {
        this.$confirm('是否删除所选数据？').then(() => {
          this.selection.forEach((item, index) => {
            for (let i = 0; i < this.tableData.length; i++) {
              let ceil = this.tableData[i]
              if (ceil.rowNum === item.rowNum) {
                this.tableData.splice(i, 1)
              }
            }
          })
        })
      } else {
        this.$alert('请选择需要删除的数据！')
      }
    },
    _ButtonAddClick () {
      const num = Math.max.apply(null, this.tableData.map(row => row.rowNum))
      this.tableData.push({
        rowNum: this.tableData.length ? num + 1 : 0
      })
    },
    getSjlx (tnZdybbtid) {
      let newCode = ''
      this.list.forEach(item => {
        if (item.tnZdybbtid == tnZdybbtid) {
          newCode = item.tnSjlx
        }
        for (let i = 0; i < item.zdybbtiList.length; i++) {
          let ceil = item.zdybbtiList[i]
          if (ceil.tnZdybbtid == tnZdybbtid) {
            newCode = ceil.tnSjlx
            break
          }
        }
      })
      return newCode
    },
    async _ButtonSaveClick () {
      const result = []
      this.tableData.forEach(obj => {
        let item = []
        for (let x in obj) {
          if (obj[x] && obj[x] !== 'NaN') {
            let value = obj[x]
            if (typeof obj[x] === 'object') {
              value = obj[x]['id'] + ',' + obj[x]['name']
            }
            item.push({
              tnBbtiid: x,
              sjlx: this.getSjlx(x),
              value
            })
          }
        }
        result.push(item)
      })
      if (result.filter(item => item.length !== this.getSfmjLength).length) {
        this.$msgbox({
          message: '报表任务相关值不能为空',
          type: 'warning'
        })
      } else {
        const { tnRwid, tcRwmc, tcRwsm, tnRwzt, tcMbid } = this.$route.query
        let params = {
          tnRwid,
          tcRwmc,
          tcRwsm: tcRwsm,
          tnTbzt: tnRwzt,
          tnLx: 1,
          tnBbtoid: tcMbid,
          xxglTbsjList: result
        }
        const resultData = await Model.updateListData(params)
        if (resultData.state === '1') {
          this.$message({
            message: '保存成功',
            duration: 1000,
            onClose: () => {
              this.$router.go(-1)
            }
          })
        }
      }
      //  alert(this.getSfmjLength)
    }
  },
  created () {
    this.$init()
  }
}
</script>
<style lang="scss" scoped>
.custom-view {
  /deep/.view-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .padding {
    padding: 20px;
  }
}
</style>
