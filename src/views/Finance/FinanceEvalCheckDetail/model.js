import request from '@commons/request.js'

export default {
  // 安全评估审核-评估详情-查询九项评估任务列表
  getFormsScoNStatusList: async data => {
    const result = await request({
      url: '/finSecEva/getFormsScoNStatusList',
      data
    })
    return result || {}
  },
  // 安全评估审核-评估详情-查询某评估任务的配置列表
  getEvaFormParamList: async data => {
    const result = await request({
      url: '/finSecEva/getEvaFormParamList',
      data
    })
    return result || {}
  },
  // 安全评估审核-评估详情-查询某评估任务的配置-值-列表
  getFinSecEvaFormInfoDetail: async data => {
    const result = await request({
      url: '/finSecEva/getFinSecEvaFormInfoDetail',
      data
    })
    return result || {}
  }
}
