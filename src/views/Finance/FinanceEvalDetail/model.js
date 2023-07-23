import request from '@commons/request.js'

export default {
  // 获取评估列表
  getEvalConfig: async data => {
    const result = await request({
      url: 'finSecEva/getEvaFormParamList',
      data
    })
    return result || {}
  },
  getEvalConfigAdd: async data => {
    const result = await request({
      url: 'finSecEva/getEvaFormParamListadd',
      data
    })
    return result || {}
  },
  getEvalData: async data => {
    const result = await request({
      url: 'finSecEva/getFinSecEvaFormInfoDetail',
      data: {
        isQuery: 1,
        cdId: '0004050201',
        requestData: data
      }
    })
    return result || {}
  },
  getEvalLinkData: async data => {
    const result = await request({
      url: 'glxxx/getssxx',
      data: {
        isQuery: 1,
        cdId: '0004050201',
        requestData: data
      }
    })
    return result || {}
  },
  // 保存评估结果
  saveEvalData: async data => {
    const result = await request({
      url: 'finSecEva/saveFinSecEvaForm',
      data: {
        requestData: data
      }
    })
    return result || {}
  }

}
