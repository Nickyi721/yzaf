<template>
  <CustomView>
    <CustomToolbar slot="top">
      <template slot="left">
        <el-select v-model="type" size="mini" @change="_SelectTypeChange">
          <el-option v-for="option in options" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
        <span> 机构树设置</span>
      </template>
    </CustomToolbar>

    <div class="setter common-card" v-if="type">
      <div class="setter-content">
        <div class="setter-tree-title">
          <span>选择机构</span>
          <span>
            <el-radio-group v-model="linkStatus">
              <el-radio :label="1">不关联</el-radio>
              <el-radio :label="2">关联子级</el-radio>
              <el-radio :label="3">关联所有下级</el-radio>
            </el-radio-group>
          </span>
        </div>
        <div class="setter-tree">
          <el-tree ref="orgTree" size="mini" :data="orgTree" :props="treeProps" lazy :load="loadOrgTreeNode" :expand-on-click-node="false" :default-expanded-keys="['300000000001']" node-key="dwbm">
            <span slot-scope="{ node, data }">
              <el-checkbox v-model="node.data.selected" @change="value => _CheckChange(node, data, value)">{{ data.name }}</el-checkbox>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="setter-content">
        <div class="setter-tree-title">
          <span>{{typeText}}机构树</span>
        </div>
        <div class="setter-tree">
          <el-tree v-if="type" size="mini" :data="fnOrgTree" :props="treeProps" lazy :load="loadFnOrgTreeNode" :default-expanded-keys="['300000000001']" node-key="id"/>
        </div>
      </div>
    </div>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import CommonModel from '@commons/model.js'
import Model from './model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'DataFnOrg',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
  },
  data () {
    return {
      dict: ['0004'],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      options: [],
      type: '',
      linkStatus: 1,
      orgTree: [],
      fnOrgTree: [],
      isFirstEnter: true
    }
  },
  computed: {
    // 业务类型文字
    typeText () {
      const idx = this.options.findIndex(item => item.tcSjubm === this.type)
      return idx >= 0 ? this.options[idx].tcSjnr : ''
    }
  },
  methods: {
    // 初始化
    $init (options) {
      if (options) {
        this.options = options['0004']
        this.type = this.options[0].tcSjubm
        // this._SelectTypeChange()
      }
    },
    async _CheckChange (node, data, value) {
      node.data.selected = value

      // 遍历父级节点
      const setParentCheckStatus = node => {
        if (node.level !== 0 && value) {
          node.data.selected = value
          setParentCheckStatus(node.parent)
        }
      }
      setParentCheckStatus(node.parent)
      
      // 遍历子节点
      const eachChild = node => {
        node.childNodes.forEach(item => {
          item.data.selected = value
          eachChild(item)
        })
      }

      if (this.linkStatus === 2) {
        node.childNodes.forEach(item => {
          item.data.selected = value
        })
      } else if (this.linkStatus === 3) {
        eachChild(node)        
      }

      if (!value) {
        eachChild(node)
      }

      // 保存节点设置信息
      const result = value ? await Model.addFnOrg({
        tcDwbm: data.dwbm,
        tcYwgnbm: this.type,
        gllx: this.linkStatus,
        tcYwgnmc: this.typeText
      }) : await Model.deleteFnOrg({
        tcDwbm: data.dwbm,
        tcYwgnbm: this.type
      })

      if (result) {
        this.fnOrgTree = await this.getFnOrgList()
      }
    },
    // 事件-选择业务类型
    async _SelectTypeChange() {
      this.orgTree = await this.getOrgList()
      this.fnOrgTree = await this.getFnOrgList()
    },
    // 加载树节点
    async loadOrgTreeNode (node, resolve) {
      let tree = []
      if (node.level === 0) {
        tree = await this.getOrgList()
        // tree[0].selected = true
        
      } else if (node.data && node.data.hasChild) {
        tree = await this.getOrgList(node.data.dwbm)
      }
      resolve(tree)
    },
    // 获取下级机构列表
    async getOrgList (orgCode) {
      const result = await CommonModel.getOrgList({ 
        tcDwbm: orgCode,
        tcYwgnbm: this.type,
        bkdm: ['000301', '000302', '000303'],
      })
      return result.data || []
    },
    // 加载功能树节点
    async loadFnOrgTreeNode (node, resolve) {
      let tree = []
      if (node.level === 0) {
        tree = await this.getFnOrgList()
      } else if (node.data && node.data.hasChild) {
        tree = await this.getFnOrgList(node.data.id)
      }
      resolve(tree)
    },
    // 获取功能树下级机构列表
    async getFnOrgList (orgCode) {
      const result = await CommonModel.getFnOrgList({ 
        tcDwbm: orgCode,
        tcYwgnbm: this.type,
        bkdm: ['000301', '000302', '000303'],
      })
      return result.data || []
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@assets/styles/define.scss';

.setter{
  height: 100%;  
  overflow: hidden;
  font-size: 14px;
  position: relative;
  >.setter-title{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid #ebeef5;
    // background: $yellow-light;
    color: $green-light;
  }

  >.setter-content{
    position: relative;
    width: 50%;
    height: 100%;
    float: left;
    padding: 10px;
    padding-top: 40px;

    >.setter-tree-title{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 40px;
      overflow: hidden;
      padding: 0 10px;
      >span{
        display: block;
        float: left;
        height: 40px;
        line-height: 40px;
        color: $green-light;
        &:nth-child(2){
          float: right;
        }
      }
    }

    >.setter-tree{
      border: 1px solid #ebeef5;
      padding: 10px;
      height: 100%;
      overflow: auto;
    }
  }
}

</style>
