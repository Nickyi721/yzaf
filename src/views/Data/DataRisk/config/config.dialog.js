export default [
  {
    name: 'add',
    title: '新增风险管控选项',
    form: {
      items: [
        {
          field: 'fileType',
          name: '选项内容',
          type: 'input',
        },
        {
          field: 'fileType',
          name: '扣分',
          type: 'input',
        },
      ],
      btns: [
        {
          name: '保存',
          icon: 'save',
          type: 'save',
          style: 'primary',
          closable: true
        },
      ]
    }
  },
  {
    name: 'update',
    title: '风险管控选项详情',
    form: {
      items: [
        {
          field: 'fileType',
          name: '选项内容',
          type: 'input',
        },
        {
          field: 'fileType',
          name: '扣分',
          type: 'input',
        },
      ],
      btns: [
        {
          name: '保存',
          icon: 'save',
          type: 'save',
          style: 'primary',
          closable: true
        },
      ]
    }
  },
]
