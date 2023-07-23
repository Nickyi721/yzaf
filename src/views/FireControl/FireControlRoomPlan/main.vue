<template>
  <CustomView>
     

    <!-- 新增对话框 -->
    <CustomDialog
      top="5vh"
      title="排班时间设置"
      :visible="dlgAddVisble"
      @close="dlgAddVisble = false"
      @open="_DlgAddOpen"
    >
      <TimeSet ref="formAdd" style="height: 500px" @query="TimeSet"/>
    </CustomDialog>

    <ElCalendar ref="time" @getPreMonth="getPreMon" @getNextMonth="getNextMon" @timeSetClick="TimeSetButton">
      <template slot="dateCell" slot-scope="{date, data}">
        <div class="planInfo" @dblclick="calendarDblclcik(date)">
          <p>{{data.day | dateFilter}}</p>
          <p v-if="getClassNum(data.day)" class="planDay">排班信息({{getClassNum(data.day)}})</p>
        </div>
      </template>
    </ElCalendar>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "./model.js";
import Moment from "moment";
import "../../../assets/styles/components/calendar.css";
// 页面组件
import TimeSet from "./components/TimeSet.vue";

export default {
  name: "FireControlRoomPlan",
  mixins: [Mixin.init],
  components: {
    TimeSet
  },
  data() {
    return {
      list: [],
      date: "",
      preMonth: "",
      classInfo: [],
      dlgAddVisble: false,
      isFirstEnter: true
    };
  },
  filters: {
    dateFilter(dataDay) {
      return dataDay.slice(8, 10);
    }
  },
  methods: {
    $init() {
      this.date = Moment(Date.now()).format("YYYY-MM");
      this.gettdPbrq();
      this.getClassNum();
    },
    // 点击上一月获取月份
    getPreMon(query) {
      // this.preMonth = query
      this.date = query;
      this.gettdPbrq();
      // this.getPreClass()
    },
    // 点击下一月获取月份
    getNextMon(query) {
      // this.NextMonth = query
      this.date = query;
      this.gettdPbrq();
      // this.getNextClass()
    },
    getClassNum(day) {
      let classNum = this.classInfo.filter(item => item.TD_PBRQ == day);
      if (classNum.length > 0) {
        classNum = classNum[0].NUM;
      } else {
        classNum = "";
      }
      return classNum;
    },
    calendarDblclcik(date) {
      this.$router.push({
        path: "/firecontrol/room/plan/detail",
        query: {
          date: Moment(date).format("YYYY-MM-DD")
        }
      });
    },
    TimeSetButton() {
      this.dlgAddVisble = true;
    },
    TimeSet(xfaqRybcbList) {
      xfaqRybcbList.forEach(element => {
        element.tcKssj = Moment(element.tcKssj).format("HH:mm:ss");
        element.tcJssj = Moment(element.tcJssj).format("HH:mm:ss");
      });
      this.addClass(xfaqRybcbList);
      this.dlgAddVisble = false;
    },
    _DlgAddOpen() {
      this.$refs.formAdd.clearTimeSet()      
    },
    async gettdPbrq() {
      const result = await Model.gettdPbrq({
        isQuery: 1,
        cdId: "00040802",
        requestData: {
          tdPbrq: this.date
        }
      });
      if (result.data) {
        this.classInfo = result.data;
      }
    },
    // async getPreClass() {
    //   const result = await Model.gettdPbrq({
    //     isQuery: 1,
    //     cdId: '00040802',
    //     requestData:{
    //       tdPbrq: this.preMonth
    //     }
    //   })
    //   if(result.data){
    //     this.classInfo = result.data
    //   }
    // },
    // async getNextClass() {
    //   const result = await Model.gettdPbrq({
    //     isQuery: 1,
    //     cdId: '00040802',
    //     requestData:{
    //       tdPbrq: this.NextMonth
    //     }
    //   })
    //   if(result.data){
    //     this.classInfo = result.data
    //   }
    // },
    async addClass(xfaqRybcbList) {
      const result = await Model.setClassTime({
        isQuery: 0,
        cdId: "00040802",
        requestData: {
          xfaqRybcbList: xfaqRybcbList
        }
      });
      if (result.state === "1") {
        this.$message({
          message: "新增成功!",
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true
        });
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      if (this.date) {
        this.gettdPbrq()
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  } 
};
</script>

<style lang="scss" scoped>
.planInfo {
  height: 58px;
  text-align: center;
}
.planDay {
  width: 80px;
  background: #006a45;
  padding-top: 3px;
  font-size: 14px;
  border-radius: 3px;
  margin: 3px auto;
  color:white;
}
.custom-toolbar {
  padding: 10px 10px 0 0;
}
</style>
