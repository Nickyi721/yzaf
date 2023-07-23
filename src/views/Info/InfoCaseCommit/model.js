import request from '@commons/request.js'

export default {
  // 获取信息上报列表
  getInfoList: async data => {
    const result = await request({
      url: 'xxglXxcb/getXxcbList',
      data
    })
    return result || {}
  },
  // 申请重新填报
  sqcxsb: async data => {
    const result = await request({
      url: 'xxglXxcb/sqcxsb',
      data
    })
    return result || {}
  },
  // 导出报告书模板
  scbgsmb: async data => {
    const result = await request({
      url: 'xxglXxcb/scbgsmb',
      data
    })
    return result || {}
  },
  exportTable: async data => {
    const result = await request({
      responseType: 'blob',
      url: 'xxglXxcb/exportXxcbList', 
      data
    })
    return result || {}
  }
}
