import request from '@commons/request.js'

export default {
  // 报表填报--保存/提交
  saveForm: async data => {
    const result = await request({
      url: 'rwzt/saveBbtb',
      data
    })
    return result || {}
  },
}
