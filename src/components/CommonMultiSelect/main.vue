<template>
  <div class="common-tree">

    <div class="common-tree-filter">
      <el-checkbox-group v-model="currentPlate" @change="_CheckPlateChange"  v-if="plates.length > 1">
        <el-checkbox v-for="option in plates" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr.replace('板块', '')}}</el-checkbox>
      </el-checkbox-group>
      <div class="tips">
        <span></span> 部分子级机构被选中
        <span></span> 所有下一级机构被选中
        <span></span> 所有子级机构被选中
      </div>
    </div>
    <el-tree class="tree" ref="tree" :data="tree" :props="treeProps" lazy :load="loadTreeNode" :expand-on-click-node="false" :default-expanded-keys="root" node-key="id">
      <div class="ceil" slot-scope="{ node, data }">
        <div>
          <el-checkbox :true-label='1' :false-label='0' :class="node | checkboxClass" v-model="node.data.bjxz" @change="value => _CheckChange(node, data, value)">
            <span :title="data.name" class="common-tree-title-node">{{ data.name }}</span>
           <!--  <span>----{{node.data.bfxz}}---{{node.data.xjxz}}---{{node.data.hasChild}}</span>
            <span>下：{{node.data.xyjNum}}---下选：{{node.data.xyjSelectNum}}</span>
            <span>全：{{node.data.syjdNum}}---全选：{{node.data.syjdSelectNum}}</span> -->
          </el-checkbox>
        </div>
        <div class="tool-wrap" v-if='data.hasChild'>
          <el-checkbox v-model="node.data.xjxz" :true-label='1' false-label='0' @change="selectNextAll(node,data)">选择下一级</el-checkbox>
          <el-checkbox v-model="node.data.xjxz" :true-label='2' false-label='0' @change="selectAll(node,data)">选择所有子级</el-checkbox>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
/*
  {id: 1, mode: 1, select: true}
  mode 1选中下一级  2全部子级
 */
import Model from '@commons/model.js'
import { debug } from 'util'

