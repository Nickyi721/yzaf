export default {
  columns: [
    { field: 'year', name: '年度' },
    { field: 'orgName', name: '单位' },
    { field: 'selfScore', name: '自评分' },
    { field: 'score', name: '考评分' },
    { field: 'multipleScore', name: '综合得分' },
    { field: 'evalLevel', name: '考评等级' },
    { field: 'rate', name: '同比' },
  ],
  check: true,
  btns: [
    { name: '导出', icon: 'export', type: 'export' },
  ],
}
