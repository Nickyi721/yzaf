import request from '@commons/request.js'

export default {
  // 获取列表
  getListData: async data => {
    const result = await request({
      url: '/zlk/queryZlkList',
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
  deleteData: async data => {
    const result = await request({
      url: '/zlk/deleteZlk',
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
  },
  uploadFile:async data => {
    const result = await request({
      url: '/zlk/zlkUpload',
      // url: 'fileUploadDown/uploadByBreakPoint',
      data: data
    })
    return result || {}
  },
}
