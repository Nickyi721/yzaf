import request from '@commons/request.js'

export default {
  // 获取检查计划
  getPublishedCheckPlanList: async data => {
    const result = await request({
      url: '/checkPlan/getPublishedCheckPlanList',
      data
    })
    return result || {}
  },
  // 删除检查计划
  deleteCheckPlan: async data => {
    const result = await request({
      url: '/checkPlan/deleteCheckPlan',
      data
    })
    return result || {}
  },

}
