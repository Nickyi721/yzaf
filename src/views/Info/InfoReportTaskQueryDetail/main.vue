<template>
  <CustomView class="custom-view" :location="[{ text: '报表任务查询及填报'}]">
    <CustomToolbar slot="top" v-if="canEdit">
      <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
      <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
    </CustomToolbar>
    <CustomToolbar slot="top" v-else>
      <CustomButton icon="export" text="导出" @click="_ButtonExportClick"/>
    </CustomToolbar>
    <DataGrid :canEdit="canEdit" :headerData='list' :data="tableData" @selection-change="selectionChange"></DataGrid>
    <CustomControlBar slot="bottom" v-if="canEdit">
      <el-button size="mini" @click="_ButtonSaveClick(0, 0)" :disabled="!list.length">保存</el-button>
      <el-button size="mini" @click="_ButtonSaveClick(1, 0)" :disabled="!tableData.length">发送</el-button>
    </CustomControlBar>
  </CustomView>
</template>

<script>
// import queryConfig from './config'
import Model from './model'
import Mixin from '../InfoReportCustomizeDetail/mixins'
import DataGrid from './components/DataGrid.vue'
import { fail } from 'assert';
export default {
  components: {
    DataGrid
  },
  mixins: [
    Mixin
  ],
  data () {
    return {
      canEdit: false,
      selection: [],
      formData: {},
      tableData: [],
      list: []
    }
  },
  computed: {
    getNeedInput () {
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
      const { tcMbid, tnRwid } = this.$route.query
      const result = await Model.getTableHeader({
        tcZdybbid: tcMbid
      })
      this.list = result.data.xxglZdybbtiDto
      this._setListOrder(this.list)
      const tableResult = await Model.getListData({
        tnRwid,
        tnLx: 1
      })
      const resultData = tableResult.data ? tableResult.data[0] : [] // .xxglTbsjList
      this.canEdit = (!tableResult.data || (tableResult.data && tableResult.data[0].tnTbzt === 0)) ? true : false
      this.tableData = resultData.xxglTbsjList || []
      this.tableData = this.tableData.map((arr, index) => {
        let obj = {}
        let value=''  
        arr.forEach(item => {
          if(item.tnSzzxsj||item.tnSzzxsj===0){
            value=item.tnSzzxsj
          }
          if(item.tcZfclxsj||item.tcZfclxsj===0){
            value=item.tcZfclxsj
          }
          if(item.tnFdxsj||item.tnFdxsj===0){
            value=item.tnFdxsj
          }

          if (typeof item.tcZfclxsj === 'string') {
            let newArr = item.tcZfclxsj.split(',')
            if (newArr.length === 2) {
              value = {
                id: item.tcZfclxsj.split(',')[0],
                name: item.tcZfclxsj.split(',')[1]
              }
            }
          }
          obj['rowNum'] = index
          obj[item.tnBbtiid] = value
        })
        return obj
      })
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
    _ButtonExportClick() {
      this.exportTable()
    },
    async exportTable() {
      const result = await Model.exportTable({
        requestData:{
          tnRwid: this.$route.query.tnRwid,
          tnLx: 1
        }
      })
      if(result){
        this.$message({
          message: '导出成功',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        const content = result
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `${this.$route.query.tcMbmc}.xls`
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }
    },
    async _ButtonSaveClick (tnRwzt, sffg) {
      const result = []
      if (!this.tableData.length) {
        this.$msgbox({
          message: '报表行数不能为空',
          type: 'warning'
        })
        return false
      }
      this.tableData.forEach(obj => {
        let item = []
        for (let x in obj) {
          if ((obj[x]||obj[x]===0) && obj[x] !== 'NaN') {
            let value = obj[x]
            if (typeof obj[x] === 'object') {
              value = obj[x]['id'] + ',' + obj[x]['name']
            }
            if (x !== 'rowNum') {
              item.push({
                tnBbtiid: x,
                sjlx: this.getSjlx(x),
                value
              })
            }
          }
        }
        result.push(item)
      })
      if (result.filter(item => item.length !== this.getNeedInput).length) {
        this.$msgbox({
          message: '报表任务相关值不能为空',
          type: 'warning'
        })
      } else {
        const { tnRwid, tcRwmc, tcRwsm, tcMbid } = this.$route.query
        let params = {
          tnRwid,
          tcRwmc,
          tcRwsm: tcRwsm,
          tnTbzt: tnRwzt,
          tnLx: 1,
          tnBbtoid: tcMbid,
          xxglTbsjList: result,
          sffg: sffg
        }
        const resultData = await Model.updateListData(params)
        if (resultData.state === '1') {
          if(resultData.data === 1){
            this.$confirm(resultData.msg).then(() => {
              tnRwzt ? this._ButtonSaveClick(1, 1) : this._ButtonSaveClick(0, 1)
            }).catch(err => { })
          }else if(resultData.data === 2){
            this.$alert(resultData.msg)
          }
          else{
            this.$message({
              message: '保存成功',
              duration: 1000,
              onClose: () => {
                this.$router.go(-1)
              }
            })
          }
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
