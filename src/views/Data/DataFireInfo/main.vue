<template>
  <CustomView>
    <!-- <CommonOrgTree :search="search" ref="commonTree" slot="side" fnCode="000404" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/> -->
    
    <CustomToolbar slot="top">
      <el-select slot="left" v-model="type" size="mini" @change="_SelectTypeChange">
        <el-option v-for="option in options['type']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
      <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
      <CustomButton icon="save" text="保存" @click="_ButtonSaveClick"/>
    </CustomToolbar>
    <EditableList :list="list" @selection-change="_EditableListChange"/>
  </CustomView>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import EditableList from './components/EditableList.vue'
export default {
  name: 'DataFireInfo',
  components: { 
    EditableList
  },
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      // 数据列表
      list: [],
      dict: ['1001'],
      options: {},
      originList: [],
      selection: [],
      type: '',
      typeText: '',
      isFirstEnter: true,
      search: true
    }
  },
  methods: {
    $init(options){
      if (options && options['1001']) {
        this.options.type = options['1001']
        if (this.options.type.length) {
          this.type = this.options.type[0].tcSjubm
          this.typeText = this.options.type[0].tcSjnr
          this.getListData()
        }
      }
    },
    // 事件 - 切换评估类型
    _SelectTypeChange (value) {
      const idx = this.options.type.findIndex(item => item.tcSjubm === value)
      this.typeText = this.options.type[idx].tcSjnr
      this.getListData()
    },
    // 事件 - 点击删除按钮
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.$confirm('是否删除选中行?').then(() => {
          this.list = this.list.filter(item => this.selection.findIndex(select => select.tnXh === item.tnXh) < 0)
        }).catch(() => {})
      } else {
        this.$alert('请选择数据').catch(() => {})
      }
    },
    // 事件 - 点击新增按钮
    _ButtonAddClick () {
      const num = Math.max.apply(null, this.list.map(row => row.tnXh))
      this.list.push({
        tnXh: this.list.length ? num + 1 : 0,
        tcXxxlx: this.type,
        tcXxxlxmc: this.typeText,
        tnXxxlrfs: 1,
        tnXxxsfbt: 0,
        tnXxxsjcd: 200,
        tnXxxsjlx: 1,
        tcXxxxxxnr: '',
        tnXxxldxid: -1,
        tnXxxldfs: '',
        tnSfzwcxtj: 0,
        // 是否显示
        tnSfxs: 1, 
        // 列宽              
        tnLk: 150,                   
        // 以下用于设置输入框验证样式
        alert: false,
      })
    },
     // 事件 - 点击保存按钮
    _ButtonSaveClick () {
      if (this.list.filter(item => !(item.tcXxxmc && item.tnXxxsjcd)).length) {
        this.$msgbox({
          message: '信息项名称或数据长度不能为空',
          type: 'warning'
        })
      } else if (this.list.filter(item => item.tnXxxldxid >= 0).filter(item => item.tnXxxldfs === 1 && !item.tcXxxldglz).length) {
        this.$msgbox({
          message: '设置了联动的信息项，其联动项关联值不能为空',
          type: 'warning'
        })
      } else if (this.list.filter(item => (item.tnXxxlrfs === 2 || item.tnXxxlrfs === 3 || item.tnXxxlrfs === 4)).filter(item => !item.tcXxxxxxnr ).length) {
        this.$msgbox({
          message: '录入方式设置为单选/多选/下拉的信息项，其选择项内容不能为空',
          type: 'warning'
        })  
      } else if(this.list.filter(item => (item.tnXxxlrfs === 7)).filter(item => !item.tcMxlx).length) {
        this.$msgbox({
          message: '录入方式设置为明细的信息项，其明细类型值不能为空',
          type: 'warning'
        }) 
      } else {
        this.$confirm('是否保存数据?').then(() => {
          this.saveListData()
        }).catch(() => {})
      }
    },
    // 保存数据
    async saveListData() {
      const deleteIds = this.originList.filter(item => this.list.findIndex(row => row.tnXfaqjbxxszid === item.tnXfaqjbxxszid) < 0).map(item => item.tnXfaqjbxxszid)

      const updateList = this.list.map((row, index) => {
        const item = {
          tnXh: row.tnXh,                   // 序号
          tnXfaqjbxxszid: row.tnXfaqjbxxszid || '',     // 主键id
          tcXxxlx: row.tcXxxlx,             // 信息项类型
          tcXxxlxmc: row.tcXxxlxmc,         // 信息项类型名称
          tcXxxmc: row.tcXxxmc,             // 信息项名称
          tnXxxlrfs: row.tnXxxlrfs,         // 信息项录入方式
          tnXxxsfbt: row.tnXxxsfbt,         // 信息项是否必填
          tnXxxsjcd: parseInt(row.tnXxxsjcd),         // 信息项数据长度
          tnXxxsjlx: row.tnXxxsjlx,         // 信息项数据类型
          tcMxlx: row.tcMxlx,               // 明细类型值
          tnXxxplsx: index,                 // 信息项排列顺序

          tcXxxxxxnr: row.tcXxxxxxnr,       // 信息项选择项内容
          tnSfzwcxtj: row.tnSfzwcxtj,       // 是否作为查询条件
          tnSfxs: row.tnSfxs,               // 是否显示
          tnLk: row.tnLk,                   // 列宽
        }
        !(typeof row.tnXxxldfs === 'undefined' || row.tnXxxldfs === '') && (item.tnXxxldfs = row.tnXxxldfs)
        !!row.tcXxxldglz && (item.tcXxxldglz = row.tcXxxldglz)
        if (row.tnXxxldxid >= 0) {
          item.tnXxxldxid = row.tnXxxldxid
          const idx = this.list.findIndex(data => data.tnXh === row.tnXxxldxid)
          item.linkItemText = this.list[idx].tcXxxmc
        }
        row.tnXxxldxid >= 0 && (item.tnXxxldxid = row.tnXxxldxid)
        return item
      })
      updateList.forEach((item, index) => {
        item.tnXh = index
      })
      updateList.forEach((row, index) => {
        if (row.linkItemText) {
          const idx = updateList.findIndex(item => item.tcXxxmc === row.linkItemText)
          row.tnXxxldxid = updateList[idx].tnXh
        }
      })
      
      const result = await Model.saveListData({
        ids: deleteIds,
        jbxxList: updateList
      })
      if (result && result.state === '1') {
        this.$message({
          message: '配置保存成功',
          duration: 1000,
        })
        this.getListData()
      }
    },
    // 列表勾选
    _EditableListChange (selection) {
      this.selection = selection
    },
    // 获取信息项列表
    async getListData () {
      const result = await Model.getListData(this.type)
      if (result && result.data) {
        this.originList = JSON.parse(JSON.stringify(result.data))
        result.data.forEach(item => {
          item.alert = false
          item.tnXxxldxid = typeof item.tnXxxldxid !== 'undefined' ? item.tnXxxldxid : -1
          item.tnXxxldfs = typeof item.tnXxxldfs !== 'undefined' ? item.tnXxxldfs : ''
        })
        this.list = result.data
      }
    },
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
