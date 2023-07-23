<template>
  <div class="dict-tree">
    <el-tree :data="tree" :props="defaultProps" @node-click="_TreeNodeClick" node-key="id" :default-expanded-keys="expands"/>
  </div>
</template>

<script>
import Model from '../model.js'

export default {
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tree: [],
      expands: ['0']
    }
  },
  methods: {
    _TreeNodeClick (node) {
      this.currentNode = node
      this.$emit('click', node)
    },
    async getTreeData (needEmitEvent) {
      const result = await Model.getDataDictTree()
      if (result.data) {
        this.tree = result.data
        this.currentNode = this.tree[0]
        needEmitEvent && this.$emit('loaded', this.tree)
      }
    },
    refresh () {
      this.expands = [this.currentNode.id]
      this.getTreeData()
    }
  },
  created () {
    this.getTreeData(true)
  }
}
</script>

<style lang="scss">
@import "~@assets/styles/define.scss";

.dict-tree{
  background: #fff;
  height: 100%;

  .common-tree-filter{
    height: auto!important;
    padding: 10px;
    border-bottom: 1px solid $border;
    background: $bg;
    .el-checkbox{
      margin-right: 10px!important;
    }
  }

  .common-tree-title-node{
    font-size: 14px;
  }

  .el-checkbox+.el-checkbox{
    margin-left: 10px;
  }

  .el-tree{
    >.el-tree-node{
      >.el-tree-node__content{
        display: block;
        height: 32px;
        line-height: 32px;
        font-weight: bold;
      }
    }
  }

  .is-current{
    >.el-tree-node__content{
      color:$green;
      font-size:14px;
      font-weight: bold;
      background: #f5f5f5!important;
      i{
        font-weight: normal;
      }
    }
  }
}
</style>
