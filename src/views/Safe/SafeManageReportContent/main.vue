<template>
  <CustomView :location="[{ text: '安全检查报告详情' }]">
    <div class="g-scroll">
      <CustomTitle v-if='$route.query.type === "bgs"'>安全检查报告</CustomTitle>
      <el-form v-if='$route.query.type === "bgs"' ref="form" :model="safe"  label-position="top" class="common-form">
        <el-row style="text-align: right">
          <el-button size="mini" icon="el-icon-export" @click="_ButtonExportClick('report')" >导出</el-button>
        </el-row>
        <el-form-item label="编号：" prop="tcBgsbh">
          {{safe['tcBgsbh']}}
        </el-form-item>
        <el-form-item label="检查单位：" prop="tcJcdwmc" style="margin-top:10px">
          {{safe['tcJcdwmc']}}
        </el-form-item>
        <el-form-item label="被查单位：" prop="tcBjcdwmc">
          {{safe['tcBjcdwmc']}}
        </el-form-item>
        <el-form-item label="检查日期：" prop="tcJcrq">
          {{safe['tcJcrq']}}
        </el-form-item>
        <el-form-item label="检查内容及存在问题：" prop="tcNrwt">
          {{safe['tcNrwt']}}
        </el-form-item>
        <el-form-item label="整改意见和时限：" prop="tcZgyjsx">
          {{safe['tcZgyjsx']}}
        </el-form-item>
        <el-form-item label="被检查单位意见：" prop="tcBjcdwyj">
          {{safe['tcBjcdwyj']}}
        </el-form-item>
        <el-form-item label="检查单位主管领导批示：" prop="tcJcdwzg">
          {{safe['tcJcdwzg']}}
        </el-form-item>
      </el-form>

      <template v-if="(safe.tnXxzt != 1  && $route.query.type === 'bgs' && !showNoticeForm) || !showNoticeForm || $route.query.type === 'yhzg'">
        <CustomTitle v-if="notice.tnShzt == 0">隐患整改通知书(未审批)</CustomTitle>
        <CustomTitle v-else-if="notice.tnShzt == 1">隐患整改通知书(已审批)</CustomTitle>
        <CustomTitle v-else-if="notice.tnShzt == 2">隐患整改通知书(已驳回)</CustomTitle>
        <CustomTitle v-else>隐患整改通知书</CustomTitle>
        <el-form label-position="top" class="common-form" v-if="notice.tnShzt != 2 && $route.query.type === 'yhzg'">
          <el-row style="text-align: right">
            <el-button size="mini" icon="el-icon-export" @click="_ButtonExportClick('notice')">导出</el-button>
          </el-row>
        </el-form>
        <el-form :disabled="(safe.tnXxzt === 2 || safe.tnXxzt === 3) && notice.tnShzt != 2" ref="notice" :model="notice"  label-position="top" class="common-form">
          <el-form-item label="编号" v-if="$route.query.type === 'yhzg'">
            <el-input v-model="notice['tcZgtzbh']" size="mini" placeholder="编号" disabled></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="notice['tcZgtznr']" type="textarea" rows="20" size="mini" placeholder="内容"></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template v-if="safe.tnXxzt == 3 && $route.query.type === 'yhzghf'">
        <CustomTitle>隐患整改回复书</CustomTitle>
        <el-form label-position="top" class="common-form">
          <el-row style="text-align: right">
            <el-button size="mini" icon="el-icon-export" @click="_ButtonExportClick('noticeReply')">导出</el-button>
          </el-row>
        </el-form>
        <el-form :disabled="safe.tnXxzt === 3" ref="noticeReply" :model="noticeReply"  label-position="top" class="common-form">
          <el-form-item label="编号" v-if="$route.query.type === 'yhzghf'">
            <el-input v-model="noticeReply['bh']" size="mini" placeholder="编号" disabled></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="noticeReply['hfnr']" type="textarea" rows="20" size="mini" placeholder="内容"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </div>
    
    <CustomControlBar slot="bottom" v-if="$route.query.type === 'bgs' || $route.query.type === 'yhzg'">
      <el-button type="primary" size="small" @click="_ButtonMakeClick" v-if="showNoticeForm && safe.tnXxzt === 1">生成隐患整改通知</el-button>
      <el-button type="primary" size="small" @click="_ButtonSendClick" v-if="(!showNoticeForm && $route.query.type === 'bgs') || (notice.tnShzt === 2 && $route.query.type === 'yhzg')">发送</el-button>
    </CustomControlBar>
    
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import request from '@commons/request.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      safe: {},
      notice: {},
      noticeReply: {},
      showNoticeForm: true,
    }
  },
  methods: {
    $init(options) {
      this.getAqjcbgDetial()
    },
    async _ButtonExportClick(type) {
      if(type === 'report') {
        if(this.safe.tnAqjcbgid && this.safe.tnAqjcbgid !== '') {
          request({
            url: '/aqjcAqjcbg/scAqjcbgs',
            responseType: 'blob', // 表明返回服务器返回的数据类型
            data: {
              requestData:{
                tnAqjcbgid: this.safe.tnAqjcbgid,
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
              const fileName = '安全检查报告-' + myDate
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
        } else {
          this.$message({
            message: "发生未知错误，请联系管理员",
            type: 'error',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
        }
      } else if(type === 'notice') {
        if(this.notice.tnYhzgtzid && this.notice.tnYhzgtzid !== '') {
          request({
            url: '/aqjcYhzgtz/scYhzgtz',
            responseType: 'blob', // 表明返回服务器返回的数据类型
            data: {
              requestData:{
                tnYhzgtzid: this.notice.tnYhzgtzid,
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
        } else {
          this.$message({
            message: "发生未知错误，请联系管理员",
            type: 'error',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
        }
      } else {
        if(this.noticeReply.yhzgtzid && this.noticeReply.yhzgtzid !== '') {
          request({
            url: '/aqjcYhzgtz/scYhzghf',
            responseType: 'blob', // 表明返回服务器返回的数据类型
            data: {
              requestData:{
                tnYhzgtzid: this.noticeReply.yhzgtzid,
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
              const fileName = '隐患整改回复书-' + myDate
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
        } else {
          this.$message({
            message: "发生未知错误，请联系管理员",
            type: 'error',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
        }
      }
    },
    _ButtonMakeClick () {
      this.showNoticeForm = false
      this.makeNotice()
    },
    _ButtonSendClick () {
      this.notice.tnShzt === 2 ? this.updateYhzgtz() : this.sendNotice()
    },
    async updateYhzgtz() {
      const result = await Model.updateYhzgtz({
        requestData: {
          tcAqjctoid: this.notice.tcAqjctoid,
          tnAqjcjhid: this.notice.tnAqjcjhid,
          tnAqjcbgid: this.$route.query.id,
          tcZgtzbh: this.notice.tcZgtzbh,
          tcZgtznr: this.notice.tcZgtznr,
          tcBjcdwid: this.safe.tcBjcdwid,
          tcBjcdwmc: window.localStorage.getItem("tcBjcdwmc"),
          tnYhzgtzid: this.notice.tnYhzgtzid,
          tcDwdm: this.safe.tcDwdm,
          tcDwmc: this.safe.tcDwmc,
        }
      })
      if (result.state === '1') {
        this.$message({
          message: "隐患整改通知发送成功！",
          type: 'success',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
        this.$router.push({ path: '/safe/manage/query' })
      }
    },
    async getNoticeDetail(tnAqjcbgid) {
      const result = await Model.getNoticeDetail({
        isQuery: 1,
        cdId: '0004060204',
        requestData: {
          tnAqjcbgid: tnAqjcbgid,
        }
      })
      if(result.data) {
        this.notice = result.data.yhzgtz
        this.noticeReply = result.data
      }
    },
    async getAqjcbgDetial () {
      const result = await Model.getAqjcbgDetial({
        requestData: { 
          tnAqjcbgid: this.$route.query.id
        }
      })
      if (result && result.data) {
        this.safe = result.data
        this.safe.tcNrwt = this.safe.tcNrwt.replace("###",'')
        if(this.safe.tnXxzt === 2 || this.safe.tnXxzt === 3) {
          this.getNoticeDetail(this.safe.tnAqjcbgid)
        }
        this.safe.tcBjcdwid = this.$route.query.tcDwdm
      }
    },
    async makeNotice () {
      const result = await Model.makeNotice({
        requestData: { 
          tnAqjcbgid: this.$route.query.id,
          tcBjcdwid: this.safe.tcBjcdwid,
        }
      })
      if (result && result.data) {
        this.notice = result.data
        this.notice.tcZgtzbh = result.data.tcYhzgtzbh
        this.notice.tcZgtznr = result.data.yhnrlist.join("")
        this.$forceUpdate()
        this.$message({
          message: "生成隐患整改通知成功！",
          type: 'success',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
      }
    },
    async sendNotice () {
      const result = await Model.sendNotice({
        requestData: {
          tcAqjctoid: this.notice.tcAqjctoid,
          tnAqjcjhid: this.notice.tnAqjcjhid,
          tnAqjcbgid: this.$route.query.id,
          tcZgtzbh: this.notice.tcZgtzbh,
          tcZgtznr: this.notice.tcZgtznr,
          tcBjcdwid: this.safe.tcBjcdwid,
          tcBjcdwmc: window.localStorage.getItem("tcBjcdwmc"),
          tcDwdm: this.safe.tcDwdm,
          tcDwmc: this.safe.tcDwmc,
        }
      })
      if (result.state === '1') {
        this.$message({
          message: "隐患整改通知发送成功！",
          type: 'success',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
        this.$router.push({ path: '/safe/manage/query' })
      }
    }

  },
}
</script>

<style lang="scss" scoped>
  .infoType {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color: #04b74d;
    font-weight: bold
  }
</style>

