import request from '@commons/request.js'

export default {
  // 安全评估查询 计分表
  getFinSecEvaScoreTable: async data => {
    const result = await request({
      url: '/finSecEva/getFinSecEvaScoreTable',
      data
    })
    return result || {}
  }
}
