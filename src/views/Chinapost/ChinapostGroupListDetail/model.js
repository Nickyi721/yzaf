import request from '@commons/request.js'

export default {
  // 获取年度详情
  getDetail: async data => {
    const result = await request({
      url: 'payzNzkp/getNzzpDetail',
      data
    })
    return result || {}
  },
  // 保存集团考评
  saveJtkp: async data => {
    const result = await request({
      url: 'payzNzkp/saveJtkp',
      data
    })
    return result || {}
  },
}
