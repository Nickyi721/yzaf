import request from '@commons/request.js'

export default {
  addSggl: async data => {
    const result = await request({
      url: '/sggl/addSggl',
      data
    })
    return result || {}
  },
  updateSggl: async data => {
    const result = await request({
      url: '/sggl/updateSggl',
      data
    })
    return result || {}
  },
}
