<template>
  <CustomView :location="[{ text: '安全保卫工作人员查询' }]">
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter
        ref="dataFilter"
        @query="_DataFilterQuery"
        :tcXb="tcXb['050301']"
        :tcGzgw="tcGzgw"
        :tcWhcd="tcWhcd"
        :tcYgxz="tcYgxz"
        :tcBayz="tcBayz"
        :tcCqz="tcCqz"
        :tcXfzs="tcXfzs"
      />
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="org-guard" class="orange"/>
          {{orgName}}
        </span>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
        <CustomButton icon="export" text="导出" @click="_ButtonExportClick"/>
      </CustomToolbar>
    </div>

    <!-- 数据表格 -->
    <DataGrid
      :list="list"
      @dblclick="_DataGridDblClick"
      @selection-change="_DataGridSelectionChange"
    >
      <CustomPage
        :total="pageTotal"
        :pageNum="pageNum"
        :rows="pageRows"
        @rows-change="_PageRowsChange"
        @change="_PageChange"
      />
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "./model.js";
import CommonModel from "@commons/model.js";

// 页面组件
import DataFilter from "./components/DataFilter.vue";
import DataGrid from "./components/DataGrid.vue";
import Moment from "moment";

export default {
  mixins: [Mixin.init, Mixin.page],
  components: {
    DataFilter,
    DataGrid
  },
  data() {
    return {
      tcXb: [],
      tcGzgw: [],
      tcWhcd: [],
      tcYgxz: [],
      tcBayz: [
        { tcSjubm: "", tcSjnr: "全部" },
        { tcSjubm: "0", tcSjnr: "有" },
        { tcSjubm: "1", tcSjnr: "无" }
      ],
      tcCqz: [
        { tcSjubm: "", tcSjnr: "全部" },
        { tcSjubm: "0", tcSjnr: "有" },
        { tcSjubm: "1", tcSjnr: "无" }
      ],
      tcXfzs: [
        { tcSjubm: "", tcSjnr: "全部" },
        { tcSjubm: "0", tcSjnr: "有" },
        { tcSjubm: "1", tcSjnr: "无" }
      ],
      query: {},
      // 数据列表
      list: [],
      // 已选列表
      selection: [],
      orgName: ""
    };
  },
  methods: {
    $init() {
      this.query.tnAbjgid = this.$route.params.id;
      this.orgName = window.localStorage.getItem("tcDwmc");
      this.getSex();
      this.getWHCD();
      this.getGZGW();
      this.getYGXZ();
      this.getSecurityWorkStaffList();
      this.$forceUpdate()
    },
    // 事件-机构树加载完成
    _DataFilterQuery(query) {
      this.query = Object.assign(this.query, query);
      this.getSecurityWorkStaffList();
    },
    // 事件-点击删除用户按钮
    _ButtonDeleteClick() {
      if (this.selection.length) {
        this.$confirm("是否删除所选数据？")
          .then(() => {
            this.deleteSecurityWorkStaff(
              this.selection.map(item => item.tnAbgzryid)
            );
          })
          .catch(err => {});
      } else {
        this.$msgbox({
          message: "请选择人员",
          type: "warning"
        });
      }
    },
    // 事件-点击新增用户按钮
    _ButtonAddClick() {
      this.$router.push({
        name: "guardPersonWorkerAdd",
        params: {
          tnAbgzryid: "-1",
          tnAbjgid: this.$route.params.id,
          type: "add"
        }
      });
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      // this.$router.push({ path: '/guard/person/worker/add', query: { row: JSON.stringify(row), type: 'update'} })
      this.$router.push({
        name: "guardPersonWorkerAdd",
        params: { tnAbgzryid: row.tnAbgzryid, tnAbjgid: "-1", type: "update", tcSsdwbm: this.$route.params.tcSsdwbm }
      });
    },
    _DataGridSelectionChange(selection) {
      this.selection = selection;
    },
    // 事件-改变每页数量
    _PageRowsChange(num) {
      this.pageRows = num
      this.pageNum = 1;
      this.getSecurityWorkStaffList();
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this.getSecurityWorkStaffList();
    },
    _ButtonExportClick() {
      this.exportTable()
    },
    async exportTable() {
      const result = await Model.exportTable({
        isQuery: 0, //是否是查询类 0-否 1-是
        cdId: "00040402", //菜单ID
        cdMc: "安全保卫人员管理",
        requestData: this.query
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
          elink.download = `${this.orgName}工作人员.xls`
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
    //获取性别
    async getSex() {
      const result = await CommonModel.getDictData(["050301"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.tcXb = all.concat(result.data["050301"]);
      }
    },

    //文化程度
    async getWHCD() {
      const result = await CommonModel.getDictData(["050304"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.tcWhcd = all.concat(result.data["050304"]);
      }
    },

    //工作岗位
    async getGZGW() {
      const result = await CommonModel.getDictData(["050306"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.tcGzgw = all.concat(result.data["050306"]);
      }
    },
    //用工性质
    async getYGXZ() {
      const result = await CommonModel.getDictData(["050307"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.tcYgxz = all.concat(result.data["050307"]);
      }
    },
    // 获取用户列表
    async getSecurityWorkStaffList() {
      const result = await Model.getSecurityWorkStaffList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1, //是否是查询类 0-否 1-是
        cdId: "00040402", //菜单ID
        cdMc: "安全保卫人员管理",
        requestData: this.query
      });
      if (result.data) {
        this.list = result.data;
        this.list.forEach(el => {
          el.tdRzsj =
            el.tdRzsj === undefined
              ? ""
              : Moment(el.tdRzsj).format("YYYY-MM-DD");
        });
        this.pageTotal = result.total;
      }
    },
    async deleteSecurityWorkStaff(ids) {
      const result = await Model.deleteSecurityWorkStaff({
        requestData: {
          delete: ids
        }
      });
      if (result) {
        this.$msgbox({
          message: "删除成功",
          type: "success",
          showClose: true,
          duratioin: 1000
        });
        this.getSecurityWorkStaffList();
      }
    }
  }
};
</script>
