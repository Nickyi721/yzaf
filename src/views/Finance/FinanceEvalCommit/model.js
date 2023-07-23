import request from '@commons/request.js'

export default {
  // 获取评估列表
  getEvalList: async data => {
    const result = await request({
      url: 'finSecEva/getFinSecEvaListByDwdm',
      data
    })
    return result || {}
  },
  commitEvalData: async data => {
    const result = await request({
      url: 'finSecEva/submitFinSecEvaContent',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  deleteEvalData: async data => {
    const result = await request({
      url: 'finSecEva/deleteFinSecEvaContent',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  // 获取当前单位有哪些评估表
  getEvalStatus: async data => {
    const result = await request({
      url: 'finSecEva/getFormsScoNStatusList',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  // 判断当前单位在当前时间段内是否有评估记录
  checkStatus: async data => {
    const result = await request({
      url: 'finAssSet/getBzw',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
