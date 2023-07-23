import request from '@commons/request.js'

export default {
  // 获取详情
  getDetail: async data => {
    const result = await request({
      url: 'xxglXxcb/getDetail',
      data
    })
    return result || {}
  },
}
