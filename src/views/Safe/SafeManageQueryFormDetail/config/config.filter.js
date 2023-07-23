export default {
  items: [
    [
      {
        field: 'planName',
        name: '计划名称',
        type: 'input',
      },
      {
        field: 'planStatus',
        name: '计划状态',
        type: 'select',
        options: [
          { label: '进行中', value: 0 },
          { label: '完结', value: 1 },
          { label: '无效', value: 2 }
        ]
      }
    ],
    [
      {
        field: 'planDate',
        name: '计划时间段',
        type: 'range',
      }
    ]
  ]
}
