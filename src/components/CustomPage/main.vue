<template>
  <el-pagination
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="_PageSizeChange"
    @current-change="_PageCurrentChange"
    :current-page="pageNum"
    :page-sizes="pageSize"
    :page-size="rows"
    :total="total">
  </el-pagination>
</template>

<script>
export default {
  name: 'CustomPage',
  props: {
    total: Number,
    pageNum: Number,
    rows: Number,
    pageSize: {
      type: Array,
      default: () => [10, 20, 50, 100]
    }
  },
  methods: {
    // 事件-每页显示条数变化
    _PageSizeChange (num) {
      this.$emit('rows-change', num)
    },
    // 事件-翻页
    _PageCurrentChange (num) {
      this.$emit('change', num)
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
