<template>
  <CustomView class="custom-view" :location="[{ text: '上报报表详情'}]">
    
    <CustomToolbar slot="top">
      <CustomButton icon="export" text="导出" @click="_ButtonClick"/>
    </CustomToolbar>

    <DataGrid :canEdit="canEdit" :headerData='list' :data="tableData" @selection-change="selectionChange"></DataGrid>
    
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
    Mixin,
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
      const { tcMbid, tnRwid, tcDwdm } = this.$route.query
      const result = await Model.getTableHeader({
        tcZdybbid: tcMbid
      })
      this.list = result.data.xxglZdybbtiDto
      this._setListOrder(this.list)
      const tableResult = await Model.getListData({
        tnRwid,
        tcDwdm,
        tnLx: 1
      })
      const resultData = tableResult.data ? tableResult.data[0] : [] // .xxglTbsjList
      // this.canEdit = (!tableResult.data || (tableResult.data && tableResult.data[0].tnTbzt !== 1)) ? true : false
      this.tableData = resultData.xxglTbsjList || []
      //  const sjlxData = ['tnSzzxsj', 'tnFdxsj', 'tcZfclxsj ']
      this.tableData = this.tableData.map(arr => {
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
          // let value = item.tcZfclxsj || item.tnSzzxsj || item.tnFdxsj
          if (typeof item.tcZfclxsj === 'string') {
            let newArr = item.tcZfclxsj.split(',')
            if (newArr.length === 2) {
              value = {
                id: item.tcZfclxsj.split(',')[0],
                name: item.tcZfclxsj.split(',')[1]
              }
            }
          }
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
    async _ButtonSaveClick (tnRwzt) {
      const result = []
      this.tableData.forEach(obj => {
        let item = []
        for (let x in obj) {
          if ((obj[x]||obj[x]===0) && obj[x] !== 'NaN') {
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
        const { tnRwid, tcRwmc, tcRwsm, tcMbid } = this.$route.query
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
    },
    async _ButtonClick() {
      const result = await Model.exportReport({
        tnLx: 1,
        tnRwid: this.$route.query.tnRwid,
        tcDwdm: this.$route.query.tcDwdm,
      })
      if (result) {
        const content = result
        const blob = new Blob([content])
        let year = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        let strDate = new Date().getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate;
        }
        const myDate = year + month + strDate
        const fileName = '自定义报表-' + myDate
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName + '.xls'
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      } else {
        this.$message({
          message:'下载失败,请联系管理员!',
          type:"fail",
          duration:1000,
          customClass: "middle"
        })
      }
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
