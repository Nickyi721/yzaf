export default {
  items: [
    [
      {
        field: 'title',
        name: '信息标题',
        type: 'input',
      },
      {
        field: 'caseType',
        name: '信息类型',
        type: 'select',
        options: [
          { label: '私拆案件', value: 1, },
          { label: '贪污案件', value: 2, },
          { label: '盗窃案件', value: 3, },
          { label: '抢劫案件', value: 4, },
          { label: '交通事故', value: 5, },
          { label: '火灾事故', value: 6, },
          { label: '其他人员伤亡事故', value: 7, },
          { label: '邮寄爆炸物', value: 8, },
          { label: '邮寄毒品', value: 9, },
          { label: '刑事案件', value: 10 }
        ]
      },
      {
        field: 'caseLocation',
        name: '案发部位',
        type: 'select',
        options: [
          { label: '金融营业场所', value: 1 },
          { label: '业务库', value: 2 },
          { label: '自助服务区', value: 3 },
          { label: '干线邮路', value: 4 },
          { label: '委办邮路', value: 5 },
          { label: '办公场地', value: 6 },
          { label: '邮件处理场地', value: 7 },
          { label: '邮政营业场所', value: 8 },
          { label: '速递揽投部', value: 9 },
          { label: '运钞车', value: 10 },
          { label: '自有邮车', value: 11 },
          { label: '外包邮车', value: 12 },
          { label: '其他', value: 13 },
        ]
      },
      {
        field: 'caseLocationBelong',
        name: '案发部位所属',
        type: 'select',
        options: [
          { label: '省分公司', value: 1 },
          { label: '邮储银行', value: 2 },
          { label: '速递物流公司', value: 3 },
          { label: '其他控股子公司', value: 4 },
          { label: '集团直属单位', value: 5 },
        ]
      },
      {
        field: 'caseLevel',
        name: '层级',
        type: 'select',
        options: [
          { label: '省级', value: 0 },
          { label: '市级', value: 1 },
          { label: '县级', value: 2 },
        ]
      }
    ],
    [
      {
        field: 'caseDate',
        name: '案发时间',
        type: 'range',
      },
      {
        field: 'sendDate',
        name: '上报时间',
        type: 'range',
      },
    ]
  ]
}
