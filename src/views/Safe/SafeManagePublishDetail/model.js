import request from '@commons/request.js'

export default {
  // 获取检查内容列表
  getCheckContent: async data => {
    const result = await request({
      url: '/safeCheck/getTabTemList',
      data
    })
    return result || {}
  },
  // 获取详情
  getCheckPlanDetail: async data => {
    const result = await request({
      url: '/checkPlan/getSafeCheckTableNameList',
      data
    })
    return result || {}
  },
  // 保存新增计划
  saveCheckPlan: async data => {
    const result = await request({
      url: '/checkPlan/saveCheckPlan',
      data
    })
    return result || {}
  },
  getCheckGroup: async data => {
    const result = await request({
      url: '/workGroup/getAqjcGzz1',
      data
    })
    return result || {}
  },
  getCheckedGroup: async data => {
    const result = await request({
      url: '/checkPlan/getGzzXxByJhid1',
      data
    })
    return result || {}
  }
}
