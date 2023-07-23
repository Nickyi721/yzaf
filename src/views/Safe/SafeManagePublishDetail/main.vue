<template>
   <CustomView :location="[{ text: $route.query.type === 'add' ? '新增检查计划' : '检查计划详情' }]">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="计划名称" prop="tcJhmc">
        <el-input v-model="formData['tcJhmc']" size="mini" placeholder="请输入计划名称" :disabled="$route.query.type !== 'add'"></el-input>
      </el-form-item>

      <el-form-item label="检查内容" prop="tnAqjcbid">
        <el-select @change="_CheckContentChange" v-model="formData['tnAqjcbid']" size="mini" placeholder="请选择检查内容" :disabled="$route.query.type !== 'add'">
          <el-option v-for="option in optionsCheckContent" :key="option.tnAqjcbid" :label="option.tcAqjcbmc" :value="option.tnAqjcbid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="计划说明" prop="tcJhsm">
        <el-input v-model="formData['tcJhsm']" type="textarea" :rows="3" size="mini" placeholder="请输入计划说明" :disabled="$route.query.type !== 'add'"></el-input>
      </el-form-item>

      <el-form-item label="截止时间" prop="tcJhjzsj">
        <el-date-picker v-model="formData['tcJhjzsj']" :picker-options="pickerOptions" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择截止时间" :disabled="$route.query.type !== 'add'"></el-date-picker>
      </el-form-item>

      <el-form-item label="提醒天数" prop="tnTxts">
        <el-input v-model="formData['tnTxts']" size="mini" type="number" @change="txtsChange" placeholder="请输入提醒天数" :disabled="$route.query.type !== 'add'"></el-input>
      </el-form-item>

      <el-form-item label="工作组" prop="gzzidSub" v-if="this.$route.query.planType == 0 || this.$route.query.type === 'add'">
        <el-table
          stripe
          highlight-current-row
          :data="groupList"
          size="mini"
          height="400px"
          class="list-table"
          header-cell-class-name="table-hd" 
          @selection-change="_TableSelectionChange" 
          >
          <el-table-column v-if="groupType=='checkedGroup'" type="index"></el-table-column>
          <el-table-column v-else type="selection"></el-table-column>
          <el-table-column label="工作组名称" prop="tcJczmc"></el-table-column>
          <el-table-column label="有效开始时间" prop="tcYxkssj"></el-table-column>
          <el-table-column label="有效结束时间" prop="tcYxjssj"></el-table-column>
          <!-- <el-table-column prop="tcJczmc" label="单位名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{scope.row.workGroupFz.filter(el=>el.tnLx===1).map(el => el.tcMc).join(',')||scope.row.workGroupFz.map(el => el.tcMc).join(',')}}</p>
            </template>
          </el-table-column> -->
          <!-- <el-table-column v-if="groupType=='checkedGroup'" prop="tcJczmc" label="工作组用户" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{scope.row.workGroupFz.filter(el=>el.tnLx===0).map(el => el.tcMc).join(',')}}</p>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form-item>
      <el-form-item label="被检单位" v-if="this.$route.query.planType == 1">
        <CommonMultiSelect class="form-tree" ref="orgTree" fnCode="000406" style="height: 400px" :apiUrl='treeApi' :requestData='treeRequestData' />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick" v-if="$route.query.type === 'add'">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<script>
import Model from './model.js'

import Validator from '@commons/validator.js'
import { log } from 'util';

