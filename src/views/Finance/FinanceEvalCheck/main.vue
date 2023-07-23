<template>
  <CustomView>
    <!-- 侧栏：机构树 -->
    <CommonOrgTree slot="side" fnCode="000405" module="eval" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>    
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <Sample/>
      <InfoCard :title="currentOrg.name" :info="orgInfo"/>
      <CustomToolbar>
        <CustomButton icon="add" text="审核" @click="_ButtonCheckClick"/>
        <CustomButton icon="add" text="安全评估计分表" @click="_ButtonScoreClick"/>
      </CustomToolbar>
    </div>
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <!-- <CustomPage :page="page" @rows-change="_DataGridRowsChange" @page="_DataGridPage"/> -->
      <CustomPage :total="pageTotal" :rows="pageRows" :pageNum="pageNum" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    <!-- 审核弹框 -->
    <CustomDialog title="审核" :visible="dlgAuditVisble" @close="dlgAuditVisble = false" @open="_DlgAuditOpen">
      <AuditPass ref="formAudit" @control="_AuditControl" />
    </CustomDialog>
  </CustomView>
</template>

<style lang="scss">
</style>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Moment from 'moment'

import InfoCard from './components/InfoCard.vue'
import DataGrid from './components/DataGrid.vue'
import AuditPass from './components/AuditPass.vue'
import Sample from './components/Sample.vue'

export default {
  name: 'FinanceEvalCheck',
  mixins: [Mixin.init, Mixin.page],
  components: {
    InfoCard,
    DataGrid,
    AuditPass,
    Sample
  },
  data () {
    return {
      orgInfo: {},
      list: [],
      selection: [],
      dlgAuditVisble: false,
      currentOrg: {},
      isFirstEnter: true
    }
  },
  methods: {
    _DlgAuditOpen() {
      this.$refs.formAudit.reset();
    },
    // 事件-点击树节点
    _OrgTreeClick (node) {
      this.currentOrg = node;
      this.orgInfo = node;
      this.pageNum = 1;
      this.getNotAduitData(node.id)
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded (node) {
      this.currentOrg = node;
      this.orgInfo = node;
      this.getNotAduitData(node.id);
    },
    // 事件-双击表格
    _DataGridDblClick(row) {
      this.$router.push({ 
        path: '/finance/eval/check/detail', 
        query: { 
          orgCode: row.tcDwdm, 
          orgName: row.tcDwmc,
          evalId: row.tnPgnrzbid,
        } 
      })
    },
    // 事件-行选
    _DataGridSelectionChange(selection) {
      this.selection = selection;
    },
    // 事件-审核按钮
    _ButtonCheckClick() {
      if(this.selection.length < 1) {
        this.$alert("请选择要审核的记录");
      } else if(this.selection.length > 1) {
        this.$alert("只能选择一条记录审核")
      } else {
        if(this.selection[0].tnGzzid) {
          if(this.selection[0].tcZzid == JSON.parse(window.sessionStorage.user).tnYhid) {
            this.dlgAuditVisble = true;
          } else {
            this.$message({
              message:"只能审核属于工作组的记录!",
              type: 'warning',
              showClose: true,
              duration: 1000,
              customClass: "middle",
            })
          }
        } else {
          this.dlgAuditVisble = true;
        }
      }
    },
    // 事件-计分表按钮
    _ButtonScoreClick() {
      if(this.selection.length < 1) {
          this.$alert("请选择要查看的记录");
        } else if(this.selection.length > 1) {
          this.$alert("只能选择一条记录查看")
        } else {
          this.$router.push({
          path: '/finance/eval/check/sheet', 
          query: {curOrg: JSON.stringify(this.selection[0])}
        })
        }
    },
    // 事件-审核弹框 确定
    async _AuditControl(formData) {
      let curData = {
        tnPgnrzbid: this.selection[0].tnPgnrzbid,
        tnPgztid: formData.tnPgztid,
        tcShyj: formData.tcShyj
      }
      if(curData.tnPgztid) {
        const result = await Model.setFSEvaAuditStatus({
          isQuery: 0,  //是否是查询类 0-否 1-是
          cdId: '0004050202', 
          requestData: {
            tnPgnrzbid: curData.tnPgnrzbid,
            tnPgztid: curData.tnPgztid,
            tcShyj: curData.tcShyj
          }
        });
        if(result.state === '1') {
          this.$message({
            message: '审核成功',
            duration: 1000,
            customClass: 'middle',
            onClose: () => {
              this.dlgAuditVisble = false;
              this.getNotAduitData(this.currentOrg.id)
            }
          })
        }
      } else {
        this.$alert('请选择是否审核通过')
      }
    },
    // 事件-改变每页显示数量
    _PageRowsChange(num) {
      this.pageRows = num;
      this.pageNum = 1;
      this.getNotAduitData(this.info.id);
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this.getNotAduitData(this.info.id);
    },
    // 获取未审核数据列表
    async getNotAduitData(data) {
      const result = await Model.getFSEvaNotAuditList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '0004050202', 
        requestData: {
          tcDwdm: data,
        }
      });
      if(result.data) {
        this.list = result.data;
        this.pageTotal = result.total;
        let len = this.list.length
        for(let i =0; i < len; i++) {
          this.list[i].tdKspgsj = Moment(this.list[i].tdKspgsj).format('YYYY-MM-DD')
        }
      }
    },
  },
  activated () {
    if(!this.isFirstEnter) {
      this.currentOrg && this.getNotAduitData(this.currentOrg.id)
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
