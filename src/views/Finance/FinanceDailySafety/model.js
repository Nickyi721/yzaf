import request from '@commons/request.js'

export default {
  getGridData: async data => {
    const result = await request({
      url: 'rcaqjc/getlist',
      data: data
    })
    return result || {}
  }
}
