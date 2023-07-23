import request from '@commons/request.js'

export default {
    // 日常任务填报详情
    _getTemplateTjRcrw: async data => {
        const result =  await request({
            url:'tbsj/getTemplateTjRcrw',
            data
        })
        return result || {}
    },
    // 查询表头
    getTableHeader: async data => {
        const result = await request({
            url:'/template/getFormTemplateDetail',
            data:{
                isQuery: 1,
                requestData: data
            }
        })
        return result || {}
    },
//      // 获取非日常任务统计表
//     getTemplateTj: async data => {
//         const result = await request({
//             url: 'tbsj/getTemplateTj',
//             data
//         })
//         return result || {}
//   },
}