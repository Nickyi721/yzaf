import request from '@commons/request.js'

export default {
  // 安全评估查询-评估详情-查询列表
  getFinSecEvaList: async data => {
    const result = await request({
      url: '/finSecEva/getFinSecEvaList',
      data
    })
    return result || {}
  },
  // 安全评估查询-评估概况-查询列表
  getFinSecEvaAbout: async data => {
    const result = await request({
      url: '/finSecEva/getFinSecEvaAbout',
      data
    })
    return result || {}
  },
  // 安全评估查询-机构计分-查询列表
  getFinSecEvaIns: async data => {
    const result = await request({
      url: '/finSecEva/getFinSecEvaIns',
      data
    })
    return result || {}
  },
}
