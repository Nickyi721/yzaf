<template>
  <CustomView :location="[{ text: '安全保卫管理人员查询' }]">
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter
        ref="dataFilter"
        @query="_DataFilterQuery"
        :xb="xb"
        :zw="zw"
        :zzmm="zzmm"
        :whcd="whcd"
        :zjz="zjz"
        :status="status"
      />
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="org-guard" class="orange"/>
          {{orgName}}
        </span>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick"/>
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
import request from '@commons/request.js'

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
      query: {
        tcXm: "",
        tcXb: "",
        tcZw: "",
        tcZzmm: "",
        tcWhcd: "",
        tcZjz: "",
        tcZt: "",
        tnAbjgid: "" //当前查询的单位代码
      },
      // 已选列表
      selection: [],
      currentOrg: {},
      zw: [],
      whcd: [],
      zjz: [],
      status: [],
      zzmm: [],
      xb: [{ tcSjubm: "", tcSjnr: "全部" }, { tcSjubm: "0", tcSjnr: "男" }, { tcSjubm: "1", tcSjnr: "女" }],
      // 数据列表
      list: [],
      orgName: ""
    };
  },
  activated() {
    this.refresh();
  },
  methods: {
    $init() {
      this.query.tnAbjgid = this.$route.params.id;
      this.orgName = window.localStorage.getItem("tcDwmc");
      this.getDuties();
      this.getWHCD();
      this.getZJZ();
      this.getStatus();
      this.getZZMM();
      this.getSecurityOrgList();
      this.$forceUpdate()
    },
    refresh() {
      this.getSecurityOrgList();
    },
    // 事件-机构树加载完成
    _DataFilterQuery(query) {
      this.query = Object.assign(this.query, query);
      this.getSecurityOrgList();
    },
    // 事件-点击删除用户按钮
    _ButtonDeleteClick() {
      if (this.selection.length) {
        this.$confirm("是否删除所选数据？")
          .then(() => {
            this.deleteSecurityOrg(this.selection.map(item => item.tnAbglryid));
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
        name: "guardPersonManagerAdd",
        params: {
          tnAbglryid: "-1",
          tnAbjgid: this.$route.params.id,
          type: "add"
        }
      });
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      // this.$router.push({ path: '/guard/person/manager/add', query: { row: JSON.stringify(row),type: 'update'}})
      this.$router.push({
        name: "guardPersonManagerAdd",
        params: { tnAbglryid: row.tnAbglryid, tnAbjgid: "-1", type: "update",tcSsdwbm: this.$route.params.tcSsdwbm }
      });
    },
    _DataGridSelectionChange(selection) {
      this.selection = selection;
    },
    // 事件-改变每页数量
    _PageRowsChange(num) {
      this.pageRows = num
      this.pageNum = 1;
      this.getSecurityOrgList();
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this.getSecurityOrgList();
    },

    //获取职务
    async getDuties() {
      const result = await CommonModel.getDictData(["050202"]);
      if (result && result.data) {
        console.log(result);
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.zw = all.concat(result.data["050202"]);
        
      }
    },
    //获取文化程度
    async getWHCD() {
      const result = await CommonModel.getDictData(["050203"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.whcd = all.concat(result.data["050203"]);
      }
    },
    //获取专兼职
    async getZJZ() {
      const result = await CommonModel.getDictData(["050204"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.zjz = all.concat(result.data["050204"]);
      }
    },
    //获取状态
    async getStatus() {
      const result = await CommonModel.getDictData(["050205"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.status = all.concat(result.data["050205"]);
      }
    },
    //获取政治面貌
    async getZZMM() {
      const result = await CommonModel.getDictData(["050206"]);
      if (result && result.data) {
        let all = [{ tcSjubm: "", tcSjnr: "全部" }];
        this.zzmm = all.concat(result.data["050206"]);
      }
    },
    // 获取用户列表
    async getSecurityOrgList() {
      const result = await Model.getSecurityOrgList({
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
          el.tdCjgzsj =
            el.tdCjgzsj === undefined
              ? ""
              : Moment(el.tdCjgzsj).format("YYYY-MM-DD");
          el.tdCsny =
            el.tdCsny === undefined
              ? ""
              : Moment(el.tdCsny).format("YYYY-MM-DD");
        });
        this.pageTotal = result.total;
      }
    },
    async deleteSecurityOrg(ids) {
      const result = await Model.deleteSecurityOrg({
        requestData: {
          isQuery: 0, //是否是查询类 0-否 1-是
          cdId: "00040402", //菜单ID
          cdMc: "安全保卫人员管理",
          delete: ids
        }
      });
      if (result) {
        this.$msgbox({
          message: "删除成功",
          type: "success",
          showClose: true,
          duration: 1000
        });
        this.getSecurityOrgList();
      }
    },
    _ExportClick() {
      // 后端导出
      request({
        url: '/abgl/exportAbglryList',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          rows: this.pageRows,
          pageNum: this.pageNum,
          isQuery: 0, //是否是查询类 0-否 1-是
          cdId: "00040402", //菜单ID
          cdMc: "安全保卫人员管理",
          requestData: this.query
        }
      }).then((res) => { // 处理返回的文件流
        if(res == undefined){
          this.$message({
            message:'下载失败,请联系管理员!',
            type:"fail",
            duration:1000,
            customClass: "middle"
          })
        }else{
          const content = res
          const blob = new Blob([content])
          let year = new Date().getFullYear()
          let month = new Date().getMonth() + 1
          let strDate = new Date().getDate()
          if (month >= 1 && month <= 9) {
            month = '0' + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
          }
          const myDate = year + month + strDate
          const fileName = '安全保卫管理人员-' + myDate
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName + '.xls'
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
      })
    }
  }
};
</script>
