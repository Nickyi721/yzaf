import request from '@commons/request.js'

export default {
  // 获取隐患整改通知列表
  getNoticeList: async data => {
    const result = await request({
      url: '/aqjcAqjcbg/getYhzgList',
      data
    })
    return result || {}
  },
}
