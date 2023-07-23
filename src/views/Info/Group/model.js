import request from '@commons/request.js'
export default {
  getListData: async data => {
    const result = await request({
      url: '/xxglQzgl/getQzglList',
      data: data
    })
    return result || {}
  }
}
