export default {
  columns: [
    { field: 'orgName', name: '单位名称' },
    { field: 'hiddenNum', name: '隐患个数', width: '200px' },
    { field: 'repairNum', name: '整改个数', width: '200px' }
  ],
  dblTarget: '/safe/count/detail',
  btns: [
    { name: '导出', icon: 'export', type: 'export' },
  ],
}
