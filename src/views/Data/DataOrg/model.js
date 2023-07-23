import request from '@commons/request.js'

export default {
  // 获取单位基础数据列表
  getOrgList: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/dwxx/getOrgList',
      data
    })
    return result || {}
  },
  // 导出Excel
  orgListExport: async data => {
    data.isQuery = 1
    const result = await request({
      url: '/dwxx/orgListExport',
      data
    })
    return result || {}
  },
}
