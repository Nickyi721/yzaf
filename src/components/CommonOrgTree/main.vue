<template>
  <div class="side-tree">
    <div class="common-tree-search" v-if="search">
      <el-input
        type="text"
        placeholder="请输入搜索信息"
        v-model="text"
        maxlength="30"
        size="mini"
        clearable
      >
      </el-input>
      <el-button type="primary" size="mini" @click="_ButtonClick">搜索</el-button>
    </div>
    <div class="common-tree-filter" v-if="plate">
      <el-checkbox-group v-model="currentPlate" @change="_CheckChange">
        <el-checkbox v-for="option in plates" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr.replace('板块', '')}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-tree ref="tree" v-if="fnCode" size="mini" :show-checkbox="showCheckbox" :check-strictly="checkStrictly" check-on-click-node :data="tree" :props="defaultProps" lazy :load="loadTreeNode" :expand-on-click-node="false" node-key="id" :default-checked-keys="treeList" :default-expanded-keys="defaultExpands" highlight-current @check-change="_TreeCheckChange" @node-click="_TreeNodeClick">
      <span slot-scope="{ node, data }">
        <span :title="data.name" class="common-tree-title-node">

          <CustomIcon name="org-guard" class="icon-guard" v-if="fnCode === '000404' && data.jgtype === '2'"/>
          <CustomIcon name="equip" class="icon-guard" v-if="fnCode === '000405' && data.type === '2' && module !== 'eval'"/>
          <CustomIcon name="message-site" class="icon-message-site" v-if="fnCode === '000408' && data.type === '2'"/>

          <template v-if="fnCode === '000405' && module === 'eval'">
            <span class="icon-org-num" v-if="getEvalNum(data.jraqszt)">{{getEvalNum(data.jraqszt)}}</span>
            <template v-if="data.jraqszt && data.jraqszt.split('-')[4] !== 'NA'">
              <img src="~@assets/tips.gif" v-if="getSelfLevelIcon(data.jraqszt) < 90"/>
              <img src="~@assets/good.png" v-if="getSelfLevelIcon(data.jraqszt) >= 90"/>
            </template>

            <template v-if="data.jraqszt && (data.jraqszt.split('-')[0] !== data.jraqszt.split('-')[3])">
              <img src="~@assets/tips2.gif" v-if="getAllLevelIcon(data.jraqszt) < 90"/>
              <img src="~@assets/good2.png" v-if="getAllLevelIcon(data.jraqszt) >= 90"/>
            </template>
            
          </template>
          {{ data.name }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import Model from '@commons/model.js'

export default {
  name: 'CommonOrgTree',
  props: {
    fnCode: String,
    module: String,
    net: Boolean,
    plate: {
      type: Boolean,
      default: true
    },
    search: {
      type: Boolean,
      default: false
    },
    showCheckbox: Boolean,
    checkStrictly: Boolean,
    content: Boolean,
    checkList: {
      type: Array,
      default: () => []
    },
    isWorkGroup: Boolean
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      currentPlate: ['000301', '000302', '000303'],
      tree: [],
      expands: ['0'],
      plates: [],
      treeList: [],
      defaultExpands: [JSON.parse(window.sessionStorage.user).tcDwdm],
      text: ''
    }
  },
  methods: {
    _TreeNodeClick (node) {
      this.currentNode = node
      this.$emit('click', node)
    },
    _TreeCheckChange (data, checked, indeterminate) {
      this.$emit('check-change', data, checked)
    },
    _CheckChange (value) {
      this.refresh()
    },
    getCheckedNodes () {
      return this.$refs.tree.getCheckedNodes()
    },
    getCheckedKeys () {
      return this.$refs.tree.getCheckedKeys()
    },
    updateKeyChildren (keys, data){
      this.$refs.tree.updateKeyChildren(keys, data)
    },
    // 搜索按钮
    _ButtonClick() {
      
    },
    // 加载树节点
    async loadTreeNode (node, resolve) {
      let tree = []
      if (node.level === 0) {
        tree = await this.getFnOrgList() || []
        this.$nextTick(() => {
          tree[0] && this.$refs.tree.setCurrentKey(tree[0].id)
        })
        this.$emit('loaded', tree[0])
      } else if (node.data && node.data.hasChild) {
        tree = await this.getFnOrgList(node.data.id, node.data.type)
        this.$emit('resolved', node.data)
      }
      resolve(tree)
    },
    // 获取下级机构列表
    async getFnOrgList (orgCode, type) {
      let result = null
      if (this.fnCode === '000404') {
        result = await Model.getAbjgFnOrgList({
          tcDwbm: orgCode,
          tcYwgnbm: this.fnCode,
          // sfbhwd: this.net ? 2 : 1
          bkdm: this.currentPlate
        })
      }
      else if(this.fnCode === '000405'){
        if (this.module === 'eval') {
          const params = { 
            tcYwgnbm: this.fnCode,
            bkdm: this.currentPlate
          }
          type === '1' && (params.tcDwbm = orgCode)
          type === '2' && (params.tnGzzszbid = orgCode)

          result = await Model.getEvalFnOrgList(params)
        } else if (this.isWorkGroup){
          result = await Model.getFnOrgList({ 
            tcDwbm: orgCode,
            tcYwgnbm: this.fnCode,
            // sfbhwd: this.net ? 2 : 1
            bkdm: this.currentPlate
          })
        }else {
          result = await Model.getAfssFnOrgList({ 
            tcDwbm: orgCode,
            tcYwgnbm: this.fnCode,
            // sfbhwd: this.net ? 2 : 1
            bkdm: this.currentPlate
          })
        }
        if(this.module === 'normal') {
          result = await Model.getFnOrgList({ 
            tcDwbm: orgCode,
            tcYwgnbm: this.fnCode,
            // sfbhwd: this.net ? 2 : 1
            bkdm: this.currentPlate
          })
        }
        
      } else if(this.fnCode === '000408') {
        if(this.module === 'special') {
          result = await Model.getFnOrgList({ 
            tcDwbm: orgCode,
            tcYwgnbm: this.fnCode,
            // sfbhwd: this.net ? 2 : 1
            bkdm: this.currentPlate
          })
        } else {
          result = await Model.getXfxxOrgList({ 
            tcDwbm: orgCode,
            tcYwgnbm: this.fnCode,
            // sfbhwd: this.net ? 2 : 1
            bkdm: this.currentPlate
          })
        }
      }
      else{
        result = await Model.getFnOrgList({ 
          tcDwbm: orgCode,
          tcYwgnbm: this.fnCode,
          // sfbhwd: this.net ? 2 : 1
          bkdm: this.currentPlate
        })
      }
      const list = result.data || []
      list.forEach(item => {
        item.isLeaf = !item.hasChild
      })
      return list
    },
    // 刷新树
    async refresh () {
      this.tree = await this.getFnOrgList()
      this.$emit('refreshed', this.tree)
    },
    //清除所选
    clearSelection () {
      if (this.$refs.tree)
        this.$refs.tree.setCheckedKeys([]);
    },
    getEvalNum (sn) {
      return sn ? parseInt(sn.split('-')[3]) : sn
    },
    getSelfLevelIcon (sn) {
      const str = sn ? sn.split('-')[4] : '0'
      const value = str === 'NA' ? 0 : parseInt(str)
      return value
    },
    getAllLevelIcon (sn) {
      const value = sn ? parseInt(sn.split('-')[2]) : 0
      return value
    }
  },
  mounted () {
    this.plates = JSON.parse(window.sessionStorage.boardIds)
  },
  watch: {
    checkList: {
      immediate: true,
      handler (val) {
        this.clearSelection();
        this.treeList = val
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import "~@assets/styles/define.scss";
.side-tree {
  .common-tree-search {
    padding: 8px;
    .el-input {
      width: 70%;
    }
    .el-button {
      margin-left: 12px;
    }
  }
}

.icon-guard{
  color: $orange;
}
.icon-message-site{
  color: $orange;
}
.icon-org-num{
  display: inline-block;
  vertical-align: middle;
  height: 16px;
  min-width: 16px;
  padding: 0 3px;
  border-radius: 4px;
  background: $warn;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #fff!important;
}
.icon-org-eval{
  display: inline-block;
  vertical-align: middle;
  height: 16px;
  width: 16px;
  border-radius: 100%;
  margin-left: 5px;
  &.icon-org-self-red{
    background: $error;
    animation:flash 0.3s infinite;
  }
  &.icon-org-self-green{
    background: $green;
  }

  &.icon-org-all-red{
    border: 5px solid $error;
    animation:flash 0.3s infinite;
  }
  &.icon-org-all-green{
    border: 5px solid $green;
  }

  @keyframes flash
  {
    from { opacity: 1; }
    to { opacity: 0; }
  }
}
</style>
