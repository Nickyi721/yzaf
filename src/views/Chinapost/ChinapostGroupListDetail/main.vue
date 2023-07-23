<template>
  <CustomView :location="[{ text: '集团考评详情' }]">
    <CustomToolbar border slot="top">
      <span class="common-org-title" slot="left">
        <CustomIcon name="specially-designed"/>
        {{params.orgName}}{{params.year}}年度集团考评详情
      </span>
      <CustomButton icon="save" text="保存" @click="_ButtonClick" v-if="$route.query.oneVeto == 0 && $route.query.tnZt == 0" />     
    </CustomToolbar>
    <!-- 数据表格 -->
    <div class="g-scroll-content">
      <div class="g-title-center">集团考评表
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick1"/>
      </div>
      <DataGrid :list="list" :editAble="editAble"></DataGrid>
      <div class="g-title-center">风险扣分项
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick2"/>
      </div>
      <DataGridRisk :list="listRisk" @dblclick="_DataGridDblClick" />
      <br>
      <br>
      <br>
    </div>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'
import ExportToExcel from "@commons/exportToExcel.js"

// 页面组件
import DataGrid from './components/DataGrid.vue'
import DataGridRisk from './components/DataGridRisk.vue'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataGrid,
    DataGridRisk
  },
  data () {
    return {
      list: [],
      editAble: 0,
      listRisk: [],
      // oneVeto: 0
      tableConfig: {
        _this: this
      },
      title: [],
      downloadList: [],      
      downloadList2: []
    }
  },
  methods: {
    $init (options) {
      this.getDetail()
      if (parseInt(this.$route.query.oneVeto)) {
        this.editAble = 1
      } else {
        this.editAble = parseInt(this.$route.query.tnZt)
      }
    },
    //导出按钮
    _ExportClick1() {
      let exportList = []
      let fileName = this.$route.query.orgName+this.$route.query.year+'年度集团考评详情表'
      let thList = document.getElementsByTagName('thead')[0].childNodes[0].childNodes //
      let idx = [] //用于表头和表体一一对应
      thList.forEach((v, j) => {
        let text = v.innerText
        if(!!text && text!='#') {
          this.title.push(v.innerText)
          idx.push(j)
        }
      })
      let trList = document.getElementsByTagName('tbody')[0].childNodes  //tr
      trList.forEach((v, j) => {
        if(j < trList.length-1){
          let temp = {}
          let tdList = v.childNodes
          tdList.forEach((a, i) => {
            let text = a.innerText
            idx.forEach(arr => {
              if(i=== arr) {
                let key = thList[arr].innerText
                temp[key] = text
              }
            })
          })
          exportList.push(temp)
        }
      })
      if (this.downloadList.includes(fileName)) {
        if (!window.confirm("您刚刚已经下载过改文件了哦，需要重新下载吗？")){
          return false;
        }
      }
      var isrepeat = true;
      for(let key in exportList[0]){
        if(exportList[0][key] !== key){
          isrepeat = false;
        }
      }
      if(isrepeat){
        exportList.shift()
      }
      ExportToExcel(exportList, this.tableConfig, fileName);
      // 把已下载的表名存入已下载列表中
      this.downloadList.push(fileName);
      this.title = []
    },    
    _ExportClick2() {
      let exportList = []
      let fileName = this.$route.query.orgName+this.$route.query.year+'风险扣分项'
      let thList = document.getElementsByTagName('thead')[1].childNodes[0].childNodes //表头
      let idx = [] //用于表头和表体一一对应
      thList.forEach((v, j) => {
        let text = v.innerText
        if(!!text && text!='#') {
          this.title.push(v.innerText)
          idx.push(j)
        }
      })
      let trList = document.getElementsByTagName('tbody')[1].childNodes  //tr
      trList.forEach((v, j) => {
        if(j < trList.length-1){
          let temp = {}
          let tdList = v.childNodes
          tdList.forEach((a, i) => {
            let text = a.innerText
            idx.forEach(arr => {
              if(i=== arr) {
                let key = thList[arr].innerText
                temp[key] = text
              }
            })
          })
          exportList.push(temp)
        }
      })
      if (this.downloadList2.includes(fileName)) {
        if (!window.confirm("您刚刚已经下载过改文件了哦，需要重新下载吗？")){
          return false;
        }
      }
      var isrepeat = true;
      for(let key in exportList[0]){
        if(exportList[0][key] !== key){
          isrepeat = false;
        }
      }
      if(isrepeat){
        exportList.shift()
      }
      ExportToExcel(exportList, this.tableConfig, fileName);
      // 把已下载的表名存入已下载列表中
      this.downloadList.push(fileName);      
      this.title = []
    },
    // 保存
    async _ButtonClick() {
      let tnKpzdf = 0
      let tcKpdj = ''
      for(let i in this.list) {
        if(this.list[i].tnKpf) {
          tnKpzdf += parseFloat(this.list[i].tnKpf)
        }
      }
      tnKpzdf = tnKpzdf.toFixed(2)
      if(tnKpzdf >= 95) {
        tcKpdj = '0'
      } else if(tnKpzdf >= 90 && tnKpzdf <= 94) {
        tcKpdj = '1'
      } else {
        tcKpdj = '2'
      }
      let updateList = []
      for(let i=0;i<this.list.length;i++) {
        if(this.list[i].tnKpf==''||this.list[i].tnKpf==undefined){
          this.$message({
            message: '尚有评分未填写或者填写不符合规范，请修改后再保存',
            type: 'warning',
            duration: 1000,
            customClass: "middle",
            showClose: true
          })
          return
        }
      }
      this.list.forEach((row, index) => {
        if(row.tnKpf) {
          const item = {
            tnZpf: parseFloat(row.tnZpf),
            tnKpid: row.tnKpid,
            tnNzkpid: row.tnNzkpid,
            tnKpf: parseFloat(row.tnKpf)
          }
          updateList.push(item)
        }
      })
      const result = await Model.saveJtkp({
        isQuery: 0,
        cdId: '0004090301',
        requestData: {
          tnNzkpzid: this.$route.query.tnNzkpzid,
          tcNd: this.$route.query.year,
          tnKpzdf: tnKpzdf,
          tcKpdj: tcKpdj,
          xmdfList: updateList
        }
      })
      if(result.state === '1') {
        this.$message({
          message: '保存成功！',
          type: 'success',
          customClass: "middle",
        })
        this.$router.push({path: '/chinapost/group/list'})
      }
    },
    // 获取详情
    async getDetail() {
      const result = await Model.getDetail({
        isQuery: 1,
        cdId: '0004090301',
        requestData: {
          tcNd: this.$route.query.year,
          tcDwdm: this.$route.query.orgId
        }
      })
      if(result.data) {
        this.list = result.data.PayzKhpfList
        for (let i=0;i<this.list.length;i++) {
          // 判断是否已经完成考评
          // 已完成
          if(this.editAble === 0) {
            // 判断预扣分
            if(this.list[i].tnBjf - this.list[i].kf <= 0) {
              this.list[i].tnKpf = 0
            } else {
              this.list[i].tnKpf = this.list[i].tnBjf - this.list[i].kf
            }
          }
          // 判断是否有一票否决
          // if(this.list[i].kf >= 10000) {
          //   this.oneVeto = 1
          // }
        }
        if(parseInt(this.$route.query.oneVeto)) {
          this.list.forEach(item => {
            item.tnKpf = 0
          })
        }

        this.listRisk = result.data.XxglList
        this.listRisk.forEach((item) => {
          item.tdAfrq = Moment(item.tdAfrq).format('YYYY-MM-DD')
          if(item.tnKf >= 10000) {
            item.tnKf = '/'
            item.tnBz = '一票否决案件'
          } else {
            item.tnBz = ''
          }
        }) 
      }
    },
    _DataGridDblClick(row) {
      this.$router.push({
        path: '/chinapost/group/list/info',
        query: {
          tnXxcbid: row.tnXxcbid,
        }
      })
    }
  },
}
</script> 

<style scoped>
  .el-button {
    float: right;
  }
</style>

