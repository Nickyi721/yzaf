export default {
  columns: [
    { field: 'dataCode', name: '序号', width: '100px' },
    { field: 'year', name: '年度', width: '100px' },
    { field: 'dataContent', name: '风险管控选项' },
    { field: 'isLastLevel', name: '扣分', width: '100px' },
  ],
  dblTargetName: 'update',
  check: true,
  btns: [
    { name: '删除', icon: 'delete', type: 'delete', nums: 2 },
    { name: '新增', icon: 'add', type: 'add', targetName: 'add' },
  ],
}
