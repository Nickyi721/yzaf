import request from '@commons/request.js'
// import Mock from 'mockjs'
// import Config from '@/commons/config.js'
export default {
  addData: async data => {
    const result = await request({
      url: '/abgl/insertAbjg',
      data: data
    })
    return result || {}
  }
}
