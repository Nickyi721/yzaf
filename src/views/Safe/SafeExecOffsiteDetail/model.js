import request from '@commons/request.js'

export default {
  // 保存
  saveAPresentChk: async data => {
    const result = await request({
      url: 'fxcjc/savefxcjc',
      data
    })
    return result || {}
  },
  // 获取详情
  getAPresentChkDetail: async data => {
    const result = await request({
      url: 'fxcjc/getdetail',
      data
    })
    return result || {}
  }
}