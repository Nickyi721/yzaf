export default {
  columns: [
    { field: 'orgName', name: '单位' },
    { field: 'a', name: '金融营业场所', editable: true, type: 'link' },
    { field: 'b', name: '网点四类业务库', editable: true, type: 'link' },
    { field: 'c', name: '自助设备', editable: true, type: 'link' },
    { field: 'd', name: '中心业务库', editable: true, type: 'link' },
    { field: 'e', name: '自助银行', editable: true, type: 'link' },
    { field: 'f', name: '运钞', editable: true, type: 'link' },
    { field: 'g', name: '枪弹', editable: true, type: 'link' },
  ],
  // check: true,
  btns: [
    { name: '导出', icon: 'export', type: 'export' }
  ],
}
