<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="export" text="生成报告书" @click="_ButtonClick"/>
      </CustomToolbar>
    </div>

    <!-- 数据表格 -->
    <DataGrid
      ref="dataGrid"
      :list="list"
      @dblclick="_DataGridDblclick"
      @selection-change="_DataGridSelectionChange"
      @select="_RowSelect"
      @select-all="_DataGridSelectAll"
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
import Moment from "moment";

// 共用模块
import Mixin from "@mixins";
import Model from "./model.js";

// 页面组件
import DataFilter from "./components/DataFilter.vue";
import DataGrid from "./components/DataGrid.vue";

export default {
  name: "SafeExecReport",
  mixins: [Mixin.init, Mixin.page],
  components: {
    DataFilter,
    DataGrid
  },
  data() {
    return {
      list: [],
      query: {
        tnJhlx: "0"
      },
      selection: [],
      isFirstEnter: true
    };
  },
  methods: {
    $init() {
      this.getDataList();
    },
    _DataGridSelectionChange(selection) {
      this.selection = selection;
    },
    // 事件-查询
    _DataFilterQuery(query) {
      this.query = query;
      this.getDataList();
    },
    // 事件-改变每页数量
    _PageRowsChange(num) {
      this.pageRows = num;
      this.pageNum = 1;
      this.getDataList();
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this.getDataList();
    },
    _DataGridSelectAll(selection){
      let selectAll = [].concat(selection)
      for(let i=0; i<selectAll.length; i++){
        if (selectAll[i].tnXxzt !== 0) {
          this.$refs.dataGrid.toggleRowSelection(selectAll[i], false);
          this.$msgbox({
            message: "已生成报告书，不能重复生成",
            type: "warning"
          });
        }
      }
    },
    _ButtonClick() {
      if (this.selection.length !== 0) {
        console.log(this.selection);
        for (let x in this.selection) {
          console.log(this.selection[x]);
          if (this.selection[x].tnXxzt !== 0) {
            this.$refs.dataGrid.clearSelection();
            this.$msgbox({
              message: "已生成报告书，不能重复生成",
              type: "warning"
            });
            return;
          }
        }

        this.$confirm("是否生成报告书？")
          .then(async () => {
            let plan = Array();
            let dwdmArr = Array();
            for (let i in this.selection) {
              plan.push(this.selection[i].tnAqjctoid);
              dwdmArr.push(this.selection[i].tcDwdm);
            }
            const result = await Model.getReportBook({
              isQuery: 1,
              cdId: "0004060202",
              requestData: {
                tnAqjctoid: plan,
                dwdmArr: dwdmArr
              }
            });
            if (result.data && result.state === "1") {
              this.$message({
                message: "生成报告书成功！",
                type: "success",
                showClose: true,
                duration: 1000,
                customClass: "middle"
              });
              this.$router.push({
                path: "/safe/exec/report/new",
                query: {
                  report: JSON.stringify(result.data)
                }
              });
            }
          })
          .catch(err => {});
      } else {
        this.$alert("请选择要操作的数据！");
      }
    },
    // 事件-表格双击
    _DataGridDblclick(row) {
      this.$router.push({
        path: "/safe/exec/report/detail",
        query: {
          curPlan: row.tnAqjcjhid,
          curOrg: row.tcDwdm
        }
      });
    },
    _RowSelect(selection, row) {
      if (row.tnXxzt !== 0) {
        this.$refs.dataGrid.toggleRowSelection(row, false);
        this.$msgbox({
          message: "已生成报告书，不能重复生成",
          type: "warning"
        });
      }
    },
    // 加载列表
    async getDataList() {
      const result = await Model.getDataList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,
        cdId: "0004060202",
        requestData: {
          tcJhmc: this.query.tcJhmc || "",
          tnJhzt:
            this.query.tnJhzt !== undefined && this.query.tnJhzt !== ""
              ? parseInt(this.query.tnJhzt)
              : "",
          tcJhkssj: this.query.tcJhsj ? this.query.tcJhsj[0] : "",
          tcJhjssj: this.query.tcJhsj ? this.query.tcJhsj[1] : "",
          tnJhlx: this.query.tnJhlx
        }
      });
      if (result.data) {
        this.list = result.data;
        this.list.forEach(el => {
          el.tnJhlx = this.query.tnJhlx;
        });
        for (let i in this.list) {
          if (this.list[i].tnJhzt === 0) {
            this.list[i].tnJhztmc = "进行中";
          } else if (this.list[i].tnJhzt === 1) {
            this.list[i].tnJhztmc = "完结";
          } else {
            this.list[i].tnJhztmc = "无效";
          }

          if (this.list[i].tnXxzt === 0) {
            this.list[i].tnXxztmc = "未生成";
          } else if (this.list[i].tnXxzt === 1) {
            this.list[i].tnXxztmc = "生成报告书";
          } else if (this.list[i].tnXxzt === 2) {
            this.list[i].tnXxztmc = "生成整改通知书";
          } else {
            this.list[i].tnXxztmc = "生成隐患整改回馈书";
          }
        }
        this.pageTotal = result.total;
      }
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getDataList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
};
</script>
