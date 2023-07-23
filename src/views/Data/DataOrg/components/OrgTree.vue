<template>
  <div class="common-tree common-tree-side">
    <div class="common-tree-filter">
      <el-checkbox-group v-model="currentPlate" @change="_CheckChange">
        <el-checkbox v-for="option in plates" :key="option.value" :label="option.value">{{option.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-tree size="mini" :data="orgTree" :props="treeProps" lazy :load="loadTreeNode" :expand-on-click-node="false" @node-click="_TreeNodeClick" :default-expanded-keys="['300000000001']" node-key="dwbm"/>
  </div>
</template>

<script>
import Model from '@commons/model.js'

export default {
  data () {
    return {
      orgTree: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      plates: [
        { label: '邮政', value: '000301' },
        { label: '银行', value: '000302' },
        { label: '寄递', value: '000303' },
      ],
      currentPlate: []
    }
  },
  methods: {
    _TreeNodeClick (node) {
      this.currentNode = node
      this.$emit('click', node)
    },
    async _CheckChange (value) {
      this.orgTree = await this.getOrgList()
    },
    // 加载树节点
    async loadTreeNode (node, resolve) {
      let orgTree = []
      if (node.level === 0) {
        orgTree = await this.getOrgList()
        this.$emit('loaded', orgTree[0])
      } else if (node.data && node.data.hasChild) {
        orgTree = await this.getOrgList(node.data.dwbm)
        this.$emit('resolved', orgTree)
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
  created () {
    let curPlate = JSON.parse(window.sessionStorage.boardIds);
    for(let i in curPlate) {
      this.currentPlate.push(curPlate[i].tcSjubm)
    }
  }
}
</script>

<style lang="scss" scoped>
  .common-tree-filter .el-checkbox {
    margin-left: 15px !important;
  }
</style>
