<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter
        ref="dataFilter"
        :infoTypes="infoTypes"
        :infoStates="infoStates"
        @query="_DataFilterQuery"
      />
    </div>
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick">
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

// 页面组件
import DataFilter from "./components/DataFilter.vue";
import DataGrid from "./components/DataGrid.vue";

export default {
  mixins: [Mixin.init, Mixin.page],
  components: {
    DataFilter,
    DataGrid
  },
  data() {
    return {
      query: {},
      list: [],
      selection: [],
      infoTypes: [],
      infoStates: [],
      isFirstEnter: true
    };
  },
  methods: {
    $init() {
      this.getNoticeList();
    },
    // 事件-改变每页数量
    _PageRowsChange(num) {
      this.pageRows = num;
      this.pageNum = 1;
      this.getNoticeList();
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this.getNoticeList();
    },
    // 事件-查询
    _DataFilterQuery(query) {
      this.query = query;
      this.getNoticeList();
    },
    // 事件-双击表格
    _DataGridDblClick(row) {
      this.$router.push({
        path: "/safe/manage/check/detail",
        query: {
          curPlan: row.tnAqjcbgid,
          tnYhzgtzid: row.tnYhzgtzid
        }
      });
    },
    async getNoticeList() {
      const result = await Model.getNoticeList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,
        cdId: "0004060204",
        requestData: {
          tcJhmc: this.query.tcJhmc || "",
          tnJhzt:
            this.query.thJhzt !== undefined ? parseInt(this.query.tcJhzt) : "",
          begintime: this.query.tcJhsj ? this.query.tcJhsj[0] : "",
          endtime: this.query.tcJhsj ? this.query.tcJhsj[1] : ""
        }
      });
      if (result.data) {
        this.list = result.data;
        this.list.forEach(item => {
          if (item.tnXxzt === 0) {
            item.tnXxztmc = "未生成报告书";
          } else if (item.tnXxzt === 1) {
            item.tnXxztmc = "已生成报告书";
          } else if (item.tnXxzt === 2) {
            item.tnXxztmc = "已生成隐患整改通知";
          } else {
            item.tnXxztmc = "已生成隐患整改回复";
          }
        })
        this.pageTotal = result.total
      }
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getNoticeList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
};
</script>









