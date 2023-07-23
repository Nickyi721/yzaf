import request from '@commons/request.js'

export default {
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
  // 查询任务详情
  getListData: async data => {
    const result = await request({
      url: '/rwzt/queryRwztList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  // 保存信息项
  saveListData: async data => {
    const result = await request({
      url: '/template/addFormTemplate',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  // 更新信息项
  updateListData: async data => {
    const result = await request({
      url: '/rwzt/saveBbtb',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'rwzt/exportZdybbtb',
      data
    })
    return result || {}
  }
}
