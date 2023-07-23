import request from '@commons/request.js'

export default {
  // 获取自评列表
  getDetailList: async data => {
    const result = await request({
      url: 'payzNzkp/getNzzpDetail',
      data
    })
    return result || {}
  },
  // 保存编辑
  saveList: async data => {
    const result = await request({
      url: 'payzNzkp/insertKp',
      data
    })
    return result || {}
  },
  // 提交
  publishItem: async data => {
    const result = await request({
      url: 'payzNzkp/tjNzkp',
      data
    })
    return result || {}
  },
  closeWork: async data => {
    const result = await request({
      url: 'dailyWork/updateZtByNd',
      data: {
        requestData: {
          tcNd: data
        }
      }
    })
    return result || {}
  },
}
