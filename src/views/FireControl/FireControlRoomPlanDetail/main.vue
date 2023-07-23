<template>
  <CustomView :location="[{text:'消防人员排班详情'}]">
    <div>
      <CustomToolbar>
        <CustomButton v-if="this.$route.query.date >= this.nowDay" icon="add" text="新增" @click="_ButtonAddClick"/>
        <CustomButton v-if="this.$route.query.date >= this.nowDay" icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton icon="export" text="导出" @click="_ButtonExportClick"/>
      </CustomToolbar>
    </div>
    <div class="common-grid">
    <el-table :data="list" @selection-change="handleSelectionChange" size="mini" class="grid-table" ref="table" header-cell-class-name="table-hd" stripe highlight-current-row height="100%">
      <el-table-column type="selection" width="80px" fixed></el-table-column>
      <el-table-column label="姓名" prop="tcAbryxm" width></el-table-column>
      <el-table-column label="开始时间" prop="tcKssj"></el-table-column>
      <el-table-column label="结束时间" prop="tcJssj"></el-table-column>
      <el-table-column label="班次名称" prop="tcBcmc"></el-table-column>
      <el-table-column label="备注" prop="tcBz"></el-table-column>
    </el-table>
    </div>
    <!-- 新增对话框 -->
    <CustomDialog title="新增人员" :visible="dlgAddVisble" @close="dlgAddVisble = false" @open="_DlgAddOpen">
      <FormAdd ref="formAdd" @save="_FormAddSave"/>
    </CustomDialog>

  </CustomView>
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "./model.js";
import Moment from "moment";

import FormAdd from './components/FormAdd.vue'

// 页面组件

export default {
  mixins: [Mixin.init],
  components: {
      FormAdd
  },
  data() {
    return {
      // 数据列表
      list: [],
      selection: [],
      dlgAddVisble: false,
      data:{formData:[]},
      tnRypbxqid:[]
    };
  },
  methods: {
    $init() {
        this.getClass()  
    },
    // 勾选数据
    handleSelectionChange(selection) {
        this.selection = selection
        let id = this.selection.map(item => item.tnRypbxqid)
        this.tnRypbxqid = id.map(item => item.toString())
    },
    // 点击新增按钮
    _ButtonAddClick() {
        this.dlgAddVisble = true
    },
    // 点击删除按钮
    _ButtonDeleteClick() {
        if(this.selection.length){
            this.$confirm('是否删除所选数据?').then(()=>{
                this.deleteClass(this.selection)
            }).catch(err=>{})
        }else{
            this.$msgbox({
                message:'请选择数据',
                type:'warning'
            })
        }
    },
    _DlgAddOpen() {
        this.$refs.formAdd.reset()
    },
    _FormAddSave(query) {
        this.dlgAddVisble = false
        this.formData = query
        this.formData.tcKssj = this.$route.query.date + " " + this.formData.tcKssj    
        this.formData.tcJssj = this.$route.query.date + " " + this.formData.tcJssj  
        this.data.formData.push({tdPbrq:''})
        this.formData.tdPbrq = this.$route.query.date
        this.saveClass()
    },
    _ButtonExportClick() {
      this.exportTable()
    },
    async exportTable() {
      const result = await Model.exportTable({
        isQuery: 0,
        cdId: "00040802",
        requestData:{
          tdPbrq:this.$route.query.date
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
          elink.download = `消防人员排班详情.xls`
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
    async saveClass() {
      const result = await Model.saveClass({
        isQuery: 0,
        cdId: "00040802",
        requestData: this.formData       
      })
      if (result.state==="1") {
        this.$message({
          message:'新增成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        })
        this.getClass()        
      }
    },
    async getClass() {
      const result = await Model.getClass({
        isQuery: 1,
        cdId: "00040802",
        requestData:{
          tdPbrq:this.$route.query.date
        }
      })
      if(result.data){
        this.list = result.data.list
      }
    },
    async deleteClass() {
      const result =  await Model.deleteClass({
        isQuery: 0,
        cdId: "00040802",
        requestData:{
            tnRypbxqidArr:this.tnRypbxqid
          }
      })
      if (result.state==="1") {
        this.$message({
          message:'删除成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        })
        this.getClass()        
      }
    }
  },
  computed: {
    nowDay() {
      return Moment(Moment()).format('YYYY-MM-DD')
    }
  }
};
</script>
