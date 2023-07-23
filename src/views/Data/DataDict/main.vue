<template>
  <CustomView>
    <!-- 侧栏 -->
    <DataTree slot="side" class="dict-tree" ref="dataTree" @click="_DataTreeClick" @loaded="_DataTreeLoaded"/>
    
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonClick('delete')"/>
        <CustomButton icon="add" text="新增" @click="_ButtonClick('add')"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    <!-- 新增对话框 -->
    <CustomDialog title="新增" :visible="dlgAddVisble" @close="dlgAddVisble = false" @open="_DlgAddOpen">
      <FormAdd ref="formAdd" @control="_FormAddControl"/>
    </CustomDialog>

    <!-- 修改对话框 -->
    <CustomDialog title="修改" :visible="dlgUpdateVisble" @close="dlgUpdateVisble = false" @open="_DlgUpdateOpen">
      <FormUpdate ref="formUpdate" @control="_FormUpdateControl"/>
    </CustomDialog>
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'

import DataTree from './components/DataTree.vue'
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import FormAdd from './components/FormAdd.vue'
import FormUpdate from './components/FormUpdate.vue'

export default {
  name: 'DataDict',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataTree,
    DataFilter,
    DataGrid,
    FormAdd,
    FormUpdate
  },
  data () {
    return {
      // 查询条件
      query: {},
      // 列表
      list: [],
      // 已选列表
      selection: [],
      dlgAddVisble: false,
      dlgUpdateVisble: false,
      isFirstEnter: true
    }
  },
  methods: {
    // 事件-点击树结点
    _DataTreeClick (node) {
      this.currentNode = node
      this.pageNum = 1
      this.query.tcSjibm = this.currentNode.id
      this.$refs.dataFilter.bindData.cxlx = 0
      this.$refs.dataFilter.bindData.tcSjubm = ''
      this.$refs.dataFilter.bindData.tcSjnr = ''
      this.getListData()
    },
    // 事件-数据字典树加载完成
    _DataTreeLoaded (tree) {
      this.currentNode = tree[0]
      this.query.tcSjibm = this.currentNode.id
      this.getListData()
    },
    // 事件-条件查询
    _DataFilterQuery () {
      this.getListData()
    },
    // 事件-表格按钮点击
    _ButtonClick (type) {
      switch (type) {
        case 'delete':
        if (this.selection.length > 0) {
          this.$confirm('是否删除所选数据？').then(() => {
            this.deleteData()
          }).catch(err => {})
        } else {
          this.$alert('请选择需要删除的数据！').catch(err => {})
        }
        break;
        case 'add':
        this.dlgAddVisble = true
        break;
      }
    },
    // 事件-双击表格行列
    _DataGridDblClick (row) {
      this.currentRow = row
      this.dlgUpdateVisble = true
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getListData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    _DlgAddOpen () {
      this.$refs.formAdd.reset()
    },
    _DlgUpdateOpen () {
      this.$refs.formUpdate.setFormData(this.currentRow)
    },
    // 事件-对话框点击
    _FormAddControl (type, formData) {
      this.dlgAddVisble = false
      this.addData(formData)
    },
    // 事件-对话框点击
    _FormUpdateControl (type, formData) {
      this.dlgUpdateVisble = false
      this.saveData(formData)
    },
    // 删除数据
    async deleteData () {
      const deletes = this.selection.map(item => item.tcSjubm).join(',')
      const result = await Model.deleteDataDictItem(deletes)
      if (result) {
        this.refresh()
      }
    },
    // 新增数据
    async addData (data) {
      const result = await Model.getDataDictMax(this.query.tcSjibm)
      let code = ''
      if (result.data) {
        const num = parseInt(result.data, 10) + 1
        const length = result.data.length
        const prefixZero = length - num.toString().length ? new Array(length - num.toString().length).join(',').split(',').map(item => '0').join('') : ''
        code = prefixZero + num.toString()
      } else {
        code = this.query.tcSjibm + '01'
      }

      data.tcSjibm = this.query.tcSjibm
      data.tcSjubm = code
      const res = await Model.saveDataDictItem(data)
      if (res) {
        this.refresh()
      }
    },
    // 保存数据
    async saveData (data) {
      const result = await Model.saveDataDictItem(data)
      this.refresh()
    },
    // 获取列表数据
    async getListData () {
      const dataFilter = this.$refs.dataFilter.bindData
      const result = await Model.getDataDictList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcSjibm: this.query.tcSjibm,
          cxlx: dataFilter.cxlx,
          tcSjubm: dataFilter.tcSjubm,
          tcSjnr: dataFilter.tcSjnr,
        }
      })
      if (result.data) {
        this.list = result.data
        this.list.forEach(item => item.isEnd = item.tnSfmj ? '是' : '否')
        this.pageTotal = result.total
      }
    },
    refresh () {
      this.getListData()
      this.$refs.dataTree.refresh()
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getListData()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
