<template>
  <CustomView>
    <div slot="top">
      <CustomToolbar slot="top">
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
        <CustomButton icon="delete" text="停用" @click="_ButtonDeleteClick(0)" />
        <CustomButton icon="end" text="启用" @click="_ButtonDeleteClick(1)" />
        <CustomButton icon="export" text="导出" @click="_ButtonExportClick" />
      </CustomToolbar>
    </div>
    <div
      class="common-grid"
      ref="container"
      :style="{ 'paddingBottom': $slots.default ? '0px' : '40px'}"
    >
      <el-table
        :row-class-name="rowClickStyle ? 'click-row' : ''"
        class="grid-table"
        ref="table"
        header-cell-class-name="table-hd"
        stripe
        highlight-current-row
        size="mini"
        height="100%"
        @selection-change="_GridSelectionChange"
        :data="list"
      >
        <el-table-column type="selection" width="80px"></el-table-column>
        <el-table-column label="人员" prop="tcAbryxm" width="300px" align="center"></el-table-column>
        <el-table-column label="备注" prop="tcBz" align="center"></el-table-column>
        <el-table-column label="状态" prop="tnSfyx" align="center">
          <template slot-scope="scope">{{scope.row.tnSfyx | stateFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="400px" align="left">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              :disabled="disabled(scope.row)"
              v-if="!scope.row.tcBz"
              @click="noteAdd(scope.row)"
            >添加备注</el-button>
            <div class="note" v-else>
              <el-button type="primary" size="mini" @click="deleteNote(scope.row)" :disabled="disabled(scope.row)">删除备注</el-button>
              <el-button type="primary" size="mini" @click="noteAdd(scope.row)" :disabled="disabled(scope.row)">修改备注</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
       
      <div class="grid-page" ref="page">
        <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
      </div>
    </div>
   
    <!-- 新增对话框 -->
    <CustomDialog
      title="选择人员"
      width="90%"
      top="40px"
      :visible="dlgAddVisble"
      @close="dlgAddVisble = false"
      @open="_DlgAddOpen"
    >
      <FormAdd ref="formAdd" style="height: 500px" @selected="DataAdd" />
    </CustomDialog>
    <el-dialog :title="beizhu" :visible.sync="dialogFormVisible" wdith="35%">
      <el-form v-model="list">
        <el-form-item label="备注" label-width="40px">
          <el-input type="textarea" rows="4" v-model="list.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveNote()">确 定</el-button>
      </div>
    </el-dialog>
  </CustomView>
</template> 

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "./model.js";

import FormAdd from "./components/FormAdd.vue";

// 页面组件

export default {
  mixins: [Mixin.init, Mixin.Grid, Mixin.page],
  components: {
    FormAdd
  },
  data() {
    return {
      list: [],
      beizhu: "",
      dlgAddVisble: false,
      saveData: [],
      dialogFormVisible: false,
      selection: [],
      tnRyxxgjidArr: [],
      rowClickStyle: true
    };
  },
  filters: {
    stateFilter(data) {
      if (data === 1) {
        return "启用";
      }
      if (data === 0) {
        return "停用";
      }
    }
  },
  methods: {
    $init() {
      this.getFormData();
    },
    _ButtonAddClick() {
      this.dlgAddVisble = true;
    },
    disabled(row) {
      if (row.tnSfyx === 1) {
        return false;
      }
      if (row.tnSfyx === 0) {
        return true;
      }      
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows=num
      this.pageNum = 1
      this.getFormData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getFormData()
    },    
    _DlgAddOpen() {
      this.$refs.formAdd.reset();
      this.$refs.formAdd.getListData();
    },
    DataAdd(selected) {
      this.dlgAddVisble = false;
      this.saveData = [];
      selected.forEach(el => {
        this.saveData.push({
          tnRylx: el.rylx,
          tnAbryid: el.id,
          tcAbryxm: el.tcXm,
          tcDwbm: el.tc_ssdwbm,
          tnYhid: el.tnYhid
        });
      });
      this.saveFormData();
      this.$forceUpdate();
    },
    _GridSelectionChange(selection) {
      this.selection = selection;
    },
    // 删除人员
    _ButtonDeleteClick(tnSfyx) {
      if (this.selection.length) {
        this.$confirm(tnSfyx ===1 ?"是否启用当前人员?":"是否停用当前人员")
          .then(() => {
            this.tnRyxxgjidArr = this.selection.map(item => item.tnRyxxgjid);
            this.deletePerson(tnSfyx);
          })
          .catch(err => {});
      } else {
        this.$msgbox({
          message: "请选择数据",
          type: "warning"
        });
      }
    },
    // 添加备注
    noteAdd(row) {
      this.list.note = "";
      if (row.tcBz !== undefined) {
        this.beizhu = "修改备注";
        this.list.note = row.tcBz;
      } else {
        this.beizhu = "添加备注";
      }
      this.dialogFormVisible = true;
      this.list.tnRyxxgjid = row.tnRyxxgjid;
    },
    saveNote() {
      if (this.list.note !== undefined) {
        let row;
        row = this.list.tnRyxxgjid;
        this.addNote(row);
        this.dialogFormVisible = false;
      } else {
        this.$msgbox({
          type: "warning",
          message: "请输入备注"
        });
      }
    },
    // 删除备注
    deleteNote(row) {
      this.$confirm("是否删除当前备注")
        .then(() => {
          this.list.tnRyxxgjid = row.tnRyxxgjid;
          let rows;
          rows = this.list.tnRyxxgjid;
          this.noteDelete(rows);
        })
        .catch(err => {});
    },
    _ButtonExportClick() {
      this.exportTable();
    },
    async exportTable() {
      const result = await Model.exportTable({
        isQuery: 0,
        cdId: "00040802",
        requestData: {
          tcAbryxm: this.saveData.tcAbryxm
        }
      });
      if (result) {
        this.$message({
          message: "导出成功",
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        });
        const content = result;
        const blob = new Blob([content]);
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = `${JSON.parse(window.sessionStorage.user).tcDwmc}消防控制人员信息.xls`;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      }
    },
    // 添加备注
    async addNote(row) {
      const result = await Model.getNote({
        isQuery: 0,
        cdId: "00040802",
        requestData: {
          tnRyxxgjid: row,
          tcBz: this.list.note
        }
      });
      result && this.getFormData();
    },
    // 删除人员
    async deletePerson(tnSfyx) {
      const result = await Model.deletePerson({
        isQuery: 0,
        cdId: "00040802",
        requestData: {
          tnSfyx,
          tnRyxxgjidArr: this.tnRyxxgjidArr
        }
      });
      if (result.state === "1") {
        this.$message({
          message: "操作成功",
          type: "success",
          showClose: true,
          duration: 1000
        });
        this.getFormData();
      }
    },
    // 修改备注
    async noteDelete(rows) {
      const result = await Model.getNote({
        isQuery: 0,
        cdId: "00040802",
        requestData: {
          tnRyxxgjid: rows,
          tcBz: ""
        }
      });
      result && this.getFormData();
    },
    // 获取数据
    async getFormData() {
      const result = await Model.getFormData({
        isQuery: 1,
        rows: this.pageRows,
        pageNum: this.pageNum,
        cdId: "00040802",
        requestData: {
          tcAbryxm: this.saveData.tcAbryxm
        }
      });
      if (result.data) {
        this.list = result.data.list
        this.pageTotal = result.total
      }
    },
    // 保存数据
    async saveFormData() {
      const result = await Model.saveFormData({
        isQuery: 0,
        cdId: "00040802",
        requestData: {
          xfaqRyxxgjList: this.saveData
        }
      });
      if (result.state === "1") {
        this.$message({
          message: "成功保存数据",
          duration: 1000,
          onClose: () => {
            this.getFormData();
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.el-dialog {
  width: 600px;
}
.el-dialog__body {
  padding-bottom: 0px;
}
</style>
