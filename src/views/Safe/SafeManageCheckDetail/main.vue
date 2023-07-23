<template>
  <CustomView :location="[{text:'隐患整改通知书详情'}]">
    <div class="g-scroll">
      <CustomTitle>隐患整改通知书</CustomTitle>
      <el-form :model="formData" label-position="top" class="common-form">
        <el-row style="text-align: right">
          <el-button size="mini" icon="el-icon-export" @click="_ElectricSealClick" >盖章</el-button>
        </el-row>
        <el-form-item label="编号">
          <el-input v-model="formData['tcZgtzbh']" size="mini" placeholder="编号" disabled></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="formData['tcZgtznr']"
            type="textarea"
            rows="20"
            size="mini"
            placeholder="内容"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <CustomControlBar slot="bottom">
      <el-button type="primary" size="mini" v-if="disabled" @click="_toHandleClick">通过</el-button>
      <el-button type="primary" size="mini" style="color:#006a45!important;border-color:#006a45!important;background:#ffffff!important" v-if="disabled" @click="_handledClick">不通过</el-button>
    </CustomControlBar>
  </CustomView>
</template>
<style lang="scss">

</style>

<script>
import Model from "./model.js";
import Mixin from "@mixins";
import request from "@commons/request.js";

export default {
  mixins: [Mixin.init],
  data() {
    return {
      formData: {
        tcZgtzbh: "",
        tcZgtznr: "",
        tnYhzgtzid: ""
      },
      disabled: false,
    };
  },
  methods: {
    $init() {
      this.getNoticeDetail();
    },
    _toHandleClick() {
      this.toPassClick(1);
    },
    _handledClick() {
      this.toPassClick(2);
    },
    _ElectricSealClick() {
      request({
        url: '/aqjcYhzgtz/scdzyz',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          requestData:{
            tnYhzgtzid: this.formData.tnYhzgtzid,
          }
        }
      }).then((res) => { // 处理返回的文件流
        if(res == undefined ){
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
          const fileName = '隐患整改通知-' + myDate
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName + '.docx'
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
    },
    async getNoticeDetail() {
      const result = await Model.getNoticeDetail({
        isQuery: 1,
        // cdId: "0004060204",
        requestData: {
          tnAqjcbgid: this.$route.query.curPlan
        }
      });
      if (result.data) {
        this.formData.tcZgtzbh = result.data.yhzgtz.tcZgtzbh;
        this.formData.tcZgtznr = result.data.yhzgtz.tcZgtznr;
        this.formData.tnYhzgtzid = result.data.yhzgtz.tnYhzgtzid;
        this.disabled = result.data.yhzgtz.tnShzt === 0
      }
    },
    async toPassClick(type) {
      const result = await Model.toPassClick({
        isQuery: 0,
        cdId: "0004060204",
        requestData: {
          tnYhzgtzid: this.formData.tnYhzgtzid,
          tnshzt: type
        }
      });
      if (result.state === "1") {
        this.$message({
          message: "处理成功！",
          type: "success",
          showClose: true,
          duration: 1000,
          customClass: "middle"
        });
      }
      this.$router.push({ path: "/safe/manage/query" });
    }
  }
};
</script>