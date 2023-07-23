<template lang="html">
  <CustomView :location="[{ text: '年终自评详情' }]">
    <!-- 顶部：条件查询/操作栏 -->
    <CustomToolbar border slot="top">
      <span class="common-org-title" slot="left">
        <CustomIcon name="specially-designed"/>
        {{params.orgName}}{{params.year}}年度年终自评详情
      </span>
      <template v-if="$route.query.tnTjzt == 0">
        <CustomButton icon="save" text="保存" @click="_ButtonClick('save')"/>
        <CustomButton icon="publish" text="提交" @click="_ButtonClick('publish')"/>
      </template>
    </CustomToolbar>
    <div class="g-scroll-content">
      <div class="g-title-center">自评评分表</div>
      <DataGridItem :list="listItem" :editAble="editAble" @span-method="_TableMerageMethod" />
      <div class="g-title-center">风险扣分项</div>
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

// 页面组件
import DataGridItem from './components/DataGridItem.vue'
import DataGridRisk from './components/DataGridRisk.vue'

export default {
  mixins: [
    Mixin.init, 
  ],
  components: {
    DataGridItem,
    DataGridRisk,
  },
  data () {
    return {
      listItem: [],
      listRisk: [],
      editAble: 0,
      // spanArr: [],
      pos: 0,
      // 是否有一票否决
      oneVeto: 0,
      // 判断年度日常工作登记状态
      ndzdgzzt: 0
    }
  },
  methods: {
    $init (options) {
      this.getDetail()
      this.editAble = parseInt(this.$route.query.tnTjzt)
    },
    _ButtonClick(type) {
      if(type === 'save') {
        this.saveList(type)
      } else {
        for(let i=0;i<this.listItem.length;i++) {
          if(this.listItem[i].tnZpf===''|| this.listItem[i].tnZpf === undefined) {
            this.$message({
              message: '尚有评分未填写或者填写不符合规范，请修改后再提交',
              type: 'warning',
              duration: 1000,
              customClass: "middle",
              showClose: true
            })
            return
          }
        }
        this.$confirm('是否提交?').then(async () => {
          this.saveList(type)
          // 2019年5月12日晚上修改 
          // const result = await Model.closeWork(this.params.year)
          // if (result.state === '1') {
          //   this.saveList(type)
          // }
        }).catch(() => {})
      }
    },
    // 表格合并
    _TableMerageMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        
      }
    },
    // 获取详情列表
    async getDetail() {
      const result = await Model.getDetailList({
        isQuery: 1,
        cdId: '0004090201',
        requestData: {
          tcNd: this.$route.query.year
        }
      })
      if(result.data) {
        this.ndzdgzzt = result.data.ndzdgzzt
        this.listItem = result.data.PayzKhpfList
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
        for (let i=0;i<this.listItem.length;i++) {
          // 合并单元格备用
          // if(i===0) {
          //   this.spanArr.push(1)
          //   this.pos = 0
          // } else {
          //   if(this.listItem[i].tcKpxm1 === this.listItem[i-1].tcKpxm1) {
          //     this.spanArr[this.pos] += 1
          //     this.spanArr.push(0)
          //   } else{
          //     this.spanArr.push(1)
          //     this.pos = i
          //   }
          // }
          
          // 判断是否已经完成自评
          // 未完成
          if(!this.$route.query.isDone || this.$route.query.isDone === 'false') {
            // 判断预扣分
            if(this.listItem[i].tnBjf - this.listItem[i].kf <= 0) {
              this.listItem[i].tnZpf = 0
            } else {
              this.listItem[i].tnZpf = this.listItem[i].tnBjf - this.listItem[i].kf
            }
          } else { // 已完成
            // if(this.listItem[i].tnZpf === undefined) {
            //   this.listItem[i].tnZpf = this.listItem[i].tnBjf
            // }
          }
          // 判断是否有一票否决
          if(this.listItem[i].kf >= 10000) {
            this.oneVeto = 1
          }
        }
      }
    },
    // 编辑保存
    async saveList(type) {
      let tnZpzdf = 0
      let tcBz = ''
      if(this.oneVeto === 0) {
        for(let i in this.listItem) {
          if(this.listItem[i].tnZpf) {
            tnZpzdf += parseFloat(this.listItem[i].tnZpf)
          }
        }
        // 总分保留小数2位
        tnZpzdf = tnZpzdf.toFixed(2)
      } else {
        tcBz = '此单位因“一票否决”，因此总分为0'
      }
      let updateList = []
      for(let i=0;i<this.listItem.length;i++) {
        if(this.listItem[i].tnZpf==='' || this.listItem[i].tnZpf===undefined){
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
      this.listItem.forEach((row, index) => {
        // if(row.tnZpf) {
          if(row.tnNzkpid) {  //判断是否为第一次自评打分
            const item = {
              tnZpf: row.tnZpf,
              tnKpid: row.tnKpid,
              tnNzkpid: row.tnNzkpid,
              tnKpf: row.tnZpf
            }
            updateList.push(item)
          } else {
            const item = {
              tnZpf: row.tnZpf,
              tnKpid: row.tnKpid,
              tnkpf: row.tnZpf
            }
            updateList.push(item)
          }
        // }
      })
      // 调取接口
      const result = await Model.saveList({
        isQuery: 0,
        cdId: '0004090201',
        requestData: {
          tnNzkpzid: this.$route.query.tnNzkpzid,
          tcKpdwssjj: this.listItem[0].tcKpdwssjj,
          tcNd: this.$route.query.year,
          tnZpzdf: tnZpzdf,
          tcBz: tcBz,
          xmdfList: updateList
        }
      })
      // 提交时先保存，然后判断年度工作登记是否完结，只有完结才可以提交
      if(result.state === '1') {
        if(type === 'publish') {
          // 判断年度工作登记是否完结，只有完结才可以提交
          if(this.ndzdgzzt) {
            this.publishItem()
          } else {
            this.$message({
              message: '草稿已保存，只有对应年份的日常工作登记完结，才能进行提交！',
              type: 'success',
              duration: 10000,
              customClass: "middle",
              showClose: true
            })
          }
        } else {
          this.$message({
            message: '保存成功！',
            type: 'success',
            duration: 1000,
            customClass: "middle",
            showClose: true
          })
          this.$router.push({
            path: '/chinapost/self/list'
          })
        }
      }
    },
    // 提交
    async publishItem() {
      const result = await Model.publishItem({
        isQuery: 0,
        cdId: '0004090201',
        requestData: {
          tnNzkpzid: this.$route.query.tnNzkpzid
        }
      })
      if(result.state === '1') {
        this.$message({
          message: '提交成功！',
          type: 'success',
          duration: 1000,
          customClass: "middle",
          showClose: true
        })
        this.$router.push({path: '/chinapost/self/list'})
      }
    },
    _DataGridDblClick(row) {
      this.$router.push({
        path: '/chinapost/self/list/info',
        query: {
          tnXxcbid: row.tnXxcbid,
        }
      })
    }
  }
}
</script>
