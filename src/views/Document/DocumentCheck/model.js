import request from '@commons/request.js'

export default {
  // 获取列表
  getListData: async data => {
    const result = await request({
      url: '/zlk/queryZlkSpList',
      data: data
    })
    return result || {}
  },
  // 新增数据
  approveData: async data => {
    const result = await request({
      url: '/zlk/saveShJg',
      data: data
    })
    return result || {}
  },
  // 更新数据
  delete: async data => {
    const result = await request({
      url: '/',
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
