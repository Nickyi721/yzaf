<template>
  <div class="common-tree">
    <el-tree size="mini" :data="orgTree" :props="defaultProps" lazy :load="loadTreeNode" :expand-on-click-node="false" @node-click="_TreeNodeClick"/>
  </div>
</template>

<script>
import Model from '@commons/model.js'

export default {
  data () {
    return {
      orgTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    _TreeNodeClick (node) {
      this.currentNode = node
      this.$emit('click', node)
    },
    // 加载树节点
    async loadTreeNode (node, resolve) {
      let orgTree = []
      if (node.level === 0) {
        orgTree = await this.getOrgList()
        this.$emit('loaded', this.orgTree)
      } else if (node.data && node.data.hasChild) {
        orgTree = await this.getOrgList(node.data.dwbm)
        this.$emit('resolved', this.orgTree)
      }
      resolve(orgTree)
    },
    // 获取下级机构列表
    async getOrgList (orgCode) {
      const result = await Model.getOrgList({ 
        tcDwbm: orgCode,
      })
      return result.data || []
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
