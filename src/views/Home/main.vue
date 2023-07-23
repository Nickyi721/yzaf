<template>
  <CustomView class="home">
    <div class="home-no-news" v-if="!(agence.length || news.length || docs.length)">
      暂时没有任何相关消息
    </div>
    
    <div v-else>
      <div class="home-info" v-if="agence.length">
        <div class="home-info-title">
          <CustomIcon name="to-dos"/>
          <span>待办事宜</span> 
        </div>
        <ul>
          <li v-for="(item, idx) in agence" :key="idx" @click="_AgenceClick(item, idx)">
            <div class="info-block">
              <div class="info-block-icon">
                <CustomIcon name="deal" class="icon-color-lemon"/>
              </div>
              <div class="info-block-content">
                <h6>{{item.mc}} {{item.sxmc}}</h6>
                <div class="info-block-des">
                  <CustomIcon name="to-dos"/>
                  <span>{{item.tcLxmc}}</span>
                  <CustomIcon name="time"/>
                  <span>{{item.sj? item.sj: ''}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="home-info" v-if="news.length">
        <div class="home-info-title">
          <CustomIcon name="latest-notice"/>
          <span>消息通知</span>
        </div>
        <ul>
          <li v-for="(item, idx) in news" :key="idx" @click="_NewsClick (item, idx)">
            <div class="info-block">
              <div class='info-block-icon'>
                <CustomIcon :name="getNewsType(item)" :class="newsColor[item.tcLx]"/>
              </div>
              <div class="info-block-content">
                <h6>{{item.tcXxbt | ellipsis}}</h6>
                <div class="info-block-des">
                  <CustomIcon name="to-dos"/>
                  <span>{{item.tcLxmc}}</span>
                  <CustomIcon name="time"/>
                  <span>{{item.tdCjsj? item.tdCjsj.substr(0, 10): ''}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="home-info" v-if="docs.length">
        <div class="home-info-title">
          <CustomIcon name="latest-information"/>
          <span>最新资料</span>
          <span class="home-info-title-more" @click="_DocsMoreClick">
            更多<CustomIcon name="more"/>
          </span>
        </div>
        <ul>
          <li v-for="(item, idx) in docs" :key="idx" @click="_DownloadFile(item)">
            <div class="info-block">
              <div class='info-block-icon'>
                <CustomIcon name="file" :class="filesColor[item.tcLxid]"/>
              </div>
              <div class="info-block-content">
                <h6>{{item.tcYwjm | ellipsis}}</h6>
                <div class="info-block-des">
                  <CustomIcon name="to-dos"/>
                  <span>{{item.tcLxmc}}</span>
                  <CustomIcon name="time"/>
                  <span>{{item.tdScsj? item.tdScsj.substr(0, 10): ''}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </CustomView>
</template>

<script>
import Mixin from "@mixins";
import Model from "./model.js";
import config from "@commons/config.js";
import request from "@commons/request.js";
import axios from "axios";

export default {
  mixins: [Mixin.init],
  name: 'Welcome',
  data() {
    return {
      agence: [],
      news: [],
      docs: [],
      newsColor: {
        '04010101': {
          'icon-color-yellow': true
        },
        '04010102': {
          'icon-color-orange': true
        },
        '04010103': {
          'icon-color-red': true
        },
        '04010104': {
          'icon-color-lemon': true
        },
        // 新加的图标颜色
        '0402': {
          'icon-color-lemon': true
        },
      },
      filesColor: {
        '11010101': {
          'icon-color-red': true
        },
        '11010102': {
          'icon-color-yellow': true
        },
      }
    }
  },
  methods: {
    $init () {
      this.getAgence(), 
      this.getNews(), 
      this.getDocs()
    },
    // 获取待办事宜数据
    async getAgence () {
      const result = await Model.getAgenceNews()
      if (result.state === '1') {
        this.agence = result.data || []
      }
    },
    // 获取消息通知
    async getNews () {
      const result = await Model.getUnreadNews()
        this.news = (result.data || []).splice(0, 6)
    },
    // 获取最新资料
    async getDocs () {
      const result = await Model.getDownloadData()
      if (result.state === '1') {
        this.docs = (result.data || []).splice(0, 6)
      }
    },
    // 获取信息类别对应图标
    getNewsType ({ tcLxmc }) {
      let iconName = ''
      switch (tcLxmc) {
        case '系统通知':
          iconName = 'system-notifications'
          break 
        case '风险预警信息':
          iconName = 'risk-early-warning'
          break
        case '安全工作通知':
          iconName = 'security-notices'
          break 
        case '安全信息':
          iconName = 'security-information'
          break
        case '上报信息查询':
          iconName = 'information-query'
          break
          
      }
      return iconName
    },

    // 跳转到待办事宜详情页面
    _AgenceClick ({ tcLxmc, id, zt, mc, sj, tcDwdm, tcDwmc, tnLx, tnTbzt, tcZdybbid }, idx) {
      let tempjh = {
        tnAqjcjhid: this.agence[idx].id,
        tcJhmc: this.agence[idx].mc,
        tcJhjzsj: this.agence[idx].sj,
        tcDwdm: this.agence[idx].sxid,
        tcDwmc: this.agence[idx].sxmc,
        tnRwid:this.agence[idx].id, // 用于报表任务上报中的固定报表
        tnLx: this.agence[idx].tnLx,// 用于报表任务上报
        tcZdybbid: this.agence[idx].tcZdybbid // 用于报表上报的自定义报表
      }
      const target = {}
      switch (tcLxmc) {
        case '报表上报任务':  //报表任务查询及填报
          if (this.agence[idx].tnLx === 0) {
            this.queryRwzt(this.agence[idx])
          } else {
            this.queryRwzt(this.agence[idx])
          }
          break
        case '安全检查计划': // 安全检查表录入
            target.path = '/safe/exec/form/commit'
            target.query = { // 所需参数: 
            row: JSON.stringify(tempjh)
          }
          break
        case '隐患整改通知':  
          target.path = '/safe/exec/notice/detail'
          target.query = {
            curPlan: id,
            curZt: zt
          }
          break
      }
      return this.$router.push(target)
    },
    async queryRwzt(row) {
      row.tnRwid = row.id
      row.tcRwmc = row.mc
      row.tcMbid = row.tcZdybbid
      const result = await Model.queryRwzt({
        isQuery: 1,
        cdId: '0004030303',
        requestData: {
          tnRwid: row.id,
          tnLx: row.tnLx,
        }
      })
      if(result.data && result.data.length !== 0) {
        result.data[0].tcMbid = row.tcZdybbid
        // 固定报表
        if(result.data[0].tnLx === 0) {
          // 已填报-判断是保存还是已提交
          if(row.tnTbzt === 0) {
            // 已保存--修改、提交
            this.$router.push({ 
              path: '/info/report/task-query/base-form', 
              query: {
                row: JSON.stringify(result.data[0])
              } 
            })
          } else {
            // 已提交--预览
            this.$router.push({ 
              path: '/info/report/task-query/base-form/detail', 
              query: {
                row: JSON.stringify(result.data[0])
              } 
            })
          }
        } else { // 自定义报表
          this.$router.push({ 
            path: '/info/report/task-query/detail', 
            query: result.data[0]
          })
        }
      } else {
      // 未填报
       // 为固定报表
       if (row.tnLx === 0) { 
          this.$router.push({ 
          path: '/info/report/task-query/base-form', 
          query: {
            row: JSON.stringify(row)
          } 
        })
        // 为自定义报表
        } else {
          this.$router.push({ 
          path: '/info/report/task-query/detail', 
          query: row
        })
        }
      }
    },

   
    // 跳转到消息通知详情页面
    _NewsClick ({tnXxid, tcLx, tnBlbz, sffsdw}, idx) {  
      if (tcLx == '0402') {
        this.$router.push ({
          path:'/info/case/query/detail',
          query: {
          type: 'detail',
          tnXxcbid: tnXxid
          }
        })
      } else if (tcLx === '04010101' || tcLx === '04010102' || tcLx === '04010103' || tcLx === '04010104') {
        
          this.$router.push ({
            name: "infoNewsQueryDetail",
            params: { tnXxid: this.news[idx].tnXxid, tnBlbz: this.news[idx].tnBlbz||-10, sffsdw:this.news[idx].sffsdw === true?1:0}
          })
      }
    },

    // 跳转到资料库页面
    _DocsMoreClick () {
      this.$router.push ({
        path: '/document/upload'
      })
    },

    // 下载文件
    _DownloadFile ({ tcWjm, tcYwjm }) {
      request({
        url: '/zlk/zlkDownload',
        responseType: 'blob',
        data: {
          requestData:{
            tcWjm:tcWjm
          }
        }
      })
      .then((res) => {
        const content = res
        const blob = new Blob([content])
        const fileName = tcYwjm
        const fileTag = fileName.split(".")[1]
          if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
      })
    },
  },
  // 长度过滤
  filters: {
    ellipsis: function (value) {
      if (!value) return ' '
      if (value.length > 10) {
        return value.slice(0, 10) + '...'
      }
      return value
    },
  },
  mounted () {}
};
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";

.home{
  padding-top: 20px;
}

.home-banner{
  background: #ffffff;
  margin-bottom: 20px;
  padding: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid #ededed;
  >img{
    width: 100%;
  }
}

.home-no-news{
  height: 500px;
  background: #ffffff;
  text-align: center;
  line-height:500px;
}

.home-info{
  overflow: hidden;
  margin: 0 16px;
  margin-bottom: 20px;

  .home-info-title{
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 600;
    color: $green;

    >i{
      margin-right: 5px;
      color: $text-light;
      font-weight: normal;
    }
    >span{
      
      font-size: 16px;
    }

    >.home-info-title-more{
      float: right;
      font-weight: normal;
      font-size: 14px;
      color: $text-light;
      cursor: pointer;

      i{
        font-size: 12px;
      }
    }
  }

  >ul{
    overflow: hidden;
    list-style: none;
    margin: 0 -8px;

    >li{
      width: 33.33%;
      float: left;
      padding: 0px 8px;
      margin-bottom: 10px;
      cursor: pointer;

      >.info-block{
        background: #fff;
        padding: 10px;
        overflow: hidden;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.07);
        border: 1px solid #f1f1f1;
        border-radius: 4px;

        &:hover{
          border: 1px solid $green-light;
        }

        >*{
          float: left;

          &.info-block-icon{
            width: 40px;
            height: 40px;
            margin-right: 10px;
            >i{
              display: block;
              font-size: 40px;
              margin-top: -3px;
            }
          }

          &.info-block-content{
            width: calc(100% - 50px);
            >h6{
              font-size: 16px;
              font-weight: normal;
              margin-bottom: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              span{
                color: $green;
                font-size: 12px;
              }
            }

            .info-block-des{
              font-size: 12px;
              >i{
                font-size: 14px;
                margin-right: 5px;
                vertical-align: middle;
                color: $gray
              }
              >span{
                display: inline-block;
                vertical-align: middle;
                color: $text-light;
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}

.icon-color-red{
  color: $error;
}

.icon-color-blue{
  color: $blue;
}

.icon-color-cyan{
  color: $cyan;
}

.icon-color-yellow{
  color: $warn;
}

.icon-color-orange{
  color: $orange;
}

.icon-color-lemon{
  color: $lemon;
}

.custom-view {
  background: $bg !important;
}
</style>