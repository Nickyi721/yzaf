<template>
  <CustomView :location="[{ text: '信息详情'}]">
    <CustomTitle>
      {{content.title}}
      <span slot="info">{{content.pubDate}}</span>
    </CustomTitle>
    <div class="common-content">
      <div class="common-content-des">
        <p>
          <span>信息类型：</span>
          <span>{{content.infoType}}</span>
        </p>
        <p>
          <span>接收单位：</span>
          <span>{{content.sendGroup || getOrgList(content.orgList, 6)}}</span>
        </p>
        <p>
          <span>抄送单位：</span>
          <span>{{content.copyGroup || getOrgList(content.orgList, 7)}}</span>
        </p>
      </div>
      <div class="common-content-text" v-html="content.content"></div>
      <CommonFileDownload 
        :list="content.attachment" 
        :disabled='true' 
        @remove='_onRemove'
        >
      </CommonFileDownload>
    </div>

    <CustomControlBar slot="bottom" v-if="content.infoType==='安全工作通知'">
      <el-button type="primary" size="mini" @click="_toHandleClick">通过</el-button>
      <el-button type="primary" style="color:#006a45!important;border-color:#006a45!important;background:#ffffff!important" size="mini" @click="_handledClick">不通过</el-button>
    </CustomControlBar>
  </CustomView >
</template>
<style lang="scss" src="./main.scss"></style>
<script>
import Mixin from '@mixins'
import Model from './model.js'

export default {
  mixins: [
    Mixin.page,
    Mixin.init, 
  ],
  data () {
    return {
      content: {
        tnXxid:'',
        title: '',
        infoType: '',
        sendGroup: '',
        copyGroup: '',
        orgList: [],
        sendOrg: '',
        copyOrg: '',
        content: '',
        pubDate:'',
        attachment: [
        ],
        sfdxx: '',
        tcJsdwIds: []
      },
      bindData: {
        tcSpzt:'',
        tcSpztmc:'',
        tnXxid:'',
        sfdxx: '',
        tcJsdwIds: [],
        jsdwList: []
      },
      src: '',
      picVisible: false
    }
  },
  methods: {
    $init () {
      this.getDetail()
    },
    _toHandleClick () {
      this.bindData.tnXxid = this.content.tnXxid
      this.bindData.tcSpzt = '000602'
      this.bindData.tcSpztmc = '已审批'
      this.bindData.sfdxx = this.content.sfdxx
      this.bindData.tcJsdwIds = this.content.tcJsdwIds
      this.updateStatus(this.bindData)
    },
    _handledClick () {
      this.bindData.tnXxid = this.content.tnXxid
      this.bindData.tcSpzt = '000603'
      this.bindData.tcSpztmc = '拒批'
      this.bindData.sfdxx = this.content.sfdxx
      this.bindData.tcJsdwIds = this.content.tcJsdwIds
      this.updateStatus(this.bindData)
    },
    _onRemove() {
    },
    closeHandle(){
      this.picVisible = false
    },
    getOrgList (list, type) {
      return list.filter(item => item.tnLx === type).map(item => {
        if (item.mode === 1) {
          if (item.selected) {
            return `${item.tcDwmc}及下一级单位`
          } else {
            return `${item.tcDwmc}下一级单位`
          }
        } else if (item.mode === 2) {
          if (item.selected) {
            return `${item.tcDwmc}及所有子单位`
          } else {
            return `${item.tcDwmc}所有子单位`
          }
        } else {
          return `${item.tcDwmc}`
        }
      }).join('，')
    },
    async getDetail(){      
      const result = await Model.getDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId:'0004030101', //菜单ID
        requestData: {
          tnXxid:this.$route.query.tnXxid,
        }
      })
      if(result){        
        const data = result.data[0]
        this.content.tnXxid = this.$route.query.tnXxid
        this.content.title = data.tcXxbt
        this.content.pubDate = data.tdFbsj
        this.content.infoType = data.tcLxmc

        this.content.sendGroup = data.jsQzglMc
        this.content.copyGroup = data.csQzglMc

        this.content.orgList = data.xxglXxgldwpzDto || this.content.orgList
        this.content.orgList.forEach(el => {
            el.mode = el.tnXjxzbz
            el.selected = !el.tnBjxzbz
        })
        if(data.xxglXxgldwpzDto.length > 0){
          // this.content.sendOrg = data.xxglXxgldwpzDto.filter(el=>{
          //   return el.tnLx === 6
          // }).map(lt=>{
          //   return lt.tcDwmc
          // }).join(",")
          // this.content.copyOrg = data.xxglXxgldwpzDto.filter(el=>{
          //   return el.tnLx === 7
          // }).map(lt=>{
          //   return lt.tcDwmc
          // }).join(",")
          this.content.tcJsdwIds = data.xxglXxgldwpzDto.filter(el => el.tnLx === 6).map(lt => lt.tcDwdm)
        }
        this.content.attachment = data.xtFjList
        this.content.content = data.tcZw
        this.content.sfdxx = data.sfdxx
      }
    },
    async updateStatus(data){
      const result = await Model.updateStatus({
        isQuery: 0,  //是否是查询类 0-否 1-是
        cdId:'0004030103', //菜单ID
        cdMc:'信息审批',
        requestData: data
      })
      if (result.state==="1") {
        this.$message({
          message:'操作成功!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
        this.$router.push({path: '/info/news/check/'})
      }
    }
  }
}
</script>