export default {
  name: 'CommonMultiSelect',
  props: {
    fnCode: String,
    apiUrl: {
      type: String,
      default: '/xxglQzgl/getQzglTreeByAsync'
    },
    propsCode: {
      type: Object,
      default () {
        return {
          selected: 'bjxz',
          mode: 'xjxz',
          bfxz: 'bfxz'
        }
      }
    },
    requestData: {
      type: Object,
      default () {
        return {
          name: 'tnQzglid',
          tnLx: 4,
          id: '0'
        }
      }
    },
    checkList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      treeProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      isLoading: true,
      currentPlate: ['000301', '000302', '000303'],
      tree: [],
      currentNodeData: {
        id: '300000000003'
      },
      plates: [],
      root: []
    }
  },
  filters: {
    checkboxClass (node) {
      if (node.data.bfxz && [1, 2].indexOf(node.data.xjxz) < 0 && node.data.hasChild) {
        return 'checkbox-type3'
      } else if (node.data.xjxz === 1 && node.data.hasChild) {
        return 'checkbox-type1'
      } else if (node.data.xjxz === 2 && node.data.hasChild) {
        return 'checkbox-type2'
      }
      return ''
    }
  },
  methods: {
    _CheckPlateChange (value) {
      this.refresh()
    },
    getCheckedNodes () {
      return this.getCheckList()
    },
    selectAll (node, data) {
      if (node.data.syjdSelectNum) {
        this.selectNumComputed(node, {}, node.data.syjdSelectNum, false)
      }
      this.setChecked(node)
      node.data.syjdSelectNum = node.data.xjxz === 2 ? node.data.syjdNum : 0
      node.data.xyjSelectNum = node.data.xjxz === 2 ? node.data.xyjNum : 0
      this.selectNumComputed(node, {}, node.data.syjdNum, node.data.xjxz === 2)
      if (!node.data.syjdSelectNum) {
        node.data.bfxz = 0
      }
    },
    selectNextAll (node, data) {
      if (node.data.syjdSelectNum) {
        this.selectNumComputed(node, {}, node.data.syjdSelectNum, false)
      }
      this.setChecked(node)
      node.data.xyjSelectNum = node.data.xjxz === 1 ? node.data.xyjNum : 0
      node.data.syjdSelectNum = node.data.xjxz === 1 ? node.data.xyjSelectNum : 0
      this.selectNumComputed(node, {}, node.data.syjdSelectNum, node.data.xjxz === 1)
      if (!node.data.syjdSelectNum) {
        node.data.bfxz = 0
      }
    },
    selectNumComputed (node, currentData, num, flag) {
      const each = node => {
        const parentNode = node.parent
        if (node.level !== 1) {
          if (flag) {
            if (currentData.parentId === parentNode.data.id) {
              parentNode.data.xyjSelectNum += num
            }
            parentNode.data.syjdSelectNum += num
          } else {
            if (currentData.parentId === parentNode.data.id) {
              parentNode.data.xyjSelectNum -= num
            }
            parentNode.data.syjdSelectNum -= num
          }
          if (parentNode.data.syjdSelectNum && parentNode.data.xyjSelectNum !== parentNode.data.xyjNum && parentNode.data.syjdSelectNum !== parentNode.data.syjdNum) {
            parentNode.data.bfxz = 1
          } else {
            parentNode.data.bfxz = 0
          }
          if (parentNode.data.syjdSelectNum === parentNode.data.syjdNum) {
            parentNode.data.xjxz = 2
          } else if (parentNode.data.xyjSelectNum === parentNode.data.xyjNum) {
            parentNode.data.xjxz = 1
          } else {
            parentNode.data.xjxz = 0
          }
          each(parentNode)
        }
      }
      each(node)
    },
    _CheckChange (node, currentData, value) {
      // 遍历父级节点
      this.selectNumComputed(node, currentData, 1, value)
      //  this.$emit('check-change', this.getCheckList())
    },
    // 加载树节点
    async loadTreeNode (node, resolve) {
      this.isLoading = true
      let tree = []
      if (node.level === 0) {
        tree = await this.getFnOrgList()
        tree.forEach(item => {
          if (!this.root.filter(ceil => ceil === item.id).length) {
            this.root.push(item.id)
          }
        })
      } else if (node.data && node.data.hasChild) {
        tree = await this.getFnOrgList(node.data.id)
        tree.forEach(item => {
          if (!this.root.filter(ceil => ceil === item.id).length) {
            if ((item.xjxz === 1 || item.bfxz) && item.hasChild) {
              this.root.push(item.id)
            }
          }
        })
      }
      
      resolve(tree)
      this.isLoading = false
      let currentNode
      if(this.$refs.tree){
        currentNode = this.$refs.tree.getNode(node.key)
      }
      currentNode && this.setChecked(currentNode, true)
    },
    // 获取下级机构列表
    async getFnOrgList (orgCode) {
      const { tnLx } = this.requestData
      let data = {
        tcDwbm: orgCode,
        // tnQzglid: this.tnQzglid,
        tnLx,
        tcYwgnbm: this.fnCode,
        bkdm: this.currentPlate
      }
      data[this.requestData.name] = this.requestData.id
      const result = await Model.getGroupFnOrgList(this.apiUrl, data)
      let list = result.data || []

      return list.map(item => {
        if (item.xjxz !== 1 && item.xjxz !== 2 && item.syjdSelectNum) {
          item.bfxz = 1
        }
        item.bjxz = item.bjxz || 0
        item.xjxz = item.xjxz || 0
        if(!item.hasChild){
          item.leaf = true
        }
        return item
      })
    },
    // 刷新树
    async refresh () {
      this.tree = await this.getFnOrgList()
      this.$emit('refreshed', this.tree)
    },
    // 重置
    async reset () {
      this.currentPlate = ['000301', '000302', '000303']
      this.tree = await this.getFnOrgList()
    },
    setChecked (currentNode, init) {
      const each = node => {
        node.childNodes.forEach(item => {
          const parentNode = item.parent
          if (parentNode.data.xjxz === 2) {
            item.data.bjxz = 1
            item.data.xjxz = 2
            item.data.bfxz = 0
            item.data.syjdSelectNum = item.data.syjdNum
            item.data.xyjSelectNum = item.data.xyjNum
          } else if (parentNode.data.xjxz === 1) {
            item.data.bjxz = 1
            item.data.xjxz = item.data.xjxz || 0
            item.data.bfxz = item.data.bfxz || 0
            item.data.syjdSelectNum = item.data.syjdSelectNum || 0
            item.data.xyjSelectNum = item.data.xyjSelectNum || 0
          } else {
            if (!init) {
              item.data.xjxz = 0
              item.data.bjxz = 0
              item.data.bfxz = 0
              item.data.syjdSelectNum = 0
              item.data.xyjSelectNum = 0
            }
          }
          item.childNodes && each(item)
        })
      }
      each(currentNode)
    },
    getCheckList () {
      let list = []
      const filterList = data => {
        if (!list.filter(item => item.id === data.id).length) {
          list.push(data)
        }
      }
      const each = tree => {
        for (let i = 0; i < tree.length; i++) {
          const item = tree[i]
          if (item.data.xjxz === 1) {
            filterList(item.data)
          } else if (item.data.xjxz === 2) {
            filterList(item.data)
          } else if (item.data.bjxz) {
            if ([1, 2].indexOf(item.parent.data.xjxz) < 0) {
              filterList(item.data)
            }
          }

          if (item.data.xjxz !== 2) {
            item.childNodes && each(item.childNodes)
          }
        }
      }
      each(this.$refs.tree.root.childNodes)
      return list
    }
  },
  mounted () {
    this.plates = JSON.parse(window.sessionStorage.boardIds)
  }
}
</script>
<style scoped lang="scss">
@import "~@assets/styles/define.scss";
.common-tree {
  overflow: hidden;
}
.common-tree-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px!important;
}
.tips {
  display: block;
  text-align: right;
  font-size: 12px;
  color: $text-light;
  // line-height: 100%!important;
  position: absolute;
  right: 10px;
  top: 0;
  height: 40px;

  span {
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-left: 10px;
    margin-right: 5px;

    &:nth-child(1) {
      background: #e6fbce;
      border: 1px solid #91f718;
    }
    &:nth-child(2) {
      background: #91f718;
      border: 1px solid #04b74d;
    }
    &:nth-child(3) {
      background: #04b74d;
      border: 1px solid #04b74d;
    }
  }
}
.tree /deep/ {
  .el-tree-node__content {
    height: 40px !important;
    display: flex !important;
    > .el-tree-node__expand-icon {
      color: #666;
    }
  }
  .el-checkbox {
    .el-checkbox__inner {
      background: none !important;
      border-color: #999;
      &:after {
        border-color: #04b74d !important;
      }
    }
    &.checkbox-type1 {
      .el-checkbox__inner {
        background: #91f718 !important;
        &:after {
          border-color: #04b74d !important;
        }
      }
    }
    &.checkbox-type2 {
      .el-checkbox__inner {
        background: #04b74d !important;
        &:after {
          border-color: #fff !important;
        }
      }
    }
    &.checkbox-type3 {
      .el-checkbox__inner {
        background: #e6fbce !important;
        border-color: #91f718 !important;
      }
    }
  }
  .is-current {
    > .el-tree-node__content {
      background: #ddd !important;
      > .el-tree-node__expand-icon {
        color: #888 !important;
      }
      .common-tree-title-node {
        // color: #fff;
      }
      .tool-wrap {
        display: block;
      }
    }
  }
  .ceil {
    display: flex;
    flex: 1;
    justify-content: space-between;
    .el-tree-node__expand-icon {
      margin-right: 5px;
    }
  }
  .tool-wrap {
    display: none;
    .el-checkbox {
      margin-right: 10px;
      span {
        font-size: 12px;
      }
    }
  }
  .is-leaf {
    &:before{
      display: none !important;
    }
  }
}
</style>
