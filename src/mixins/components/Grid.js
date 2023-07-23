export default {
  data () {
    return {
      border: false
    }
  },
  methods: {
    // 表格单元行双击响应
    _TableDblClick (row, event) {
      this.$emit('dblclick', row)
    },
    // 表格选择响应
    _TableSelectionChange (selection, i) {
      this.$emit('selection-change', selection)
    },
    // 表格合并行列
    _TableMerageMethod ({ row, column, rowIndex, columnIndex }) {
      this.$emit('span-method', { row, column, rowIndex, columnIndex })
    },
    _RowSelect (selection, row) {
      this.$emit('select', selection, row)
    },
    _DataGridSelectAll (selection) {
      this.$emit('select-all', selection)
    }
  }
}
