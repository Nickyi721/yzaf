import request from '@commons/request.js'

export default {
  // 新增/修改-保存
  saveTask: async data => {
    const result = await request({
      url: 'rwfb/saveFormTaskTo',
      data
    })
    return result || {}
  },
  // 查询详情
  getTaskDetail: async data => {
    const result = await request({
      url: 'rwfb/getTaskToDetail',
      data
    })
    return result || {}
  },
  // 报表列表
  getTemplateList: async data => {
    const result = await request({
      url: 'template/getTemplateList',
      data
    })
    return result || {}
  }
}
