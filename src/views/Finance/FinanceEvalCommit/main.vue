<template>
  <CustomView>
    <!-- 侧栏 -->
    <CommonOrgTree slot="side" fnCode="000405" module="eval" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top" v-if="!(this.currentOrg.type === '2' && this.currentOrg.hasChild)">
      <Sample/>
      <InfoCard :title="currentOrg.name" :info="orgInfo"/>
      <CustomToolbar>
        <CustomButton icon="edit" text="评估类型设置" @click="_ButtonClick('edit')"/>
        <CustomButton icon="delete" text="删除" @click="_ButtonClick('delete')"/>
        <CustomButton icon="add" text="开始评估" @click="_ButtonClick('add')"/>
        <CustomButton icon="add" text="提交评估" @click="_ButtonClick('commit')"/>
      </CustomToolbar>
    </div>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_GridSelectionChange" v-if="!(this.currentOrg.type === '2' && this.currentOrg.hasChild)">
      <CustomPage :total="pageTotal" :rows="pageRows" :pageNum="pageNum" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
    
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Moment from 'moment'

import DataGrid from './components/DataGrid/main.vue'
import InfoCard from './components/InfoCard/main.vue'
import Sample from './components/Sample.vue'

export default {
  name: 'FinanceEvalCommit',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataGrid,
    InfoCard,
    Sample
  },
  data () {
    return {
      // 机构信息
      currentOrg: {},
      orgInfo: {},
      // 列表
      list: [],
      // 分页
      total: 0,
      rows: 20,
      pageNum: 1,
      hasCommiting: 0,
      hasPgsj: 0,
      selection: [],
      isFirstEnter: true
    }
  },
  methods: {
    $init (options) {
      this.currentOrg.id = JSON.parse(window.sessionStorage.user).tcDwdm
      this.getListData()
    },
    // 事件-点击树结点
    _OrgTreeClick (node) {
      this.orgInfo = node
      this.currentOrg = node
      if (!(this.currentOrg.type === '2' && this.currentOrg.hasChild)) {
        this.pageNum = 1
        this.getListData()        
      }
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded (node) {
      this.orgInfo = node
      this.currentOrg = node
      // this.getListData()
    },
    // 事件-按钮点击
    async _ButtonClick (type) {
      switch (type) {
        case 'edit':
          const result = await Model.checkStatus({
            tcDwdm: this.currentOrg.id,
          })
          if(result.msg === '1') {
            this.$router.push({
              path: '/finance/eval/commit/type',
              query: {
                type: 'setting',
                orgCode: this.currentOrg.id, 
                orgName: this.currentOrg.name,
              }
            })
          } else {
            this.$message({
              message: '当前单位在本次评估时间段内已有评估记录，暂不能设置评估类型',
              duration: 3000,
              customClass: 'middle',
              type: 'warning',
              showClose: true
            })
          }
          break;
        case 'delete':
          if (this.selection.length > 0) {
            let deleteAble = 1
            this.selection.forEach(item => {
              if(item.tnPgztid === 1 || item.tnPgztid === 3) {
                deleteAble = 0
              }
            })
            if(deleteAble === 1) {
              this.$confirm('是否删除所选数据？').then(() => {
                this.deleteData(this.selection)
              }).catch(err => {})
            } else {
              this.$message({
                message: '只能删除未提交或者审核未通过的评估记录',
                duration: 2000,
                customClass: 'middle',
                type: 'warning',
                showClose: true
              })
            }
          } else {
            this.$alert('请选择需要删除的数据！').catch(err => {})
          }
          break;
        case 'add':
          if(this.list.length !== 0 && this.hasCommiting === 1 && this.hasPgsj === 1) {
            this.$message({
              message: '当前单位在本次评估时间段内已有“正在评估”记录，不可重复评估',
              duration: 3000,
              customClass: 'middle',
              type: 'warning',
              showClose: true
            })
          } else {
            const result = await Model.getEvalStatus({
              tcDwbm: this.currentOrg.id,
              tnPgnrzbid: '',
            })
            if(result.data == null && result.state === '1') {
              if(result.msg === '当前不在评估时间内。') {
                this.$message({
                  message: '当前不在评估时间内',
                  duration: 2000,
                  customClass: 'middle',
                  type: 'warning'
                })
              } else {
                window.$app.$msgbox({
                  message: '请设置评估类型',
                  type: 'alert'
                })
                this.$router.push({
                  path:'/finance/eval/commit/type',
                  query:{
                    orgCode:this.currentOrg.id,
                    orgName:this.currentOrg.name,
                    tcPgrid: JSON.parse(window.sessionStorage.user).tnYhid,
                    tnPgztid: 0,
                    isGroup: this.currentOrg.type === '2' ? 1 : 0,
                    pgsjbzw: 1
                  } 
                })
              }
            } else {
              this.$router.push({ 
                path: '/finance/eval/form',
                query: { 
                  orgCode: this.currentOrg.id, 
                  orgName: this.currentOrg.name,
                  tcPgrid: JSON.parse(window.sessionStorage.user).tnYhid,
                  tnPgztid: 0,
                  isGroup: this.currentOrg.type === '2' ? 1 : 0,
                  jumpMode: 'button'
                }
              })
            }
          }
          break;
        case 'commit':
          if(this.selection.length === 0) {
            this.$alert('请选择需要提交的评估数据！').catch(err => {})
          } else {
            if (this.selection[0].tnPgztid === 3){
              this.$alert('审核通过的数据不能再次提交').catch(err => {})
            } else if(this.selection.length === 1) {
              if(this.selection[0].tcPgrid != JSON.parse(window.sessionStorage.user).tnYhid) {
                this.$message({
                  message: '只能提交当前用户的评估记录',
                  duration: 2000,
                  customClass: 'middle',
                  type: 'warning'
                })
              } else {
                this.$confirm('是否提交所选数据？').then(() => {
                  this.commitData(this.selection)
                }).catch(err => {})
              }
            } else if(this.selection.length > 1) {
              this.$alert('每次只能提交一条数据！').catch(err => {})
            }
          }
          break;
      }
    },
    // 事件-双击表格行列
    _DataGridDblClick (row) {
      this.$router.push({ 
        path: '/finance/eval/form',
        query: { 
          orgCode: row.tcDwdm, 
          orgName: row.tcDwmc,
          evalId: row.tnPgnrzbid,
          tcPgrid: row.tcPgrid,
          tnPgztid: row.tnPgztid,
          isGroup: this.currentOrg.type,
          pgsjbzw: row.pgsjbzw,
          jumpMode: 'dbclick'
        } 
      })
    },
    _GridSelectionChange (selection) {
      this.selection = selection
    },
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getListData()
    },
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    // 删除数据
    async deleteData (selection) {
      const result = await Model.deleteEvalData({
        tnPgnrzbid: selection.map(item => item.tnPgnrzbid).join(',')
      })
      if (result.state === '1') {
        this.$message({
          message: '删除成功',
          duration: 1000,
          customClass: 'middle',
          onClose: () => {
            this.getListData()
          }
        })
      }
    },
    // 提交评估
    async commitData (selection) {
      const data = selection[0]
      const result = await Model.commitEvalData({
        tnPgnrzbid: data.tnPgnrzbid,
        tcDwdm: data.tcDwdm,
      })
      if (result.state === '1') {
        this.$message({
          message: '成功提交评估数据',
          duration: 1000,
          customClass: 'middle',
          onClose: () => {
            this.getListData()
          }
        })
      }
    },
    // 获取列表数据
    async getListData () {
      this.hasCommiting = 0
      this.hasPgsj = 0
      const result = await Model.getEvalList({
        rows: this.rows,
        pageNum: this.pageNum,
        requestData: {
          tcDwdm: this.currentOrg.id
        }
      })
      if (result.data) {
        this.list = result.data
        this.list.forEach(item => {
          item.tdKspgsj = Moment(item.tdKspgsj).format('YYYY-MM-DD')
          if(item.tnPgztid === 0 && item.tcPgrid == JSON.parse(window.sessionStorage.user).tnYhid) {
            this.hasCommiting = 1
          }
          if(item.pgsjbzw == 1 && item.tcPgrid == JSON.parse(window.sessionStorage.user).tnYhid) {
            this.hasPgsj = 1
          }
        })
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
      this.currentOrg && this.getListData (this.currentOrg.id) 
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
