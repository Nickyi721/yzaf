import request from '@commons/request.js'

export default {
  // 报表列表
  getTemplateList: async data => {
    const result = await request({
      url: 'template/getFormTemplateList',
      data
    })
    return result || {}
  },
  // 获取任务列表
  getTaskList: async data => {
    const result = await request({
      url: 'rwfb/getTask',
      data
    })
    return result || {}
  },
  // 获取非日常任务统计表
  getTemplateTj: async data => {
    const result = await request({
      url: 'tbsj/getTemplateTj',
      data
    })
    return result || {}
  },
  // 获取日常任务统计表
  _getDailyTemplateTj: async data => {
    const result = await request({
      url: 'rwfb/getTjRcrw',
      data
    })
    return result || {}
  },
  // 查询表头
  getTableHeader: async data => {
    const result = await request({
      url: '/template/getFormTemplateDetail',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
}
