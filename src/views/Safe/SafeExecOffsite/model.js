import request from '@commons/request.js'

export default {
  // 获取列表
  getOffSiteCheList: async data => {
    data.isQuery = 1
    data.cdId = '0004060205'
    const result = await request({
      url: 'fxcjc/getlist',
      data
    })
    return result || {}
  }
}