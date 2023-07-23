import request from '@commons/request.js'
// import Mock from 'mockjs'
// import Config from '@/commons/config.js'
export default {
  getListData: async data => {
    const result = await request({
      url: '/xxglQzgl/getQzglList',
      data: data
    })
    return result || {}
  }
}
