import request from '@commons/request.js'

export default {
  exportReport: async data => {
    const result = await request({
      url: '/rwzt/gdbbdc',
      responseType: 'blob',
      data: {
        requestData: {
          tnLx: 0,
          tnRwid: data.tnRwid,
          tcDwdm: data.tcDwdm
        }
      }
    })
    return result
  },

}
