<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000405" module="normal" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>    
    <!-- 顶部查询条件 -->
    <div slot="top">
      <div class="common-filter">
        <div v-if="filterList.length===0">
          <span style="font-size: 14px;color: blue">[请在下方选择相关查询条件]</span>
        </div>
        <div class="tips">
          <span style="font-size: 14px;color: #FF5549">注：最多只能选择5个统计查询条件</span>
        </div>
        <!-- 当前查询条件 -->
        <div class="filter-items">
          <span v-for="(item, idx) in filterList" v-if="item.type === '01'" :key="idx">
            <span class="app-tab-close" @click="_RemoveItem(item)"><CustomIcon name="close" /></span>
            {{ item.tcXxxlxmc }}——{{ item.typeName }}：{{ item.valName }}
          </span>
          <span v-for="(item, idx) in filterList" v-if="item.type === '02'" :key="idx">
            <span class="app-tab-close" @click="_RemoveItem(item)"><CustomIcon name="close" /></span>
            {{ item.typeName }}：{{ item.valName }}
          </span>
        </div>
        <!-- 按钮 -->
        <CustomToolbar>
          <CustomButton icon="search" text="查询" @click="_ButtonClick('query')"/>
          <CustomButton icon="delete" text="重置" @click="_ButtonClick('reset')"/>
        </CustomToolbar>
      </div>
      <!-- tab标签页切换 -->
      <el-tabs v-show="!iframeState" value="031001" @tab-click="_TabClick">
        <el-tab-pane :label="tab.label" :name="tab.name" v-for="(tab, index) in tabs" :key="index">
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-show="!iframeState" class="eval">
      <InfoPart :config="config.BasicInfoList" @select-change="_RadioChange" @checkbox-change="_CheckboxChange" @input-type-change="_InputTypeChange" ref="infoForm"/>
      <EvalPart :config="config.EvaContentList" @eval-radio-change="_EvalRadioChange" @eval-checkbox-change="_EvalCheckboxChange" @eval-input-click="_EvalInputClick" ref="evalForm"/>
    </div>

    <iframe :src="reportUrl" v-show="iframeState" frameborder="0" scrolling="auto" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'

