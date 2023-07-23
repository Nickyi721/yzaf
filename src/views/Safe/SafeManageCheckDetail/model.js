import request from '@commons/request.js'

export default {
  // 获取隐患整改详情
  getNoticeDetail: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/getyhzgDetialAndDzyz',
      data
    })
    return result || {}
  },
  // 通过与不通过按钮
  toPassClick: async data => {
    const result = await request({
      url: '/aqjcYhzgtz/shYhzgtz',
      data
    })
    return result || {}
  }
}
