<template>
  <CustomView :location="[{ text: '评估详情' }]">
    <div slot="top">
      <CustomTitle block>{{orgName}}</CustomTitle>
      <el-tabs :value="name" @tab-click="_TabClick">
        <el-tab-pane :label="tab.label" :name="tab.name" v-for="(tab, index) in tabs" :key="index">
        </el-tab-pane>
      </el-tabs>
    </div>
    
      <div class="eval">
        <InfoForm :config="config.BasicInfoList" :content="info" ref="infoForm"/>
        <EvalForm :config="config.EvaContentList" :content="content" ref="evalForm"/>
      </div>
  </CustomView>
  
</template>

<script>
import Model from './model.js'

import Mixin from '@mixins'
import InfoForm from './components/InfoForm/main.vue'
import EvalForm from './components/EvalForm/main.vue'

export default {
  components: {
    InfoForm,
    EvalForm
  },
  mixins: [
    Mixin.init
  ],
  data () {
    return {
      tabs: [],
      list: {},
      name: '',
      config: {},
      info: {},
      content: {}
    }
  },
  methods: {
    $init () {
      this.orgName = this.$route.query.orgName
      this.orgCode = this.$route.query.orgCode
      this.evalId = this.$route.query.evalId
      this.getFormsScoNStatusList()
    },
    _TabClick(tab, event) {
      this.getEvalData(tab)
    },
    // 查询九项任务列表
    async getFormsScoNStatusList() {
      const result = await Model.getFormsScoNStatusList({
        isQuery: 1,  //是否是查询类 0-否 1-是
        requestData: {
          tcDwbm: this.orgCode,
          tnPgnrzbid: this.evalId
        }
      })
      if(result.data) {
        let len = result.data.length;
        this.name = result.data[0].tcXxxlx;
        this.getEvaFormParamList(result.data[0].tcXxxlx);
        this.getFinSecEvaFormInfoDetail(result.data[0].tcXxxlx, result.data[0].tnPgnrzbid)
        for(let i=0;i<len;i++) {
          this.tabs.push({
            id: result.data[i].tnPgnrzbid,
            label: result.data[i].tcXxxlxmc,
            name: result.data[i].tcXxxlx
          })
        }
      }
    },
    async getEvalData (tab) {
      await this.getFinSecEvaFormInfoDetail(tab.name);
      await this.getEvaFormParamList(tab.name);
    },
    // 查询某项任务的配置列表
    async getEvaFormParamList(type) {
      const result = await Model.getEvaFormParamList({
        isQuery: 1,  //是否是查询类 0-否 1-是
        requestData: {
          tcPglx: type,
        }
      })
      if(result.data) {
        this.config = result.data
      }
    },
    // 查询某项任务的配置-值-列表
    async getFinSecEvaFormInfoDetail(type) {
      const result = await Model.getFinSecEvaFormInfoDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
        requestData: {
          tcPglx: type,
		      tnPgnrzbid: this.evalId
        }
      })
      if(result.data) {
        const info = result.data.BasicInfoList
        info.forEach(item => {
          if (typeof item.tnSzzxsj !== 'undefined') {
            this.$set(this.info, item.tnPgjbxxbid, item.tnSzzxsj)
          } else if (typeof item.tcZfclxsj !== 'undefined') {
            this.$set(this.info, item.tnPgjbxxbid, item.tcZfclxsj)
          } else {
            this.$set(this.info, item.tnPgjbxxbid, item.tcFdxsj)
          }
        })
        const content = result.data.EvaContentList
        content.forEach(item => {
          let value
          if (item.tcYysjxid.match(',')) {
            value = item.tcYysjxid.split(',').map(item => parseInt(item, 10))
          } else {
            value = item.tcYysjxid.split().map(item => parseInt(item, 10))
          }
          this.$set(this.content, item.tnPgnrszbid, value)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.eval{
  height: 100%;
  overflow-y: auto;
  min-width: 1000px;
  padding: 10px 20px 40px 20px;
}
</style>
