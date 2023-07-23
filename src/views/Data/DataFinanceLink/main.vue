<template>
  <CustomView>
    <CustomToolbar slot="top">
      <el-select slot="left" v-model="evalType" size="mini" @change="_SelectEvalTypeChange">
        <el-option v-for="option in options['evalType']" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <CustomButton icon="save" text="保存" @click="_ButtonSaveClick"/>
    </CustomToolbar>

    <div class="common-editable">
      <el-table stripe border height="100%" :data="list" size="mini" class="grid-table" header-cell-class-name="grid-table-hd">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="tcXxxmc" label="名称" min-width="200px"></el-table-column>
        <el-table-column prop="tnXxxsjlx" label="数据类型" width="75px">
          <span slot-scope="scope">{{dataEnum.type[scope.row.tnXxxsjlx]}}</span>
        </el-table-column>
        <el-table-column prop="tnXxxsjcd" label="数据长度" width="75px"></el-table-column>
        <el-table-column prop="tnXxxlrfs" label="录入方式" width="75px">
          <span slot-scope="scope">{{dataEnum.method[scope.row.tnXxxlrfs]}}</span>
        </el-table-column>
        <el-table-column label="关联安防设施类型" width="150px">
          <select v-model="scope.row['facilityType']" slot-scope="scope" @change="_SelectFacilityTypeChange(scope.row)">
            <option v-for="option in options['facilityType']" :key="option.tcSjubm" :value="option.tcSjubm">{{option.tcSjnr}}</option>
          </select>
        </el-table-column>

        <el-table-column label="关联安防设施信息项" min-width="200px">
          <select v-model="scope.row['facilityItem']" slot-scope="scope" :disabled="scope.row['facilityType'] === ''">
            <option v-for="option in createFacilityList(scope.row)" :key="option.tnAfabszid" :value="option.tnAfabszid">{{option.tcXxxmc}}</option>
          </select>
        </el-table-column>
      </el-table>
    </div>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
export default {
  name: 'DataFinanceLink',
  mixins: [
    Mixin.init,
  ],
  data () {
    return {
      dict: ['0301', '0310'],
      options: {
        evalType: [],
        facilityType: []
      },
      dataEnum: {
        type: {
          0: '整数',
          1: '字符',
          2: '浮点',
        },
        method: {
          1: '填写',
          2: '单选',
          3: '多选',
          4: '下拉',
          5: '日期',
        }
      },
      list: [],
      originList: [],
      evalType: '',
      evalTypeText: '',
      facilityType: {},
      isFirstEnter: true
    }
  },
  methods: {
    // 初始化
    $init (options) {
      if (options) {
        if (options['0310']) {
          this.options.evalType = options['0310']
          if (this.options.evalType.length) {
            this.evalType = this.options.evalType[0].tcSjubm
            this.evalTypeText = this.options.evalType[0].tcSjnr
            this.getEvalList()
          }
          this.options.facilityType = [{ tcSjubm: '', tcSjnr: '请选择' }].concat(options['0301'])
        }
      }
    },
    // 事件 - 切换评估类型
    _SelectEvalTypeChange (value) {
      const idx = this.options.evalType.findIndex(item => item.tcSjubm === value)
      this.evalTypeText = this.options.evalType[idx].tcSjnr
      this.getEvalList()
    },
    async _SelectFacilityTypeChange (row) {
      const type = row['facilityType']
      row.facilityItem = ''
      if (type && typeof this.facilityType[type] === 'undefined') {
        const list = await this.getFacilityList(type)
        this.$set(this.facilityType, type, list)
      } 
    },
    createFacilityList (row) {
      const list = this.facilityType[row.facilityType] || []
      return list.filter(item => (item.tnXxxlrfs === row.tnXxxlrfs) && (item.tnXxxsjlx === row.tnXxxsjlx) && (item.tnXxxsjcd === row.tnXxxsjcd) && (item.tcXxxxxxnr === row.tcXxxxxxnr)) 
    },
    // 事件 - 点击保存按钮
    _ButtonSaveClick () {
      this.saveListData()
    },
    // 获取评估信息项列表
    async getEvalList () {
      const result = await Model.getEvalList(this.evalType)
      if (result.data) {
        this.list = result.data.map(item => ({
          ...item,
          facilityType: ''
        }))
        this.getLinkList()
      }
    },
    async getFacilityList (type) {
      const result = await Model.getFacilityList(type)
      return result.data || []
    },
    async getLinkList () {
      const result = await Model.getLinkList(this.evalType)
      const linkData = result.data || []
      this.list.forEach(row => {
        const idx = linkData.findIndex(item => item.tnPgjbxxbid === row.tnPgjbxxbid)
        if (idx >= 0) {
          row.facilityType = linkData[idx].tcAfabxxxlx
          row.facilityItem = linkData[idx].tnAfabszid
        }
      })

      const types = Array.from(new Set(
        this.list
        .filter(row => row.facilityType)
        .map(row => row.facilityType)
        .filter(type => !this.facilityType[type])
      ))

      if (types.length) {
        const results = await Promise.all(types.map(type => this.getFacilityList(type)))
        types.forEach((type, idx) => {
          this.$set(this.facilityType, type, results[idx])
        })
      }
    },
    // 保存关联信息
    async saveListData () {
      const list = this.list.filter(row => row.facilityType)
      if (list.filter(row => !row.facilityItem).length) {
        this.$msgbox({
          message: '关联安防设施信息项不能为空',
          type: 'warning'
        })
      } else {
        const data = list.map(row => ({
          tnPgjbxxbid: row.tnPgjbxxbid,
          tcAfabxxxlx: row.facilityType,
          tnAfabszid: row.facilityItem
        }))

        const result = await Model.saveListData({
          tcPgxxxlx: this.evalType,
          glxmList: data
        })
        if (result.state === '1') {
          this.$message({
            message: '关联信息保存成功',
            duration: 1000,
          })
          this.getEvalList()
        }
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.evalType && this.getEvalList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
