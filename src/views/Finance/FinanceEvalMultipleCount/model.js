import request from '@commons/request.js'

export default {
  // 安全评估查询-评估详情-查询某评估任务的配置列表
  getEvaFormParamList: async data => {
    const result = await request({
      // url: '/finSecEva/getEvaFormParamList',
      url: '/finSecEva/getEvaFormParamListadd',
      data
    })
    return result || {}
  },
  // 获取是否加密
  getSfjm: async data => {
    const result = await request({
      url: '/system/checkUserId',
      data
    })
    return result || {}
  },
}
