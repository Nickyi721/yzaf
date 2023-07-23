<template>
  <div class="common-tree">
    <div class="common-tree-filter" v-if="plates.length > 1">
      <el-checkbox-group v-model="currentPlate" @change="_CheckPlateChange">
        <el-checkbox v-for="option in plates" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr.replace('板块', '')}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-tree ref="tree" :data="tree" :props="treeProps" lazy :load="loadTreeNode" :expand-on-click-node="false" :default-expanded-keys="root" node-key="id">
      <span slot-scope="{ node, data }">
        <el-checkbox v-model="node.data.selected" @change="value => _CheckChange(node, data, value)">
          <span :title="data.name" class="common-tree-title-node">{{ data.name }}</span>
        </el-checkbox>
      </span>
    </el-tree>
  </div>
</template>

<script>
import Model from '@commons/model.js'

export default {
  name: 'CommonOrgSelect',
  props: {
    fnCode: String,
    checkList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      treeProps: {
        children: 'children',
        label: 'name'
      },
      currentPlate: ['000301', '000302', '000303'],
      tree: [],
      plates: [],
      root: [],
      isWorkGroup: Boolean,
    }

  },
  methods: {
    getCheckedNodes () {
      return this.$refs.tree.getCheckedNodes()
    },
    _TreeNodeClick (node) {
      this.currentNode = node
      this.$emit('click', node)
    },
    _TreeCheckChange (data, checked, indeterminate) {
      this.$emit('check-change', data, checked)
    },
    _CheckPlateChange (value) {
      this.refresh()
    },
    async _CheckChange (node, data, value) {
      node.data.selected = value

      // 遍历父级节点
      // const setParentCheckStatus = node => {
      //   if (node.level !== 0 && value) {
      //     node.data.selected = value
      //     setParentCheckStatus(node.parent)
      //   }
      // }
      // setParentCheckStatus(node.parent)
      
      // 遍历子节点
      const eachChild = node => {
        node.childNodes.forEach(item => {
          item.data.selected = value
          eachChild(item)
        })
      }
      eachChild(node)  

      this.$emit('check-change', data, value, this.getCheckList())
    },
    // 加载树节点
    async loadTreeNode (node, resolve) {
      let tree = []
      if (node.level === 0) {
        tree = await this.getFnOrgList()
        this.root = tree.map(item => item.id)
      } else if (node.data && node.data.hasChild) {
        tree = await this.getFnOrgList(node.data.id)
      }
      this.setChecked(tree)
      resolve(tree)
    },
    // 获取下级机构列表
    async getFnOrgList (orgCode) {
      const result = await Model.getFnOrgList({ 
        tcDwbm: orgCode,
        tcYwgnbm: this.fnCode,
        bkdm: this.currentPlate
      })
      const list = result.data || []
      return list
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
    setChecked (list) {
      list.forEach(item => {
        item.selected = this.checkList.findIndex(id => id === item.id) >= 0
        item.children && each(item.children)
      })
    },
    getCheckList () {
      const list = []
      const each = tree => {
        tree.forEach(item => {
          item.data.selected && list.push(item.data)
          item.childNodes && each(item.childNodes)
        })
      }
      each(this.$refs.tree.root.childNodes)
      return list
    }
  },
  mounted() {
    this.plates = JSON.parse(window.sessionStorage.boardIds)
  },
}
</script>
