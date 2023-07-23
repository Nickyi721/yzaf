<template>
  <CustomView :location="[{ text: '安全检查结果详情' }]">
    <div slot="top">
      <div class="common-info">
        <div class="common-info-unit">
          <span class="common-info-label">计划名称：</span>
          <span class="common-info-content">{{safe['tcJhmc']}}</span>
        </div>
        <div class="common-info-unit">
          <span class="common-info-label">截止时间：</span>
          <span class="common-info-content">{{safe['tcJhjzsj']}}</span>
          <span class="common-info-label">计划状态：</span>
          <span class="common-info-content">{{tnJhzt}}</span>
          <span class="common-info-label">完成单位个数：</span>
          <span class="common-info-content">{{safe['ytNum']}}个</span>
          <span class="common-info-label">未完成单位个数：</span>
          <span class="common-info-content">{{safe['wtNum']}}个</span>
        </div>
        <div class="common-info-unit">
          <span class="common-info-label">未完成单位：</span>
          <span class="common-info-content" :title="safe['wtdwList']" v-if="safe['wtdwList']">
            <div class="common-info-scroll">
              <p v-for="(org, index) in safe['wtdwList'].split(',')" :key="index">
                {{org}}
              </p>
            </div>
          </span>
        </div>
      </div>

      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          已完成单位列表
        </span>
      </CustomToolbar>
    </div>
    
    <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
      <el-table stripe
        border
        :data="list"
        size="mini"
        height="100%"
        class="grid-table"
        header-cell-class-name="table-hd" 
        :row-class-name="rowClickStyle ? 'click-row' : ''" 
        @row-dblclick="_TableDblClick"
        >
        <el-table-column type='index'></el-table-column>
        <el-table-column prop='tcSxmc' label="被检查单位"></el-table-column>
        <el-table-column prop='tcJcdw' label="检查单位"></el-table-column>
        <el-table-column prop='tcBgsbh' label="报告书" width="240px">
          <template slot-scope="scope">
            <a @click="_pClick(scope.row.tnAqjcbgid, 'bgs', scope.row.tcSxid, scope.row.tcSxmc)" style="color:blue">{{scope.row.tcBgsbh}}</a>
          </template>
        </el-table-column>
        <el-table-column prop='tcZgtzsbh' label="隐患整改通知书" width="240px">
          <template slot-scope="scope">
            <a @click="_pClick(scope.row.tnAqjcbgid, 'yhzg', scope.row.tcSxid, scope.row.tcSxmc)" style="color:blue">{{scope.row.tcZgtzsbh}}</a>
          </template>
        </el-table-column>
        <el-table-column prop='tcHfsbh' label="隐患整改通知回复书" width="240px">
          <template slot-scope="scope">
            <!-- <p v-if='scope.row.tnYhzgtzhf'>是</p>
            <p v-if='!scope.row.tnYhzgtzhf'>否</p> -->
            <a @click="_pClick(scope.row.tnAqjcbgid, 'yhzghf', scope.row.tcSxid, scope.row.tcSxmc)" style="color:blue">{{scope.row.tcHfsbh}}</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </CustomView>
</template>
<style lang="scss" scoped>
  .common-info .common-info-unit > *.common-info-label{
    width: auto;
    text-align: left;
    margin-left: 10px;
  }
  .infoType {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color: #04b74d;
    font-weight: bold
  }
  .common-form{
    padding: 0px 0;
  }
  .el-form-item{
    margin-bottom: 0px!important
  }
</style>
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
      list: [],
      safe: {
        tnAqjcjhid: '',
        tcJhmc: '',
        tnJhzt: '',
        tcJhsm: '',
        tcJhjzsj: '',
        ytNum: '',
        wtNum: '',
        wtdwList: ''
      },
      notice: {},
      noticeReply: {},
      showNoticeForm: false,
      rowClickStyle: true,
      tnJhzt: ''
    }
  },
  methods: {
    $init(options) {
      this.safe = this.$route.query
      if(this.safe.tnJhzt == 0) this.tnJhzt = '进行中'
      if(this.safe.tnJhzt == 1) this.tnJhzt = '完结'
      if(this.safe.tnJhzt == 2) this.tnJhzt = '无效'
      this.safe.tcJhmc = window.localStorage.getItem('tcJhmc')
      this.getAqjcbgDetial()
    },
    _pClick(id, type, tcDwdm, tcDwmc) {
      window.localStorage.setItem("tcBjcdwmc", tcDwmc)
      this.$router.push({path:'/safe/manage/report/content',query:{id: id, type: type, tcDwdm: tcDwdm}})
    },
    _TableDblClick(row) {
      this.$router.push({path:'/safe/exec/report/detail',query:{curPlan: this.safe.tnAqjcjhid, curOrg: row.tcSxid}})
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
              const fileName = '安全检查报告'
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
              const fileName = '隐患整改通知'
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
              const fileName = '隐患整改回复书'
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
            message:"发生未知错误，请联系管理员",
            type: 'error',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
        }
      }
    },
    _ButtonMakeClick () {
      this.showNoticeForm = true
      this.makeNotice()
    },
    _ButtonSendClick () {
      this.sendNotice()
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
      // const data = JSON.parse(this.$route.query.row)
      const result = await Model.getAqjcbgDetial({
        requestData: { 
          tnAqjcjhid: this.$route.query.tnAqjcjhid
        }
      })
      if (result && result.data) {
        if(result.data.wtdwList.list.length>0){
          this.safe.wtdwList = result.data.wtdwList.list.map(el=>el.tcSxmc).join(",")
        }
        // this.safe.wtdwList = result.data.wtdwList
        this.list = result.data.ytdwList
      }
    },
    async makeNotice () {
      const result = await Model.makeNotice({
        requestData: { 
          tnAqjcbgid: this.$route.query.id
        }
      })
      if (result && result.data) {
        this.notice = result.data
        this.notice.tcZgtzbh = result.data.tcYhzgtzbh
        this.notice.tcZgtznr = result.data.yhnrlist[0]
        this.$forceUpdate()
        this.$message({
          message:"生成隐患整改通知成功！",
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
          tcBjcdwmc: this.safe.tcBjcdwmc,
          tcDwdm: this.safe.tcDwdm,
          tcDwmc: this.safe.tcDwmc,
        }
      })
      if (result.state === '1') {
        this.$message({
          message:"隐患整改通知发送成功！",
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

