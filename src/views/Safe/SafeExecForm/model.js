import request from '@commons/request.js'

export default {
  // 获取列表
  getListData: async data => {
    const result = await request({
      url: '/aqjcto/queryAqjcJcjhList',
      data: data
    })
    return result || {}
  },
  // 新增数据
  addData: async data => {
    const result = await request({
      url: '/',
      data: data
    })
    return result || {}
  },
  // 更新数据
  updateData: async data => {
    const result = await request({
      url: '/',
      data: data
    })
    return result || {}
  },
}
