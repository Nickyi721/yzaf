<template>
  <div class="wrap">
    <div class="input">
      <el-input :placeholder="placeholder" :value="value.name" size="mini" @focus="focus" :disabled="disabled" readonly/>
    </div>
    <el-dialog title="单位树选择" :visible="dialogVisible" @close="dialogVisible = false">
      <CommonOrgTree ref="orgTree" check-strictly content fnCode="000403" style="height: 300px;overflow:hidden" @click="_OrgTreeClick" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEntry" :disabled="!selectTree">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data () {
    return {
      selectTree: {},
      dialogVisible: false
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    focus () {
      this.dialogVisible = true
      //  this.$emit('focus')
    },
    _OrgTreeClick (node) {
      this.selectTree = node
    },
    dialogEntry () {
      this.dialogVisible = false
      this.$emit('input', {
        id: this.selectTree.id,
        name: this.selectTree.name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