export default {
  data () {
    return {
      treeApi: 'checkPlan/getOrgListTreeByAsync',
      treeRequestData: {
        name: 'tnRwid',
        id: this.$route.query.curPlan || '0'
      },
      groupList: [],
      groupType: '',
      formData: {
        bjdw: [],
        gzzidSub: '',
      },
      // 限制今天之前的时间不能选择
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      optionsCheckContent: [],
      rules: {
        tcJhmc: [
          Validator.required('请输入计划名称'),
          Validator.length(1, 60)
        ],
        tnAqjcbid: [
          Validator.required('请选择安全检查表'),
        ],
        tcAqjcbmc: [
          Validator.required('请选择检查内容')
        ],
        tcJhjzsj: [
          Validator.required('请选择计划截止日期')
        ],
        tcJhsm: [
          Validator.length(1, 200)
        ],
        tnTxts: [
          Validator.required('请输入提醒天数'),
          Validator.isNumber()
        ],
        gzzidSub: [
          Validator.required('请选择工作组')
        ]
      }
    }
  },
  methods: {
    // 提醒天数判断
    txtsChange () {
      const txts = this.formData['tnTxts']
      const jzsj = this.formData['tcJhjzsj']
      const restDay = Math.ceil((Date.parse(jzsj) - Date.now()) / 86400000)
      if (restDay < txts) {
        this.formData['tnTxts'] = restDay
      }
    },
    // 检查内容下拉-change事件
    _CheckContentChange (val) {
      // 检查表名称
      let objCheckContent = this.optionsCheckContent.find((item) => {
        return item.tnAqjcbid === val
      })
      this.formData.tcAqjcbmc = objCheckContent.tcAqjcbmc
      this.formData.tcAqjcbid = val
    },
    // 单位树勾选
    _OrgTreeCheckChange () {
      let data = this.$refs.orgTree.getCheckedNodes()
      let newData = data.map(item => {
        const { xjxz, id, bjxz } = item
        if (xjxz && xjxz !== 3) {
          return {
            mode: xjxz,
            tcDwdm: id,
            selected: !!bjxz
          }
        } else {
          return {
            tcDwdm: id,
            selected: !!bjxz
          }
        }
      })
      return newData
    },
    // 获取检查内容 列表
    async getCheckContent () {
      const result = await Model.getCheckContent({
        isQuery: 0,
        cdId: '0004060101'
      })
      if (result.data) {
        this.optionsCheckContent = result.data
      }
    },
    async getCheckPlanDetail () {
      const result = await Model.getCheckPlanDetail({
        isQuery: 1,
        cdId: '0004060101',
        requestData: {
          tnAqjcjhid: this.$route.query.curPlan
        }
      })
      if (result.data) {
        this.formData = result.data
        this.formData.tnAqjcbid = parseInt(this.formData.tnAqjcbid)
      }
    },
    // 事件-保存
    async _ButtonSaveClick () {
      // if (this.$refs.orgTree.isLoading) {
      //   this.$msgbox({
      //     message: `正在加载数据请稍后！`,
      //     type: 'warning'
      //   })
      //   return
      // }
      // this.formData.bjdw = this._OrgTreeCheckChange()
      // if (!this.formData.bjdw.length) {
      //   this.$msgbox({
      //     message: `请选择单位`,
      //     type: 'warning'
      //   })
      //   return
      // }
      this.$refs.ruleForm.validate(async (valid, obj) => {
        if (valid) {
          if (this.$route.query.type === 'add') {
            this.formData.tnTxts = parseInt(this.formData.tnTxts)
            const result = await Model.saveCheckPlan({
              isQuery: 0,
              cdId: '0004060101',
              requestData: {
                tcJhmc: this.formData.tcJhmc || '',
                tcJhsm: this.formData.tcJhsm || '',
                tcJhjzsj: this.formData.tcJhjzsj || '',
                tnTxts: (this.formData.tnTxts || this.formData.tnTxts == 0) ? this.formData.tnTxts : '',
                tnAqjcbid: this.formData.tcAqjcbid || '',
                tcAqjcbmc: this.formData.tcAqjcbmc || '',
                gzzidSub: this.formData.gzzidSub
                // bjdw: this.formData.bjdw
              }
            })
            if (result.state === '1') {
              this.$message({
                message: '新增成功！',
                type: 'success',
                showClose: true,
                duration: 1000,
                customClass: 'middle'
              })
              this.$router.push({ path: '/safe/manage/publish' })
            }
          } else {
            const result = await Model.saveCheckPlan({
              isQuery: 0,
              cdId: '0004060101',
              requestData: {
                tnAqjcjhid: this.formData.tnAqjcjhid,
                tcJhmc: this.formData.tcJhmc || '',
                tcJhsm: this.formData.tcJhsm || '',
                tcJhjzsj: this.formData.tcJhjzsj || '',
                tnTxts: this.formData.tnTxts || '',
                tnAqjcbid: this.formData.tnAqjcbid || '',
                tcAqjcbmc: this.formData.tcAqjcbmc || '',
                gzzidSub: this.formData.gzzidSub
                // bjdw: this.formData.bjdw
              }
            })
            if (result.state === '1') {
              this.$message({
                message: '修改成功！',
                type: 'success',
                showClose: true,
                duration: 1000,
                customClass: 'middle'
              })
              this.$router.push({ path: '/safe/manage/publish' })
            }
          }
          this.$refs.ruleForm.clearValidate()
          this.dlgTypeVisble = false
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    async getCheckGroup () {
      const result = await Model.getCheckGroup()
      if (result.state === '1') {
        this.groupList = result.data
        // this.groupType = 'checkGroup'
      }
    },
    async getCheckedGroup () {
      const result = await Model.getCheckedGroup({
        isQuery: 0,
        cdId: '0004060101',
        requestData: {
          tnAqjcjhid: this.$route.query.tnAqjcjhid
        }
      })
      if (result.state === '1') {
        this.groupList = result.data
        // this.groupType = 'checkedGroup'
      }
    },
    _TableSelectionChange (selection) {
      this.formData.gzzidSub = selection.map(item => item.tnGzzszbid).join(',')
    }
  },
  beforeMount(){
    if (this.$route.query.type === 'detail') {
      this.groupType = 'checkedGroup'
    }else{
      this.groupType = 'checkGroup'
    }
  },
  created () {
    // 获取检查内容
    this.getCheckContent()
    // 获取计划详情
    if (this.$route.query.type === 'detail') {
      this.getCheckPlanDetail()
    }
    this.$route.query.type === 'add' ? this.getCheckGroup() : this.getCheckedGroup()
  }
}
</script>

<style lang="scss" scoped>
  @import '~@assets/styles/define.scss';

  .list-table{
    border: 1px solid $border;
  }
</style>