import InfoPart from './components/InfoPart/main.vue'
import EvalPart from './components/EvalPart/main.vue'
export default {
  name: 'FinanceEvalMultipleCount',
  components: {
    InfoPart,
    EvalPart
  },
  mixins: [
    Mixin.report,
    Mixin.init,
  ],
  data () {
    return {
      reportUrl: '',
      iframeState: false,
      tabs: [
        {
          id: 1,
          label: '营业场所',
          name: '031001'
        },
        {
          id: 2,
          label: '业务库、保险箱库评估',
          name: '031002'
        },
        {
          id: 3,
          label: '自助设备、自助银行评估',
          name: '031003'
        },
        {
          id: 4,
          label: '运钞评估',
          name: '031004'
        },
        {
          id: 5,
          label: '消防评估',
          name: '031005'
        },
        {
          id: 6,
          label: '数据中心及联网监控中心评估',
          name: '031006'
        },
        {
          id: 7,
          label: '枪支弹药评估',
          name: '031007'
        },
        {
          id: 8,
          label: '案件防范评估',
          name: '031008'
        },
        {
          id: 9,
          label: '安全保卫基础工作评估',
          name: '031009'
        },
      ],
      config: {},
      filterList: [],
      currentTab: '031001',
      isFirstEnter: true,
      dwdm: '',
      urlParm: '',
      valueObject: {},
      sfjm: 0
    }
  },
  methods: {
    async $init (options) {
      this.getEvaFormParamList(this.currentTab);
      const result = await Model.getSfjm({})
      if(result.state === '1') {
        this.sfjm = result.data
      }
    },
    // 加载树形结构
    _OrgTreeLoaded(node) {
      this.dwdm = node.id
    },
    // 点击树节点
    _OrgTreeClick(node) {
      this.dwdm = node.id
      this.iframeState = true
      this.createUrlParam()
      this.reportUrl = this.createReportUrl(`reportlet=jraq_zhcx_z.cpt&dwbm=${this.dwdm}&sfjm=${this.sfjm}` + this.urlParm)
    },
    _ButtonClick(type) {
      if(type === 'query') {
        this.iframeState = true
        this.createUrlParam()
        console.log(this.urlParm)
        this.reportUrl = this.createReportUrl(`reportlet=jraq_zhcx_z.cpt&dwbm=${this.dwdm}&sfjm=${this.sfjm}` + this.urlParm)
      } else {
        this.$router.go(0);
      }
    },
    // 构造URL
    createUrlParam() {
      this.urlParm = ''
      this.filterList.forEach((item, index) => {
        if(item.valId !== '') {
          this.urlParm += '&xxxlx' + (index + 1) + '=' + item.type + '&sjlx' + (index + 1) + '=' + item.tnXxxsjlx + 
          '&id' + (index + 1) + '=' + item.typeId + '&value' + (index + 1) + '=' + item.valId
        } else {
          this.urlParm += '&xxxlx' + (index + 1) + '=' + item.type + '&sjlx' + (index + 1) + '=' + item.tnXxxsjlx + 
          '&id' + (index + 1) + '=' + item.typeId + '&value' + (index + 1) + '=' + item.valName
        }
      })
    },
    // 基本信息-单选-change事件
    _RadioChange(curItem, value, name) {
      let status = 0
      this.filterList.forEach(item => {
        if(curItem.tnPgjbxxbid === item.typeId) {
          status = 1
        }
      })
      // 判断之前的条件中是否存在当前选项
      if(status === 1) {
        this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnPgjbxxbid)
        this.filterList.push({
          type: '01',
          typeId: curItem.tnPgjbxxbid,
          typeName: curItem.tcXxxmc,
          valId: value,
          valName: name,
          tcXxxlx: curItem.tcXxxlx,
          tcXxxlxmc: curItem.tcXxxlxmc,
          tnXxxsjlx: curItem.tnXxxsjlx
        })
      } else {
        if(this.filterList.length < 5) {
          this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnPgjbxxbid)
          this.filterList.push({
            type: '01',
            typeId: curItem.tnPgjbxxbid,
            typeName: curItem.tcXxxmc,
            valId: value,
            valName: name,
            tcXxxlx: curItem.tcXxxlx,
            tcXxxlxmc: curItem.tcXxxlxmc,
            tnXxxsjlx: curItem.tnXxxsjlx
          })
        } else {
          this.$alert('当前最多支持5项查询条件')
        }
      }
    },
    // 基本信息多选-change事件
    _CheckboxChange(state, curItem, value, valueNameObject, name) {
      let status = 0
      let valueNameList = []
      if(state) {
        if(!(curItem.tnPgjbxxbid in this.valueObject)) {
          this.valueObject[curItem.tnPgjbxxbid] = []
        }
        this.valueObject[curItem.tnPgjbxxbid].push(value)
        
      } else {
        this.valueObject[curItem.tnPgjbxxbid] = this.valueObject[curItem.tnPgjbxxbid].filter(item => item !== value)
      }
      const valueList = this.valueObject[curItem.tnPgjbxxbid].join(',')
      valueNameList = valueNameObject[curItem.tnPgjbxxbid].join('，')
      
      this.filterList.forEach(item => {
        if(item.typeId === curItem.tnPgjbxxbid) {
          status = 1
        }
      })
      this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnPgjbxxbid)
      if(this.filterList.length < 5) {
        this.filterList.push({
          type: '01',
          typeId: curItem.tnPgjbxxbid,
          typeName: curItem.tcXxxmc,
          valId: valueList,
          valName: valueNameList,
          tcXxxlx: curItem.tcXxxlx,
          tcXxxlxmc: curItem.tcXxxlxmc,
          tnXxxsjlx: curItem.tnXxxsjlx
        })
      } else {
        this.$alert('当前最多支持5项查询条件')
      }
    },
    // 基本信息-输入型数据
    _InputTypeChange(value, curItem) {
      let status = 0
      this.filterList.forEach(item => {
        if(curItem.tnPgjbxxbid === item.typeId) {
          status = 1
        }
      })
      // 判断之前的条件中是否存在当前选项
      if(status === 1) {
        this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnPgjbxxbid)
        this.filterList.push({
          type: '01',
          typeId: curItem.tnPgjbxxbid,
          typeName: curItem.tcXxxmc,
          valId: '',
          valName: value,
          tcXxxlx: curItem.tcXxxlx,
          tcXxxlxmc: curItem.tcXxxlxmc,
          tnXxxsjlx: curItem.tnXxxsjlx
        })
      } else {
        if(this.filterList.length < 5) {
          this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnPgjbxxbid)
          this.filterList.push({
            type: '01',
            typeId: curItem.tnPgjbxxbid,
            typeName: curItem.tcXxxmc,
            valId: '',
            valName: value,
            tcXxxlx: curItem.tcXxxlx,
            tcXxxlxmc: curItem.tcXxxlxmc,
            tnXxxsjlx: curItem.tnXxxsjlx
          })
        } else {
          this.$alert('当前最多支持5项查询条件')
        }
      }
    },
    // 评估内容-单选
    _EvalRadioChange(id, type, val, name, curItem) {
      if(this.filterList.length < 5) {
        this.filterList = this.filterList.filter(item => item.typeId !== id)
        this.filterList.push({
          type: '02',
          typeId: id,
          typeName: type,
          valId: val,
          valName: name,
          tnXxxsjlx: 1
        })
      } else {
        this.$alert('当前最多支持5项查询条件')
      }
    },
    // 评估内容-多选
    _EvalCheckboxChange(state, id, type, val, name, curItem) {
      if(state) {
        if(this.filterList.length < 5) {
          this.filterList.push({
            type: '02',
            typeId: id,
            typeName: type,
            valId: val[val.length - 1],
            valName: name,
            tnXxxsjlx: 1
          })
        } else {
          this.$alert('当前最多支持5项查询条件')
        }
      } else {
        const arr1 = this.filterList.filter(item => item.typeId !== id)
        const arr2 = this.filterList.filter(item => item.typeId === id && val.includes(item.valId))
        this.filterList = arr1.concat(arr2)
      }
    },
    // 评估内容-输入型数据
    _EvalInputClick(id, name) {
      if(this.filterList.length < 5) {
        this.filterList = this.filterList.filter(item => item.typeId !== id)
        this.filterList.push({
          type: '02',
          typeId: id,
          typeName: name,
          valId: '',
          valName: '',
          tnXxxsjlx: 1
        })
      } else {
        this.$alert('当前最多支持5项查询条件')
      }
    },
    async _TabClick(tab, event) {
      this.currentTab = tab.name
      await this.getEvaFormParamList(tab.name);
      this.$forceUpdate
    },
    // 单个条件的删除
    _RemoveItem(item) {
      if(item.valId !== '') {
        this.filterList = this.filterList.filter(list => item.valId !== list.valId)
      } else {
        this.filterList = this.filterList.filter(list => item.typeId !== list.typeId)
      }
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
  },
  activated () {
    if(!this.isFirstEnter) {
      this.currentTab && this.getEvaFormParamList(this.currentTab)
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
<style lang="scss" scoped>
  .filter-items {
    height: 90px;
    overflow-y: auto;
    margin-top: 15px;
    >span {
      display: block;
      font-size: 14px;
      height: 25px !important;
      line-height: 25px !important;
      // margin-left: 10px;
      margin-bottom: 5px;
      .app-tab-close {
        cursor: pointer;
      }
    }
    .iconfont {
      font-size: 14px !important;
    }
  }
  .tips {
    position: absolute;
    right: 30px;
    top: 5px;
  }
  .eval {
    // height: 100%;
    overflow-y: auto;
    min-width: 1000px;
    padding: 10px 20px 40px 20px;
  }
  .el-tabs {
    background-color: #fff;
  }
  .custom-toolbar {
    padding: 5px !important;
  }
</style>
