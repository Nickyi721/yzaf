export default {
  columns: [
    { field: 'classify', name: '分类' },
    { field: 'company', name: '企业', editable: true, type: 'link' },
    { field: 'bank', name: '银行', editable: true, type: 'link' },
    { field: 'sum', name: '总数', editable: true, type: 'link' },
  ],
  // check: true,
  btns: [
    { name: '导出', icon: 'export', type: 'export' }
  ],
}
