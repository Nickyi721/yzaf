import request from '@commons/request.js'

export default {
  addData: async data => {
    const result = await request({
      url: '/xxglQzgl/addQzgl',
      data: data
    })
    return result || {}
  }
}
