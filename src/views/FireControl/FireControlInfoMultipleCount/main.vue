<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000408" module="special" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>    

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
          <span v-for="(item, idx) in filterList" :key="idx">
            <span class="app-tab-close" @click="_RemoveItem(item)"><CustomIcon name="close" /></span>
            {{ item.tcXxxlxmc }}——{{ item.typeName }}：{{ item.valName }}
          </span>
          <!-- <span v-for="(item, idx) in filterList" v-if="item.valId === ''" :key="idx">
            <span class="app-tab-close" @click="_RemoveItem(item)"><CustomIcon name="close" /></span>
            {{ item.typeName }}
          </span> -->
        </div>
        <!-- 按钮 -->
        <CustomToolbar>
          <CustomButton icon="search" text="查询" @click="_ButtonClick('query')"/>
          <CustomButton icon="delete" text="重置" @click="_ButtonClick('reset')"/>
        </CustomToolbar>
      </div>
      <!-- tab标签页切换 -->
      <el-tabs v-if="!iframeState" value="100101" @tab-click="_TabClick">
        <el-tab-pane :label="tab.tcSjnr" :name="tab.tcSjubm" v-for="(tab, index) in tabs" :key="index">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="!iframeState" class="eval">
      <DynamicForm ref="dynamicForm" :config="config" @select-change="_RadioChange" @checkbox-change="_CheckboxChange" @input-type-change="_InputTypeChange" />
    </div>

    <iframe :src="reportUrl" v-if="iframeState" frameborder="0" scrolling="auto" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

import DynamicForm from './components/DynamicForm.vue'
export default {
  name: 'FireControlInfoMultipleCount',
  mixins: [
    Mixin.report,
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DynamicForm
  },
  data() {
    return {
      reportUrl: '',
      dict: ['1001'],
      filterList: [],
      iframeState: false,
      tabs: [],
      currentTab: '100101',
      config: [],
      sfjm: 0,
      dwdm: '',
      urlParm: '',
      valueObject: {}
    }
  },
  methods: {
    async $init (options) {
      if (options && options['1001']) { 
        this.tabs = options['1001']
      }
      const result = await Model.getSfjm({})
      if(result.state === '1') {
        this.sfjm = result.data
      }
      await this.getFireFormParamList(this.currentTab);
    },
    // 查询按钮点击
    _ButtonClick(type) {
      if(type === 'query') {
        this.iframeState = true
        this.createUrlParam()
        this.reportUrl = this.createReportUrl(`reportlet=xfaq_zhcx_z.cpt&op=view&dwdm=${this.dwdm}&sfjm=${this.sfjm}` + this.urlParm)
      } else {
        this.$router.go(0)
      }
    },
    // 构造URL
    createUrlParam() {
      this.urlParm = ''
      this.filterList.forEach((item, index) => {
        if(item.valId !== '') {
          this.urlParm += '&xxxlx' + (index + 1) + '=' + item.tcXxxlx + '&sjlx' + (index + 1) + '=' + item.tnXxxsjlx + 
          '&id' + (index + 1) + '=' + item.typeId + '&value' + (index + 1) + '=' + item.valId
        } else {
          this.urlParm += '&xxxlx' + (index + 1) + '=' + item.tcXxxlx + '&sjlx' + (index + 1) + '=' + item.tnXxxsjlx + 
          '&id' + (index + 1) + '=' + item.typeId + '&value' + (index + 1) + '=' + item.valName
        }
      })
    },
    // 标签页切换
    async _TabClick(tab, event) {
      this.currentTab = tab.name
      await this.getFireFormParamList(this.currentTab);
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
    // 加载树形结构
    _OrgTreeLoaded(node) {
      this.dwdm = node.id
    },
    // 点击树节点
    _OrgTreeClick(node) {
      this.dwdm = node.id
      this.iframeState = true
      this.createUrlParam()
      this.reportUrl = this.createReportUrl(`reportlet=xfaq_zhcx_z.cpt&op=view&dwdm=${this.dwdm}&sfjm=${this.sfjm}` + this.urlParm)
    },
    // 加载每种类型的配置
    async getFireFormParamList(type) {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx: type
      })
      if (result.data) {
        this.config = result.data
        this.config = this.config.filter(item => item.tnXxxlrfs === 1 || item.tnXxxlrfs === 2 || item.tnXxxlrfs === 3 || item.tnXxxlrfs === 4)
      }
    },
    // 单选-change事件
    _RadioChange(curItem, value, name) {
      let status = 0
      this.filterList.forEach(item => {
        if(curItem.tnXfaqjbxxszid === item.typeId) {
          status = 1
        }
      })
      // 判断之前的条件中是否存在当前选项
      if(status === 1) {
        this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnXfaqjbxxszid)
        this.filterList.push({
          typeId: curItem.tnXfaqjbxxszid,
          typeName: curItem.tcXxxmc,
          valId: value,
          valName: name,
          tcXxxlx: curItem.tcXxxlx,
          tcXxxlxmc: curItem.tcXxxlxmc,
          tnXxxsjlx: curItem.tnXxxsjlx
        })
      } else {
        if(this.filterList.length < 5) {
          this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnXfaqjbxxszid)
          this.filterList.push({
            typeId: curItem.tnXfaqjbxxszid,
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
    // 多选-change事件
    _CheckboxChange(state, curItem, value, valueNameObject) {
      let status = 0
      let valueNameList = []
      if(state) {
        if(!(curItem.tnXfaqjbxxszid in this.valueObject)) {
          this.valueObject[curItem.tnXfaqjbxxszid] = []
        }
        this.valueObject[curItem.tnXfaqjbxxszid].push(value)
        
      } else {
        this.valueObject[curItem.tnXfaqjbxxszid] = this.valueObject[curItem.tnXfaqjbxxszid].filter(item => item !== value)
      }
      const valueList = this.valueObject[curItem.tnXfaqjbxxszid].join(',')
      valueNameList = valueNameObject[curItem.tnXfaqjbxxszid].join('，')
      
      this.filterList.forEach(item => {
        if(item.typeId === curItem.tnXfaqjbxxszid) {
          status = 1
        }
      })
      this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnXfaqjbxxszid)
      if(this.filterList.length < 5) {
        this.filterList.push({
          typeId: curItem.tnXfaqjbxxszid,
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
    // 输入型数据
    _InputTypeChange(value, curItem) {
      let status = 0
      this.filterList.forEach(item => {
        if(curItem.tnXfaqjbxxszid === item.typeId) {
          status = 1
        }
      })
      // 判断之前的条件中是否存在当前选项
      if(status === 1) {
        this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnXfaqjbxxszid)
        this.filterList.push({
          typeId: curItem.tnXfaqjbxxszid,
          typeName: curItem.tcXxxmc,
          valId: '',
          valName: value,
          tcXxxlx: curItem.tcXxxlx,
          tcXxxlxmc: curItem.tcXxxlxmc,
          tnXxxsjlx: curItem.tnXxxsjlx
        })
      } else {
        if(this.filterList.length < 5) {
          this.filterList = this.filterList.filter(item => item.typeId !== curItem.tnXfaqjbxxszid)
          this.filterList.push({
            typeId: curItem.tnXfaqjbxxszid,
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
      height: 35px !important;
      line-height: 20px !important;
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
    height: 100%;
    overflow-y: auto;
    // min-width: 1000px;
    padding: 10px 20px 40px 20px;
  }
  .el-tabs {
    background-color: #fff;
  }
  .custom-toolbar {
    padding: 5px !important;
  }
</style>

