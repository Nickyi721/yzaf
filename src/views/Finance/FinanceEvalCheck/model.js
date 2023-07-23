import request from '@commons/request.js'

export default {
  // 安全评估审核 查询未审核列表
  getFSEvaNotAuditList: async data => {
    const result = await request({
      url: '/finSecEva/getFSEvaNotAuditList',
      data
    })
    return result || {}
  },
  // 安全评估审核 审核
  setFSEvaAuditStatus: async data => {
    const result = await request({
      url: '/finSecEva/finSecEvaAuditPass',
      data
    })
    return result || {}
  }
}
