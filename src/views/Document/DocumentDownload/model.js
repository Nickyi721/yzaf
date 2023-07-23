import request from '@commons/request.js'

export default {
  // 获取列表
  getListData: async data => {
    const result = await request({
      url: '/zlk/queryZlkYShList',
      data: data
    })
    return result || {}
  },
  getSjzdZlkLx: async data => {
    const result = await request({
      url: '/zlk/getSjzdZlkLx',
      data: data
    })
    return result || {}
  }
}
