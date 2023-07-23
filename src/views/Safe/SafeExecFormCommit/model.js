import request from '@commons/request.js'

export default {
  // 获取列表
  getListData: async data => {
    const result = await request({
      url: '/aqjcto/getAqjcXxxDetail',
      data: data
    })
    return result || {}
  },
  getDetail: async data => {
    const result = await request({
      url: './aqjcto/getAqjcJcjgDetail',
      data: data
    })
    return result || {}
  },
  // 新增数据
  addData: async data => {
    const result = await request({
      url: '/aqjcto/saveAqjcJclr',
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
  setAgree: async data => {
    const result = await request({
      url: '/aqjcto/aqjcGzzRt',
      data: data
    })
    return result || {}
  }
}
