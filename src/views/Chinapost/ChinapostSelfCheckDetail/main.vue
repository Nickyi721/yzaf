<template>
  <CustomView :location="[{ text: '年终自评审核' }]">
    <!-- 顶部：条件查询/操作栏 -->
    <CustomToolbar border slot="top">
      <span class="common-org-title" slot="left">
        <CustomIcon name="specially-designed"/>
        {{params.orgName}}{{params.year}}年度年终自评详情
      </span>
      <CustomButton v-if="$route.query.tnShzt === 0" icon="check" text="审核通过" @click="_ButtonClick('success')"/>
      <CustomButton v-if="$route.query.tnShzt === 0" icon="check" text="审核不通过" @click="_ButtonClick('faild')"/>
    </CustomToolbar>
    <div class="g-scroll-content">
      <div class="g-title-center">自评评分表</div>
      <DataGridItem :list="listItem" />
      <div class="g-title-center">风险扣分项</div>
      <DataGridRisk :list="listRisk" @dblclick="_DataGridDblClick"/>
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
    }
  },
  methods: {
    $init(options) {
      this.getDetail()
    },
    // 获取详情
    async getDetail() {
      const result = await Model.getDetailList({
        isQuery: 1,
        cdId: '0004090202',
        requestData: {
          tcNd: this.$route.query.year
        }
      })
      if(result.data) {
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
      }
    },
    async _ButtonClick(type) {
      if(type === 'success') {
        this.$confirm('是否审核通过?').then(async () => {
          // 审核
          const result = await Model.checkItem({
            isQuery: 0,
            cdId: '0004090202',
            requestData: {
              tnNzkpzid : this.$route.query.tnNzkpzid,
              tnShzt: 1 
            }
          })
          if(result.state === '1') {
            this.$message({
              message: '审核通过成功！',
              type: 'success',
              customClass: "middle",
            })
            this.$router.push({ path: '/chinapost/self/check' })
          }
        }).catch(() => {})
      } else {
        this.$confirm('是否审核不通过?').then(async () => {
          // 审核
          const result = await Model.checkItem({
            isQuery: 0,
            cdId: '0004090202',
            requestData: {
              tnNzkpzid : this.$route.query.tnNzkpzid,
              tnShzt: 0 
            }
          })
          if(result.state === '1') {
            this.$message({
              message: '审核不通过成功！',
              type: 'success',
              customClass: "middle",
            })
            this.$router.push({ path: '/chinapost/self/check' })
          }
        }).catch(() => {})
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
