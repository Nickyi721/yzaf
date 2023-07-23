<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增自定义报表' : '自定义报表详情' }]">
    <div slot="top">
      <el-form :model="formData" ref="ruleForm" label-width="80px" class="common-info-form">
        <el-form-item label="报表名称">
          <el-input v-model="formData['tcZdybbmc']" size="mini" placeholder="请输入报表名称" maxlength='30'></el-input>
        </el-form-item>
        <el-form-item label="报表说明">
          <el-input type="textarea" rows="2" v-model="formData['tcBbsm']" size="mini" placeholder="请输入报表说明" maxlength='160'></el-input>
        </el-form-item>
      </el-form>
      <CustomToolbar>
        <template slot="left">
          <span class="common-mark-text" >字母带蓝色标志为计算公式可填选项,如: </span>
          <el-badge class="common-mark-text" type="primary" is-dot>A</el-badge>
        </template>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
        <CustomButton icon="add" text="保存" @click="_ButtonSaveClick" :disabled="!list.length"/>
      </CustomToolbar>
    </div>
    
    <EditableList :list="list" @selection-change="_EditableListChange" :isUpdate="isUpdate" :delIds="delIds" />
  </CustomView>
</template>

<script>
import Mixin from './mixins'
import _ from 'lodash'
import Model from './model.js'
import EditableList from './components/EditableList.vue'
export default {
  components: { EditableList },
  mixins: [
    Mixin
  ],
  data () {
    return {
      title: this.$route.query.type === 'update' ? '修改自定义报表' : '新增自定义报表',
      formData: {},
      isUpdate: this.$route.query.type === 'update',
      list: [],
      delIds: []
    }
  },
  methods: {
    async $init (options) {
      const { type, templateId } = this.$route.query
      if (type === 'update') {
        const result = await Model.getListData({
          tcZdybbid: templateId
        })
        if (result.state === '1') {
          const { tcZdybbmc, tcBbsm, xxglZdybbtiDto } = result.data
          this.formData = { tcZdybbmc, tcBbsm }
          const list = xxglZdybbtiDto
          this.$set(this, 'list', list)
          this._setListOrder(this.list)
        }
      }
    },
    getTnCanUse (code) {
      let result = false
      this.list.forEach(item => {
        if (item.tnLxh === code) {
          result = item.canUse
        }
        for (let i = 0; i < item.zdybbtiList.length; i++) {
          let ceil = item.zdybbtiList[i]
          if (ceil.tnLxh === code) {
            result = ceil.canUse
            break
          }
        }
      })
      return result
    },
    _ButtonAddClick () {
      //  const num = Math.max.apply(null, this.list.map(row => row.tnLbh))
      if (this._maxLength(this.list)) {
        this.$msgbox({
          message: '报表列最大为26',
          type: 'warning'
        })
        return false
      }
      this.list.push({
        // tnLbh: this.list.length ? num + 1 : 0, // 序号
        tcLmc: '', //  名称
        tnSfmj: 1, // 是否末级 0否 1是
        tnSftj: 0, // 统计
        tnSjlx: '', // 数据类型
        tcBblsz: '', // 列设置
        tcLrfs: '', // 录入方式
        zdybbtiList: [] // 子类
      })
      this._setListOrder(this.list)
    },
    _ButtonSaveClick () {
      let resulData = []
      this.list.forEach(item => {
        resulData.push(item)
        resulData = [...resulData, ...item.zdybbtiList]
      })
      if (!this.formData.tcZdybbmc) {
        this.$msgbox({
          message: '报表名称不能为空',
          type: 'warning'
        })
      } else if (!this.formData.tcBbsm) {
        this.$msgbox({
          message: '报表描述不能为空',
          type: 'warning'
        })
      } else if (resulData.filter(item => !item.tcLmc).length && resulData.length) {
        this.$msgbox({
          message: '报表列名称不能为空',
          type: 'warning'
        })
      } else if (resulData.filter(item => item.tnSfmj && !_.isNumber(item.tnSjlx)).length) {
        this.$msgbox({
          message: '数据类型未选择',
          type: 'warning'
        })
      } else if (resulData.filter(item => item.tnSfmj && !item.tcLrfs).length) {
        this.$msgbox({
          message: '录入方式未选择',
          type: 'warning'
        })
      } else if (resulData.filter(item => item.tnSfmj && item.tcLrfs === '2' && !item.tcBblsz).length) {
        this.$msgbox({
          message: '请填写报表列设置',
          type: 'warning'
        })
      } else {
        let canSubmit = true
        resulData.forEach((item, index) => {
          if (item.tcBblsz) {
            let arr = item.tcBblsz.split('')
            for (let i = 0; i < arr.length; i++) {
              if (/^[A-Z]+$/.test(arr[i]) && !this.getTnCanUse(arr[i])) {
                this.$msgbox({
                  message: `报表列设置中存在不能计算的报表列${arr[i]}`,
                  type: 'warning'
                })
                canSubmit = false
                return
              }
            }
          }
        })
        if (canSubmit) {
          this.saveListData()
        }
      }
    },
    async saveListData () {
      const { tcZdybbmc, tcBbsm, tnZdybbtid } = this.formData
      let params = {
        tnZdybbtid,
        tcZdybbmc,
        tcBbsm,
        xxglZdybbtiDto: []
      }
      for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i]
        item.tnLbh = i
        item.tcBblsz = item.tcBblsz && item.tcBblsz.replace(/\+/g, '加')
        if (!item.tnSfmj) {
          const { tnLbh, tcLmc, tnSfmj, zdybbtiList, tnZdybbtid, tnSjtid } = item
          params.xxglZdybbtiDto.push({
            tnZdybbtid,
            tnSjtid,
            tnLbh,
            tcLmc,
            tnSfmj,
            tnSftj: 1,
            zdybbtiList: zdybbtiList.map((ceil, index) => {
              ceil.tnLbh = index
              ceil.tcBblsz = ceil.tcBblsz && ceil.tcBblsz.replace(/\+/g, '加')
              return ceil
            })
          })
        } else {
          /*  item.zdybbtiList = item.zdybbtiList.map((ceil, index) => {
             ceil.tnLbh = index
             ceil.tcBblsz = ceil.tcBblsz.replace(/\+/g, '加')
             return ceil
           }) */
          params.xxglZdybbtiDto.push(item)
        }
      }
      let result = {}
      if (this.$route.query.type === 'update') {
        params.delIds = this.delIds
        params.tcZdybbid = this.$route.query.templateId
        result = await Model.updateListData(params)
      } else {
        result = await Model.saveListData(params)
      }
      if (result.state === '1') {
        this.$message({
          message: '保存成功',
          duration: 1000,
          onClose: () => {
            this.$router.go(-1)
          }
        })
      }
    },
    _EditableListChange (selection) {
      this.selection = selection
    }
  },
  created () {
    this.$init()
  }
}
</script>
