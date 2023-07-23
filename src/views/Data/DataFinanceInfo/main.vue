<template>
  <CustomView>
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
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import EditableList from './components/EditableList.vue'
export default {
  name: 'DataFinanceInfo',
  components: { EditableList },
  mixins: [
    Mixin.init,
  ],
  data () {
    return {
      dict: ['0310'],
      options: {},
      list: [],
      originList: [],
      selection: [],
      type: '',
      typeText: '',
      isFirstEnter: true
    }
  },
  methods: {
    // 初始化
    $init (options) {
      if (options && options['0310']) {
        this.options.type = options['0310']
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
      } else if (this.list.filter(item => (item.tnXxxlrfs !== 1 && item.tnXxxlrfs !== 5)).filter(item => item.tnXxxldfs !== 0).filter(item => !item.tcXxxxxxnr ).length) {
        this.$msgbox({
          message: '设置为单选/多选/下拉录入方式的信息项，其选择项内容不能为空',
          type: 'warning'
        })  
      } else {
        this.$confirm('是否保存数据?').then(() => {
          this.saveListData()
        }).catch(() => {})
      }
    },
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
    // 保存信息项
    async saveListData () {
      const deleteIds = this.originList.filter(item => this.list.findIndex(row => row.tnPgjbxxbid === item.tnPgjbxxbid) < 0).map(item => item.tnPgjbxxbid)

      const updateList = this.list.map((row, index) => {
        const item = {
          tnXh: row.tnXh,                   // 序号
          tnPgjbxxbid: row.tnPgjbxxbid,     // 主键id
          tcXxxlx: row.tcXxxlx,             // 信息项类型
          tcXxxlxmc: row.tcXxxlxmc,         // 信息项类型名称
          tcXxxmc: row.tcXxxmc,             // 信息项名称
          tnXxxlrfs: row.tnXxxlrfs,         // 信息项录入方式
          tnXxxsfbt: row.tnXxxsfbt,         // 信息项是否必填
          tnXxxsjcd: parseInt(row.tnXxxsjcd),         // 信息项数据长度
          tnXxxsjlx: row.tnXxxsjlx,         // 信息项数据类型
          tnXxxplsx: index,                 // 信息项排列顺序
          tcXxxxxxnr: row.tcXxxxxxnr,       // 信息项选择项内容
          tnSfzwcxtj: row.tnSfzwcxtj,       // 是否作为查询条件
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
        delete: deleteIds,
        update: updateList
      })
      if (result) {
        this.$message({
          message: '配置保存成功',
          duration: 1000,
        })
        this.getListData()
      }
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
