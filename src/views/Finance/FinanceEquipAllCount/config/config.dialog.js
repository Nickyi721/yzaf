export default [
  {
    name: 'upload',
    title: '上传文件',
    form: {
      items: [
        {
          field: 'fileType',
          name: '文件分类',
          type: 'select',
          options: [
            { label: '上级监管部门文件', value: 0 },
            { label: '集团公司安全管理文件', value: 1 },
            { label: '总行安全管理文件', value: 2 },
          ]
        },
        {
          field: 'fileKey',
          name: '选择文件',
          type: 'upload',
          api: 'xxxx'
        },
      ],
      btns: [
        {
          name: '保存',
          icon: 'save',
          type: 'save',
          style: 'primary'
        },
      ]
    }
  },
]
